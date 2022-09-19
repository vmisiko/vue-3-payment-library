import router from "./router";
import store from "./store";
import iconView from "./components/iconView";
import notification from "./components/notificationComponent";
import sendyBtn from "./components/sendyBtn";
import paymentLibraryMxn from "./mixins/paymentLibraryMxn";
import "vue-tel-input/dist/vue-tel-input.css";
import { i18n, messages  } from "./plugins/i18n";
import mitt from "mitt";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import { createRouter , createWebHistory } from "vue-router";
import { datadogRum } from '@datadog/browser-rum';



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

    const libRouter = createRouter({
      history: createWebHistory(),
      routes: router,
    });

    Sentry.init({
      app,
      dsn: "https://a243b413655641b6880dd7cfe65e6ed8@o32379.ingest.sentry.io/6722027",
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(libRouter),
        }),
      ],
      environment: options.config.VGS_ENVIRONMENT,
      tracesSampleRate: 1.0,
    });

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
  i18nMessages: messages
};
