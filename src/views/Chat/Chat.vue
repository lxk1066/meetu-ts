<script lang="ts">
export default { name: "meetuChat" };
</script>
<script setup lang="ts">
import { ref, inject } from "vue";
import { useStore } from "@/stores";
import {
  NavBar as vanNavBar,
  Icon as vanIcon,
  Popover as vanPopover,
} from "vant";
import ChatList from "@/components/Chat/ChatList.vue";

import type { Socket } from "socket.io-client";

const store = useStore();
const socket: Socket = inject("socket") as Socket;
const showPopover = ref<boolean>(false);
const actions: Array<{ text: string; icon: string; type: string }> = [
  { text: "在线", icon: "checked", type: "online" },
  { text: "离线", icon: "clear", type: "offline" },
];

const onSelect = (action: any): void => {
  if (action.type === "online") {
    socket.connect();
    socket.emit("online-message", (socket as any).uid);
  } else if (action.type === "offline") {
    socket.disconnect();
    store.changeOnlineStatus(false);
  }
};

const reload = () => {
  location.reload();
};

socket.on("online-message-reply-own", (isOnline) => {
  if (isOnline) store.changeOnlineStatus(isOnline);
  else socket.emit("online-message", (socket as any).uid);
});
</script>

<template>
  <van-nav-bar
    title="聊天"
    fixed
    placeholder
    z-index="2"
    class="nav-bar-height"
  >
    <template #left>
      <van-popover
        v-model:show="showPopover"
        :actions="actions"
        @select="onSelect"
        placement="bottom-start"
        :offset="[0, -3]"
        style="width: 90px"
      >
        <template #reference>
          <div class="online-icon-box">
            <van-icon
              :class="{
                'online-icon': store.onlineStatus,
                'offline-icon': !store.onlineStatus,
              }"
              :name="store.onlineStatus ? 'checked' : 'clear'"
              size="25"
              style="padding-right: 5px"
            />
            {{ store.onlineStatus ? "在线" : "离线" }}
          </div>
        </template>
      </van-popover>
    </template>
    <template #right>
      <van-icon name="replay" size="25" @click="reload" />
    </template>
  </van-nav-bar>
  <ChatList />
</template>

<style lang="scss">
.online-icon-box {
  width: 80px;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
}
.online-icon {
  color: lightgreen !important;
}
.offline-icon {
  color: #c08989 !important;
}
</style>
