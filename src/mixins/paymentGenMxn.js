import moment from "moment-timezone";
import { mapGetters, mapMutations } from "vuex";

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

      const paymentOptions = this.getBupayload.payment_options;
      const fullPayload = {
        url: "/payment_methods",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      if (response.status) {
        const paymentMethods = response.payment_methods.filter((item) =>
          paymentOptions.includes(item.payment_method_id)
        );
        const savedMethods = response.saved_payment_methods.filter((item) =>
          paymentOptions.includes(item.pay_method_id)
        );
        const savedMethodsCI = [
          {
            id: 748,
            user_id: "88888",
            pay_method_id: 22,
            pay_method_details: "4211-21XX-XXXX-8995",
            pay_detail_id: "4ba12ce2-ee58-43cf-b119-e04b31ff3d9dMTN",
            pay_method_name: "MTN",
            default: 0,
            psp: "FLW",
            category: "Mobile Money",
            status: 1,
            stk_limit: null,
            daily_limit: null,
            transaction_limit: 30,
          },
          {
            id: 748,
            user_id: "88888",
            pay_method_id: 24,
            pay_method_details: "4211-21XX-XXXX-8995",
            pay_detail_id: "4ba12ce2-ee58-43cf-b119-e04b31ff3d9dFLW",
            pay_method_name: "Orange",
            default: 1,
            psp: "FLW",
            category: "Mobile Money",
            status: 1,
            stk_limit: null,
            daily_limit: null,
            transaction_limit: 30,
          },
        ];

        const savedMethodsUG = [
          {
            id: 748,
            user_id: "88888",
            pay_method_id: 22,
            pay_method_details: "4211-21XX-XXXX-8995",
            pay_detail_id: "4ba12ce2-ee58-43cf-b119-e04b31ff3d9dMTN",
            pay_method_name: "MTN",
            default: 1,
            psp: "FLW",
            category: "Mobile Money",
            status: 1,
            stk_limit: null,
            daily_limit: null,
            transaction_limit: 30,
          },
          {
            id: 748,
            user_id: "88888",
            pay_method_id: 23,
            pay_method_details: "4211-21XX-XXXX-8995",
            pay_detail_id: "4ba12ce2-ee58-43cf-b119-e04b31ff3d9dAIRTEL",
            pay_method_name: "Airtel",
            default: 0,
            psp: "FLW",
            category: "Mobile Money",
            status: 1,
            stk_limit: null,
            daily_limit: null,
            transaction_limit: 30,
          },
        ];
        this.setPaymentMethods(paymentMethods);
        switch (this.getBupayload.country_code) {
          case "CI":
            this.setSavedPayMethods(savedMethodsCI);
            break;
          case "UG":
            this.setSavedPayMethods(savedMethodsUG);
            break;
          default:
            this.setSavedPayMethods(savedMethods);
            break;
        }
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
