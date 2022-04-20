<template>
  <div>
    <div class="text-caption-1 direction-flex pda-3" @click="handleSelect">
      <div class="direction-flex" v-if="payMethod.pay_method_id === 2">
        <IconView
          :icon="
            $cardIconValidator(payMethod.psp.toLowerCase())
              ? payMethod.psp.toLowerCase()
              : 'card'
          "
        />
        <span class="mgl-2">{{ payMethod.psp }}</span>
        <span class="gray80-text mgl-2">
          {{ $formatLastFour(payMethod.pay_method_details) }}</span
        >
      </div>
      <div
        v-if="payMethod.category === 'Mobile Money'"
        class="direction-flex"
      >
        <img
          :src="`${iconUrl}/${payMethod.pay_method_name.toLowerCase()}.svg`"
          alt=""
        />
        <span class="mgl-2">{{ payMethod.pay_method_name }}</span>
      </div>
      <div class="direction-flex" v-if="payMethod.pay_method_id === 20">
        <IconView icon="pay-bank" />
        <span class="mgl-2"> Pay By bank </span>
      </div>
      <span class="spacer"></span>
      <div class="">
        <IconView icon="greator" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import paymentGenMxn from "../../mixins/paymentGenMxn";

export default {
  name: "PaymentOption",
  mixins: [paymentGenMxn],
  props: ["payMethod"],
  data() {
    return {
      iconUrl: "https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons",
    };
  },
  methods: {
    ...mapMutations(['setSelectedPayOption']),
    handleSelect() {
      window.analytics.track("Tap Payment Option", {
        ...this.commonTrackPayload(),
      });
      switch (this.payMethod.pay_method_id) {
        case 1:
          this.setSelectedPayOption(this.payMethod);
          this.$router.push({
            name: "MpesaDetails",
            params: {
              id: this.payMethod.pay_detail_id,
            },
          });
          break;
        case 2:
          this.setSelectedPayOption(this.payMethod);
          this.$router.push({
            name: "CardDetails",
            params: {
              cardno: this.payMethod.pay_method_details,
              cardTitle: this.payMethod.psp,
            },
          });
          break;
        default:
          this.setSelectedPayOption(this.payMethod);
          this.$router.push({
            name: "MpesaDetails",
            params: {
              id: this.payMethod.pay_detail_id,
              title: "Pay by bank",
              paymentOption: "Pay by Bank",
              icon: "virtual accounts",
            },
          });
          break;
      }
    },
  },
};
</script>
