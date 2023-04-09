<script lang="ts">
export default {
  name: "meetuSquarePostComment",
};
</script>
<script setup lang="ts">
import { ref, watch, onMounted, defineProps } from "vue";
import { Loading as vanLoading, showToast } from "vant";
import { useRoute } from "vue-router";
import { useStore } from "@/stores";
import getPostComment from "@/api/square/getPostComment";
import getPostCommentList from "@/api/square/getPostCommentList";

import getPersonInfo from "@/api/user/getPersonInfo";

import CommentItem from "@/components/Square/Comment.vue";
import CommentInput from "@/components/Square/CommentInput.vue";

import type { Comment, NewComment, CommentType } from "@/types/index";

const store = useStore();
const route = useRoute();

const commentList = ref<Comment[] | null>(null);
const rootComments = ref<NewComment[]>([]);

const loading = ref<boolean>(true); // 评论区数据加载

const props = defineProps<{
  postId: number | string;
}>();

// 获取某个用户头像
const getUserAvatar = async (uid: number | string) => {
  const { data: res } = await getPersonInfo(uid);
  if (res.code === 200) {
    return res.data.profile;
  } else {
    return "default.png";
  }
};
// 并行加载所有用户的头像
const loadAvatarList = async () => {
  const promiseArr: Promise<string>[] = [];
  (commentList.value as Comment[]).forEach((item) =>
    promiseArr.push(getUserAvatar(item.user_id))
  );
  const promiseRes = await Promise.all(promiseArr).catch((err) => {
    console.log("error loading", err);
  });

  if (promiseRes) {
    promiseRes.forEach((item, index) => {
      (commentList.value as Comment[])[index].profile = item;
    });
  }
};

// 将根评论和子评论进行分组
const groupCommentList = () => {
  const rootComments: NewComment[] = (commentList.value as Comment[]).filter(
    (comment) => comment.rootCommentId == null
  );
  (commentList.value as Comment[]).forEach((comment) => {
    if (comment.rootCommentId) {
      const index = rootComments.findIndex(
        (item) => item.id === comment.rootCommentId
      );

      if (!rootComments[index].subComments)
        rootComments[index].subComments = [];

      (rootComments[index].subComments as Comment[]).unshift(comment);
    }
  });
  return rootComments;
};

onMounted(async () => {
  // 获取登录状态
  const loginStatus = store.loginStatus;

  let result;
  if (loginStatus) {
    // 如果已登录，就获取所有的评论
    const token = route.meta.token as string;
    const { data: res } = await getPostCommentList(token, props.postId);
    result = res;
  } else {
    // 用户未登录，只获取前几条评论
    const { data: res } = await getPostComment(props.postId);
    result = res;
  }

  if (result.code === 200) {
    commentList.value = result.data?.comments ?? [];
    commentCount.value = result.data.comments.length;
    // 加载用户头像
    await loadAvatarList();
    // 将根评论和子评论筛到一起
    rootComments.value = groupCommentList();

    // 如果获取成功，需等到数据分组成功后再停止loading
    loading.value = false;
  } else {
    loading.value = false; // 如果获取失败，直接停止loading
    showToast({ message: result.msg, position: "bottom" });
  }
});

// 评论数量
let commentCount = ref<number>(0);

const commentBoxRef = ref<HTMLElement | null>(null);

// 是否展示commentInput
const isShowCommentInput = ref<boolean>(false);

//  评论类型  根评论: addRoot 回复根评论: replyRoot 回复子评论: replySub
const commentType = ref<CommentType>("addRoot");
const replyUsername = ref<string>(""); // 回复评论的用户名
const rootCommentId = ref<NewComment["rootCommentId"]>(null); // 回复的根评论ID，默认null
const toCommentId = ref<NewComment["toCommentId"]>(null); // 回复的子评论ID，默认null

// 当CommentInput隐藏后，重置commentType、replyUsername、rootCommentId和toCommentId
watch(isShowCommentInput, (newVal) => {
  if (newVal === false) {
    commentPostHandle();
  }
});

// 用户点击了父组件的评论按钮，重置 commentType 和 replyUsername
const commentPostHandle = () => {
  commentType.value = "addRoot";
  replyUsername.value = "";
  rootCommentId.value = null;
  toCommentId.value = null;
};

// 点击回复评论按钮的自定义事件回调
const replyCommentHandle = ({
  type,
  rootCommentId: replyRootCommentId,
  commentUsername: replyCommentUsername,
  subCommentId: replySubCommentId,
}: {
  type: CommentType;
  rootCommentId: NewComment["id"];
  commentUsername: NewComment["username"];
  subCommentId?: NewComment["toCommentId"];
}) => {
  commentType.value = type;

  // 回复根评论
  if (type === "replyRoot") {
    rootCommentId.value = replyRootCommentId;
    replyUsername.value = replyCommentUsername;
    toCommentId.value = null;
  }

  // 回复子评论
  if (type === "replySub") {
    replyUsername.value = replyCommentUsername;
    rootCommentId.value = replyRootCommentId;
    toCommentId.value = replySubCommentId as number;
  }
};

// 点击发送评论按钮的自定义事件回调
const addCommentHandle = ({
  type,
  comment,
}: {
  type: CommentType;
  comment: NewComment;
}) => {
  // 总评论数＋1
  commentCount.value++;
  // 评论输入框重置
  commentPostHandle();

  // 将服务端返回的comment push到rootComments
  if (type == "addRoot") {
    // 添加根评论
    rootComments.value.unshift(comment);
  } else if (type == "replyRoot" || type == "replySub") {
    // 回复根评论, 找到根评论的索引
    const index = rootComments.value.findIndex(
      (item) => item.id === comment.rootCommentId
    );

    if (index == -1) return;

    if (!rootComments.value[index].subComments)
      rootComments.value[index].subComments = [];

    (rootComments.value[index].subComments as Comment[]).push(comment);
  } else {
    // 错误的类型type
  }
};
</script>

<template>
  <div class="comment-box" ref="commentBoxRef">
    <div class="header">
      <div class="left">
        <h3 @click="commentPostHandle">评论</h3>
        <span class="comment-count">{{ commentCount }}</span>
      </div>
      <div class="right">
        <span class="hot-sort">最热</span>
        <span class="symbol"></span>
        <span class="time-sort">最新</span>
      </div>
    </div>
    <!-- 评论内容区 -->
    <div class="comment">
      <van-loading class="loading" v-if="loading" color="#1989fa" size="30">
        加载中...
      </van-loading>

      <comment-item
        v-for="comment in rootComments"
        :key="comment.id"
        :comment="comment"
        @reply-comment="replyCommentHandle"
      ></comment-item>

      <div class="empty" v-if="!loading && !commentCount">
        <span>快来发表你的评论吧</span>
      </div>
    </div>
    <!-- 评论输入框 -->
    <transition name="input" appear>
      <comment-input
        v-show="isShowCommentInput"
        :target-ref="commentBoxRef"
        :post-id="props.postId"
        :comment-type="commentType"
        :username="replyUsername"
        :root-comment-id="rootCommentId"
        :to-comment-id="toCommentId"
        @show="isShowCommentInput = $event"
        @add-comment="addCommentHandle"
      ></comment-input>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.comment-box {
  width: 95%;
  min-height: 100px;
  margin: 10px auto 20px auto;
  border-radius: 5px;
  background-color: white;
  .header {
    width: 95%;
    height: 35px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .left,
    .right {
      display: flex;
      align-items: center;
      margin: 0 10px;
    }
    .left > .comment-count {
      font-size: 14px;
      margin: 0 10px;
    }
    .right {
      width: 100px;
      justify-content: space-around;
      .symbol::after {
        content: "";
        border-left: 1px solid;
        display: inline-block;
        height: 10px;
        color: gray;
      }
    }
  }
  .comment {
    width: 95%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .loading {
      margin-bottom: 10px;
    }
    .empty {
      display: inline-block;
      color: grey;
    }
  }
}

.input-enter-active,
.input-leave-active {
  transition: all 0.5s linear;
}

.input-leave-to,
.input-enter {
  transform: translateY(100%);
  opacity: 0;
}

.input-leave,
.input-enter-to {
  transform: translateY(0);
  opacity: 1;
}
</style>
