<script lang="ts">
export default {
  name: "meetuSquarePostComment",
};
</script>
<script setup lang="ts">
import { ref, onMounted, defineProps } from "vue";
import { showToast } from "vant";
import { useRoute } from "vue-router";
import { useStore } from "@/stores";
import getPostComment from "@/api/square/getPostComment";
import getPostCommentList from "@/api/square/getPostCommentList";

import getPersonInfo from "@/api/user/getPersonInfo";

import CommentItem from "@/components/Square/Comment.vue";
import CommentInput from "@/components/Square/CommentInput.vue";

import type { Comment, NewComment } from "@/types/index";

const store = useStore();
const route = useRoute();

const commentList = ref<Comment[] | null>(null);
const rootComments = ref<NewComment[]>([]);

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

// 将根评论和子评论分组到一起
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
  } else {
    showToast({ message: result.msg, position: "bottom" });
  }
});

// 评论数量
let commentCount = ref<number>(0);

const commentBoxRef = ref<HTMLElement | null>(null);

// 是否展示commentInput
const isShowCommentInput = ref<boolean>(false);
</script>

<template>
  <div class="comment-box" ref="commentBoxRef">
    <div class="header">
      <div class="left">
        <h3>评论</h3>
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
      <comment-item
        v-for="comment in rootComments"
        :key="comment.id"
        :comment="comment"
      ></comment-item>

      <div class="empty" v-if="!commentCount">
        <span>快来发表你的评论吧</span>
      </div>
    </div>
    <!-- 评论输入框 -->
    <transition name="input" appear>
      <comment-input
        v-show="isShowCommentInput"
        :target-ref="commentBoxRef"
        @show="isShowCommentInput = $event"
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
