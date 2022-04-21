import { reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export function usePayment() {
  const store = useStore();
  const router = useRouter();
  const route = useRoute();

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
    loadingText: "please_wait",
  });

  const getSavedPayMethods = computed(() => store.getters.getSavedPayMethods);
  const getBupayload = computed(() => store.getters.getBupayload);
  const getErrorText = computed(() => store.getters.getErrorText);
  const getLoading = computed(() => store.getters.getLoading);
  // const setErrorText = () => store.commit("setErrorText");
  // const setPaymentMethods = () => store.commit("setPaymentMethods");
  // const setSavedPayMethods = () => store.commit("setSavedPayMethods");
  // const setLoading = () => store.commit("setLoading");
  // const paymentAxiosPost = () => store.dispatch("paymentAxiosPost");

  onMounted(async () => {
    store.commit('setLoading', true);
    state.loadingText.value = "Loading...";
    await retrievePaymentMethods();
    store.commit('setLoading', false);
    state.loadingText.value = "please_wait";
    getDefaultpayMethod();
    console.log(state.currency.value, "currency");
    console.log(state.amount.value, "amount");
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

    const response = await store.dispatch('paymentAxiosPost', fullPayload);
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
      store.commit('setPaymentMethods', paymentMethods);
      store.commit('setSavedPayMethods',savedMethods);
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
    state.defaultPaymentMethod.value = getSavedPayMethods.value
      ? getSavedPayMethods.value.filter((method) => method.default === 1)[0]
      : [];
    state.currency.value = getBupayload.value.currency;
    state.amount.value = getBupayload.value.amount;
    if (!state.defaultPaymentMethod) {
      checkAvailableOptions(state.defaultPaymentMethod.value);
    }
  }

  return {
    getSavedPayMethods,
    getBupayload,
    getErrorText,
    getLoading,
    // setErrorText,
    // setPaymentMethods,
    // setSavedPayMethods,
    // setLoading,
    state,
  };
}
