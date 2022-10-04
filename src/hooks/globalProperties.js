import { getCurrentInstance , ref} from "vue";

export function useGlobalProp() {
  const instance = getCurrentInstance();

  const router = instance.appContext.config.globalProperties.$router;
  const route = instance.appContext.config.globalProperties.$route;
  const t = instance.appContext.config.globalProperties.$translate;
  const sendyOptions = instance.appContext.config.globalProperties.$sendyOptions;
  const iconUrl = ref("https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons");

  return {
    router,
    route,
    t,
    iconUrl,
    sendyOptions,
  };
}
