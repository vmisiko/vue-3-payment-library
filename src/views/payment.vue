<template>
  <div>
    <div>
      <div v-if="getLoading"  class="flex-center">
        <Processing :text="loadingText" />
      </div>
      <div v-else class="flex-center">
        <AdditionalCardFields
          :additionalData="additionalData"
          :transaction_id="transaction_id"
          v-if="showAdditionalCardFields"
          @continue="handleContinue"
          @continue3DS="handleContinue3DS"
        />

        <div
          class="card"
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
              {{ $translate("confirm_and_pay") }}
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
      :text="errorText ? errorText : $translate('failed_to_charge_card')"
      :title="$translate('failed_to_charge_card_title')"
      @close="handleErrorModalClose"
    />
  </div>
</template>

<script>
import { toRefs, onMounted } from "vue";
import { useStore } from "vuex";
import TopInfo from "../components/topInfo";
import PaymentDetail from "../components/paymentDetail";
import Processing from "../components/processing";
import TransactionLimitModal from "../components/modals/transactionalLimitModal";
import AdditionalCardFields from "./AdditionalCardFields";
import ErrorModal from "../components/modals/ErrorModal";
import { usePayment } from "../hooks/payment";
import { useSegement } from '../hooks/useSegment';

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
      title: this.$translate("payment"),
      subtitle: "",
      paymentStatus: null,
    };
  },
  setup() {
    const store = useStore();
    const { commonTrackPayload } = useSegement();
    const {
      getSavedPayMethods,
      getBupayload,
      getErrorText,
      getLoading,
      state,
      submit,
      pollCard,
      handleContinue3DS,
      getDefaultpayMethod,
      retrievePaymentMethods,
    } = usePayment();

    onMounted(async () => {
      const entryPath = localStorage.getItem("entry_route");
      if (window.history.state.back !== entryPath &&  window.history.state.back !== '/add-payment') {
        getDefaultpayMethod();
        return;
      };
      store.commit("setLoading", true);
      state.loadingText = "Loading...";
      await retrievePaymentMethods();
      store.commit("setLoading", false);
      state.loadingText = "Please wait";
      getDefaultpayMethod();
    });

    function handleErrorModalClose() {
      state.showErrorModal = false;
      state.showAdditionalCardFields = false;
      window.analytics.track("Tap close failed payment prompt", {
        ...commonTrackPayload(),
        pay_direction: state.defaultPaymentMethod?.pay_method_name,
      });
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
