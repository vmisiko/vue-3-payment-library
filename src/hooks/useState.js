import { reactive } from "vue";

export function useState() {
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
  });

  return state;
}
