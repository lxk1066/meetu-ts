import { onMounted, type Ref } from "vue";
import { showToast } from "vant";
import starPost from "@/api/square/starPost";
import postStarStatus from "@/api/square/postStarStatus";
import { throttle } from "@/utils/throttle";

// 点击点赞按钮

interface usePostStarArgs {
  loginStatus: boolean;
  token: string | undefined;
  uid: string | number | undefined;
  postId: string | number;
  starStatus: Ref<boolean>;
}

export const usePostStar = ({
  loginStatus,
  token,
  uid,
  postId,
  starStatus,
}: usePostStarArgs) => {
  // 发起点赞请求
  const starPostFn = async (): Promise<void> => {
    if (count % 2 === 0) return;
    count = 0;

    if (!loginStatus) {
      showToast({ message: "未登录", position: "bottom" });
      starStatus.value = !starStatus.value;
    } else {
      const { data: res } = await starPost(postId, token as string);
      if (res.code !== 200) {
        starStatus.value = !starStatus.value;
        showToast({ message: res.msg, position: "bottom" });
      }
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
    if (!loginStatus) return;

    const res = await getPostStarStatus(postId, uid as string);

    if (res) {
      starStatus.value = true;
    } else {
      starStatus.value = false;
    }
  });

  return {
    dianzanHandler,
    getPostStarStatus,
    uid: Number(uid),
  };
};
