import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "virtual:windi-components.css";
import "virtual:windi-utilities.css";
import "ant-design-vue/es/message/style/css";
import "ant-design-vue/es/modal/style/css";
import "normalize.css/normalize.css";
import { message } from "ant-design-vue";
import i18n from "./language";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "./assets/css/main.css";

dayjs.extend(duration);

message.config({
  duration: 3,
  maxCount: 1,
});

const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.use(router);

app.mount("#app");
