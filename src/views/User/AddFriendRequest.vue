<script setup lang="ts" name="meetuAddFriendRequest">
import { ref, onBeforeMount, defineProps } from "vue";
import {
  NavBar as vanNavBar,
  CellGroup as vanCellGroup,
  Cell as vanCell,
  Field as vanField,
  Image as vanImage,
  Button as vanButton,
  showFailToast,
  showSuccessToast,
} from "vant";
import { useRouter, useRoute } from "vue-router";
import getPersonInfo from "@/api/user/getPersonInfo";
import getProfile from "@/api/user/getProfile";
import addFriendRequest from "@/api/notice/addFriendRequest";
import type { UserInfo } from "@/types";

const props = defineProps<{
  uid: string;
}>();

const message = ref<string>("");
const info = ref<UserInfo | null>(null);
const router = useRouter();
const route = useRoute();
const goBack = () => router.back();
onBeforeMount(async () => {
  const { data: res } = await getPersonInfo(props.uid);
  if (res.code === 200) {
    info.value = res.data;
  } else {
    showFailToast("获取用户信息失败");
  }
});

const sendRequest = async () => {
  const token = route.meta.token as string;
  const { data: res } = await addFriendRequest(
    token as string,
    (info.value as UserInfo).muid,
    message.value
  );
  if (res.code === 200) {
    showSuccessToast("发送成功");
    router.go(-1);
  } else {
    showFailToast(res.msg);
  }
};
</script>

<template>
  <van-nav-bar title="发送好友申请" left-arrow @click-left="goBack" />
  <main class="content-box">
    <van-cell class="user-card" center size="large" clickable border>
      <template #title>
        <van-image
          class="user-profile"
          round
          width="4rem"
          height="4rem"
          :src="getProfile('default.png')"
          error-icon="user-circle-o"
          loading-icon="user-circle-o"
          fit="cover"
        />
        <h4 class="username">{{ info?.username ? info.username : "" }}</h4>
        <p class="van-ellipsis">个性签名：{{ info?.sign }}</p>
      </template>
    </van-cell>
    <van-cell-group inset>
      <van-field
        v-model="message"
        rows="2"
        autosize
        label="验证信息"
        type="textarea"
        maxlength="50"
        placeholder="请输入验证信息"
        show-word-limit
        style="font-size: 15px"
      />
    </van-cell-group>
    <div style="width: 100%; text-align: center">
      <van-button
        class="submit-btn"
        type="primary"
        size="large"
        @click="sendRequest"
        >发送</van-button
      >
    </div>
  </main>
</template>

<style lang="scss" scoped>
.content-box {
  padding-top: 5px;
  height: calc(100% - 46px);
  background-color: #efefef;
  .user-card {
    box-sizing: border-box;
    width: 95%;
    margin: 10px auto;
    border-radius: 10px;
  }
  .user-profile {
    float: left;
    margin: 5px;
  }
  .username {
    font-size: 20px;
    margin: 5px 0 0 0;
    padding-left: 12px;
    line-height: 20px;
  }
  .submit-btn {
    margin-top: 10px;
    width: 95%;
  }
}
</style>
