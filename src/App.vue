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
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
