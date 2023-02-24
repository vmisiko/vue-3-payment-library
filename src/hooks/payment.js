import { computed } from "vue";
import { useStore } from "vuex";
import { useState } from "./useState";
import { useGlobalProp } from "./globalProperties";
import { useSegement } from "./useSegment";
import { usePayBybankSetup } from './payBybankSetup';
import { datadogRum } from "@datadog/browser-rum";
import PaymentMethod from "../Models/paymentMethod";
import PaymentOption from "../Models/PaymentOptions";

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
        
    const fullPayload = {
      url: !getBupayload.value.isPayOnDelivery() ? "/payment_methods" : "/pod/pay_methods",
      params: payload,
    };

    const response =  await store.dispatch("paymentAxiosPost", fullPayload);
    if (response.status) {
      const paymentMethods = paymentOptions
        ? response.payment_methods.filter((option) =>
            paymentOptions.includes(option.payment_method_id)
          )
        : response.payment_methods
      const savedMethods = paymentOptions
        ? response.saved_payment_methods.filter((option) =>
            paymentOptions.includes(option.pay_method_id)
          )
        : response.saved_payment_methods;

      const paymentMethodsModel = paymentMethods.map((paymentMethod) => new PaymentMethod(paymentMethod));
      const paymentOptions = savedMethods.map((paymentOption) => new PaymentOption(paymentOption));
      store.commit("setPaymentMethods", paymentMethodsModel);
      store.commit("setSavedPayMethods", paymentOptions);
    }
  }


  function checkAvailableOptions() {
    if (
      getSavedPayMethods.value &&
      getSavedPayMethods.value.length > 0
    ) {
      route.name !== "ChoosePaymentCheckout"
        ? router.push({
            name: "ChoosePayment",
            params: { entry: "entry" },
          })
        : "";

      return;
    }
    router.push({ name: "AddPayment", params: { entry: "entry" } });
  }

  function getDefaultpayMethod() {
    state.defaultPaymentMethod = getSavedPayMethods.value
      ? getSavedPayMethods.value.filter((method) => method.isDefault())[0]
      : null;
    state.currency = getBupayload.value.currency;
    state.amount = getBupayload.value.amount;
    state.picked = state.defaultPaymentMethod ? state.defaultPaymentMethod.pay_detail_id : "";

    if (!state.defaultPaymentMethod) {
      checkAvailableOptions();
    }
  }
  const checkout = async (payload) =>  {
    store.commit("setLoading", true);
    const version = getBupayload.value?.version ?? 'v3';
    
    const fullPayload = {
      url: !getBupayload.value.isPayOnDelivery() ? `/api/${version}/process` : '/api/v3/pod/process',
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
          const duration = Date.now() - state.startResponseTime;
          window.analytics.track("Payment processed successfully", {
            ...commonTrackPayload(),
            payment_method: state.defaultPaymentMethod.pay_method_name,
            message: response.message,
          })
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
    window.analytics.track("Payment processing failed", {
      ...commonTrackPayload(),
      payment_method: state.defaultPaymentMethod.pay_method_name,
      message: response.message,
      reason: response.message,
      sendyErrorCode: "",
    });
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
  async function processPaybybank() {
    store.commit('setLoading', true);
    if (getBupayload.value.isPayOnDelivery()) {
      router.push({name: "HowitWorks"});
      return;
    };

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
      phonenumber: getBupayload.value?.phonenumber ?? state.defaultPaymentMethod?.phonenumber,
      test: getBupayload?.value?.test ?? false,
      pay_detail_id: state.defaultPaymentMethod.pay_detail_id,
      bank: state.defaultPaymentMethod.bank_code,
      bank_account: state.defaultPaymentMethod.pay_detail_id,
      email: getBupayload.value.email,
      firstname: getBupayload.value.firstname,
      lastname: getBupayload.value.lastname,
    };

    checkout(payload);
    return;
  }
  const processMobiletransactionLimit = () => {
    if (state.defaultPaymentMethod.pay_method_id === 1) {
      state.amount > state.defaultPaymentMethod.transaction_limit
        ? router.push("/mpesa-c2b")
        : router.push("/mpesa-stk");
      return;
    }

    state.amount > state.defaultPaymentMethod.transaction_limit
      ? (state.showTransactionLimit = true)
      : router.push("/mpesa-stk");
  }

  async function submit() {
    state.startResponseTime = new Date();
    if (route.name !== "FailedView") {
      window.analytics.track("Tap Confirm and Pay", {
        ...commonTrackPayload(),
        payment_method: state.defaultPaymentMethod.pay_method_name,
        amount: getBupayload.value.amount,
        currency: getBupayload.value.currency,
      });
    }

    if (route.name === "FailedView") {
      window.analytics.track("Try again after Failed Payment", {
        ...commonTrackPayload(),
        payment_method: state.defaultPaymentMethod?.pay_method_name,
      });
    }

    if (
      state.defaultPaymentMethod.exceedsDailyLimit(state.amount)
    ) {
      state.showTransactionLimit = true;
      return;
    }

    if (state.defaultPaymentMethod.isMobileMoney()) {
      processMobiletransactionLimit();
      return;
    }

    if (state.defaultPaymentMethod.isPayWithBankTransfer()) {
      processPaybybank() 
      return;
    }

    if (getBupayload.value.isPayOnDelivery() && state.defaultPaymentMethod.isCard()) {
      router.push({name: 'AddCard'});
      return
    }

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
      phonenumber: getBupayload.value?.phonenumber ?? state.defaultPaymentMethod?.phonenumber,
      test: getBupayload?.value?.test ?? false,
      pay_detail_id: state.defaultPaymentMethod.pay_detail_id,
      bank: state.defaultPaymentMethod.bank_code,
      bank_account: state.defaultPaymentMethod.pay_detail_id,
      email: getBupayload.value.email,
      firstname: getBupayload.value.firstname,
      lastname: getBupayload.value.lastname,
    };

    checkout(payload);
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
          state.poll_count++;
          TransactionIdStatus();
          if (poll_count === state.poll_limit - 1) {
            store.commit("setLoading", false);
            if (route.name === "AddCard") {
              if (getBupayload.value.isPayOnDelivery()) {
                state.errorText = "The request to charge the card has not been completed. Please wait for about a minute before retrying. If this error persists, please reach out to our customer support team for assistance.";
                store.commit("setErrorText", state.errorText);
                state.errorTitle = t("unable_to_confirm_payment");
              }
              state.errorText = "The request to add the card has not been completed. Please wait for about a minute before retrying. If this error persists, please reach out to our customer support team for assistance.";
              store.commit("setErrorText", state.errorText);
              state.showErrorModal = true;
              window.analytics.track("Payment option not saved successfully", {
                ...commonTrackPayload(),
                message: "The request to add the card has not been completed. Please wait for about a minute before retrying. If this error persists, please reach out to our customer support team for assistance.",
                reason: "The request to add the card has not been completed. Please wait for about a minute before retrying. If this error persists, please reach out to our customer support team for assistance.",
                sendyErrorCode: "",
                payment_method: state.defaultPaymentMethod.pay_method_name,
              });
              return;
            }
            window.analytics.track("Payment processing failed", {
              ...commonTrackPayload(),
              message: "Polling time Out",
              reason: "Polling time out",
              sendyErrorCode: "",
              payment_method: state.defaultPaymentMethod.pay_method_name,
            });
            state.errorText = "The request to charge the card has not been completed. Please wait for about a minute before retrying. If this error persists, please reach out to our customer support team for assistance.";
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
      url: getBupayload.value.isPayOnDelivery() ? `/api/v1/process/pod/status/${state.transaction_id}` : `/api/v2/process/status/${state.transaction_id}`,
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
          state.loading = false;
          if (route.name === "AddCard") {
            if (getBupayload.value.isPayOnDelivery()) {
              router.push({
                name: "SuccessView",
                duration: '',
              });
              return;
            }
            window.analytics.track("Payment option saved successfully", {
              ...commonTrackPayload(),
              message: res.message,
              reason: res.message,
              sendy_error_code: "",
              payment_method: state.defaultPaymentMethod?.pay_method_name ?? 'card',
            });
            router.push("/choose-payment");
            return;
          } else {
            router.push("/choose-payment");
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
          state.loading = false;
          if (route.name === "AddCard") {

            state.showErrorModal = true;
            window.analytics.track("Payment option not saved successfully", {
              ...commonTrackPayload(),
              message: res.message,
              reason: res.message,
              sendy_error_code: "",
              payment_method: state.defaultPaymentMethod.pay_method_name,
            });
            state.errorTitle = getBupayload.value.isPayOnDelivery() ? t("unable_to_confirm_payment") : "";
            return;
          }
          if (route.name !== "FailedView" && route.name !== "AddCard") {
            router.push({ name: "FailedView" });
          }
          datadogRum.addError(new Error(res.message));
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
    state.errorTitle = getBupayload.value.isPayOnDelivery() ? state.errorTitle = t("unable_to_confirm_payment") : "";
    state.loading = false;
    state.showErrorModal = true;
    window.analytics.track("Payment option not saved successfully", {
      ...commonTrackPayload(),
      message: res.message,
      reason: res.message,
      sendy_error_code: "",
      payment_method: state.defaultPaymentMethod.pay_method_name,
    });
    datadogRum.addError(new Error(res.message));
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
      url: "/api/v3/submit_info",
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
    store.dispatch('paymentNotification', {
      text: response.message,
      type: 'error'
    });
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
    checkout,
  };
}
