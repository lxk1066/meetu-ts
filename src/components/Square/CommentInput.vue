<script lang="ts">
export default { name: "meetuSquarePostCommentInput" };
</script>
<script setup lang="ts">
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
import {
  Field as vanField,
  CellGroup as vanCellGroup,
  Button as vanButton,
  showToast,
  showConfirmDialog,
} from "vant";
import commentPost from "@/api/square/commentPost";
import replyRootComment from "@/api/square/replyRootComment";
import replySubComment from "@/api/square/replySubComment";
import type { NewComment, CommentType } from "@/types";

const store = useStore();
const route = useRoute();
const router = useRouter();
const commentValue = ref<string>("");

// 输入框的placeholder
const placeHolder = computed(() => {
  if (props.commentType === "replyRoot" || props.commentType === "replySub") {
    return `@ ${props.username}`;
  } else {
    return "说点什么吧...";
  }
});

const props = defineProps<{
  targetRef: HTMLElement | null;
  postId: number | string;
  commentType: CommentType;
  username: NewComment["username"];
  rootCommentId: NewComment["rootCommentId"];
  toCommentId: NewComment["toCommentId"];
}>();

const emits = defineEmits<{
  (event: "show", data: boolean): void; // 展示/隐藏评论输入框的自定义事件
  (
    event: "addComment",
    data: {
      type: CommentType;
      comment: NewComment;
    }
  ): void;
}>();

function onScroll() {
  if (
    props.targetRef &&
    props.targetRef.offsetTop + 100 <
      document.documentElement.clientHeight + window.scrollY
  ) {
    emits("show", true);
  } else {
    emits("show", false);
  }
}

onMounted(() => {
  // 一进入页面就判断一下是否展示
  setTimeout(() => {
    onScroll();
  }, 0);
  document.addEventListener("scroll", onScroll);
});
onBeforeUnmount(() => {
  document.removeEventListener("scroll", onScroll);
});

// input获得焦点
const focusActive = ref<boolean>(false);
const onfocus = () => {
  focusActive.value = true;
};
const onblur = () => {
  focusActive.value = false;
};

// 点击发送评论
const sendComment = (e: Event) => {
  // 使输入框获得焦点
  (e.target as HTMLElement).previousElementSibling
    ?.querySelector("input")
    ?.focus();

  // 发起请求
  fetchCommentPost();
  // 输入框置空
  commentValue.value = "";
};

// 评论帖子
const fetchCommentPost = async () => {
  // 获取登录状态
  const loginStatus = store.loginStatus;

  // 如果登录，就允许发送请求，否则提示登录
  if (loginStatus) {
    const token = route.meta.token as string;
    if (!commentValue.value)
      showToast({ message: "请输入内容", position: "bottom" });

    // 使用策略模式
    const comment = {
      addRoot: commentPost,
      replyRoot: replyRootComment,
      replySub: replySubComment,
    };

    const { data: res } = await comment[props.commentType](
      token,
      props.postId,
      commentValue.value,
      props.rootCommentId as number,
      props.toCommentId as number
    );

    if (res.code === 200) {
      const comment: NewComment = res.data;
      // 通知父组件，将新消息push到评论列表中
      emits("addComment", { type: props.commentType, comment });
    }
  } else {
    showConfirmDialog({
      title: "提示",
      message: "必须登录后才能评论，是否登录？",
    }).then(() => {
      router.push({ name: "login", query: { redirect: route.fullPath } });
    });
  }
};
</script>

<template>
  <div class="comment-input-box">
    <van-cell-group
      class="comment-input-group"
      :class="{ focus: focusActive }"
      inset
    >
      <van-field
        class="comment-input"
        v-model.trim="commentValue"
        @focus="onfocus"
        @blur="onblur"
        :placeholder="placeHolder"
      >
      </van-field>
    </van-cell-group>
    <van-button
      class="send-btn"
      :class="{ 'send-btn-active': focusActive }"
      size="small"
      type="primary"
      @click="sendComment"
    >
      {{ props.commentType !== "addRoot" ? "回复" : "发送" }}
    </van-button>
  </div>
</template>

<style lang="scss" scoped>
.comment-input-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: white;
  padding: 10px 0;
  .comment-input-group {
    width: 100%;
    transition: all 0.4s;
    .comment-input {
      height: 32px;
      line-height: 32px;
      border-radius: 25px;
      background-color: #f2f2f2;
      padding: 0;
      :deep(.van-field__control) {
        text-indent: 10px;
      }
    }
  }
  .send-btn {
    width: 0;
    opacity: 0;
    padding: 0;
    transform: translateY(100px) scale(0);
    transition: all 0.5s;
  }
  .focus {
    width: calc(100% - 90px);
  }
  .send-btn-active {
    width: 50px;
    opacity: 1;
    margin-right: 10px;
    transform: translateY(0px) scale(1);
  }
}
</style>
