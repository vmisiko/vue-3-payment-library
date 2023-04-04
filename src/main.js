import router from "./router";
import store from "./store";
import iconView from "./components/iconView";
import notification from "./components/notificationComponent";
import sendyBtn from "./components/sendyBtn";
import paymentLibraryMxn from "./mixins/paymentLibraryMxn";
import "vue-tel-input/dist/vue-tel-input.css";
import { i18n } from "./plugins/i18n";
import mitt from "mitt";
import { datadogRum } from '@datadog/browser-rum';
import PaymentOptionDataSource from "./data/datasources/paymentOption";
import axios from "axios";
export { useWithdrawals } from "./hooks/useWithdrawals";


const emitter = mitt();

export default {
  install: (app, options) => {
    if (!options || !options.store) {
      throw new Error("Please initialise plugin with a Vuex store.");
    }
    /*eslint-disable no-prototype-builtins */
    if (!options.hasOwnProperty("router")) {
      throw new Error("Please Initialise plugin with vue router.");
    }

    options.router.addRoute(router[0]);
    options.store.registerModule("PaymentLib", store);
   
    options.store.emitter = emitter;
    options.store.$sendyOptions = options;
    app.config.globalProperties.emitter = emitter;
    app.config.globalProperties.$sendyOptions = options;
    app.config.globalProperties.$translate = (key) => i18n.global.t(key);

    app.component("IconView", iconView);

    app.component("Snackbar", notification);

    app.component("sendy-btn", sendyBtn);

    app.mixin(paymentLibraryMxn);
    app.provide('sendyOptions', options);
    app.provide("paymentOptionDataSource", new PaymentOptionDataSource(options.store, axios));

    datadogRum.init({
      applicationId: '88cc1abf-0a01-43bc-abed-90244f9c14e1',
      clientToken: 'pub65d73129306eddcf92546136d75e158e',
      site: 'datadoghq.eu',
      service:'web-payment--plugin',
      sampleRate: 100,
      premiumSampleRate: 100,
      trackInteractions: true,
      defaultPrivacyLevel:'mask-user-input',
      env: options.config.VGS_ENVIRONMENT,
  });
      
  datadogRum.startSessionReplayRecording();
  },
};
