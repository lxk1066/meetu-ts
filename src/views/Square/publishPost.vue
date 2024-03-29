<script setup lang="ts" name="meetuPublishPost">
import { ref } from "vue";
import {
  Button as vanButton,
  CellGroup as vanCellGroup,
  Field as vanField,
  Form as vanForm,
  NavBar as vanNavBar,
  Uploader as vanUploader,
  showConfirmDialog,
  showToast,
  showSuccessToast,
  showFailToast,
} from "vant";
import { useRouter, useRoute } from "vue-router";
import publishPost from "@/api/square/publishPost";

const route = useRoute();
const router = useRouter();
const title = ref<string>("");
const content = ref<string>("");
const pictures = ref<any[]>([]);
const formData = ref<FormData | null>(null);
const submitFlag = ref(false);
const onClickLeft = () => {
  if (title.value || content.value || pictures.value.length) {
    showConfirmDialog({
      title: "提示",
      message: "当前编辑内容未保存，确认退出？",
    })
      .then(() => {
        router.back();
      })
      .catch(() => {});
  } else {
    router.back();
  }
};

const onSubmit = async () => {
  console.log("发布图文");
  if (submitFlag.value === false) {
    submitFlag.value = true;
    formData.value = new FormData();
    if (title.value.length < 5 || title.value.length > 30) {
      submitFlag.value = false;
      showToast({ message: "标题必须在5~30字之间", position: "bottom" });
    } else if (content.value.length < 5 || content.value.length > 500) {
      submitFlag.value = false;
      showToast({
        message: "帖子内容必须在5~500字之间",
        position: "bottom",
      });
    } else {
      formData.value.append("title", title.value);
      formData.value.append("content", content.value);
      if (pictures.value.length) {
        pictures.value.forEach((item) => {
          (formData.value as FormData).append("pictures", item.file);
        });
      }

      // 上传服务器
      const token = route.meta.token as string;
      const { data: res } = await publishPost(token as string, formData.value);
      if (res.code === 200) {
        showSuccessToast("发布成功");
        submitFlag.value = false;
        router.replace({
          name: "postDetail",
          params: { postId: res.data.postId },
        });
      } else {
        showFailToast({ message: "发布失败, " + res.msg, duration: 2800 });
        submitFlag.value = false;
      }
    }
    submitFlag.value = false;
  }
};

// const dataUrlToFile = (dataUrl, filename) => {
//   // 去掉url的头，并转换为byte
//   const splits = dataUrl.split(',')
//   const mime = splits[0].split(':')[1].split(';')[0]
//   const bytes = window.atob(splits[1])
//   const arrayBuffer = new ArrayBuffer(bytes.length)
//   const uint8View = new Uint8Array(arrayBuffer)
//   for (let i = 0; i < bytes.length; i++) {
//     uint8View[i] = bytes.charCodeAt(i)
//   }
//   return new File([arrayBuffer], filename, { type: mime })
// }
</script>

<template>
  <van-nav-bar title="发布图文" left-arrow @click-left="onClickLeft" />
  <div class="content-box">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model.trim="title"
          name="标题"
          placeholder="标题"
          :rules="[{ required: true, message: '请填写标题' }]"
        />
      </van-cell-group>
      <van-cell-group inset :style="{ marginTop: '10px' }">
        <van-field
          v-model.trim="content"
          rows="5"
          autosize
          type="textarea"
          maxlength="500"
          placeholder="请输入帖子内容"
          show-word-limit
          :style="{ fontSize: '16px' }"
        />
      </van-cell-group>
      <van-cell-group inset :style="{ marginTop: '10px' }">
        <van-field name="uploader">
          <template #input>
            <van-uploader v-model="pictures" multiple :max-count="6" />
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :disabled="submitFlag"
        >
          发布
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.content-box {
  width: 100%;
  min-height: calc(100% - 46px);
  background-color: #efefef;
  padding-top: 10px;
}
</style>
