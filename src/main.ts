import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

// 本地SVG图标
import "virtual:svg-icons-register";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "@/styles/pagination.scss";
import "uno.css";
import "animate.css";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(setupPlugins);
app.mount("#app");
