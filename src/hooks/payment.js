import { computed } from "vue";
import { useStore } from "vuex";
import { useState } from "./useState";
import { useGlobalProp } from "./globalProperties";
import { useSegement } from "./useSegment";
import { usePayBybankSetup } from './payBybankSetup';

export function usePayment() {
  const store = useStore();
  const { t, route, router } = useGlobalProp();
  const { state } = useState();
  const { commonTrackPayload } = useSegement();
  const { getBalance } = usePayBybankSetup();

  const getSavedPayMethods = computed(() => store.getters.getSavedPayMethods);
  const getBupayload = computed(() => store.getters.getBupayload);
  const getErrorText = computed(() => store.getters.getErrorText);
  const getLoading = computed(() => store.getters.getLoading);

  async function retrievePaymentMethods() {
    const payload = {
      country_code: getBupayload.value.country_code,
      entity_id: getBupayload.value.entity_id,
      user_id: getBupayload.value.user_id,
      pay_direction: getBupayload.value.pay_direction ? getBupayload.value.pay_direction :'PAY_IN',
    };

    const paymentOptions = getBupayload.value.payment_options;
        
    const fullPayload = {
      url: getBupayload.value.pay_direction !== "PAY_ON_DELIVERY" ? "/payment_methods" : "/pod/pay_methods",
      params: payload,
    };

    const response =  await store.dispatch("paymentAxiosPost", fullPayload);
    if (response.status) {
      const paymentMethods = paymentOptions
        ? response.payment_methods.filter((option) =>
            paymentOptions.includes(option.payment_method_id)
          )
        : response.payment_methods.filter((option) =>
          option.payment_method_id !== 10
        ) 
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
    if (route.name !== "FailedView") {
      window.analytics.track("Confirm and Pay", {
        ...commonTrackPayload(),
        payment_method: state.defaultPaymentMethod.pay_method_name,
        amount: getBupayload.value.amount,
        currency: getBupayload.value.currency,
      });
    }

    if (route.name === "FailedView") {
      window.analytics.track("Try again after Failed Payment", {
        ...commonTrackPayload(),
      });
    }

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
      platform: 'web',
      pay_direction: getBupayload.value.pay_direction,
    };

    const fullPayload = {
      url: getBupayload.value.pay_direction !== 'PAY_ON_DELIVERY' ?  "/api/v3/process" : '/api/v3/pod/process',
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
          store.setLoading(false);
          const duration = Date.now() - state.startResponseTime;
          router.push({
            name: "SuccessView",
            duration: duration,
          });
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
            if (route.name === "AddCard") {
              state.errorText = t("failed_to_collect_card_details");
              store.commit("setErrorText", state.errorText);
              state.showErrorModal = true;
              return;
            }
            state.errorText = t("failed_to_charge_card");
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
          store.commit("setLoading", false);
          if (route.name === "AddCard") {
            state.loading = false;
            router.push("/choose-payment");
            return;
          } else {
            router.push("/choose-payment");
            state.loading = false;
            const duration = Date.now() - state.startResponseTime;
            router.push({
              name: "SuccessView",
              duration: duration,
            });
          }
          break;
        }
        case "failed": {
          state.poll_count = state.poll_limit;
          store.commit("setLoading", false);
          state.errorText = res.message;
          store.commit("setErrorText", res.message);
          if (route.name === "AddCard") {
            state.loading = false;
            state.showErrorModal = true;
            return;
          }
          if (route.name !== "FailedView" && route.name !== "AddCard") {
            router.push({ name: "FailedView" });
          }
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
    state.loading = false;
    state.showErrorModal = true;
  }

  function handleContinue3DS(val) {
    state.showAdditionalCardFields = false;
    state.additionalData = val.additionalData.filter(
      (element) => element.field_id === "url"
    );
    init3DS();
  }

  function init3DS() {
    const res = !state.additionalData
      ? state.additionalData
      : state.additionalData[0];
    const url = res.field;
    const urlWindow = window.open(url, "");

    const timer = setInterval(() => {
      if (urlWindow.closed) {
        init3dsPoll();
        clearInterval(timer);
      }
    }, 500);
  }

  async function init3dsPoll() {
    store.commit("setLoading", true);
    const payload = {
      transaction_id: state.transaction_id,
      tds: true,
    };

    const fullPayload = {
      params: payload,
      url: "/api/v2/submit_info",
    };

    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    store.commit("setLoading", false);
    if (response.status) {
      switch (response.transaction_status) {
        case "pending":
          pollCard();
          state.count = true;
          break;
        case "success": {
          store.commit("setLoading", false);
          const duration = Date.now() - state.startResponseTime;

          if (route.name === "AddCard") {
            state.loading = false;
            state.showErrorModal = true;
            return;
          }

          router.push({
            name: "SuccessView",
            duration: duration,
          });
          break;
        }
        default:
          break;
      }
      return;
    }
    state.errorText = t("failed_to_collect_card_details");
    store.dispatch('paymentNotification', response.message);
    state.showErrorModal = true;
  }

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
    store.commit('setLoading', true);
    const balance = await getBalance();

    if (parseFloat(balance) < parseFloat(getBupayload.value.amount)) {
      store.commit('setLoading', false);
      return router.push({
        name: 'PayByBank'
      });
    }

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
      firstname: getBupayload.value.firstname,
      lastname: getBupayload.value.lastname,
      platform: 'web'
    };

    const fullPayload = {
      url: "/api/v3/onepipe/collect",
      params: payload,
    };
    store.commit('setLoading', true);
    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    store.commit("setLoading", false);
    if (response.status) {
      store.dispatch("paymentNotification", {
        text: response.message,
      });
      router.push({
        name: "SuccessView",
      });
      return;
    }
    store.commit("setErrorText", response.message);
    if (route.name !== "FailedView") {
      router.push({ name: "FailedView" });
    }
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
    init3DS,
    handleContinue3DS,
    getAccounts,
    getMobileOs,
    payBybankCollect,
    getDefaultpayMethod,
    retrievePaymentMethods,
  };
}
