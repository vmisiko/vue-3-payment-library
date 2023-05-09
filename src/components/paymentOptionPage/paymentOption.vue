<template>
  <div>
    <div class="text-caption-1 direction-flex pda-4 option-border" @click="handleSelect">
      <PaymentIcon class="icon-size" :paymentOption="payMethod" />
      <PaymentOptionTypeText 
        class="mgy-auto ml-2"
        :paymentOption="payMethod"
      />
      <span class="spacer"></span>
      <IconView class="mgy-auto" icon="greator" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import paymentGenMxn from "../../mixins/paymentGenMxn";
import PaymentIcon from "../../views/ChoosePayment/components/PaymentIcon";
import PaymentOptionTypeText from "../../views/ChoosePayment/components/PaymentOptionTypeText";

export default {
  name: "PaymentOption",
  components:{
    PaymentIcon,
    PaymentOptionTypeText,
  },
  mixins: [paymentGenMxn],
  props: ["payMethod"],
  data() {
    return {
      iconUrl:
        "https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons",
    };
  },
  methods: {
    ...mapMutations(["setSelectedPayOption"]),
    handleSelect() {
      window.analytics.track("Tap Manage Payment Options", {
        ...this.commonTrackPayload(),
        selected_option: this.payMethod.pay_method_name,
      });
      this.setSelectedPayOption(this.payMethod);
      this.$router.push({
        name: 'PaymentOptionDetail',
      });
    },
  },
};
</script>

