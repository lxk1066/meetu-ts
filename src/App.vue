<script setup lang="ts">
import { onBeforeUnmount, provide } from "vue";
import { useStore } from "@/stores";
import socket from "@/utils/socket/socket";
import Login from "@/components/Login.vue";
import verifyToken from "./api/user/verifyToken";

provide("socket", socket);
const store = useStore();

init();

onBeforeUnmount(() => {
  if (socket.connected) socket.disconnect();
});

async function init() {
  // 一进来就立即与服务器建立socket.io连接
  const token = localStorage.getItem("meetu_jwt_token");
  const uid = localStorage.getItem("meetu_uid");
  if (token && uid) {
    const { data: res } = await verifyToken(token);
    if (res.code === 200) {
      if (!socket.connected) socket.connect();
      socket.on("connect", () => {
        console.log("connect", socket.id);
        socket.emit("set-user-id", uid);
        (socket as any).uid = uid;

        // 更新当前用户的在线状态
        socket.emit("online-message", (socket as any).uid);
        console.log("online-message");
        socket.on("online-message-reply-own", (isOnline) => {
          console.log("isOnline", isOnline);
          store.changeOnlineStatus(isOnline);
        });

        socket.on("disconnect", () => {
          console.log("disconnect", socket.id); // undefined
        });
      });
    }
  }
}
</script>

<template>
  <!-- <h1>he</h1> -->
  <router-view />
  <Login v-if="$route.meta.auth" />
</template>

<style lang="scss">
body,
html,
#app {
  width: 100%;
  height: 100%;

  font-family: "Noto Sans", "Open Sans", "Noto Sans SC", "Roboto Light",
    sans-serif;
}

@font-face {
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("@/assets/fonts/NotoSans-Medium.ttf");
}
@font-face {
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("@/assets/fonts/OpenSans-Medium.ttf");
}
@font-face {
  font-family: "Noto Sans SC";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("@/assets/fonts/NotoSansSC-Medium.otf");
}
</style>
