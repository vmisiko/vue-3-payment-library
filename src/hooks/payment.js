import { reactive, computed, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";

export function usePayment() {
  const store = useStore();
  const instance = getCurrentInstance();

  const router = instance.appContext.config.globalProperties.$router;
  const route = instance.appContext.config.globalProperties.$route;

  const state = reactive({
    currency: "KES",
    amount: 0.0,
    loading: false,
    defaultPaymentMethod: null,
    transaction_id: null,
    poll_count: 0,
    poll_limit: 30,
    errorText: "",
    mpesaCode: "",
    startResponseTime: null,
    showTransactionLimit: false,
    showAdditionalCardFields: false,
    additionalData: null,
    showErrorModal: false,
    loadingText: "please wait",
  });

  const getSavedPayMethods = computed(() => store.getters.getSavedPayMethods);
  const getBupayload = computed(() => store.getters.getBupayload);
  const getErrorText = computed(() => store.getters.getErrorText);
  const getLoading = computed(() => store.getters.getLoading);

  onMounted(async () => {
    store.commit("setLoading", true);
    state.loadingText = "Loading...";
    await retrievePaymentMethods();
    store.commit("setLoading", false);
    state.loadingText = "Please wait";
    getDefaultpayMethod();
  });

  async function retrievePaymentMethods() {
    const payload = {
      country_code: getBupayload.value.country_code,
      entity_id: getBupayload.value.entity_id,
      user_id: getBupayload.value.user_id,
    };

    const paymentOptions = getBupayload.value.payment_options;
    const fullPayload = {
      url: "/payment_methods",
      params: payload,
    };

    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    if (response.status) {
      const paymentMethods = paymentOptions
        ? response.payment_methods.filter((option) =>
            paymentOptions.includes(option.payment_method_id)
          )
        : response.payment_methods;
      const savedMethods = paymentOptions
        ? response.saved_payment_methods.filter((option) =>
            paymentOptions.includes(option.pay_method_id)
          )
        : response.saved_payment_methods;
      store.commit("setPaymentMethods", paymentMethods);
      store.commit("setSavedPayMethods", savedMethods);
    }
  }

  function checkAvailableOptions(defaultPaymentMethod) {
    if (
      getSavedPayMethods.value &&
      getSavedPayMethods.value.length > 0 &&
      !defaultPaymentMethod
    ) {
      route.name !== "ChoosePaymentCheckout"
        ? router.push({
            name: "ChoosePayment",
            params: { entry: "entry" },
          })
        : "";

      return;
    }
    if (!defaultPaymentMethod) {
      router.push({ name: "AddPayment", params: { entry: "entry" } });
      return;
    }
  }

  function getDefaultpayMethod() {
    state.defaultPaymentMethod = getSavedPayMethods.value
      ? getSavedPayMethods.value.filter((method) => method.default === 1)[0]
      : [];
    state.currency = getBupayload.value.currency;
    state.amount = getBupayload.value.amount;
    if (!state.defaultPaymentMethod) {
      checkAvailableOptions(state.defaultPaymentMethod);
    }
  }

  async function submit() {
    state.startResponseTime = new Date();
    // window.analytics.track("Confirm and Pay", {
    //   ...state.commonTrackPayload(),
    //   payment_method: state.defaultPaymentMethod.pay_method_name,
    //   amount: state.getBupayload.amount,
    //   currency: state.getBupayload.currency,
    // });

    if (
      state.defaultPaymentMethod.daily_limit &&
      state.amount > state.defaultPaymentMethod.daily_limit
    ) {
      state.showTransactionLimit = true;
      return;
    }

    if (state.defaultPaymentMethod.category === "Mobile Money") {
      if (state.defaultPaymentMethod.pay_method_id === 1) {
        state.amount > state.defaultPaymentMethod.transaction_limit
          ? router.push("/mpesa-c2b")
          : router.push("/mpesa-stk");
        return;
      }

      state.amount > state.defaultPaymentMethod.transaction_limit
        ? (state.showTransactionLimit = true)
        : router.push("/mpesa-stk");
      return;
    }

    if (state.defaultPaymentMethod.pay_method_id === 20) {
      payBybankCollect();
      return;
    }

    store.commit("setLoading", true);
    const payload = {
      country: getBupayload.value.country_code,
      amount: getBupayload.value.amount,
      cardno: state.defaultPaymentMethod.pay_method_details,
      txref: getBupayload.value.txref,
      userid: getBupayload.value.user_id,
      currency: getBupayload.value.currency,
      bulk: getBupayload.value.bulk,
      entity: getBupayload.value.entity_id,
      company_code: getBupayload.value.company_code,
      paymethod: state.defaultPaymentMethod.pay_method_id,
    };

    const fullPayload = {
      url: "/api/v3/process",
      params: payload,
    };

    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    state.transaction_id = response.transaction_id;
    if (response.status) {
      if (response.additional_data) {
        state.additionalData = response.additional_data;
        state.showAdditionalCardFields = true;
        store.commit("setLoading", false);
        return;
      }

      switch (response.transaction_status) {
        case "pending": {
          const duration = Date.now() - state.startResponseTime;
          if (getBupayload.value.bulk) {
            store.commit("setLoading", false);
            router.push({
              name: "SuccessView",
              duration: duration,
            });
            return;
          }
          pollCard();
          break;
        }
        case "success": {
          store.commit("setLoading", false);
          store.dispatch("paymentNotification", {
            text: 'this.$t("card_details_added")',
          });
          router.push("/choose-payment");
          store.setLoading(false);
          break;
        }
        default:
          break;
      }
      return;
    }
    store.commit("setErrorText", response.message);
    store.commit("setLoading", false);
    router.push({ name: "FailedView" });
  }

  function pollCard() {
    store.commit("setLoading", true);
    state.poll_count = 0;
    for (let poll_count = 0; poll_count < state.poll_limit; poll_count++) {
      (function (poll_count) {
        setTimeout(() => {
          if (state.poll_count === state.poll_limit) {
            poll_count = state.poll_limit;
            return;
          }

          TransactionIdStatus();
          if (poll_count === state.poll_limit - 1) {
            store.commit("setLoading", false);
            // state.errorText = 'this.$t("failed_to_charge_card")';
            state.errorText = "Failed to charge Card";
            store.commit("setErrorText", state.errorText);
            router.push({ name: "FailedView" });
            return;
          }
        }, 10000 * poll_count);
      })(poll_count);
    }
  }

  async function TransactionIdStatus() {
    const payload = {
      url: `/api/v1/process/status/${state.transaction_id}`,
    };

    const res = await store.dispatch("paymentAxiosGet", payload);

    if (res.status) {
      switch (res.transaction_status) {
        case "success": {
          state.poll_count = state.poll_limit;
          store.dispatch("paymentNotification", {
            text: res.message,
          });
          store.commit("setLoading", false);
          const duration = Date.now() - state.startResponseTime;
          router.push({
            name: "SuccessView",
            duration: duration,
          });
          break;
        }
        case "failed": {
          state.poll_count = state.poll_limit;
          store.commit("setLoading", false);
          state.errorText = res.message;
          store.commit("setErrorText", res.message);
          router.push({ name: "FailedView" });
          break;
        }
        case "pending":
          break;
        default:
          break;
      }
      return res;
    }
    state.poll_count = state.poll_limit;
    store.commit("setLoading", false);
    state.errorText = res.message;
    state.showErrorModal = true;
  }

  function handleContinue3DS() {}

  function getMobileOs() {
    let name = "web";
    if (navigator.userAgent.indexOf("Android") != -1) {
      name = "Android";
    }
    if (navigator.userAgent.indexOf("like Mac") != -1) {
      name = "iOS";
    }
    return name;
  }

  async function getAccounts() {
    const payload = {
      entityId: getBupayload.value.entity_id,
      userId: getBupayload.value.user_id,
    };

    const fullPayload = {
      url: `/api/v3/onepipe/accounts/`,
      params: payload,
    };

    const response = await store.dispatch("paymentAxiosGet", fullPayload);
    if (response.status) {
      store.commit("setVirtualAccounts", response.accounts);
      const account = response.accounts.filter((el) => el.is_primary === true);
      store.commit("setSelectedVirtualAccount", account[0].account_number);
    }
  }

  async function payBybankCollect() {
    const payload = {
      country: getBupayload.value.country_code,
      amount: getBupayload.value.amount,
      txref: getBupayload.value.txref,
      userid: getBupayload.value.user_id,
      currency: getBupayload.value.currency,
      bulk: getBupayload.value.bulk,
      entity: getBupayload.value.entity_id,
      paymethod: state.defaultPaymentMethod.pay_method_id,
      company_code: getBupayload.value.company_code,
    };

    const fullPayload = {
      url: "/api/v3/onepipe/collect",
      params: payload,
    };

    store.commit("setLoading", true);
    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    if (response.status) {
      store.dispatch("paymentNotification", {
        text: response.message,
      });
      store.commit("setLoading", false);
      router.push({
        name: "SuccessView",
      });
      return;
    }
    store.commit("setErrorText", response.message);
    router.push({ name: "FailedView" });
    return;
  }

  return {
    getSavedPayMethods,
    getBupayload,
    getErrorText,
    getLoading,
    state,
    submit,
    pollCard,
    handleContinue3DS,
    getAccounts,
    getMobileOs,
    payBybankCollect,
  };
}
