<script lang="ts">
export default { name: "meetuPerson" };
</script>
<script setup lang="ts" name="meetuPerson">
import { ref, onBeforeMount } from "vue";
import {
  Icon as vanIcon,
  Empty as vanEmpty,
  Popover as vanPopover,
  Grid as vanGrid,
  GridItem as vanGridItem,
  showToast,
} from "vant";
import getPersonInfo from "@/api/user/getPersonInfo";
import getProfile from "@/api/user/getProfile";
import { useClipboard } from "@/components/hooks/useClipboard";

const isEmpty = ref<boolean>(true);
const headerImage = ref<string>(getProfile("header-background.jpeg"));
const userProfile = ref<string>("");
const gender = ref<string>("");
const username = ref<string>("");
const sign = ref<string>("");
const muid = ref<string>("");

onBeforeMount(async () => {
  const uid = localStorage.getItem("meetu_uid");
  const { data: res } = await getPersonInfo(uid as string);
  if (res.code === 200) {
    const data = res.data;
    userProfile.value = getProfile(data.profile);
    username.value = data.username;
    gender.value = data.gender;
    sign.value = data.sign;
    muid.value = data.muid;
  } else {
    showToast({ message: "网络错误", position: "bottom" });
  }
});

// 屏幕长按MUID弹出复制气泡框
const muidRef = ref<HTMLElement | null>(null);
const showCopyMUIDPopover = ref(false);
let timeoutEvent: number;
const touchStart = () => {
  (muidRef.value as HTMLElement).classList.add("muid-touch");
  clearTimeout(timeoutEvent);
  timeoutEvent = setTimeout(() => {
    showCopyMUIDPopover.value = true;
  }, 350);
};
const touchMove = () => {
  (muidRef.value as HTMLElement).classList.remove("muid-touch");
  clearTimeout(timeoutEvent);
};
const touchEnd = () => {
  (muidRef.value as HTMLElement).classList.remove("muid-touch");
  clearTimeout(timeoutEvent);
};
// 使用Clipboard.js实现复制的功能
useClipboard("#copyBtn", ".muid span", (status) => {
  showCopyMUIDPopover.value = false;
  (muidRef.value as HTMLElement).classList.remove("muid-touch");
  showToast({
    message: status ? "复制成功" : "复制失败",
    position: "bottom",
  });
});
</script>

<template>
  <div class="header-box" :style="{ backgroundImage: `url(${headerImage})` }">
    <div id="avatar-box">
      <div style="position: relative; display: inline-block">
        <img id="avatar" :src="userProfile" ait="头像" />
        <span v-if="gender === 'male'" class="gender">♂</span>
        <span v-else-if="gender === 'female'" class="gender">♀</span>
        <span v-else></span>
      </div>
      <span id="username">{{ username }}</span>
    </div>
    <van-popover v-model:show="showCopyMUIDPopover" :offset="[15, 8]">
      <van-grid
        square
        clickable
        horizontal
        id="copyBtn"
        style="min-width: 50px; min-height: 30px"
      >
        <van-grid-item style="flex-basis: 100%" text="复制" />
      </van-grid>
      <template #reference>
        <p
          class="muid"
          ref="muidRef"
          @touchstart.prevent="touchStart"
          @touchmove.prevent="touchMove"
          @touchend="touchEnd"
        >
          MUID: <span>{{ muid ? muid : "无" }}</span>
        </p>
      </template>
    </van-popover>
    <span id="sign">{{ sign }}</span>
    <span id="setting">
      <span id="editSelfInfo"
        ><router-link to="/person/edit">编辑信息</router-link></span
      >
      <van-icon
        id="settingBtn"
        name="setting-o"
        @click="$router.push({ name: 'settings' })"
      />
    </span>
  </div>
  <div class="content-box">
    <van-empty
      v-if="isEmpty"
      style="padding-top: 20%"
      image-size="10rem"
      description="你还没有发布任何动态哦！"
    />
  </div>
</template>

<style lang="scss" scoped>
#app {
  height: 100%;
}
.header-box {
  z-index: 1;
  width: 100%;
  height: 40%;
  background-position: center center;
  background-repeat: no-repeat;
  //background-position: 10 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: relative;
  #avatar-box {
    width: 200px;
    margin-top: 5%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    #avatar {
      width: 70px;
      height: 70px;
      border-radius: 40px;
      border: 2px solid white;
    }
    .gender {
      position: absolute;
      top: 65%;
      right: 2px;
      color: black;
      width: 18px;
      height: 18px;
      font-size: 15px;
      border-radius: 20px;
      border: 1px solid white;
      background-color: aliceblue;
    }
    #username {
      display: block;
      color: white;
      margin-top: 10px;
      font-size: 25px;
      letter-spacing: 1px;
    }
  }
  :deep(.van-grid-item) {
    flex-basis: 50%;
  }
  .muid {
    margin: 0;
    padding: 0;
    max-width: 150px;
    font-size: 13px;
    color: #deecf9;
  }
  .muid-touch {
    background-color: rgba(211, 211, 211, 0.42);
    color: #70e2ff;
  }
  #sign {
    margin-top: 10px;
    background-image: linear-gradient(90deg, #7117ea, #ea6060);
    background-clip: text; // 该属性只兼容Chrome
    -webkit-background-clip: text;
    color: transparent;
  }
  #setting {
    display: flex;
    align-items: center;
    position: absolute;
    top: 10px;
    right: 10px;
    #editSelfInfo {
      margin-right: 15px;
      text-decoration: none;
      a {
        color: white;
      }
      a:hover {
        color: #efeded;
      }
    }
    #settingBtn {
      color: white;
      font-weight: bold;
      font-size: 20px;
    }
    #settingBtn:active {
      color: #efeded;
    }
  }
}
.content-box {
  z-index: 2;
  position: relative;
  top: -20px;
  width: 100%;
  min-height: calc(60% - 40px);
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 20px 20px 0 0;
}
</style>
