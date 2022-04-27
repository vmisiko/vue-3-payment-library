<template>
  <div class="flex-center">
    <Processing v-if="getLoading" :text="loadingText" />

    <div v-else>
      <AdditionalCardFields
        :additionalData="additionalData"
        :transaction_id="transaction_id"
        v-if="showAdditionalCardFields"
        @continue="handleContinue"
        @continue3DS="handleContinue3DS"
      />

      <div class="card" :class="{ 'card-min': paymentStatus }" v-else>
        <IconView icon="back" />

        <TopInfo
          class="mgt-9"
          :icon="icon"
          :title="title"
          :subtitle="getErrorText"
        />

        <PaymentDetail
          v-if="defaultPaymentMethod"
          :currency="currency"
          :amount="amount"
          :paymentMethod="defaultPaymentMethod"
          :paymentStatus="paymentStatus"
        />

        <div class="mgt-8 text-right">
          <sendy-btn
            :block="true"
            :loading="loading"
            color="primary"
            @click="submit"
          >
            {{ $route.params.mpesa ? "Retry" : "Try Again" }}
          </sendy-btn>
        </div>

        <div class="mgt-8 text-right" v-if="paymentStatus === 'retry'">
          <sendy-btn :block="true" :loading="loading" color="primary" class="">
            {{ $t("retry_in") }}
          </sendy-btn>
        </div>

        <div
          class="mgt-8 direction-flex flex-center link"
          @click="
            $route.name === 'ResolvePayment'
              ? $router.push('/choose-payment-checkout')
              : $router.push('/choose-payment')
          "
        >
          <span> {{ $t("change_payment_option") }}</span>
          <IconView class="mgl-2" icon="greator" />
        </div>
      </div>
    </div>
    <ErrorModal
      :show="showErrorModal"
      :text="errorText"
      @close="handleErrorModalClose"
    />
  </div>
</template>

<script>
import { toRefs, onMounted } from "vue";
import { useStore } from "vuex";
import TopInfo from "../components/topInfo";
import PaymentDetail from "../components/paymentDetail";
import AdditionalCardFields from "./AdditionalCardFields";
import ErrorModal from "../components/modals/ErrorModal";
import { usePayment } from "../hooks/payment";

export default {
  name: "FailedView",
  components: {
    TopInfo,
    PaymentDetail,
    ErrorModal,
    AdditionalCardFields,
  },
  data() {
    return {
      icon: "warning",
      title: this.$route.params.mpesa
        ? this.$t("unable_to_confirm")
        : this.$t("payment_failed"),
      paymentStatus: true,
      currency: "KES",
      amount: 0.0,
      loading: false,
      defaultPaymentMethod: null,
      errorText: this.$t("could_not_process"),
      transaction_id: null,
      poll_count: 0,
      poll_limit: 30,
      showTransactionLimit: false,
      showAdditionalCardFields: false,
      additionalData: null,
      showErrorModal: false,
    };
  },
  setup() {
    const store = useStore();
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
