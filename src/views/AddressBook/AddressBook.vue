<script setup lang="ts" name="meetuAddressBook">
import { ref, onBeforeMount } from "vue";
import {
  Badge as vanBadge,
  NavBar as vanNavBar,
  IndexBar as vanIndexBar,
  IndexAnchor as vanIndexAnchor,
  Cell as vanCell,
  Image as vanImage,
  Empty as vanEmpty,
  showFailToast,
} from "vant";

import SearchFriend from "@/components/AddressBook/SearchFriend.vue";
import getAllFriends from "@/api/user/getAllFriends";
import getMuidUserInfo from "@/api/user/getMuidUserInfo";
import getProfile from "@/api/user/getProfile";
import getAllNoticesNumber from "@/api/notice/getAllNoticesNumber";
import { pinyin } from "pinyin-pro";

interface friend {
  id: string;
  username: string;
  profile: string;
  initial?: string;
}
type indexedFriendsType = { [prop: string]: friend[] };

const allFriends = ref<friend[]>([]);
const indexAlphabet = ref<string[]>([]);
const indexedFriends = ref<indexedFriendsType>({});
const allNoticesNumber = ref(0);
const showSearchFriendPopup = ref(false);

onBeforeMount(async () => {
  const token = localStorage.getItem("meetu_jwt_token");
  const { data: res1 } = await getAllFriends(token as string);
  if (res1.code === 200) {
    const { friends } = res1.data;
    for (const item of friends) {
      const { data: result } = await getMuidUserInfo(item);
      if (result.code === 200) {
        allFriends.value.push({
          id: result.data.uid,
          username: result.data.username,
          profile: result.data.profile,
        });
      }
    }
    const { data: res2 } = await getAllNoticesNumber(token as string);
    if (res2.code === 200) {
      allNoticesNumber.value = res2.data.number;
    }
  } else {
    showFailToast("网络错误");
  }
  const { alphabet, resultData } = getIndexedData(allFriends.value);
  indexAlphabet.value = alphabet;
  indexedFriends.value = resultData;
});

const getIndexedData = (source: friend[]) => {
  // pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
  const alphabet: string[] = []; // 索引字母数组

  source.forEach((item) => {
    const name = item.username;
    // 获取每一个name值第一个字的大写首字母（传入的 name 是中文时默认得到大写字母，name 是英文时按照原字符串输出，可能是小写）
    const initial: string = pinyin(name, {
      toneType: "none",
      type: "array",
    })[0]
      .substring(0, 1)
      .toUpperCase();
    item.initial = initial;
    // 获取用于索引的字母
    if (alphabet.indexOf(initial) === -1) {
      alphabet.push(initial);
    }
  });
  // 按字母表顺序排序
  alphabet.sort();

  const resultData: indexedFriendsType = {};
  // 将源数据按照首字母分类
  alphabet.forEach((item) => {
    resultData[item] = source.filter((it) => {
      return it.initial === item;
    });
  });
  return { alphabet, resultData };
};
</script>

<template>
  <van-nav-bar title="通讯录" />
  <div class="function-area">
    <van-badge
      :content="allNoticesNumber"
      :show-zero="false"
      style="width: 40%"
    >
      <div
        class="function-item notice"
        style="width: 100%"
        @click="$router.push({ name: 'notices' })"
      >
        通知
      </div>
    </van-badge>
    <div
      class="function-item add-friends"
      @click="showSearchFriendPopup = true"
    >
      添加好友
    </div>
    <SearchFriend
      v-if="showSearchFriendPopup"
      @closePopup="showSearchFriendPopup = false"
    ></SearchFriend>
  </div>
  <div class="address-book">
    <van-index-bar :index-list="indexAlphabet">
      <div v-for="(item, index1) in indexAlphabet" :key="index1">
        <van-index-anchor :index="item">{{ item }}</van-index-anchor>
        <van-cell
          clickable
          v-for="(friend, index2) in indexedFriends[item]"
          :key="index2"
          :to="{ name: 'detail', params: { uid: friend.id } }"
        >
          <template #title>
            <div class="address-book-item-title">
              <van-image
                class="user-profile"
                round
                width="2.5rem"
                height="2.5rem"
                :src="getProfile(friend.profile)"
                error-icon="user-circle-o"
                loading-icon="user-circle-o"
                fit="cover"
              />
              <h4 class="username">{{ friend.username }}</h4>
            </div>
          </template>
        </van-cell>
      </div>
    </van-index-bar>
    <van-empty
      v-if="!allFriends.length"
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      image-size="80"
      description="这里空空如也，一个好友都没有~"
      style="margin-top: 20px"
    />
  </div>
</template>

<style lang="scss" scoped>
.function-area {
  margin-top: 10px;
  display: flex;
  justify-content: space-evenly;
  .function-item {
    font-size: 16px;
    color: white;
    width: 40%;
    height: 50px;
    display: inline-block;
    border-radius: 20px;
    text-align: center;
    line-height: 50px;
    background: linear-gradient(145deg, #c2ffd8, #465efb);
    &:active {
      background: linear-gradient(145deg, #aefac9, #2a44ec);
    }
  }
  // .notice {
  // }
  // .add-friends {
  // }
}
.address-book {
  margin-top: 10px;
  .address-book-item-title {
    display: flex;
    align-items: center;
  }
  .username {
    margin: 0;
    padding: 0 10px;
  }
  .user-profile {
    float: left;
    line-height: 90%;
  }
}
</style>
