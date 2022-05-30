import router from "./router";
import store from "./store";
import iconView from "./components/iconView";
import notification from "./components/notificationComponent";
import sendyBtn from "./components/sendyBtn";
import paymentLibraryMxn from "./mixins/paymentLibraryMxn";
import "vue-tel-input/dist/vue-tel-input.css";
import { i18n, messages  } from "./plugins/i18n";
import mitt from "mitt";

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

    if (!options.hasOwnProperty("i18n")) {
      throw new Error("Please Initialise plugin with i18n object.");
    }

    options.router.addRoute(router[0]);
    options.store.registerModule("PaymentLib", store);
    
    // Object.keys(messages).forEach(key => {
    //   options.i18n.global.setLocaleMessage(key, messages[key]);
    // });

    options.store.emitter = emitter;
    options.store.$sendyOptions = options;
    app.config.globalProperties.emitter = emitter;
    app.config.globalProperties.$sendyOptions = options;
    app.config.globalProperties.$translate = (key) => i18n.global.t(key);

    app.component("IconView", iconView);

    app.component("Snackbar", notification);

    app.component("sendy-btn", sendyBtn);

    app.mixin(paymentLibraryMxn);
  },
  i18nMessages: messages
};
