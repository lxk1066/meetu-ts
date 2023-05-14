<script setup lang="ts" name="meetuEditUserInfo">
import { ref, onBeforeMount, watch, nextTick } from "vue";
import {
  NavBar as vanNavBar,
  Form as vanForm,
  Button as vanButton,
  Field as vanField,
  CellGroup as vanCellGroup,
  RadioGroup as vanRadioGroup,
  Radio as vanRadio,
  Uploader as vanUploader,
  Popup as vanPopup,
  Area as vanArea,
  showToast,
} from "vant";
import { useRoute } from "vue-router";
import { areaList } from "@vant/area-data"; // vant官方提供的默认的中国省市区数据，用于选中地区
import getPersonInfo from "@/api/user/getPersonInfo";
import uploadProfile from "@/api/user/uploadProfile";
import getProfile from "@/api/user/getProfile";
import updateUsername from "@/api/user/updateUsername";
import updateGender from "@/api/user/updateGender";
import updateSign from "@/api/user/updateSign";
import updateArea from "@/api/user/updateArea";
import type { UploaderFileListItem } from "vant";

const route = useRoute();

const onClickLeft = () => history.back();
const profile = ref<UploaderFileListItem[]>([]);
const uploadDisable = ref<boolean>(true);

const username = ref<string>(""); // 用户名
const genderChecked = ref<string>("1"); // 性别
const sign = ref<string>(""); // 个性签名

const token: string = route.meta.token as string;

// areaList.province_list["000000"] = "保密";
// objArraySort(areaList.province_list)
// console.log('areaList: ', areaList.province_list)

const areaResult = ref<string>("保密"); // 选择地区
const showArea = ref<boolean>(false); // 控制选择地区弹窗的变量

const onAreaConfirm = async ({ selectedOptions }: any) => {
  // 选择地区确认按钮
  if (selectedOptions[0].value === "000000") {
    areaResult.value = "保密";
  } else {
    areaResult.value = selectedOptions
      .map((item: { text: any }) => item.text)
      .join("/");
  }
  // 将地区信息保存到服务器
  await editArea();
};

onBeforeMount(async () => {
  // 请求服务器拿到当前用户的数据
  const uid = localStorage.getItem("meetu_uid");
  if (uid) {
    const { data: res } = await getPersonInfo(uid);
    if (res.code === 200) {
      const data = res.data;
      profile.value.push({ url: getProfile(data.profile), isImage: true });
      username.value = data.username;
      if (data.gender === "secrecy") genderChecked.value = "1";
      else if (data.gender === "male") genderChecked.value = "2";
      else if (data.gender === "female") genderChecked.value = "3";
      sign.value = data.sign;
      if (data.area === "secrecy") areaResult.value = "保密";
      else areaResult.value = data.area;
    } else {
      showToast({ message: "网络错误", position: "bottom" });
    }
  }
});

watch(
  profile,
  () => {
    //  如果存储头像的变量发生变化
    uploadDisable.value = profile.value.length === 0;
  },
  { deep: true }
);

// base64转Blob
function convertBase64UrlToBlob(urlData: string) {
  // 去掉url的头，并转换为byte
  const split = urlData.split(",");
  const bytes = window.atob(split[1]);
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: split[0] });
}

const profileUpload = async () => {
  if (profile.value.length) {
    profile.value[0].status = "uploading";
    profile.value[0].message = "上传中...";
    // 上传到服务器
    const f = convertBase64UrlToBlob(profile.value[0].content as string); // data为裁剪后的base64位图片
    const fd = new FormData();
    fd.append("profile", f, (profile.value[0].file as File).name);
    // 上传图片数据
    const { data: res } = await uploadProfile(fd, token);
    if (res.code === 200) {
      profile.value[0].status = "done";
      profile.value[0].message = "上传成功";
      showToast("头像上传成功！");
    } else {
      profile.value[0].status = "done";
      profile.value[0].message = "上传失败";
      showToast({ message: "头像上传失败！" + res.msg, duration: 2800 });
    }
  }
};

const editUsername = async () => {
  // 请求服务器修改用户名
  const { data: res } = await updateUsername(username.value, token);
  if (res.code === 200) {
    showToast({ message: "修改成功", position: "bottom" });
  } else {
    showToast({ message: res.msg, position: "bottom" });
  }
};

const editGender = async () => {
  // 请求服务器修改性别
  let gender: string = "";
  if (genderChecked.value === "2") gender = "male";
  else if (genderChecked.value === "3") gender = "female";

  const { data: res } = await updateGender(gender, token);
  if (res.code === 200) {
    showToast({ message: "修改成功", position: "bottom" });
  } else {
    showToast({ message: res.msg, position: "bottom" });
  }
};

const editSign = async () => {
  // 请求服务器修改个性签名
  const { data: res } = await updateSign(sign.value, token);
  if (res.code === 200) {
    showToast({ message: "修改成功", position: "bottom" });
  } else {
    showToast({ message: res.msg, position: "bottom" });
  }
};
const editArea = async () => {
  // 请求服务器修改用户的地区信息
  const { data: res } = await updateArea(areaResult.value, token);
  if (res.code === 200) {
    showToast({ message: "修改成功", position: "bottom" });
    nextTick(() => {
      (document.querySelector("div.van-overlay") as any).click();
    });
  } else {
    showToast({ message: res.msg, position: "bottom" });
  }
};
</script>

<template>
  <van-nav-bar
    title="编辑个人信息"
    left-text="返回"
    left-arrow
    placeholder
    @click-left="onClickLeft"
  />
  <div class="form-box">
    <van-form>
      <van-cell-group inset>
        <van-field name="uploader" label="上传头像">
          <template #input>
            <van-uploader v-model="profile" multiple :max-count="1" />
          </template>
          <template #button>
            <van-button
              size="small"
              type="primary"
              @click="profileUpload"
              :disabled="uploadDisable"
              >上传</van-button
            >
          </template>
        </van-field>

        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              @click="editUsername"
              :disabled="username === ''"
              >修改</van-button
            >
          </template>
        </van-field>

        <van-field name="radio" label="性别">
          <template #input>
            <van-radio-group v-model="genderChecked" direction="horizontal">
              <van-radio name="1">保密</van-radio>
              <van-radio name="2">男</van-radio>
              <van-radio name="3">女</van-radio>
            </van-radio-group>
          </template>
          <template #button>
            <van-button size="small" type="primary" @click="editGender"
              >修改</van-button
            >
          </template>
        </van-field>

        <van-field
          v-model="sign"
          rows="2"
          autosize
          label="个性签名"
          type="textarea"
          maxlength="80"
          placeholder="请输入个性签名"
          show-word-limit
        >
          <template #button>
            <van-button size="small" type="primary" @click="editSign"
              >修改</van-button
            >
          </template>
        </van-field>

        <van-field
          v-model="areaResult"
          is-link
          readonly
          name="area"
          label="地区"
          placeholder="点击选择省市区"
          @click="showArea = true"
        >
        </van-field>
        <van-popup v-model:show="showArea" position="bottom">
          <van-area
            :area-list="areaList"
            value="000000"
            @confirm="onAreaConfirm"
            @cancel="showArea = false"
          />
        </van-popup>
      </van-cell-group>
    </van-form>
  </div>
</template>

<style lang="scss">
.form-box {
  width: 100%;
  height: calc(100% - 50px);
  background-color: #eeeded;
  padding-top: 5px;
  .muid-prompt {
    color: #cd93ff;
    text-decoration: underline;
  }
}
</style>
