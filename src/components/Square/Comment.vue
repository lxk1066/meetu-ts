<script lang="ts">
export default { name: "meetuSquarePostCommentItem" };
</script>
<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { Image as vanImage } from "vant";
import getProfile from "@/api/user/getProfile";
import formatTimeStamp from "@/utils/formatTimeStamp";
import type { NewComment, CommentType } from "@/types/index";

const props = defineProps<{
  comment: NewComment;
}>();

const emits = defineEmits<{
  (
    event: "replyComment",
    data: {
      type: CommentType;
      rootCommentId: NewComment["id"];
      commentUsername: NewComment["username"];
      subCommentId?: NewComment["toCommentId"];
    }
  ): void;
}>();

// 回复根评论
const replyRoot = (id: NewComment["id"], username: NewComment["username"]) => {
  emits("replyComment", {
    type: "replyRoot",
    rootCommentId: id,
    commentUsername: username,
  });
};

// 回复子评论
const replySub = (
  rootCommentId: NewComment["id"],
  subCommentId: NewComment["toCommentId"],
  username: NewComment["username"]
) => {
  emits("replyComment", {
    type: "replySub",
    rootCommentId: rootCommentId,
    commentUsername: username,
    subCommentId: subCommentId,
  });
};
</script>

<template>
  <div class="comment-item">
    <div class="comment-item-header">
      <div class="header-left">
        <van-image
          round
          width="2.5rem"
          height="2.5rem"
          fit="cover"
          :src="getProfile(props.comment.profile ?? 'default.png')"
        ></van-image>
        <div class="info">
          <span class="username">{{ props.comment.username }}</span>
          <span class="time">{{
            formatTimeStamp(props.comment.created_time, "auto")
          }}</span>
        </div>
      </div>
      <div class="header-right">
        <span @click="replyRoot(props.comment.id, props.comment.username)">
          回复
        </span>
      </div>
    </div>
    <p class="comment-item-content">
      {{ props.comment.content }}
    </p>
    <!-- 子评论区域 -->
    <div class="sub-comment" v-if="props.comment.subComments">
      <div
        class="sub-comment-item"
        v-for="subComment in props.comment.subComments"
        :key="subComment.id"
      >
        <div class="comment-item-header">
          <div class="header-left">
            <van-image
              round
              width="1.8rem"
              height="1.8rem"
              fit="cover"
              :src="getProfile(subComment.profile ?? 'default.png')"
            ></van-image>
            <div class="info">
              <span class="username">{{ subComment.username }}</span>
              <span class="time">{{
                formatTimeStamp(subComment.created_time, "auto")
              }}</span>
            </div>
          </div>
          <div class="header-right">
            <span
              @click="
                replySub(props.comment.id, subComment.id, subComment.username)
              "
            >
              回复
            </span>
          </div>
        </div>
        <p class="comment-item-content sub-comment-item-content">
          <!-- 回复子评论的用户名 -->
          <span v-if="subComment.toCommentId" class="to-sub-comment-username">
            {{
              "@" +
              props.comment.subComments.find(
                (item) => item.id === subComment.toCommentId
              )?.username
            }}
          </span>
          {{ subComment.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-item {
  width: 100%;
  min-height: 90px;
  // border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.comment-item::after {
  content: "";
  width: calc(100% - 40px);
  height: 1px;
  display: flex;
  justify-content: flex-end;
  margin-left: 40px;
  border-bottom: 1px solid rgb(220, 220, 220);
}
.comment-item:not(.comment-item:first-child) {
  padding-top: 8px;
}
.comment-item:last-child::after {
  border-bottom: none;
}
.comment-item-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .header-left {
    display: flex;
  }
  .header-right {
    display: flex;
    align-items: center;
    padding: 0 10px;
    span {
      color: grey;
      font-size: 13px;
    }
    span:active {
      color: blue;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
    .username {
      font-size: 14px;
      font-weight: bold;
    }
    .time {
      font-size: 13px;
      color: grey;
    }
  }
}
.comment-item-content {
  margin: 0;
  width: 85%;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding-left: 40px;
  word-break: break-word;
  white-space: pre-wrap;
  padding-bottom: 5px;
  .to-sub-comment-username {
    color: #0099d6;
  }
}
.sub-comment {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: rgb(245, 245, 245);
  border-radius: 5px;
  margin-left: 40px;
  margin-bottom: 10px;
  width: calc(100% - 40px);
  padding: 10px;
  .sub-comment-item {
    margin-bottom: 5px;
  }
}
</style>
