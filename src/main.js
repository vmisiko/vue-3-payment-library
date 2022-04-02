import router from "./router";
import store from "./store";
import iconView from "./components/iconView";
import notification from "./components/notificationComponent";
import sendyBtn from "./components/sendyBtn";
import paymentLibraryMxn from "./mixins/paymentLibraryMxn";
import "vue-tel-input/dist/vue-tel-input.css";
import i18n from "./plugins/i18n";

export default {
  install: (app, options) => {
    if (!options || !options.store) {
      throw new Error("Please initialise plugin with a Vuex store.");
    }
    /*eslint-disable no-prototype-builtins */
    if (!options.hasOwnProperty("router")) {
      throw new Error("Please Initialise plugin with vue router.");
    }

    options.store.registerModule("PaymentLib", store);

    options.router.addRoute(router[0]);

    app.config.globalProperties$sendyOptions = options;
    app.config.globalProperties.$t = (key) => i18n.global.t(key);
    // app.use(store);
    app.component("IconView", iconView);

    app.component("Snackbar", notification);

    app.component("sendy-btn", sendyBtn);

    app.mixin(paymentLibraryMxn);
  },
};
