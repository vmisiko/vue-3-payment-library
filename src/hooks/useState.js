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
  const getBupayload = computed(() => store.getters.getBupayload);
  const getErrorText = computed(() => store.getters.getErrorText);
  const getLoading = computed(() => store.getters.getLoading);

  return {
    state,
    getSavedPayMethods,
    getBupayload,
    getErrorText,
    getLoading,
  };
}
