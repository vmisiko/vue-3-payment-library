<template>
  <div class="flex-center">
    <Processing v-if="showProcessing" text="Please wait ..." />
    <div class="card" v-else>
      <TopInfo :icon="icon" :title="title">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            Click below to add a payment option
          </span>
        </template>
      </TopInfo>

      <div class="mgt-10">
        <div class="" v-for="(method, index) in getPaymentMethods" :key="index">
          <PaymentOption :paymentMethod="method" @loading="handleLoading" />
          <hr
            v-if="index !== getPaymentMethods.length - 1"
            class="mgt-4 mgb-5"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopInfo from "../components/topInfo";
import PaymentOption from "../components/paymentOption";
import paymentGenMxn from "../mixins/paymentGenMxn";
import Processing from "../components/processing";

export default {
  name: "AddPayment",
  components: {
    TopInfo,
    PaymentOption,
    Processing,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: "back",
      title: this.$t("add_payment_option"),
      showProcessing: false,
    };
  },
  computed: {
    ...mapGetters(["getPaymentMethods"]),
  },
  mounted() {
    this.retrievePaymentMethods();
  },
  methods: {
    handleLoading(val) {
      this.showProcessing = val;
    },
  },
};
</script>
