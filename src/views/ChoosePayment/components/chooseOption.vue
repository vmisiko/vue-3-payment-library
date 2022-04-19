<template>
  <div>
    <div class="direction-flex">
      <div
        v-if="paymentOption.category === 'Mobile Money'"
        class="direction-flex"
      >
        <img
          :src="`${iconUrl}/${paymentOption.pay_method_name.toLowerCase()}.svg`"
          alt=""
        />
        <span class="mgl-2">{{ paymentOption.pay_method_name }}</span>
      </div>
      <div v-if="paymentOption.pay_method_id === 2" class="direction-flex">
        <IconView
          :icon="
            $cardIconValidator(paymentOption.psp.toLowerCase())
              ? paymentOption.psp.toLowerCase()
              : 'card'
          "
        />
        <span class="mgl-2">{{ paymentOption.psp }}</span>
        <span class="gray80-text mgl-2">
          {{ $formatLastFour(paymentOption.pay_method_details) }}</span
        >
      </div>

      <div v-if="paymentOption.pay_method_id === 20" class="direction-flex">
        <IconView icon="pay-bank" class="mgt-1" />
        <div class="mgl-2 mgy-auto">
          <span> Pay by Bank</span>
          <div class="caption-2-semibold text-gray70 direction-flex">
            <span> Available Balance</span>

            <IconView
              class="mgl-2"
              icon="loading1"
              width="1.5em"
              height="1.5em"
              v-if="loading"
            />
            <span class="mgl-2" v-else>
              {{ getBupayload.currency }} {{ balance }}</span
            >
          </div>
        </div>
      </div>

      <span class="spacer"></span>
      <div :class="{ 'mgt-2': paymentOption.pay_method_id === 20 }">
        <input
          class="float-right"
          name="paymentoption"
          type="radio"
          :value="paymentOption.category === 'Mobile Money' ? paymentOption.pay_method_id : paymentOption.pay_detail_id"
          :disabled="disableLogic"
          v-model="picked"
          v-on="inputListeners"
        />
      </div>
    </div>
    <div
      class="text-caption-2 text-sendy-red-30 mgt-3"
      v-if="disableLogic"
    >
      <span class="">{{ $t("unavailable") }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PaymentOptionItem",
  inheritAttrs: false,
  props: ["value", "paymentOption"],
  data() {
    return {
      picked: this.value,
      balance: 0,
      loading: false,
      iconUrl: "https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons",
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
    inputListeners() {
      var vm = this;
      return Object.assign({}, this.$listeners, {
        input: function (event) {
          vm.$emit("input", event.target.value);
        },
      });
    },
    disableLogic() {
      let result = false;
      if (this.paymentOption.pay_method_id === 1) {
        result = this.paymentOption.daily_limit && this.getBupayload.amount > this.paymentOption.daily_limit
      }
      return result;
    }
  },
  mounted() {
    if (this.paymentOption.pay_method_id === 20) {
      this.getBalance();
    }
  },
  methods: {
    async getBalance() {
      this.loading = true;
      const fullPayload = {
        url: `/api/v3/onepipe/balance/?userId=${this.getBupayload.user_id}`,
      };

      const response = await this.$paymentAxiosGet(fullPayload);
      this.loading = false;
      this.balance = response.availableBalance;
    },
  },
};
</script>
