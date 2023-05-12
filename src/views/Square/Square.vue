<script lang="ts">
export default { name: "meetuSquare" };
</script>
<script setup lang="ts">
import { onMounted, ref, onActivated, onDeactivated, onUnmounted } from "vue";
import { useStore } from "@/stores";
import { useRouter } from "vue-router";
import {
  Icon as vanIcon,
  Popover as vanPopover,
  PullRefresh as vanPullRefresh,
  List as vanList,
  BackTop as vanBackTop,
  Button as vanButton,
  showFailToast,
} from "vant";
import Post from "@/components/Square/Post.vue";
import getPostList from "@/api/square/getPostList";
import getMuidUserInfo from "@/api/user/getMuidUserInfo";
import type { Post as PostBox } from "@/types";
import type { PopoverAction } from "vant";

const router = useRouter();
const store = useStore();
const loading = ref<boolean>(false);
const listLoading = ref<boolean>(false);
const listFinished = ref<boolean>(false);
const showPopover = ref<boolean>(false);
const postList = ref<PostBox[]>([]);
const actions = [
  { text: "图文", icon: "photo" },
  { text: "拍照", icon: "photograph" },
];

// 整个广场的HTML元素
const squareEl = ref<HTMLElement | null>(null);

// 点击登录和注册按钮
const loginHandle = () => {
  store.changeLoginOverLayShow(true);
};
const registerHandle = () => {
  router.push({ name: "register" });
};

onMounted(async () => {
  if (postList.value.length <= 0) {
    loading.value = true;
    postList.value = [];
    const { data: res } = await getPostList("time", 0, 10);
    if (res.code === 200) {
      postList.value = res.data.result;
      loading.value = false;
      loadUserInfo().catch(() => {
        showFailToast({
          message: "部分用户信息获取失败",
          position: "bottom",
        });
      });
    }
  }
});

const loadUserInfo = async () => {
  window.scroll({ top: 0 });
  for (const item of postList.value) {
    const { data: res } = await getMuidUserInfo(item.muid);
    if (res.code === 200) {
      item.uid = res.data.uid;
      item.username = res.data.username;
      item.profile = res.data.profile;
    } else {
      item.uid = 0;
      item.username = "unknown";
      item.profile = "default.png";
    }
  }
};
const onSelect = (action: PopoverAction, index: number) => {
  if (index === 0)
    store.loginStatus
      ? router.push({ name: "pubPost" })
      : store.changeLoginOverLayShow(true);
};
const onRefresh = async () => {
  // 下拉刷新
  listFinished.value = false;
  const { data: res } = await getPostList("time", 0, 10);
  if (res.code === 200) {
    postList.value = [];
    postList.value = res.data.result;
    loading.value = false;
    loadUserInfo().catch(() => {
      showFailToast({
        message: "部分用户信息获取失败",
        position: "bottom",
      });
    });
  }
};
const onLoad = async () => {
  if (!postList.value.length) {
    listLoading.value = false;
    return false;
  }
  const { data: res } = await getPostList("time", postList.value.length, 10);
  if (res.code === 200) {
    if (res.data.result.length === 0) {
      listFinished.value = true;
    } else {
      postList.value.push(...res.data.result);
    }
    listLoading.value = false;
  } else {
    showFailToast({ message: "获取失败", position: "bottom" });
  }
};

// 记录广场的浏览位置，下次进来自动跳到上一次离开时的位置
const scrollTopHandler = () => {
  if (window.scrollY % 2 === 0) {
    localStorage.setItem("SquareScrollTop", String(window.scrollY));
  }
};

onActivated(() => {
  window.addEventListener("scroll", scrollTopHandler);
});

onDeactivated(() => {
  window.removeEventListener("scroll", scrollTopHandler);
});

onUnmounted(() => {
  localStorage.removeItem("SquareScrollTop");
});
</script>

<template>
  <div class="square-container">
    <div class="square-header">
      <div class="header-left">
        <van-popover
          v-model:show="showPopover"
          :actions="actions"
          @select="onSelect"
          placement="bottom-start"
          :offset="[-2, 5]"
          style="width: 90px"
        >
          <template #reference>
            <van-icon name="add" size="25" />
          </template>
        </van-popover>
      </div>
      <div class="header-title">
        <h3>广场</h3>
      </div>
      <div class="header-right">
        <div class="sign-box" v-if="!store.loginStatus">
          <van-button type="primary" size="mini" @click="loginHandle">
            登录
          </van-button>
          <van-button plain type="primary" size="mini" @click="registerHandle">
            注册
          </van-button>
        </div>
        <van-icon v-else name="ellipsis" class="ellipsis" />
      </div>
    </div>
    <div class="square-main">
      <div class="placeholder"></div>
      <div class="content-box">
        <van-pull-refresh
          v-model="loading"
          success-text="刷新成功"
          @refresh="onRefresh"
          :style="{ minHeight: '800px' }"
        >
          <van-list
            v-model:loading="listLoading"
            :finished="listFinished"
            :immediate-check="false"
            loading-text="拼命加载中"
            finished-text="o(︶︿︶)o再怎么找都没有啦！"
            @load="onLoad"
          >
            <Post
              v-for="item in postList"
              :key="item.art_id"
              :post-id="item.art_id"
              :uid="Number(item.uid)"
              :username="String(item.username)"
              :profile="String(item.profile)"
              :title="item.title"
              :content="item.content"
              :star="item.star"
              :pictures="item.pictures"
              :updated-time="item.updated_time"
            />
          </van-list>
        </van-pull-refresh>
        <van-back-top bottom="15vh" :teleport="squareEl" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.square-container {
  width: 100%;
  min-height: calc(100% - 60px);
  background-color: #efefef;
  .square-header {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left,
    .header-right {
      width: 100px;
      margin: 0 10px;
      display: flex;
      justify-content: space-between;
      .ellipsis {
        transform: rotate(90deg);
        font-size: 20px;
        font-weight: bolder;
      }
      .sign-box {
        width: 80px;
        display: flex;
        justify-content: space-around;
      }
    }
    .header-right {
      justify-content: flex-end;
    }
  }
  .square-main {
    width: 100%;
    min-height: 800px;
    .placeholder {
      width: 100%;
      height: 60px;
    }
    .content-box {
      width: 100%;
      min-height: calc(800px - 60px);
      background-color: #efefef;
    }
  }
}
</style>
