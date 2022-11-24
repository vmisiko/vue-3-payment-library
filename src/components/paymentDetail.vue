<template>
  <div>
    <div class="mgt-8">
      <span class="normal-text">
        {{
          $route.name === "SuccessView"
            ? $translate("amount_paid")
            : $translate("amount_to_pay")
        }}</span
      >

      <div class="float-right" :class="{ 'mgt-n2': !paymentStatus }">
        <span class="amount-text" :class="{ 'text-caption-1': paymentStatus }">
          {{ currency }} {{ $formatCurrency(amount) }}
        </span>
      </div>
    </div>

    <hr class="margin-hr" />

    <div class="mgt-8">
      <span class="normal-text">
        {{
          $route.name === "SuccessView" ? $translate("paymentOption") : $translate("pay_with")
        }}</span
      >

      <div class="direction-flex float-right">
        <img
          v-if="paymentMethod.category === 'Mobile Money'"
          :src="`${iconUrl}/${paymentMethod.pay_method_name.toLowerCase()}.svg`"
          alt=""
        />
        <IconView
          v-if="paymentMethod.pay_method_id === 2"
          :icon="
            $cardIconValidator(paymentMethod.psp.toLowerCase())
              ? paymentMethod.psp.toLowerCase()
              : 'card'
          "
          width="34"
          height="24"
        />
        <IconView
          class="mgt-n2"
          v-if="paymentMethod.pay_method_id === 20"
          icon="pay-bank"
          width="34"
          height="24"
        />
        <span
          class="mgl-2 text-caption-1"
          v-if="paymentMethod.category === 'Mobile Money'"
        >
          {{ paymentMethod.pay_method_name }}</span
        >
        <span
          class="mgl-2 text-caption-1"
          v-if="paymentMethod.pay_method_id === 2"
        >
          {{ formatLastFour(paymentMethod.pay_method_details) }}
        </span>
        <span
          class="mgl-2 text-caption-1"
          v-if="paymentMethod.pay_method_id === 20"
        >
          {{ $translate('pay_by_bank') }}
        </span>
      </div>
    </div>

    <div
      v-if="
        paymentMethod.daily_limit &&
        getBupayload.amount > paymentMethod.daily_limit
      "
      class="direction-flex text-caption-2 text-sendy-red-30 mgt-6 mgl-8"
    >
      <IconView icon="warning-text" class="mgt-1" />
      <span class="mgl-3">{{ $translate("unavailable") }}</span>
    </div>

    <hr class="margin-hr" />

    <div
      v-if="
        $route.name !== 'ResolvePayment' &&
        $route.name !== 'FailedView' &&
        $route.name !== 'SuccessView'
      "
      class="mgt-4 direction-flex float-right link"
      @click="$router.push('/choose-payment')"
    >
      <span> {{ $translate("change_payment_option") }}</span>
      <IconView class="mgl-2" icon="greator" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PaymentDetail",
  props: ["currency", "amount", "paymentMethod", "paymentStatus"],
  data() {
    return {
      iconUrl:
        "https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons",
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
  },
  methods: {
    formatLastFour(cardno) {
      const result = cardno ? cardno.substr(-4) : "";
      return `**** ${result}`;
    },
  },
};
</script>

<style lang="scss">
.payment-status-text {
  font-family: Nunito;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 20px;
  color: #303133;
}

.margin-hr {
  margin-top:21px;
}
</style>
