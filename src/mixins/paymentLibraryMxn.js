import { mapActions, mapGetters, mapMutations } from "vuex";
import { i18n } from "../plugins/i18n";
import { datadogRum } from '@datadog/browser-rum';


const mixin = {
  data() {
    return {
      VGS_VAULT_ID: "tnt4d8qyodm",
      VGS_ENVIRONMENT: "sandbox",
      BASE_URL: "https://payment-gateway-dev.sendyit.com/payment-gateway",
    };
  },
  computed: {
    ...mapGetters(["getPaymentMethods", "getSavedPayMethods", "getBupayload"]),
    config() {
      return this.$sendyOptions.config;
    },
  },
  mounted() {
    if (!window.analytics) {
      this.LoadSegment();
    }
  },
  methods: {
    ...mapMutations(["setBupayload", "setErrorText"]),
    ...mapActions({
      $paymentAxiosPost: "paymentAxiosPost",
      $paymentAxiosGet: "paymentAxiosGet",
      $paymentAxiosPut: "paymentAxiosPut",
    }),
    $handlePaymentMethod(paymentMethod) {
      const entry = localStorage.getItem("entry");

      switch (paymentMethod.payment_method_id) {
        case 1:
          if (entry === "resolve-payment-checkout") {
            this.getBupayload.amount > paymentMethod.stk_limit
              ? this.$router.push("/mpesa-c2b")
              : this.$router.push("/mpesa-stk");
          } else {
            this.$router.push("/add-mpesa");
          }
          break;
        case 2:
          this.$router.push("/add-card");
          break;
        default:
          this.$router.push("/add-card");
          break;
      }
    },
    $paymentNotification(payload) {
      this.emitter.emit("payment-notification", payload);
    },
    $initAxiosErrorNotif(payload) {
      this.emitter.emit("axios-notification", payload);
    },
    paymentCustomHeaders() {
      const authToken = this.getBupayload.authToken;
      const param = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authToken,
          "Accept-Language": this.getBupayload.locale
            ? this.getBupayload.locale
            : "en-US,en;q=0.5",
        },
      };
      return param;
    },

    $formatCurrency(amount) {
      const result = parseFloat(amount);
      return result.toLocaleString();
    },
    $formatLastFour(cardno) {
      const result = cardno.substr(-4);
      return `**** ${result}`;
    },
    $cardIconValidator(icon) {
      const icons = ["mastercard", "visa", "union-pay"];
      return icons.includes(icon);
    },
    $formatCardno(card) {
      const first = card.substr(0, 4);
      const last = card.substr(-4);
      return `${first} **** ${last}`;
    },
    $paymentInit(payload, entry) {
      localStorage.setItem("buPayload", JSON.stringify(payload));
      this.setBupayload(payload);
      localStorage.setItem("entry", entry);
      localStorage.setItem("entry_route", this.$route.path);
      this.loadLanguageAsync(payload.locale ? payload.locale : "en");
      window.analytics.identify(payload.user_id, {
        email: payload.email,
      });

      datadogRum.setUser({ 
        name: `${payload.firstname} ${payload.lastname}`,
        email: payload.email,
        user_id: payload.user_id,
      });

      switch (entry) {
        case "checkout":
          this.$router.push({ name: "Entry" });
          break;
        case "payment-option":
          this.$router.push({ name: "PaymentOptionsPage" });
          break;
        case "choose-payment":
          this.$router.push({ name: "ChoosePayment" });
          break;
        case "choose-payment-checkout":
          this.$router.push({ name: "ChoosePaymentCheckout" });
          break;
        case "resolve-payment-checkout":
          this.$router.push({ name: "ChoosePaymentCheckout" });
          break;
        case "bank-transfer":
          this.$router.push({ name: "PayByBank" });
          break;
        case "manage-withrawal-options":
          window.analytics.track('Manage Withdrawal Options Entry Point initialized', {
            user_id: this.getBupayload.user_id,
            product: this.getBupayload.entity_id,
            timestamp: Date.now(),
            platform_name: "web",
            pay_direction: this.getBupayload.pay_direction,
          });
          this.$router.push({ name: "ManageWithdrawal" });
          break;
        case "add-withdrawal":
          window.analytics.track('Withdrawal Checkout Entry Point initialized', {
            user_id: this.getBupayload.user_id,
            product: this.getBupayload.entity_id,
            timestamp: Date.now(),
            platform_name: "web",
            pay_direction: this.getBupayload.pay_direction,
          });
          this.$router.push({ name: "AddWithdrawal" });
          break;
        case "withdraw-checkout":
          this.$router.push({ name: "WithdrawalCheckout" });
          break;
        case "choose-withdraw-option":
          this.$router.push({ name: "WithdrawalCheckout" });
          break;
        default:
          break;
      }
    },
    loadLanguageAsync(lang) {
      const locales = require.context(
        "../lang",
        true,
        /[A-Za-z0-9-_,\s]+\.json$/i
      );

      const localeKeys = [];
      locales.keys().forEach((key) => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
          localeKeys.push(matched[1]);
        }
      });

      if (localeKeys.includes(lang)) {
        i18n.global.locale = lang;
      }
    },

    $handlePaymentRouting() {
      const entryRoute = localStorage.entry_route;
      const entryPoint = localStorage.entry;
      switch (entryPoint) {
        case "checkout":
          this.$router.push({ name: "Entry" });
          break;
        case "choose-payment":
          this.$router.push(entryRoute);
          break;
        case "choose-payment-checkout":
          this.$router.push(entryRoute);
          break;
        case "payment-option":
          this.$router.push({ name: "PaymentOptionsPage" });
          break;
        default:
          this.$router.push({ name: "Entry" });
          break;
      }
    },
    LoadSegment() {
      var analytics = (window.analytics = window.analytics || []);
      if (!analytics.initialize)
        if (analytics.invoked)
          window.console &&
            console.error &&
            console.error("Segment snippet included twice.");
        else {
          analytics.invoked = !0;
          analytics.methods = [
            "trackSubmit",
            "trackClick",
            "trackLink",
            "trackForm",
            "pageview",
            "identify",
            "reset",
            "group",
            "track",
            "ready",
            "alias",
            "debug",
            "page",
            "once",
            "off",
            "on",
            "addSourceMiddleware",
            "addIntegrationMiddleware",
            "setAnonymousId",
            "addDestinationMiddleware",
          ];
          analytics.factory = function (e) {
            return function () {
              var t = Array.prototype.slice.call(arguments);
              t.unshift(e);
              analytics.push(t);
              return analytics;
            };
          };
          for (var e = 0; e < analytics.methods.length; e++) {
            var key = analytics.methods[e];
            analytics[key] = analytics.factory(key);
          }
          analytics.load = function (key, e) {
            var t = document.createElement("script");
            t.type = "text/javascript";
            t.async = !0;
            t.src =
              "https://cdn.segment.com/analytics.js/v1/" +
              key +
              "/analytics.min.js";
            var n = document.getElementsByTagName("script")[0];
            n.parentNode.insertBefore(t, n);
            analytics._loadOptions = e;
          };
          const segmentKey = this.config.VGS_ENVIRONMENT === 'sandbox' ? "rKWx4tQ7ZV5kKMJAODDbtwrpewLjA0DV" : "926xrVY1VJtPAPzFx5E9UjxjRJFGOBor";
          analytics._writeKey = segmentKey;
          analytics.SNIPPET_VERSION = "4.15.3";
          analytics.load(segmentKey);
          // analytics.page();
        }
    },
  },
};

export default mixin;
