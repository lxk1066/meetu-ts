import { defineStore } from "pinia";

export const useStore = defineStore("index", {
  state() {
    return {
      loginStatus: false,
      unreadCount: 0, // 未读消息数量
      onlineStatus: false, // 当前登录用户的在线状态
      loginOverlayShow: false, // 登录模态框的显示与隐藏
    };
  },

  actions: {
    changeLoginStatus(value: boolean) {
      this.loginStatus = value;
    },
    changeUnreadCount(value: number) {
      this.unreadCount = value;
    },
    changeOnlineStatus(value: boolean) {
      this.onlineStatus = value;
    },
    // 修改登录模态框的显示隐藏
    changeLoginOverLayShow(value: boolean) {
      this.loginOverlayShow = value;
    },
  },
});
