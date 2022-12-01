<template>
  <div 
    class="option-border text-caption-1 pda-3" 
    :class="{
      'selected-border': isChecked,
      'disabled':
        paymentOption.daily_limit &&
        getBupayload.amount > paymentOption.daily_limit,
      }"
    >
    <div class="direction-flex">
      <PaymentIcon class="icon-size" :paymentOption="paymentOption" />
      <PaymentOptionTypeText  
        :paymentOption="paymentOption"
        :loading="loading" 
        :balance="balance" 
      />
      <span class="spacer"></span>

      <div :class="{'mgt-2': paymentOption.pay_method_id === 20}">
        <input
          class="float-right payment-input mgy-auto"
          name="paymentoption"
          type="radio"
          :value="value"
          :checked="isChecked"
          :disabled="disableLogic"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    </div>
    <div class="text-caption-2 text-sendy-red-30 mgt-3" v-if="disableLogic">
      <span class="">{{ $translate("unavailable") }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PaymentIcon from "./PaymentIcon.vue";
import PaymentOptionTypeText from "./PaymentOptionTypeText.vue";

export default {
  name: "PaymentOptionItem",
  props: ["modelValue", "paymentOption", "value"],
  components: {
    PaymentIcon,
    PaymentOptionTypeText
  },
  data() {
    return {
      picked: this.modelValue,
      balance: 0,
      loading: false,
      iconUrl:
        "https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons",
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
    disableLogic() {
      let result = false;
      if (this.paymentOption.pay_method_id === 1) {
        result =
          this.paymentOption.daily_limit &&
          this.getBupayload.amount > this.paymentOption.daily_limit;
      }
      return result;
    },
    isChecked() {
      console.log(this.paymentOption.default == 1, 'isChecked');
      return this.paymentOption.default == 1;
    }
  },
  watch: {
    paymentOption(val) {
      console.log(val);
    }
  },
  mounted() {
    if (this.paymentOption.pay_method_id === 20 && this.getBupayload.pay_direction !== "PAY_ON_DELIVERY") {
      this.getBalance();
    }
  },
  methods: {
    async getBalance() {
      this.loading = true;
      const fullPayload = {
        url: `/api/v3/onepipe/balance/?entityId=${this.getBupayload.entity_id}&userId=${this.getBupayload.user_id}&countryCode=${this.getBupayload.country_code}`,
      };

      const response = await this.$paymentAxiosGet(fullPayload);
      this.loading = false;
      this.balance = response.availableBalance;
    },
  },
};
</script>

<style lang="scss">
@import '../../../assets/styles/variables';

.radio-custom {
    border-radius: 50%;
    opacity: 0;
    position: absolute;  
    display: inline-block;
    vertical-align: middle;
    margin: 5px;
    cursor: pointer; 
    .radio-custom:checked {
      content: "\f00c";
      font-family: 'FontAwesome';
      background: $linkColor;
      color: #bbb;
    }
}


</style>
