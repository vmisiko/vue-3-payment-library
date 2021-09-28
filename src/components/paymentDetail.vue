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
          <IconView :icon=" paymentMethod.pay_method_id === 1 ? 'mpesa' : paymentMethod.psp.toLowerCase()" width="34" height="24" />
          <span class="ml-2 text-caption-1 "> {{ paymentMethod.pay_method_id === 1 ? paymentMethod.pay_method_name : formatLastFour(paymentMethod.pay_method_details)}}</span>
        </div>
      </div>

      <hr />

      <div class="mt-4 text-right link" v-if="!paymentStatus" @click="$router.push('/choose-payment')" >
        <span> Change payment option</span>
        
        <svg class="ml-2" width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.66656 0L0.726562 0.94L3.7799 4L0.726562 7.06L1.66656 8L5.66656 4L1.66656 0Z" fill="#324BA8"/>
        </svg>
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

