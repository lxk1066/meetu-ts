<script setup lang="ts" name="meetuSquarePostDetail">
import { onBeforeMount, onBeforeUnmount, ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import {
  NavBar as vanNavBar,
  Image as vanImage,
  Icon as vanIcon,
  showFailToast,
  ImagePreview as vanImagePreview,
  ActionSheet as vanActionSheet,
} from "vant";
import getPost from "@/api/square/getPost";
import getProfile from "@/api/user/getProfile";
import formatTimeStamp from "@/utils/formatTimeStamp";
import getMuidUserInfo from "@/api/user/getMuidUserInfo";
import getPicture from "@/api/square/getPicture";
import { usePostStar } from "@/components/hooks/usePostStar";
import type { Post } from "@/types";

const props = defineProps<{
  postId: string;
}>();

const router = useRouter();
const postData = ref<Post | null>(null);
const picturesRef = ref<HTMLImageElement | null>(null);
const isShowImagePreview = ref<boolean>(false);
const imageIndex = ref<number>(0);
const images = ref<string[]>([]);
let pictureItems: Element[] = [];

const onClickLeft = () => {
  router.back();
};
const loadUserInfo = async () => {
  if (postData.value) {
    // 类型守卫 => 类型缩小
    const { data: res } = await getMuidUserInfo(postData.value.muid);
    if (res.code === 200) {
      postData.value.uid = res.data.uid;
      postData.value.username = res.data.username;
      postData.value.profile = res.data.profile;
    } else {
      postData.value.uid = 0;
      postData.value.username = "unknown";
      postData.value.profile = "default.png";
    }
  }
};

// 如果图片全部加载完毕，就获取所有的图片DOM，添加点击事件
let loadedNumber = 0;
const pictureLoad = () => {
  loadedNumber = loadedNumber + 1;
  if (loadedNumber === (postData.value as Post).pictures.length) {
    picturePreview();
    images.value = (postData.value as Post).pictures.map((item) =>
      getPicture(item.pic_name)
    );
  }
};

const pictureItemFn = (e: Event) => {
  imageIndex.value = pictureItems.indexOf((e.target as any).parentNode);
  isShowImagePreview.value = true;
};

// 长按图片弹出保存
const isShowCopyImage = ref<boolean>(false);
const copyImage = (e: { index: number }) => {
  console.log(e.index);
  isShowCopyImage.value = true;
};
const copyImageActions = [{ name: "保存图片到手机" }];

onBeforeMount(async () => {
  window.scroll({ top: 0 });
  const { data: res } = await getPost(props.postId);
  if (res.code === 200) {
    postData.value = res.data.result;
    loadUserInfo().catch(() => {
      showFailToast({
        message: "部分用户信息获取失败",
        position: "bottom",
      });
    });
  }
});

// 点击图片进入图片预览
const picturePreview = () => {
  pictureItems = [
    ...(picturesRef.value as HTMLImageElement).querySelectorAll(
      ".picture-item"
    ),
  ];
  pictureItems.forEach((item) => {
    item.addEventListener("click", pictureItemFn);
  });
};

// 点击点赞按钮
const starStatus = ref<boolean>(false); // 记录当前帖子的点赞状态

const { dianzanHandler } = usePostStar(starStatus, props.postId);

onBeforeUnmount(() => {
  if (pictureItems.length) {
    pictureItems.forEach((item) => {
      item.removeEventListener("click", pictureItemFn);
    });
  }
});
</script>

<template>
  <div class="post-detail-container">
    <van-nav-bar
      title="图文详情"
      left-arrow
      placeholder
      fixed
      @click-left="onClickLeft"
    />
    <div class="post-box">
      <div class="post-header">
        <div class="header-left">
          <van-image
            round
            width="3rem"
            height="3rem"
            fit="cover"
            @click="
              $router.push({
                name: 'detail',
                params: { uid: (postData as Post).uid },
              })
            "
            :src="getProfile(postData?.profile ?? 'default.png')"
            :style="{ display: 'inline-block' }"
          />
          <div class="header-left-right">
            <span class="username">{{ postData?.username }}</span>
            <span class="updated-time">
              {{
                postData?.updated_time
                  ? formatTimeStamp(postData?.updated_time ?? "", "auto")
                  : ""
              }}
            </span>
          </div>
        </div>
        <div class="header-right">
          <van-icon name="ellipsis" class="ellipsis" />
        </div>
      </div>
      <div class="post-content">
        <h3>{{ postData?.title }}</h3>
        <p>{{ postData?.content }}</p>
        <div class="picture" ref="picturesRef">
          <van-image
            width="95%"
            fit="cover"
            @load="pictureLoad"
            v-for="picture in postData?.pictures"
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
          @long-press="copyImage"
        ></van-image-preview>
        <!-- 显示保存图片的动作栏 -->
        <van-action-sheet
          v-model:show="isShowCopyImage"
          :actions="copyImageActions"
          cancel-text="取消"
          close-on-click-action
        />
      </div>
      <div class="post-function">
        <div
          class="dianzan"
          :class="{ 'dianzan-active': starStatus, 'dianzan-ani': starStatus }"
          @click="dianzanHandler"
        ></div>
        <div class="pinglun">
          <img src="@/assets/imgs/pinglun.svg" alt="" />
        </div>
        <div class="zhuanfa">
          <img src="@/assets/imgs/zhuanfa.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-detail-container {
  min-height: 100%;
  padding-bottom: 50px;
  background-color: #efefef;
}
.post-box {
  width: 95%;
  margin: 10px auto 20px auto;
  border-radius: 5px;
  background-color: white;
  .post-header {
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
  .post-content {
    width: 95%;
    margin: 5px auto;
    .picture {
      text-align: center;
    }
  }
  .post-function {
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

    .dianzan {
      background: url("../../assets/imgs/dianzan.svg");
      background-position: right center;
      background-size: 25px 25px;
    }
    .dianzan-active {
      background: url("../../assets/imgs/dianzan-active.svg");
      background-position: right center;
      background-size: 25px 25px;
    }
  }
  .dianzan-ani {
    animation: bounceIn;
    animation-duration: 1.5s;
  }
}
</style>
