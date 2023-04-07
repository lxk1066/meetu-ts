<script lang="ts">
export default { name: "meetuSquarePostCommentInput" };
</script>
<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from "vue";
import {
  Field as vanField,
  CellGroup as vanCellGroup,
  Button as vanButton,
} from "vant";

const commentValue = ref<string>("");

const props = defineProps<{
  targetRef: HTMLElement | null;
}>();

const emits = defineEmits<{
  (event: "show", data: boolean): void;
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
  // 已进入页面就判断一下是否展示
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

// 发布评论
const sendComment = (e: Event) => {
  (e.target as HTMLElement).previousElementSibling
    ?.querySelector("input")
    ?.focus();
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
        v-model="commentValue"
        @focus="onfocus"
        @blur="onblur"
        placeholder="说点什么吧..."
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
      发送
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
