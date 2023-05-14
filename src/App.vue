<script setup lang="ts">
import { onBeforeUnmount, provide } from "vue";
import { useStore } from "@/stores";
import socket from "@/utils/socket/socket";
import Login from "@/components/Login.vue";
import { noCacheList } from "@/project.config";
import { useAppInit } from "@/components/hooks/useAppInit";

provide("socket", socket);
const store = useStore();

onBeforeUnmount(() => {
  if (socket.connected) socket.disconnect();
});

useAppInit(socket);
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :exclude="noCacheList">
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
  <Login v-show="store.loginOverlayShow" />
</template>

<style lang="scss">
body,
html,
#app {
  width: 100%;
  height: 100%;

  font-family: "Noto Sans", "Roboto Light", sans-serif;
}

// 自定义NavBar高度
.nav-bar-height {
  height: 60px !important;
  & > div {
    height: 60px !important;
    & > div {
      height: 60px !important;
    }
  }
}

@font-face {
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("@/assets/fonts/NotoSans-Medium.ttf");
}
// @font-face {
//   font-family: "Open Sans";
//   font-style: normal;
//   font-weight: 400;
//   font-display: swap;
//   src: url("@/assets/fonts/OpenSans-Medium.ttf");
// }
// @font-face {
//   font-family: "Noto Sans SC";
//   font-style: normal;
//   font-weight: 400;
//   font-display: swap;
//   src: url("@/assets/fonts/NotoSansSC-Medium.otf");
// }
</style>
