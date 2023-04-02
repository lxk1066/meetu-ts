import { onMounted, type Ref } from "vue";
import { showFailToast } from "vant";
import starPost from "@/api/square/starPost";
import postStarStatus from "@/api/square/postStarStatus";

// 点击点赞按钮
const token = localStorage.getItem("meetu_jwt_token") as string;
const uid: string | number = token ? localStorage.getItem("meetu_uid") ?? 0 : 0;

export const usePostStar = (
  starStatus: Ref<boolean>,
  postId: string | number
) => {
  const dianzanHandler = () => {
    starStatus.value = !starStatus.value;

    // 发起点赞请求
    starPostFn();
  };

  // 发起点赞请求
  const starPostFn = async (): Promise<void> => {
    if (!token) {
      showFailToast({ message: "未登录", position: "bottom" });
    } else {
      const { data: res } = await starPost(postId, token);
      console.log("starPost res:", res);
    }
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
