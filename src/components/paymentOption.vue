<template>
  <div
    class="direction-flex normal-text pointer"
    @click="handleSelect(paymentMethod)"
  >
    <IconView
      class="text-center mgt-0"
      :icon="paymentMethod.name.toLowerCase()"
    />

    <span class="mgl-5"> {{ optionName }} </span>

    <span class="spacer"></span>

    <IconView icon="greator-gray" width="8" height="12" />
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
          result = "Pay by Bank";
          break;
        default:
          break;
      }

      return result;
    },
  },
  methods: {
    handleSelect(paymentMethod) {
      switch (paymentMethod.payment_method_id) {
        case 1:
          window.analytics.track("Add M-Pesa", {
            ...this.commonTrackPayload(),
            phone_number: "",
          });
          this.submit();
          break;
        case 2:
          window.analytics.track("Add Card", {
            ...this.commonTrackPayload(),
            card_network: null,
          });
          this.$router.push("/add-card");
          break;
        case 20:
          window.analytics.track("Add Pay by Bank", {
            ...this.commonTrackPayload(),
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
