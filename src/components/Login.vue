<script lang="ts">
export default {
  name: "meetuLogin",
};
</script>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useStore } from "@/stores";
import {
  Button as vanButton,
  Form as vanForm,
  Field as vanField,
  CellGroup as vanCellGroup,
  Overlay as vanOverlay,
  Icon as vanIcon,
  showToast,
} from "vant";
import type { FormInstance } from "vant";

import login from "@/api/user/login";

const store = useStore();
const username = ref<string>("");
const password = ref<string>("");
const loginLoading = ref<boolean>(false);

const loginFormRef = ref<FormInstance | null>(null);

const onLogin = async (): Promise<void> => {
  loginLoading.value = true;
  const { data: res } = await login(username.value, password.value);
  if (res.code === 200) {
    loginLoading.value = false;
    localStorage.setItem("meetu_jwt_token", res.token);
    localStorage.setItem("meetu_uid", res.uid);
    store.changeLoginOverLayShow(false);
    location.reload();
  } else {
    loginLoading.value = false;
    showToast({
      message: res.msg,
      position: "bottom",
    });
  }
};

const closeOverlay = () => {
  store.changeLoginOverLayShow(false);
};

const goRegister = () => {
  closeOverlay();
};

// 当组件隐藏时，重置表单
watch(
  () => store.loginOverlayShow,
  () => {
    if (!store.loginOverlayShow) {
      (loginFormRef.value as FormInstance).resetValidation();
      username.value = "";
      password.value = "";
    }
  }
);
</script>

<template>
  <van-overlay :show="store.loginOverlayShow" class="mark-overlay" lock-scroll>
    <div class="login-box">
      <h2>登录</h2>
      <van-icon name="cross" id="close-btn" @click="closeOverlay" />
      <van-form @submit="onLogin" class="login-form" ref="loginFormRef">
        <van-cell-group inset>
          <van-field
            v-model.trim="username"
            name="用户名"
            label="账号"
            placeholder="用户名 &#47; 邮箱"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />

          <van-field
            v-model.trim="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>
        <p style="padding-left: 10px">
          还没有账号？去<router-link to="/register" @click="goRegister"
            >&#160;注册</router-link
          >
        </p>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loginLoading"
            loading-text="正在登录"
          >
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </van-overlay>
</template>

<style lang="scss" scoped>
.mark-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  --van-overlay-z-index: 10;
}
.login-box {
  width: 90%;
  min-height: 280px;
  background-color: #efefef;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  #close-btn {
    font-size: 20px;
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
