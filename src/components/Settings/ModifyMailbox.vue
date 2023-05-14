<script setup lang="ts" name="meetuModifyMailbox">
import { ref, defineEmits, defineProps } from "vue";
import { useRoute } from "vue-router";
import {
  Button as vanButton,
  Popup as vanPopup,
  Field as vanField,
  CellGroup as vanCellGroup,
  Icon as vanIcon,
  showToast,
  showFailToast,
  showSuccessToast,
  showLoadingToast,
} from "vant";
import verifyCodeCountdown from "@/utils/verifyCodeCountdown";
import sendModifyMailboxLetter from "@/api/user/modifyMailboxLetter";
import modifyMailbox from "@/api/user/modifyMailbox";
import verifyOldMail from "@/api/user/verifyOldEmail";
import { emailPattern } from "@/project.config";

const props = defineProps<{
  email: string;
}>();

const emits = defineEmits<{
  (e: "closePopup"): void;
  (e: "updateEmail", email: string): void;
}>();

const route = useRoute();

const isShow = ref<boolean>(true);
const oldEmail = ref<string>("");
const newEmail = ref<string>("");
const verifyCode = ref<string>("");
const oldEmailToken = ref<string>("");
const emailVerifyCodeBtnDisable = ref<boolean>(false);
const sendVerifyCodeBtn = ref<HTMLElement | null>(null);
const emailVerifyCodeBtnText = ref<string>("发送验证码");

// 旧邮箱的后缀
const emailSuffix = ref<string>("");
emailSuffix.value = "@" + props.email.split("@")[1];

const isNextStep = ref<boolean>(false);

const closePopup = () => {
  !isShow.value && emits("closePopup");
};

// 获取验证码
const sendVerifyCode = async () => {
  const token = route.meta.token as string;
  const { data: res } = await sendModifyMailboxLetter(
    token as string,
    newEmail.value
  );
  if (res.code === 200) {
    // 邮箱发送成功
    showToast({ message: res.msg, position: "bottom" });
    emailVerifyCodeBtnDisable.value = true;
    verifyCodeCountdown("发送验证码", 60 * 5, emailVerifyCodeBtnText, () => {
      emailVerifyCodeBtnDisable.value = false;
    });
  } else {
    // 邮箱发送失败
    showToast({ message: res.msg, position: "bottom" });
  }
};

interface OldEmailVerifyResponse {
  status: boolean;
  msg: string;
  token?: string;
}

// 点击下一步的按钮
const nextStepBtn = async () => {
  const toast = showLoadingToast({
    message: "加载中...",
    forbidClick: true,
  });

  if (!oldEmail.value) {
    showToast({ message: "请输入邮箱地址", position: "bottom" });
  } else if (oldEmail.value.includes("@")) {
    showToast({ message: "请不要输入邮箱后缀", position: "bottom" });
  } else {
    const email = oldEmail.value + emailSuffix.value;
    // 请求验证邮箱地址
    const result: OldEmailVerifyResponse = await fetchVerityOldEmail(email);

    if (result.status) {
      toast.close();
      oldEmailToken.value = result.token as string;
      isNextStep.value = true;
    } else {
      showFailToast({ message: result.msg });
    }
  }
};

// 返回到上一步
const reBack = () => {
  isNextStep.value = !isNextStep.value;
};

// 发起验证旧邮箱的请求
const fetchVerityOldEmail = async (oldEmail: string) => {
  const token: string = route.meta.token as string;
  const { data: res } = await verifyOldMail(token, oldEmail);
  if (res.code == 200) {
    return { status: true, msg: res.msg, token: res.data.token };
  } else {
    return { status: false, msg: res.msg };
  }
};

// 点击修改邮箱地址按钮
const modifyEmailHandler = async () => {
  if (emailPattern.test(newEmail.value)) {
    const token = route.meta.token as string;
    const { data: res } = await modifyMailbox(
      token as string,
      verifyCode.value,
      newEmail.value,
      oldEmailToken.value
    );
    if (res.code === 200) {
      // 修改成功
      showSuccessToast({ message: "修改成功！", position: "middle" });
      emits("updateEmail", newEmail.value);
      isShow.value = false;
    } else {
      showFailToast({ message: res.msg, position: "middle" });
    }
  } else {
    showToast({ message: "请输入合法邮箱地址", position: "bottom" });
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
    :style="{ backgroundColor: '#efefef', height: '55%' }"
    duration="0.25"
    transition-appear
    @closed="closePopup"
  >
    <h4 style="text-align: center">修改邮箱地址</h4>
    <div
      class="vertifyOldMail"
      v-if="!isNextStep"
      :class="{ 'enter-ani': !isNextStep, 'leave-ani': isNextStep }"
    >
      <div class="tips">
        我们需要验证您的邮箱地址:
        <span class="old-email">{{ props.email }}</span>
        ，请输入完整的邮箱地址，以验证您的身份。
      </div>
      <van-cell-group inset>
        <van-field
          v-model.trim="oldEmail"
          label="旧邮箱地址"
          placeholder="请输入旧邮箱地址(无后缀)"
          input-align="center"
        >
          <!-- vant内置的后置插槽是用来插入按钮的，这里我用来插入邮箱后缀名 -->
          <template #button>
            <span>{{ emailSuffix }}</span>
          </template>
        </van-field>
      </van-cell-group>
      <div style="width: 100%; display: flex; justify-content: center">
        <van-button
          class="modify-email-btn"
          type="primary"
          block
          @click="nextStepBtn"
        >
          下一步
        </van-button>
      </div>
    </div>
    <div
      class="editNewEmail"
      v-else
      :class="{ 'enter-ani': isNextStep, 'leave-ani': !isNextStep }"
    >
      <div class="reBack" @click="reBack">
        <van-icon name="revoke" />
        <span>返回</span>
      </div>
      <van-cell-group inset>
        <van-field
          v-model="newEmail"
          type="email"
          label="新邮箱地址"
          placeholder="请输入新的邮箱地址"
        />
        <!-- 新邮箱的验证码  -->
        <van-field
          v-model="verifyCode"
          label="验证码"
          placeholder="请输入验证码"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              @click="sendVerifyCode"
              ref="sendVerifyCodeBtn"
              :disabled="emailVerifyCodeBtnDisable"
            >
              {{ emailVerifyCodeBtnText }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div style="width: 100%; display: flex; justify-content: center">
        <van-button
          class="modify-email-btn"
          type="primary"
          block
          @click="modifyEmailHandler"
        >
          修改
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.tips {
  width: 95%;
  margin-left: 10px;
  margin-bottom: 10px;
  text-indent: 2rem;
  .old-email {
    text-indent: 0;
    display: inline-block;
    padding: 5px;
    background-color: #fcd8d8;
    border-radius: 5px;
  }
}
.editNewEmail {
  .reBack {
    display: inline-block;
    padding: 10px 20px;
    span {
      padding-left: 3px;
    }
  }
}
.modify-email-btn {
  width: 90%;
  margin-top: 10px;
}

:deep(.van-cell-group .van-field__label) {
  display: flex;
  align-items: center;
}

// 离场动画
.leave-ani {
  animation: fadeOutLeft;
  animation-duration: 0.9s;
}

// 进场动画
.enter-ani {
  animation: fadeInRight;
  animation-duration: 0.9s;
}
</style>
