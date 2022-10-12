<template>
  <div class="flex-center">
    <div class="card-min">
      <TopInfo
        :icon="icon"
        :title="title"
        :mpesaCode="mpesaCode"
        :isMpesa="isMpesa"
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
          @click="routing"
        >
          {{ this.$translate("done") }}
        </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore, toRefs } from "vuex";
import TopInfo from "../components/topInfo";
import PaymentDetail from "../components/paymentDetail";
import paymentGenMxn from "../mixins/paymentGenMxn";
import { usePayment } from "../hooks/payment";

export default {
  name: "Payment",
  components: {
    TopInfo,
    PaymentDetail,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: "success",
      title: this.$translate("payment_successful"),
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
    } = usePayment();

  
    return {
      getSavedPayMethods,
      getBupayload,
      getErrorText,
      getLoading,
      ...toRefs(state),
    };
  },
  methods: {
    routing() {
      window.analytics.track("Done after Successful Payment", {
        ...this.commonTrackPayload(),
        duration_of_response: this.$route.params.duration,
      });
      this.$router.push(localStorage.entry_route);
    },
  },
};
</script>
