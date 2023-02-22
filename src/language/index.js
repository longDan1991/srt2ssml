import { createI18n } from "vue-i18n";
import cn from "./cn.json";
import en from "./en.json";

const i18n = createI18n({
  globalInjection: true,
  locale: "en",
  messages: { cn, en },
});

export default i18n;
