/*global process*/
import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import WindiCSS from "vite-plugin-windicss";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    base: "./",
    plugins: [
      vue(),
      vueJsx(),
      WindiCSS(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: "less",
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: process.env.VITE_CONSOLE === "PRO",
          drop_debugger: true,
        },
      },
    },
    test: {
      coverage: {
        provider: "istanbul",
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // https://github.com/vueComponent/ant-design-vue/blob/main/components/style/themes/default.less
            "primary-color": "#ffc04d",
            "btn-default-color": "#666666",
            "btn-border-radius-base": "4px",
            "table-row-hover-bg": "#FFFCF6",
            "table-border-radius-base": "24px",
            "table-header-bg": "#FFFCF6",
            "table-header-color": "#8A92A6",
            "table-font-size": "14px",
            "table-font-header-size": "24px",
            "table-padding-vertical": "26px",
            "table-border-color": "transparent",
            "input-height-base": "40px",
            "form-item-label-font-size": "1rem",
            "input-placeholder-color": "#999999",
            "menu-item-height": "60px",
            "menu-item-boundary-margin": "1rem",
            "menu-item-vertical-margin": "0",
            "switch-height": "20px",
            "switch-min-width": "40px",
            "input-border-color": "#EFEFEF",
            "picker-border-color": "#EFEFEF",
            "select-border-color": "#EFEFEF",
            "input-number-handler-border-color": "#EFEFEF",
            "tooltip-bg": "#999999",
            "font-family": `Poppins, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
          },
          javascriptEnabled: true,
        },
      },
    },
  });
};
