import { getCurrentInstance } from "vue";

export function useGlobalProp() {
  const instance = getCurrentInstance();

  const router = instance.appContext.config.globalProperties.$router;
  const route = instance.appContext.config.globalProperties.$route;
  const t = instance.appContext.config.globalProperties.$sendyOptions.i18n.global.t;
  const sendyOptions = instance.appContext.config.globalProperties.$sendyOptions;

  return {
    router,
    route,
    t,
    sendyOptions,
  };
}
