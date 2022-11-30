<template>
  <div
    class="direction-flex normal-text pointer"
    @click="handleSelect(paymentMethod)"
  >
    <div class="mgy-auto icon-size">
      <IconView
        :icon="paymentMethod.name.toLowerCase()"
      />
    </div>
    <div class="direction-flex mgy-auto w-full">
      <span class=""> {{ optionName }} </span>

      <span class="spacer"></span>

      <IconView icon="greator-gray" width="8" height="12" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import paymentGenMxn from "../mixins/paymentGenMxn";

export default {
  name: "PaymentOption",
  mixins: [paymentGenMxn],
  props: ["paymentMethod"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getBupayload", "getPaymentMethods"]),
    optionName() {
      let result = this.$translate("credit_card_payment_small");
      switch (this.paymentMethod.payment_method_id) {
        case 1:
          result = this.paymentMethod.name;
          break;
        case 2:
          result = this.$translate("credit_card_payment_small");
          break;
        case 20:
          result = "Pay with Transfer";
          break;
        case 10:
          result = this.$translate('Bank');
          break;
        default:
          result = this.paymentMethod.name;
          break;
      }

      return result;
    },
  },
  methods: {
    handleSelect(paymentMethod) {
      switch (paymentMethod.payment_method_id) {
        case 1:
          window.analytics.track("Add Payment Options", {
            ...this.commonTrackPayload(),
            payment_method: paymentMethod.name,
            phone_number: "",
          });

          this.getBupayload.pay_direction === "PAY_OUT" ? this.$router.push({ name: "AddMobile" }) : this.submit();
          break;
        case 2:
          window.analytics.track("Add Payment Options", {
            ...this.commonTrackPayload(),
            payment_method: paymentMethod.name,
            card_network: null,
          });
          this.$router.push("/add-card");
          break;
        case 10:
          window.analytics.track("Add Payment Options", {
            ...this.commonTrackPayload(),
            payment_method: paymentMethod.name,
            card_network: null,
          });
          this.$router.push({ name: "BankWithdrawal" });
          break;
        case 20:
          window.analytics.track("Add Payment Options", {
            ...this.commonTrackPayload(),
            payment_method: "Pay with Transfer",
            card_network: null,
          });
          this.$router.push({ name: "HowitWorks" });
          break;
        default:
          this.$router.push("/add-card");
          break;
      }
    },
    async submit() {
      this.$emit("loading", true);

      const payload = {
        user_id: this.getBupayload.user_id,
        pay_method_id: this.paymentMethod.payment_method_id,
      };

      const fullPayload = {
        url: "/save_payment_method",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.$emit("loading", false);
      response.status
        ? this.$paymentNotification({ text: this.$translate("mpesa_added") })
        : this.$paymentNotification({
            text: this.$translate("mpesa_already_added"),
            type: "error",
          });
      const entry = localStorage.getItem("entry");
      entry === "resolve-payment-checkout"
        ? this.$router.push({ name: "ChoosePaymentCheckout" })
        : this.$router.push({ name: "ChoosePayment" });
    },
  },
};
</script>

