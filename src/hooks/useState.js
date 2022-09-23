import { reactive, computed } from "vue";
import { useStore } from "vuex";

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
  count: false,
  picked: false,
});

export function useState() {
  const store = useStore();

  const getSavedPayMethods = computed(() => store.getters.getSavedPayMethods);
  const getPaymentMethods = computed(() => store.getters.getPaymentMethods);

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

    store.commit('setLoading', true);
    const response =  await store.dispatch("paymentAxiosPost", fullPayload);
    store.commit('setLoading', false);
    console.log(response);
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
      console.log(getPaymentMethods.value);
    }
  }

  return {
    state,
    getSavedPayMethods,
    getBupayload,
    getErrorText,
    getLoading,
    getPaymentMethods,
    retrievePaymentMethods,
  };
}
