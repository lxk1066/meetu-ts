<script lang="ts">
export default { name: "meetuSettings" };
</script>
<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Icon as vanIcon,
  Button as vanButton,
  Cell as vanCell,
  CellGroup as vanCellGroup,
  NavBar as vanNavBar,
  showConfirmDialog,
  showDialog,
} from "vant";
import ModifyMailbox from "@/components/Settings/ModifyMailbox.vue";
import ModifyPassword from "@/components/Settings/ModifyPassword.vue";
import ModifyMUID from "@/components/Settings/ModifyMUID.vue";
import getUserMailbox from "@/api/user/getUserMailbox";
import getUserMUID from "@/api/user/getUserMUID";

const route = useRoute();
const router = useRouter();
const ownEmail = ref<string>("");
const muid = ref<string>("");

const logout = () => {
  showConfirmDialog({
    title: "提示",
    message: "确认要退出登录么？",
  })
    .then(() => {
      localStorage.clear();
      location.reload();
    })
    .catch(() => {});
};

const showMuidPrompt = () => {
  showDialog({
    title: "MUID是什么？",
    width: "330",
    message:
      "MUID作为每个用户在平台内与其他用户之间互相搜索及社交的唯一标识。请手动设置您的个性MUID，或者你也可以使用系统默认生成的MUID。最后请谨慎修改MUID！\n\nMUID支持6~10位的纯数字 或 小写英文字母+数字。",
  });
};

onBeforeMount(async () => {
  const token = route.meta.token as string;
  const uid = route.meta.uid as string;
  // 获取自己的邮箱地址
  const { data: res } = await getUserMailbox(token as string);
  if (res.code === 200) {
    ownEmail.value = res.data.email;
  }
  // 获取自己的MUID
  const { data: result } = await getUserMUID(uid as string);
  if (result.code === 200) {
    muid.value = result.data.muid;
  }
});

const modifyMailboxIsShow = ref<boolean>(false);
const modifyPasswordIsShow = ref<boolean>(false);
const modifyMUIDIsShow = ref<boolean>(false);
</script>

<template>
  <van-nav-bar
    title="设置"
    left-arrow
    placeholder
    @click-left="router.back()"
  />
  <div class="settings-box">
    <van-cell-group title="账号管理" inset>
      <van-cell
        title="邮箱地址"
        :value="ownEmail"
        is-link
        @click="modifyMailboxIsShow = true"
      />
      <ModifyMailbox
        :email="ownEmail"
        v-if="modifyMailboxIsShow"
        @closePopup="modifyMailboxIsShow = false"
        @updateEmail="ownEmail = $event"
      />

      <van-cell
        label="一个自然年(365天)只能修改1次"
        :value="muid"
        is-link
        @click="modifyMUIDIsShow = true"
        value-class="muid-cell-value"
        label-class="muid-cell-label"
      >
        <template #title>
          <span class="muid-cell-title" @click.stop="showMuidPrompt">MUID</span>
          <van-icon color="#206864" name="question" />
        </template>
      </van-cell>
      <ModifyMUID
        :muid="muid"
        v-if="modifyMUIDIsShow"
        @closePopup="modifyMUIDIsShow = false"
      />

      <van-cell
        title="修改密码"
        label="一个自然月只能修改3次"
        is-link
        @click="modifyPasswordIsShow = true"
      />
      <ModifyPassword
        v-if="modifyPasswordIsShow"
        @closePopup="modifyPasswordIsShow = false"
      />
    </van-cell-group>
    <van-cell-group title="用户须知" inset>
      <van-cell title="用户协议" is-link />
      <van-cell title="隐私政策" is-link />
      <van-cell title="特别声明" is-link />
    </van-cell-group>
    <van-cell-group title="其他" inset>
      <van-cell title="关于我们" is-link />
      <van-cell title="贡献者名单" is-link />
      <van-cell title="帮助与反馈" is-link />
    </van-cell-group>
    <div style="width: 100%; display: flex; justify-content: center">
      <van-button id="logoutBtn" type="danger" size="large" @click="logout"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-box {
  background-color: #ebebec;
  padding-top: 5px;
  min-height: calc(100% - 50px);
  .muid-cell-title {
    color: #cd93ff;
    text-decoration: underline;
  }
  &:deep(.muid-cell-value) {
    height: 20px;
    width: 100px;
  }
  &:deep(.muid-cell-label) {
    width: 175px;
  }
  #logoutBtn {
    width: 95%;
    margin-top: 20px;
  }
}
</style>
