<template>
  <div>
    <div class="mt-8">
        <span class="normal-text"> Amount to pay</span>

        <div class="float-right">
          <span class="amount-text" :class="{'text-caption-1': paymentStatus}">
            {{ currency }} {{ amount.toLocaleString() }}
          </span>
        </div>
    </div>

      <hr />

      <div class="mt-8">
        <span class="normal-text"> Pay with</span>

        <div class="d-flex float-right">  
          <IconView v-if="paymentMethod.pay_method_id === 1" icon="mpesa" width="34" height="24" />
          <IconView v-if="paymentMethod.pay_method_id === 2" :icon="$cardIconValidator(paymentMethod.psp.toLowerCase()) ? paymentMethod.psp.toLowerCase() : 'card'" width="34" height="24" />
          <span class="ml-2 text-caption-1 "> {{ paymentMethod.pay_method_id === 1 ? paymentMethod.pay_method_name : formatLastFour(paymentMethod.pay_method_details)}}</span>
        </div>
      </div>

      <hr />

      <div class="mt-4 d-flex float-right  link" v-if="!paymentStatus" @click="$router.push('/choose-payment')" >
        <span> Change payment option</span>
        <IconView class="ml-2" icon="greator"/>
      </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentDetail',
  props: ['currency', 'amount', 'paymentMethod', 'paymentStatus'],
  data() {
    return {
    }
  },
  mounted() {
    console.log(this.paymentMethod.psp.toLowerCase());
  },
  methods: {
    formatLastFour(cardno) {
      const result = cardno.substr(-4)
      return `**** ${result}`;
    }
  }
}
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
</style>

