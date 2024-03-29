<script setup lang="ts" name="meetuChatList">
import { ref, onMounted, inject, onActivated } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/stores";
import {
  showConfirmDialog,
  Button as vanButton,
  Image as vanImage,
  Cell as vanCell,
  PullRefresh as vanPullRefresh,
  SwipeCell as vanSwipeCell,
  Badge as vanBadge,
  Empty as vanEmpty,
  showToast,
} from "vant";
import getPersonInfo from "@/api/user/getPersonInfo";
import getProfile from "@/api/user/getProfile";
import { getDatabases } from "@/utils/IndexedDB/getDatabases";
import formatTimeStamp from "@/utils/formatTimeStamp";
import { addMessage } from "@/utils/IndexedDB/addMessage";
import { getLastMessage } from "@/utils/IndexedDB/getLastMessage";
import { getLastMsgReadStatus } from "@/utils/IndexedDB/getLastMsgReadStatus";
import { clearMessages } from "@/utils/IndexedDB/clearMessages";
import type { Socket } from "socket.io-client";

const loading = ref<boolean>(false);
// const count = ref<number>(0);

const store = useStore();
const router = useRouter();
const route = useRoute();

const socket = inject("socket") as Socket;

const ownUId = ref("");

const chatList = ref<msgObj[]>([]);
// topList用于存储置顶列表中的数据
const topList = ref<msgObj[]>([]);

interface msgObj {
  id: string;
  name: string;
  description: string;
  time: number;
  hasRead: boolean;
  profile: string;
  isTop?: boolean;
}
// 去服务器获取用户数据
const getUserInfo = async (ownUid: string, otherUid: string) => {
  const { data: res } = await getPersonInfo(otherUid);
  if (res.code === 200) {
    const lastMsg = await getLastMessage(
      ownUid.toString(),
      otherUid.toString(),
      ownUid.toString()
    );
    if (lastMsg[0]) {
      // 如果聊天记录是空的，那就不展示在聊天列表
      chatList.value.push({
        id: otherUid,
        name: res.data.username,
        description: lastMsg[0].message,
        time: lastMsg[0].time,
        hasRead: lastMsg[0].hasRead,
        profile: getProfile(res.data.profile),
      });
    }
  }
};

// 来新消息时消息列表更新
const newMsg = async (id: string, msg: string): Promise<void> => {
  const index = topList.value.findIndex(
    (item) => parseInt(item.id) === parseInt(id)
  );
  if (index !== -1) {
    const msgItem = topList.value[index];
    msgItem.description = msg;
    msgItem.time = +new Date();
    topList.value.splice(index, 1);
    topList.value.unshift(msgItem);
    msgItem.hasRead = false;
  } else {
    const index = chatList.value.findIndex(
      (item) => parseInt(item.id) === parseInt(id)
    );
    if (index !== -1) {
      const msgItem = chatList.value[index];
      msgItem.description = msg;
      msgItem.time = +new Date();
      chatList.value.splice(index, 1);
      chatList.value.unshift(msgItem);
      msgItem.hasRead = false;
    } else {
      const { data: res } = await getPersonInfo(id);
      chatList.value.unshift({
        id: id,
        name: res.data.username,
        description: msg,
        time: +new Date(),
        hasRead: false,
        profile: getProfile(res.data.profile),
      });
    }
  }
};

// 聊天列表页下拉刷新的回调函数
const onRefresh = () => {
  if (socket.connected) {
    loading.value = false;
    store.changeOnlineStatus(true);
  } else {
    socket.connect();
    socket.emit("online-message", (socket as any).uid);

    setTimeout(() => {
      if (loading.value === true) {
        showToast("刷新失败");
        loading.value = false;
      }
    }, 1000 * 5);
  }

  // 重新加载chatList
  reloadChatList();
};

// 点击关闭按钮的回调
const beforeClose = (arrList: msgObj[], index: number): void => {
  showConfirmDialog({
    title: "提示",
    message: "确认从聊天列表中删除么？确认后聊天记录也会被一并删除哦？",
  }).then(async () => {
    const otherUid = arrList[index].id;
    const ownUid = ownUId.value;
    await clearMessages(ownUid, ownUid, otherUid);
    arrList.splice(index, 1);
  });
};

// 点击置顶按钮时的回调
const setTop = (uid: string, index: number): void => {
  // 将用户id对应的消息栏置顶，并将置顶的用户id保存到本地存储
  const topItem: msgObj = chatList.value.find(
    (item) => item.id === uid
  ) as msgObj;
  topItem.isTop = true;
  topList.value.push(topItem);
  chatList.value.splice(index, 1);
  topList.value = objArraySort(topList.value);
};

// 点击取消置顶按钮的回调
const unSetTop = (uid: string, index: number): void => {
  const item = topList.value.find((item) => item.id === uid) as msgObj;
  item.isTop = false;
  chatList.value.push(item);
  topList.value.splice(index, 1);
  chatList.value = objArraySort(chatList.value);
};

// 将对象根据对应的time值从大到小排序
const objArraySort = (objArr: msgObj[]): msgObj[] => {
  const result = objArr.slice(0);
  return result.sort((a, b) => b.time - a.time);
};

// 修改store.state中的未读信息的数量
const changeUnreadMsgCount = (value: number): void => {
  store.changeUnreadCount(value);
};

onMounted(async () => {
  // 加载聊天列表
  loadChatList();

  // 监听在线状态
  socket.on("online-message-reply-own", (isOnline: boolean) => {
    // 刷新成功 关闭下拉
    if (isOnline) loading.value = false;
  });

  // 监听消息
  socket.on("private-message", async (fromId, toId, msg, time) => {
    await newMsg(fromId, msg);

    // 将接收到的消息保存到本地
    addMessage(ownUId.value, fromId, toId, {
      from_uid: fromId,
      to_uid: toId,
      message: msg,
      time: time,
      hasRead: false,
    });
  });
});

onActivated(async () => {
  reloadChatList();
});

// 加载chatList
const loadChatList = async () => {
  // 取出本地存储中的所有聊天记录然后循环调用 getUserInfo
  if (store.loginStatus) {
    const uid = route.meta.uid as string;
    ownUId.value = uid;
    let otherUid: string | number = "";
    const dbs = await getDatabases(uid);

    for (const item of dbs) {
      const splits = (item.name as string).split("_");
      otherUid = splits[2] === uid.toString() ? splits[3] : splits[2];
      await getUserInfo(uid, otherUid);
    }
  }

  chatList.value = objArraySort(chatList.value); // 将chatList按照time值从大到小排列
  changeUnreadMsgCount(chatList.value.length);
};

// 重新加载chatList
const reloadChatList = async () => {
  for (const chat of chatList.value) {
    chat.hasRead = await getLastMsgReadStatus(
      ownUId.value,
      ownUId.value,
      chat.id
    );
  }
};

// 点击聊天列表中的某一个，跳转到对应的聊天窗口
const openCell = (uid: string): void => {
  router.push({ name: "chatWindow", params: { uid: uid } });
};
</script>

<template>
  <van-pull-refresh
    v-model="loading"
    @refresh="onRefresh"
    success-text="刷新成功"
  >
    <div class="chatlist-container">
      <!--      置顶列表-->
      <van-swipe-cell
        class="swipe-cell-list van-ellipsis"
        v-for="(item, index) in topList"
        :key="item.id"
      >
        <van-cell
          class="top-item"
          :data-uid="item.id"
          center
          size="large"
          clickable
          border
          @click="openCell(item.id)"
        >
          <template #title>
            <van-image
              class="user-profile"
              round
              width="3rem"
              height="3rem"
              :src="item.profile"
              error-icon="user-circle-o"
              loading-icon="user-circle-o"
              fit="cover"
            />
            <h4 class="username">{{ item.name }}</h4>
          </template>
          <template #label>
            <div
              class="van-ellipsis cell-item-description"
              :class="{ 'unread-msg': !item.hasRead }"
            >
              <span v-if="!item.hasRead">[未读]</span>
              {{ item.description }}
            </div>
          </template>
          <template #value>
            <div style="height: 50px">
              <div class="msg-time" style="">
                {{ formatTimeStamp(item.time, "auto") }}
              </div>
              <van-badge
                class="new-msg"
                :class="{ 'new-msg-badge': !item.hasRead }"
                dot
                position="top-right"
              />
            </div>
          </template>
        </van-cell>
        <template #right>
          <van-button
            @click="unSetTop(item.id, index)"
            square
            type="primary"
            text="取消置顶"
          />
          <van-button
            @click="beforeClose(topList, index)"
            square
            type="danger"
            text="删除"
          />
        </template>
      </van-swipe-cell>
      <!--      非置顶列表-->
      <van-swipe-cell
        class="swipe-cell-list van-ellipsis"
        v-for="(item, index) in chatList"
        :key="item.id"
      >
        <van-cell
          :data-uid="item.id"
          center
          size="large"
          clickable
          border
          @click="openCell(item.id)"
        >
          <template #title>
            <van-image
              class="user-profile"
              round
              width="3rem"
              height="3rem"
              :src="item.profile"
              error-icon="user-circle-o"
              loading-icon="user-circle-o"
              fit="cover"
            />
            <h4 class="username">{{ item.name }}</h4>
          </template>
          <template #label>
            <div
              class="van-ellipsis cell-item-description"
              :class="{ 'unread-msg': !item.hasRead }"
            >
              <span v-if="!item.hasRead">[未读]</span>
              {{ item.description }}
            </div>
          </template>
          <template #value>
            <div style="height: 50px">
              <div class="msg-time" style="">
                {{ formatTimeStamp(item.time, "auto") }}
              </div>
              <van-badge
                class="new-msg"
                :class="{ 'new-msg-badge': !item.hasRead }"
                dot
                position="top-right"
              />
            </div>
          </template>
        </van-cell>
        <template #right>
          <van-button
            @click="setTop(item.id, index)"
            square
            type="primary"
            text="置顶"
          />
          <van-button
            @click="beforeClose(chatList, index)"
            square
            type="danger"
            text="删除"
          />
        </template>
      </van-swipe-cell>

      <van-empty
        v-if="!chatList.length && !topList.length"
        image-size="120"
        description="这里空空如也，快去和朋友一起聊天吧~"
        style="margin-top: 20px"
      />
    </div>
  </van-pull-refresh>
</template>

<style lang="scss" scoped>
.chatlist-container {
  width: 100%;
  min-height: calc(99vh - 60px - var(--van-tabbar-height));
  .swipe-cell-list {
    max-height: 70px;
    .top-item {
      background-color: #eae9e9;
    }
    .username {
      width: 90%;
      margin: 0;
      padding-left: 55px;
    }
    .user-profile {
      float: left;
    }
    .cell-item-description {
      width: 80%;
    }
    .new-msg {
      display: none;
    }
    .unread-msg {
      color: #cd93ff;
    }
    .new-msg-badge {
      display: inline-block;
      margin-top: 10px;
      margin-right: 5px;
    }
    &:deep(.van-cell__title) {
      width: 60%;
    }
    &:deep(.van-swipe-cell__right .van-button) {
      height: 100%;
    }
    &:deep(.van-cell__label) {
      width: 100%;
      padding-left: 55px;
    }
  }
  &:deep(.van-cell__value) {
    font-size: 12px;
  }
}
</style>
