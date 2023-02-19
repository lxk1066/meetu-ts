import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

import router from "./router";
app.use(router);

import "vant/lib/index.css";

app.mount("#app");
