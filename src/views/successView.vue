<template>
  <div class="flex-center">
    <div class="card-min">
      <TopInfo :icon="icon" :title="title" :mpesaCode="mpesaCode" />

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
          {{ this.$t("done") }}
        </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import TopInfo from "../components/topInfo";
import PaymentDetail from "../components/paymentDetail";
import paymentGenMxn from "../mixins/paymentGenMxn";

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
      title: this.$t("payment_successful"),
      subtitle: "",
      paymentStatus: null,
      currency: "KES",
      amount: 0.0,
      loading: false,
      defaultPaymentMethod: null,
    };
  },
  computed: {
    ...mapGetters(["getSavedPayMethods", "getBupayload", "getErrorObject"]),
  },
  watch: {
    getSavedPayMethods(val) {
      this.defaultPaymentMethod = val
        ? val.filter((method) => method.default === 1)[0]
        : [];
    },
  },
  mounted() {
    this.retrievePaymentMethods();
    this.getDefaultpayMethod();
  },
  methods: {
    ...mapMutations([
      "setErrorText",
      "setPaymentMethods",
      "setSavedPayMethods",
    ]),
    getDefaultpayMethod() {
      this.defaultPaymentMethod = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter((method) => method.default === 1)[0]
        : [];
      this.currency = this.getBupayload.currency;
      this.amount = this.getBupayload.amount;
      this.mpesaCode = this.$route.params.mpesaCode;
    },
    async retrievePaymentMethods() {
      const payload = {
        country_code: this.getBupayload.country_code,
        entity_id: this.getBupayload.entity_id,
        user_id: this.getBupayload.user_id,
      };

      const fullPayload = {
        url: "/payment_methods",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      if (response.status) {
        this.setPaymentMethods(response.payment_methods);
        this.setSavedPayMethods(response.saved_payment_methods);
      }
    },
    routing() {
      window.analytics.track("Done after Successful Payment", {
        ...this.commonTrackPayload(),
        duration_of_response: this.$route.params.duration,
      });
      // this.$handlePaymentRouting();
      this.$router.push({ name: localStorage.entry_route });
    },
  },
};
</script>
