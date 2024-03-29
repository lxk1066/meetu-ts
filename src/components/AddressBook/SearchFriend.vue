<script setup lang="ts" name="meetuSearchFriend">
import { reactive, ref, defineEmits } from "vue";
import searchMUID from "@/api/user/searchMUID";
import getPersonInfo from "@/api/user/getPersonInfo";
import getProfile from "@/api/user/getProfile";
import {
  Popup as vanPopup,
  Field as vanField,
  CellGroup as vanCellGroup,
  Cell as vanCell,
  Button as vanButton,
  Image as vanImage,
  Empty as vanEmpty,
  showFailToast,
} from "vant";

import type { UserInfo } from "@/types";

import { TokenKey } from "@/project.config";

// const props = defineProps<{
//   show: string;
// }>();

const emits = defineEmits<{
  (e: "closePopup"): void;
}>();

const searchStr = ref<string>("");
const isShow = ref<boolean>(true);
const searchBtnDisable = ref<boolean>(false);
const searchResult = reactive<Array<UserInfo>>([]);
const resultIsEmpty = ref<boolean>(false);

const closePopup = (): void => {
  !isShow.value && emits("closePopup");
};
const search = async (): Promise<void> => {
  if (resultIsEmpty.value) resultIsEmpty.value = false;
  if (searchResult.length) searchResult.splice(0, searchResult.length); // 清空数组
  if (searchStr.value) {
    searchBtnDisable.value = true;
    const token = localStorage.getItem(TokenKey);
    const { data: res } = await searchMUID(searchStr.value, token as string);
    if (res.code === 200) {
      const users = res.data.users;
      if (!users.length) resultIsEmpty.value = true;
      for (const item of users) {
        const { data: info } = await getPersonInfo(item);
        searchResult.push({
          uid: item,
          profile: info.data.profile,
          username: info.data.username,
          gender: info.data.gender,
          sign: info.data.sign,
          area: info.data.area,
          muid: info.data.muid,
        });
      }
    } else {
      showFailToast("搜索失败");
    }
    searchBtnDisable.value = false;
  }
};
</script>

<template>
  <van-popup
    v-model:show="isShow"
    round
    closeable
    close-icon="close"
    position="bottom"
    duration="0.25"
    transition-appear
    @closed="closePopup"
    :style="{ height: '80%', backgroundColor: '#efefef' }"
  >
    <template #default>
      <h2 style="text-align: center">查找用户</h2>
      <van-cell-group inset>
        <van-field
          clearable
          v-model="searchStr"
          label-align="left"
          placeholder="请输入要搜索的用户MUID"
        >
          <template #button>
            <van-button
              class="search-btn"
              size="small"
              type="primary"
              :disabled="searchBtnDisable"
              @click="search"
              >查找</van-button
            >
          </template>
        </van-field>
      </van-cell-group>
      <van-empty
        v-if="searchResult.length === 0 && resultIsEmpty"
        image="search"
        description="未找到该MUID的用户"
      />
      <van-cell-group class="user-card-group" inset v-else>
        <van-cell
          class="user-card"
          v-for="item in searchResult"
          :key="item.uid"
          center
          size="large"
          clickable
          border
          :to="{ name: 'detail', params: { uid: item.uid } }"
        >
          <template #title>
            <van-image
              class="user-profile"
              round
              width="4rem"
              height="4rem"
              :src="getProfile(item.profile)"
              error-icon="user-circle-o"
              loading-icon="user-circle-o"
              fit="cover"
            />
            <h4 class="username">{{ item.username }}</h4>
            <span class="user-muid">(MUID: {{ item.muid }})</span>
            <p class="user-area">
              地区：{{ item.area === "secrecy" ? "无" : item.area }}
            </p>
            <p>个性签名：{{ item.sign }}</p>
          </template>
        </van-cell>
      </van-cell-group>
    </template>
  </van-popup>
</template>

<style scoped>
h2 {
  height: 30px;
}
h2 + div {
  height: 50px;
}
.search-btn {
  width: 50px;
}
.user-card-group {
  height: calc(100% - 30px - 100px);
  overflow: auto;
  margin-top: 5px;
  background-color: #efefef;
}
.user-card {
  margin: 10px 0;
}
.user-profile {
  float: left;
  margin: 5px;
}
.username {
  font-size: 20px;
  margin: 5px 0 0 0;
  padding-left: 10px;
  display: inline-block;
}
.user-muid {
  margin: 0;
  padding-left: 5px;
  font-size: 12px;
}
/* .user-area {
  display: inline-block;
} */
</style>
