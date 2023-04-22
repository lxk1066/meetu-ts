<script lang="ts">
export default { name: "meetuRegister" };
</script>
<script setup lang="ts" name="meetuRegister">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  Button as vanButton,
  Icon as vanIcon,
  Form as vanForm,
  Field as vanField,
  CellGroup as vanCellGroup,
  showToast,
  showSuccessToast,
  showFailToast,
} from "vant";
import sendEmailVerifyCode from "@/api/user/emailVerifyCode";
import register from "@/api/user/register";
import verifyCodeCountdown from "@/utils/verifyCodeCountdown";
import {
  emailPattern as emailReg,
  passwordPattern as passwordReg,
} from "@/project.config";
const router = useRouter();
const username = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");
const email = ref<string>("");
const emailVerifyCode = ref<string>("");
const emailVerifyCodeBtnText = ref<string>("发送验证码");
const emailVerifyCodeBtnDisable = ref<boolean>(false); // 发送验证码按钮禁用的变量

const emailErrText: string = "邮箱不合法，请重新输入";
const emailPattern = (val: string): boolean => {
  return emailReg.test(val);
};

const passwordErrText: string =
  "密码8~20位，必须包含大小写字母和数字，特殊字符可选(,._!@#$^&*)";
const passwordPattern = (val: string): boolean => {
  return passwordReg.test(val);
};

const sendVerifyCode = async () => {
  //  向后端请求发送邮箱验证码
  if (email.value !== "") {
    const { data: res } = await sendEmailVerifyCode(email.value);
    if (res.code === 200) {
      //  邮箱发送成功
      emailVerifyCodeBtnDisable.value = true;
      verifyCodeCountdown("发送验证码", 60 * 5, emailVerifyCodeBtnText, () => {
        emailVerifyCodeBtnDisable.value = false;
      });
    } else {
      //  邮箱发送失败
      showToast({ message: res.msg, position: "bottom" });
    }
  }
};

// 点击注册按钮
const onRegister = async () => {
  if (!username.value) {
    showToast({ message: "用户名不得为空", position: "bottom" });
  } else if (!password.value) {
    showToast({ message: "密码不得为空", position: "bottom" });
  } else if (!confirmPassword.value) {
    showToast({ message: "确认密码不得为空", position: "bottom" });
  } else if (!email.value) {
    showToast({ message: "邮箱不得为空", position: "bottom" });
  } else if (!emailVerifyCode.value) {
    showToast({ message: "邮箱验证码不得为空", position: "bottom" });
  } else if (password.value !== confirmPassword.value) {
    showToast({ message: "确认密码与密码不一致！", position: "bottom" });
  } else {
    // 向后端服务器请求注册
    const { data: res } = await register(
      username.value,
      password.value,
      email.value,
      emailVerifyCode.value
    );
    if (res.code === 200) {
      showSuccessToast({ message: "注册成功！", position: "middle" });
      await router.push("/login");
    } else {
      // 注册失败
      showFailToast({
        message: res.msg,
        position: "bottom",
        duration: 2000,
      });
    }
  }
};

const goBack = () => {
  router.push("/");
  // location.reload();
};
</script>

<template>
  <div class="register-box">
    <h2>注册用户</h2>
    <van-icon
      id="close-register-box"
      name="arrow-left"
      size="25"
      @click="goBack"
    />
    <van-form @submit="onRegister" class="register-form">
      <van-cell-group inset>
        <van-field
          v-model="username"
          type="text"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />

        <van-field
          v-model="email"
          type="email"
          label="邮箱"
          placeholder="邮箱"
          name="emailPattern"
          :rules="[{ validator: emailPattern, message: emailErrText }]"
        />

        <van-field
          v-model="emailVerifyCode"
          center
          clearable
          label="验证码"
          placeholder="请输入邮箱验证码"
          :rules="[{ required: true, message: '请输入邮箱验证码' }]"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              @click="sendVerifyCode"
              id="emailCodeBtn"
              :disabled="emailVerifyCodeBtnDisable"
            >
              {{ emailVerifyCodeBtnText }}
            </van-button>
          </template>
        </van-field>

        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ validator: passwordPattern, message: passwordErrText }]"
        />
        <van-field
          v-model="confirmPassword"
          type="password"
          name="确认密码"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true, message: '请输入确认密码' }]"
        />
      </van-cell-group>
      <p style="padding-left: 20px">
        已经有账号？去<router-link to="/login">&#160;登录</router-link>
      </p>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.register-box {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #efeded;
  display: flex;
  flex-direction: column;

  h2 {
    text-align: center;
  }

  #close-register-box {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
</style>
