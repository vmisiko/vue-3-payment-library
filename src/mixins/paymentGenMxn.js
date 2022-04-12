import moment from "moment-timezone";
import { mapActions, mapGetters, mapMutations } from "vuex";

const mixin = {
  data() {
    return {
      startTime: null,
    };
  },
  computed: {
    ...mapGetters([
      "getPaymentMethods",
      "getBupayload",
      "getSavedPayMethods",
      "getVirtualAccounts",
      "getSelectedVirtualAccount",
      "getLoading",
    ]),
    paymentTimezone() {
      const localtz = moment.tz.guess();
      return localtz;
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
  mounted() {
    this.startTime = new Date();
  },
  methods: {
    ...mapMutations([
      "setPaymentMethods",
      "setSavedPayMethods",
      "setVirtualAccounts",
      "setSelectedVirtualAccount",
      "setLoading",
    ]),
    ...mapActions(["paymentAxiosGet", "paymentAxiosPost"]),
    commonTrackPayload() {
      const date = new Date();
      const finishTime = date - this.startTime;
      const payload = {
        user_id: this.getBupayload.user_id,
        product: this.getBupayload.entity_id,
        timestamp: Date.now(),
        platform_name: this.isMobile ? this.getMobileOs() : "web",
        duration_on_page: finishTime,
      };
      return payload;
    },
    async retrievePaymentMethods() {
      const payload = {
        country_code: this.getBupayload.country_code,
        entity_id: this.getBupayload.entity_id,
        user_id: this.getBupayload.user_id,
      };

      // const paymentOptions = this.getBupayload.payment_options;
      const fullPayload = {
        url: "/payment_methods",
        params: payload,
      };

      const response = await this.paymentAxiosPost(fullPayload);
      if (response.status) {
        const paymentMethods = response.payment_methods;
        const savedMethods = response.saved_payment_methods;
        this.setPaymentMethods(paymentMethods);
        this.setSavedPayMethods(savedMethods);
      }
    },
    checkAvailableOptions(defaultPaymentMethod) {
      if (
        this.getSavedPayMethods &&
        this.getSavedPayMethods.length > 0 &&
        !defaultPaymentMethod
      ) {
        this.$router.push({
          name: "ChoosePayment",
          params: { entry: "entry" },
        });
        return;
      }
      if (!defaultPaymentMethod) {
        this.$router.push({ name: "AddPayment", params: { entry: "entry" } });
        return;
      }
    },
    getMobileOs() {
      let name = "web";
      if (navigator.userAgent.indexOf("Android") != -1) {
        name = "Android";
      }
      if (navigator.userAgent.indexOf("like Mac") != -1) {
        name = "iOS";
      }
      return name;
    },
    async getAccounts() {
      const payload = {
        entityId: this.getBupayload.entity_id,
        userId: this.getBupayload.user_id,
      };

      const fullPayload = {
        url: `/api/v3/onepipe/accounts/`,
        params: payload,
      };

      const response = await this.$paymentAxiosGet(fullPayload);
      if (response.status) {
        this.setVirtualAccounts(response.accounts);
        const account = response.accounts.filter(
          (el) => el.is_primary === true
        );
        this.setSelectedVirtualAccount(account[0].account_number);
      }
    },
    async payBybankCollect() {
      const payload = {
        country: this.getBupayload.country_code,
        amount: this.getBupayload.amount,
        txref: this.getBupayload.txref,
        userid: this.getBupayload.user_id,
        currency: this.getBupayload.currency,
        bulk: this.getBupayload.bulk,
        entity: this.getBupayload.entity_id,
        paymethod: this.defaultPaymentMethod.pay_method_id,
        company_code: this.getBupayload.company_code,
      };

      const fullPayload = {
        url: "/api/v3/onepipe/collect",
        params: payload,
      };

      this.setLoading(true);
      const response = await this.$paymentAxiosPost(fullPayload);
      if (response.status) {
        this.$paymentNotification({
          text: response.message,
        });
        this.setLoading(false);
        this.$router.push({
          name: "SuccessView",
        });
        return;
      }
      this.setErrorText(response.message);
      this.$router.push({ name: "FailedView" });
      return;
    },
    
  },
};

export default mixin;
