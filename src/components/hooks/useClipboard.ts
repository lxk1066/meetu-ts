import { ref, onMounted, nextTick } from "vue";
import ClipboardJS from "clipboard";

/**
 * 复制指定内容到剪贴板的hook函数
 * @param {String} selector css选择器
 * @param {String} target 需要复制文本的目标盒子
 * @param {Function} cb 回调函数
 */
export const useClipboard = (
  selector: string,
  target: string,
  cb: (target: boolean) => void
) => {
  const clipboard = ref<ClipboardJS | null>(null);
  let flag; // 将 复制是否成功的状态通过回调函数返回

  onMounted(() => {
    clipboard.value = new ClipboardJS(selector, {
      target: function () {
        return document.querySelector(target) as Element;
      },
    });
  });

  nextTick(() => {
    (clipboard.value as ClipboardJS).on("success", (e) => {
      // 复制成功
      e.clearSelection();
      flag = true;
      cb && cb(flag);
    });
    (clipboard.value as ClipboardJS).on("error", (e) => {
      // 复制失败
      e.clearSelection();
      flag = false;
      cb && cb(flag);
    });
  });
};
