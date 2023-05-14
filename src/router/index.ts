import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { checkLogin } from "@/utils/checkLogin";
import { TokenKey, UidKey, authRoutes, noAuthRoutes } from "@/project.config";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/square",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),
  },
  {
    // 打开聊天列表页
    path: "/chatList",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "",
        name: "chatList",
        component: () => import("@/views/Chat/Chat.vue"),
      },
    ],
  },
  {
    // 打开对应聊天窗口
    path: "/chat/:uid",
    name: "chatWindow",
    component: () => import("@/views/Chat/ChatWindow.vue"),
  },
  {
    // 个人详情页
    path: "/detail/:uid",
    name: "detail",
    props: true,
    component: () => import("@/views/User/Detail.vue"),
  },
  {
    // 添加好友
    path: "/addFriend/:uid",
    name: "addFriend",
    props: true,
    component: () => import("@/views/User/AddFriendRequest.vue"),
  },
  {
    // 通知
    path: "/notices",
    name: "notices",
    component: () => import("@/views/User/Notices.vue"),
  },
  {
    // 通讯录
    path: "/addressBook",
    name: "addressBook",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "",
        name: "addressBook",
        component: () => import("@/views/AddressBook/AddressBook.vue"),
      },
    ],
  },
  {
    // 广场
    path: "/square",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "",
        name: "square",
        component: () => import("@/views/Square/Square.vue"),
      },
    ],
  },
  {
    // 发布文章
    path: "/square/pubPost",
    name: "pubPost",
    component: () => import("@/views/Square/publishPost.vue"),
  },
  {
    // 帖子详情页
    path: "/square/postDetail/:postId",
    name: "postDetail",
    props: true,
    component: () => import("@/views/Square/PostDetail.vue"),
  },
  {
    // 匹配
    path: "/search",
    name: "search",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "",
        name: "search",
        component: () => import("@/views/Search.vue"),
      },
    ],
  },
  {
    // 打开当前登录用户的个人展示页
    path: "/person",
    name: "person",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "",
        name: "person",
        component: () => import("@/views/Person.vue"),
      },
    ],
  },
  {
    // 打开当前登录用户的修改个人信息页
    path: "/person/edit",
    name: "editUserInfo",
    component: () => import("@/views/EditUserInfo.vue"),
  },
  {
    // 打开当前登录用户的设置页
    path: "/person/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
  },
  {
    // 打开修改密码页
    path: "/changePassword/:token",
    name: "changePassword",
    props: true,
    meta: { connected: false }, // 表示不需要与服务器建立socket连接
    component: () => import("@/views/User/ChangePassword.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.name === "square") {
      return {
        top: Number(localStorage.getItem("SquareScrollTop") ?? 0),
        left: 0,
      };
    } else {
      return {
        top: 0,
        left: 0,
      };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem(TokenKey);
  const uid = localStorage.getItem(UidKey);
  const loginStatus = await checkLogin(token, uid);
  if (loginStatus) {
    to.meta.token = token;
    to.meta.uid = uid;
  }

  if (
    authRoutes.some((item) => to.path.startsWith(item)) ||
    !noAuthRoutes.some((item) => to.path.startsWith(item))
  ) {
    to.meta.auth = true;
    if (loginStatus) {
      next();
    } else {
      next("/login");
    }
  } else {
    if (loginStatus && to.path.startsWith("/login")) next("/");

    to.meta.auth = false;
    next();
  }
});

export default router;
