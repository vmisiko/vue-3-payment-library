<template>
  <div>
    <div class="direction-flex">
      <div v-if="paymentOption.pay_method_id === 1" class="direction-flex">
        <IconView icon="mpesa" />
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
          :value="paymentOption.pay_detail_id"
          :disabled="
            paymentOption.daily_limit &&
            getBupayload.amount > paymentOption.daily_limit
          "
          v-model="picked"
          v-on="inputListeners"
        />
      </div>
    </div>
    <div
      class="text-caption-2 text-sendy-red-30 mgt-3"
      v-if="
        paymentOption.daily_limit &&
        getBupayload.amount > paymentOption.daily_limit
      "
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
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
    inputListeners() {
      var vm = this;
      /*eslint-disable */
      return Object.assign({}, this.$listeners, {
        input: function (event) {
          vm.$emit("input", event.target.value);
        },
      });
    },
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
