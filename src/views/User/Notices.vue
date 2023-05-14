<script lang="ts">
export default { name: "meetuNotices" };
</script>
<script setup lang="ts" name="meetuNotices">
import { ref, onBeforeMount } from "vue";
import {
  SwipeCell as vanSwipeCell,
  NavBar as vanNavBar,
  Cell as vanCell,
  Image as vanImage,
  Button as vanButton,
  Empty as vanEmpty,
  showFailToast,
  showSuccessToast,
} from "vant";
import { useRouter, useRoute } from "vue-router";
import getAllNotices from "@/api/notice/getAllNotices";
import getMuidUserInfo from "@/api/user/getMuidUserInfo";
import getProfile from "@/api/user/getProfile";
import agreeFriendRequest from "@/api/notice/agreeFriendRequest";
import disagreeFriendRequest from "@/api/notice/disagreeFriendRequest";
import deleteNotice from "@/api/notice/deleteNotice";
import formatTimeStamp from "@/utils/formatTimeStamp";
import type { Notice } from "@/types/apis";
import type { NoticeInfo } from "@/types";

const allNotices = ref<Notice[]>([]);
const allInfo = ref<NoticeInfo[]>([]);
const router = useRouter();
const route = useRoute();
const goBack = () => router.back();

const token = route.meta.token as string;

onBeforeMount(async () => {
  const { data: res } = await getAllNotices(token);
  if (res.code === 200) {
    allNotices.value = res.data.notices;
    for (const item of allNotices.value) {
      const info = await getUserInfo(item.from);
      allInfo.value.push({
        id: item.id,
        uid: info.uid,
        username: info.username,
        profile: info.profile,
        message: item.message,
        type: item.type,
        data: item?.data ?? {},
        time: item.time,
      });
    }
  } else {
    showFailToast("数据获取失败");
  }
});

const getUserInfo = async (muid: string) => {
  const { data: res } = await getMuidUserInfo(muid);
  if (res.code === 200) {
    return res.data;
  } else {
    return {};
  }
};

const agree = async (index: number) => {
  // 同意好友申请
  const { data: res } = await agreeFriendRequest(
    token,
    allNotices.value[index].id
  );
  if (res.code === 200) {
    showSuccessToast("好友添加成功");
    router.push({
      name: "chatWindow",
      params: { uid: allInfo.value[index].uid },
    });
  } else {
    showFailToast(res.msg);
    location.reload();
  }
};

const disagree = async (index: number) => {
  // 拒绝好友申请
  const { data: res } = await disagreeFriendRequest(
    token,
    allNotices.value[index].id
  );
  if (res.code === 200) {
    allNotices.value.splice(index, 1);
    allInfo.value.splice(index, 1);
  } else {
    allNotices.value.splice(index, 1);
    allInfo.value.splice(index, 1);
    showFailToast(res.msg);
  }
};

const delNotice = async (index: number) => {
  // 删除
  const { data: res } = await deleteNotice(token, allNotices.value[index].id);
  if (res.code === 200) {
    allNotices.value.splice(index, 1);
    allInfo.value.splice(index, 1);
  } else {
    showFailToast(res.msg);
  }
};
</script>

<template>
  <van-nav-bar title="通知" left-arrow @click-left="goBack" />
  <van-empty
    v-if="!allNotices.length"
    image-size="120"
    description="通知都处理完啦，快去聊天吧~"
    style="margin-top: 20px"
  />
  <van-swipe-cell v-for="(item, index) in allInfo" :key="item.id">
    <template #left>
      <van-button
        square
        type="primary"
        text="同意"
        @click="agree(index)"
        v-if="item.type === 'addFriend'"
      />
    </template>
    <van-cell>
      <template #title>
        <div class="notice-item-title">
          <van-image
            class="user-profile"
            round
            width="3rem"
            height="3rem"
            :src="getProfile(item.profile)"
            error-icon="user-circle-o"
            loading-icon="user-circle-o"
            fit="cover"
          />
          <p class="notice">
            <span>
              <span
                class="username"
                @click="
                  $router.push({ name: 'detail', params: { uid: item.uid } })
                "
              >
                {{ item.username }}
              </span>
              <span v-if="item.type === 'addFriend'">申请加你为好友</span>
              <span v-else-if="item.type === 'disagreeFriend'">
                拒绝了你的好友请求
              </span>
              <span v-else-if="item.type === 'starPost'">
                赞了你的
                <router-link
                  class="post-link"
                  :to="{
                    name: 'postDetail',
                    params: { postId: item?.data?.postId },
                  }"
                >
                  帖子
                </router-link>
              </span>
            </span>
            <span class="message van-ellipsis">{{ item.message }}</span>
          </p>
        </div>
      </template>
      <template #value>
        <div style="font-size: 10px">
          {{ formatTimeStamp(item.time, "auto") }}
        </div>
      </template>
    </van-cell>
    <template #right>
      <van-button
        square
        type="danger"
        text="拒绝"
        @click="disagree(index)"
        v-if="item.type === 'addFriend'"
      />
      <van-button square type="primary" text="删除" @click="delNotice(index)" />
    </template>
  </van-swipe-cell>
</template>

<style lang="scss" scoped>
:deep(.van-swipe-cell__left > .van-button),
:deep(.van-swipe-cell__right > .van-button) {
  height: 100%;
}
:deep(.van-cell__title) {
  flex-grow: 2.5;
}
.notice-item-title {
  display: flex;
  align-items: center;
  .notice {
    margin: 0;
    padding: 5px 10px;
    font-size: 15px;
    .username,
    .post-link {
      color: #cd93ff;
    }
    .message {
      display: block;
      color: #afafaf;
    }
  }
  .user-profile {
    float: left;
    line-height: 90%;
  }
}
</style>
