import { onMounted, type Ref } from "vue";
import { showToast } from "vant";
import starPost from "@/api/square/starPost";
import postStarStatus from "@/api/square/postStarStatus";
import { throttle } from "@/utils/throttle";

// 点击点赞按钮
const token = localStorage.getItem("meetu_jwt_token") as string;
const uid: string | number = token ? localStorage.getItem("meetu_uid") ?? 0 : 0;

export const usePostStar = (
  starStatus: Ref<boolean>,
  postId: string | number
) => {
  // 发起点赞请求
  const starPostFn = async (): Promise<void> => {
    if (count % 2 === 0) return;
    count = 0;

    if (!token) {
      showToast({ message: "未登录", position: "bottom" });
      starStatus.value = false;
    } else {
      const { data: res } = await starPost(postId, token);
      if (res.code !== 200)
        !(starStatus.value = false) &&
          showToast({ message: res.msg, position: "bottom" });
      else starStatus.value = true;
    }
  };

  // 记录点赞的次数以计算是奇数还是偶数，只有奇数次才会发起请求，偶数次相当于抵消了
  let count: number = 0;
  // 使用节流函数
  const fn = throttle(starPostFn, 1000);

  const dianzanHandler = () => {
    starStatus.value = !starStatus.value;
    count++;

    // 发起点赞请求
    fn();
  };

  // 获取帖子的点赞状态
  const getPostStarStatus = async (
    postId: string | number,
    userId: string | number
  ): Promise<boolean> => {
    const { data: res } = await postStarStatus(postId, userId);

    if (res.code === 200) {
      return true;
    } else {
      return false;
    }
  };

  onMounted(async () => {
    if (uid == 0) return;

    const res = await getPostStarStatus(postId, uid);

    if (res) {
      starStatus.value = true;
    } else {
      starStatus.value = false;
    }
  });

  return {
    dianzanHandler,
    getPostStarStatus,
    uid,
  };
};
