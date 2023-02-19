import { reactive, toRefs } from "vue";
import { defineStore } from "pinia";

export const useStore = defineStore("index", () => {
  const state = reactive({
    loginStatus: false,
    unreadCount: 0, // 未读消息数量
    onlineStatus: false, // 当前登录用户的在线状态
  });

  const changeLoginStatus = (value: boolean) => {
    state.loginStatus = value;
  };
  const changeUnreadCount = (value: number) => {
    state.unreadCount = value;
  };
  const changeOnlineStatus = (value: boolean) => {
    state.onlineStatus = value;
  };

  return {
    ...toRefs(state),
    changeLoginStatus,
    changeUnreadCount,
    changeOnlineStatus,
  };
});

// export const useStore = defineStore("index", {
//   state: () => {
//     return {
//       loginStatus: false,
//       unreadCount: 0, // 未读消息数量
//       onlineStatus: false, // 当前登录用户的在线状态
//     };
//   },
//   actions: {
//     changeLoginStatus(value: boolean) {
//       this.loginStatus = value;
//     },
//     changeUnreadCount(value: number) {
//       this.unreadCount = value;
//     },
//     changeOnlineStatus(value: boolean) {
//       this.onlineStatus = value;
//     },
//   },
// });
