<template>
  <div class="flex-center">
    <div>
      <Processing v-if="getLoading" :text="loadingText" />
      <div v-else>
        <AdditionalCardFields
          :additionalData="additionalData"
          :transaction_id="transaction_id"
          v-if="showAdditionalCardFields"
          @continue="handleContinue"
          @continue3DS="handleContinue3DS"
        />

        <div
          class="card"
          :class="{ 'card-min': paymentStatus }"
          v-if="!showAdditionalCardFields"
        >
          <TopInfo :icon="icon" :title="title" />

          <PaymentDetail
            v-if="defaultPaymentMethod"
            :currency="currency"
            :amount="amount"
            :paymentMethod="defaultPaymentMethod"
            :paymentStatus="paymentStatus"
          />

          <div class="mgt-3 text-right" v-if="!paymentStatus">
            <sendy-btn
              :loading="loading"
              color="primary"
              class="mgt-10"
              @click="submit"
            >
              {{ $t("confirm_and_pay") }}
            </sendy-btn>
          </div>
        </div>
      </div>
    </div>
    <TransactionLimitModal
      :show="showTransactionLimit"
      @close="showTransactionLimit = false"
    />
    <ErrorModal
      :show="showErrorModal"
      :text="errorText"
      @close="handleErrorModalClose"
    />
  </div>
</template>

<script>
import { toRefs } from "vue";
import TopInfo from "../components/topInfo";
import PaymentDetail from "../components/paymentDetail";
import Processing from "../components/processing";
import TransactionLimitModal from "../components/modals/transactionalLimitModal";
import AdditionalCardFields from "./AdditionalCardFields";
import ErrorModal from "../components/modals/ErrorModal";
import { usePayment } from "../hooks/payment";

export default {
  name: "Payment",
  components: {
    TopInfo,
    PaymentDetail,
    Processing,
    TransactionLimitModal,
    AdditionalCardFields,
    ErrorModal,
  },
  data() {
    return {
      icon: "back",
      title: this.$t("payment"),
      subtitle: "",
      paymentStatus: null,
    };
  },
  setup() {
    const {
      getSavedPayMethods,
      getBupayload,
      getErrorText,
      getLoading,
      state,
      submit,
      pollCard,
      handleContinue3DS,
    } = usePayment();

    function handleErrorModalClose() {
      state.showErrorModal = false;
      state.showAdditionalCardFields = false;
    }

    return {
      getSavedPayMethods,
      getBupayload,
      getErrorText,
      getLoading,
      ...toRefs(state),
      submit,
      pollCard,
      handleContinue3DS,
      handleErrorModalClose,
    };
  },
};
</script>
