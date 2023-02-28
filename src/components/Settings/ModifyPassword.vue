<script setup lang="ts" name="meetuModifyPassword">
import { ref, defineEmits, defineProps } from "vue";
import { Popup as vanPopup, Button as vanButton, showToast } from "vant";
import sendModifyPasswordEmail from "@/api/user/modifyPassword";

const isShow = ref<boolean>(true);
const sendBtnIsDisable = ref<boolean>(false);

const emits = defineEmits<{
  (e: "closePopup"): void;
}>();

const props = defineProps<{
  email: string;
}>();

const closePopup = () => {
  !isShow.value && emits("closePopup");
};

const sendEmail = async () => {
  sendBtnIsDisable.value = true;
  const token = localStorage.getItem("meetu_jwt_token");
  const { data: res } = await sendModifyPasswordEmail(token as string);
  if (res.code === 200) {
    // 邮件发送成功
    showToast({ message: res.msg, position: "bottom" });
    isShow.value = false;
  } else {
    // 邮件发送失败
    showToast({ message: res.msg, position: "bottom" });
    sendBtnIsDisable.value = false;
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
    :style="{ backgroundColor: '#efefef', height: '40%' }"
    duration="0.25"
    transition-appear
    @closed="closePopup"
  >
    <h4 style="text-align: center">修改密码</h4>
    <p class="tips">
      我们会向您的邮箱地址<span class="old-email">{{ props.email }}</span
      >发送一封包含<b>修改密码链接</b>的邮件，请点击该链接修改密码。
    </p>
    <van-button
      type="primary"
      round
      block
      style="width: 90%; margin: 0 auto"
      @click="sendEmail"
      :disabled="sendBtnIsDisable"
    >
      发送邮件
    </van-button>
  </van-popup>
</template>

<style lang="scss" scoped>
.tips {
  width: 95%;
  margin-left: 10px;
  text-indent: 2rem;
  .old-email {
    text-indent: 0;
    display: inline-block;
    padding: 5px;
    background-color: #fcd8d8;
    border-radius: 5px;
  }
}
</style>
