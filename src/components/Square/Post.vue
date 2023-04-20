<script lang="ts">
export default {
  name: "meetuSquarePost",
};
</script>
<script setup lang="ts" name="meetuSquarePost">
import { onActivated, onBeforeUnmount, ref, defineProps } from "vue";
import { useStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
import {
  Icon as vanIcon,
  Image as vanImage,
  ImagePreview as vanImagePreview,
} from "vant";
import getProfile from "@/api/user/getProfile";
import getPicture from "@/api/square/getPicture";
import formatTimeStamp from "@/utils/formatTimeStamp";
import { usePostStar } from "@/components/hooks/usePostStar";

interface PictureItem {
  pic_id: string | number;
  pic_name: string;
  pic_updated_time: string;
}

const props = defineProps<{
  postId: string | number;
  uid: number;
  username: string;
  profile: string;
  title: string;
  content: string;
  star: number | string;
  pictures: PictureItem[];
  updatedTime: string | number;
}>();

const store = useStore();
const route = useRoute();
const router = useRouter();
const picturesRef = ref<HTMLElement | null>(null);
const isShowImagePreview = ref<boolean>(false);
const imageIndex = ref<number>(0);
const images = ref<string[]>(
  props.pictures.map((item) => getPicture(item.pic_name))
);
let pictureItems: Element[] = [];
const openDetail = () => {
  router.push({ name: "postDetail", params: { postId: props.postId } });
};

// 如果图片全部加载完毕，就获取所有的图片DOM，添加点击事件
let loadedNumber = 0;
const pictureLoad = () => {
  loadedNumber = loadedNumber + 1;
  if (loadedNumber === props.pictures.length) {
    picturePreview();
    // isShowImagePreview.value = true;
  }
};
const pictureItemFn = (e: Event) => {
  e.stopPropagation();
  imageIndex.value = pictureItems.indexOf((e.target as any).parentNode);
  isShowImagePreview.value = true;
};
// 点击图片进入图片预览
const picturePreview = () => {
  pictureItems = [
    ...(picturesRef.value as HTMLElement).querySelectorAll(".picture-item"),
  ];
  pictureItems.forEach((item) => {
    item.addEventListener("click", pictureItemFn);
  });
};

// 点击点赞按钮
const starStatus = ref<boolean>(false); // 记录当前帖子的点赞状态

const { dianzanHandler, getPostStarStatus, uid } = usePostStar({
  loginStatus: store.loginStatus,
  token: (route.meta?.token as string) ?? undefined,
  uid: (route.meta?.uid as string) ?? undefined,
  postId: props.postId,
  starStatus,
});

// 点击评论按钮
const commentPost = () => {
  router.push({
    name: "postDetail",
    params: { postId: props.postId },
  });
};

onActivated(async () => {
  if (uid == 0) return;

  const res = await getPostStarStatus(props.postId, uid);

  if (res) {
    starStatus.value = true;
  } else {
    starStatus.value = false;
  }
});

onBeforeUnmount(() => {
  if (pictureItems.length) {
    pictureItems.forEach((item) => {
      item.removeEventListener("click", pictureItemFn);
    });
  }
});
</script>

<template>
  <div class="article">
    <div class="article-header">
      <div class="header-left">
        <van-image
          round
          width="2.8rem"
          height="2.8rem"
          fit="cover"
          @click="$router.push({ name: 'detail', params: { uid: props.uid } })"
          :src="getProfile(props.profile)"
          :style="{ display: 'inline-block' }"
        />
        <div class="header-left-right">
          <span class="username">{{ props.username }}</span>
          <span class="updated-time">{{
            formatTimeStamp(props.updatedTime, "auto")
          }}</span>
        </div>
      </div>
      <div class="header-right">
        <van-icon name="ellipsis" class="ellipsis" />
      </div>
    </div>
    <div class="article-content" @click="openDetail">
      <div class="title van-ellipsis">{{ props.title }}</div>
      <div class="message van-multi-ellipsis--l3">{{ props.content }}</div>
      <div class="picture" ref="picturesRef">
        <van-image
          width="6rem"
          height="6rem"
          fit="cover"
          @load="pictureLoad"
          v-for="picture in props.pictures"
          :key="picture.pic_id"
          :src="getPicture(picture.pic_name)"
          class="picture-item"
          :style="{ marginTop: '10px', marginRight: '5px' }"
        />
      </div>
      <!-- 点击图片预览图片 -->
      <van-image-preview
        v-model:show="isShowImagePreview"
        :start-position="imageIndex"
        :images="images"
      ></van-image-preview>
    </div>
    <div class="article-function">
      <div class="dianzan-box">
        <div
          class="dianzan"
          :class="{ 'dianzan-active': starStatus, 'dianzan-ani': starStatus }"
          @click="dianzanHandler"
        ></div>
        <span>{{ Number(star) === 0 ? "" : star }}</span>
      </div>
      <div class="pinglun-box" @click="commentPost">
        <div class="pinglun"></div>
        <span></span>
      </div>
      <div class="zhuanfa-box">
        <div class="zhuanfa"></div>
        <span></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article {
  min-height: 100px;
  max-height: 350px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  .article-header {
    height: 50px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left {
      height: 50px;
      display: flex;
      align-items: center;
      .username {
        font-size: 16px;
        letter-spacing: 0.5px;
        display: block;
        margin-left: 5px;
      }
      .updated-time {
        margin-left: 5px;
        font-size: 13px;
      }
    }
    .header-right {
      height: 50px;
      width: 50px;
      line-height: 50px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .ellipsis {
        transform: rotate(90deg);
        font-size: 20px;
        font-weight: bolder;
      }
    }
  }
  .article-content {
    margin: 0 5px 0 3rem;
    img {
      max-height: 200px;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .message {
      margin-top: 2px;
      font-size: 15px;
    }
  }
  .article-function {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
      width: 25px;
      height: 25px;
    }
    .dianzan,
    .pinglun,
    .zhuanfa {
      width: 25px;
      height: 25px;
      display: flex;
      margin: 10px;
      justify-content: center;
      align-items: center;
    }
    .dianzan-box,
    .pinglun-box,
    .zhuanfa-box {
      display: flex;
      span {
        font-size: 13px;
        color: gray;
        display: inline-flex;
        align-items: center;
        transform: translateX(-10px);
      }
    }
    .pinglun {
      background: url("@/assets/imgs/pinglun.svg");
      background-position: right center;
      background-size: 25px 25px;
    }
    .zhuanfa {
      background: url("@/assets/imgs/zhuanfa.svg");
      background-position: right center;
      background-size: 25px 25px;
    }
    .dianzan {
      background: url("@/assets/imgs/dianzan.svg");
      background-position: right center;
      background-size: 25px 25px;
    }
    .dianzan-active {
      background: url("@/assets/imgs/dianzan-active.svg");
      background-position: right center;
      background-size: 25px 25px;
    }
  }
}

.dianzan-ani {
  animation: bounceIn;
  animation-duration: 1s;
}
</style>
