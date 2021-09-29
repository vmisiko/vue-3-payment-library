<template>
 <div>
  <div class="text-caption-1 d-flex pa-3" v-if="payMethod.pay_method_id === 2 " @click="$router.push({ name: 'CardDetails', params: { cardno: payMethod.pay_method_details }})">
    <IconView :icon="$cardIconValidator(payMethod.psp.toLowerCase()) ? payMethod.psp.toLowerCase() : 'card' " />
    <span class="ml-2">{{ payMethod.psp }}</span>
    <span class="gray80-text ml-2"> {{$formatLastFour(payMethod.pay_method_details) }}</span>   
     <span class="spacer"></span>   
    <div class="">
      <IconView icon="greator" />
     </div>
  </div>

  <div v-else class="mt-4 text-caption-1 d-flex pa-3" @click="$router.push({ name: 'MpesaDetails', params: { id: payMethod.pay_detail_id }})">
    <IconView icon="mpesa" />
      <span class="ml-2">M-PESA</span>
    <span class="spacer"></span>   
     <div class="">
      <IconView icon="greator" />
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'PaymentOption',
  props: ['payMethod'],
  data() {
    return {
    }
  },
  methods: {
    handleSelect() {
      switch (this.paymentMethod.id) {
        case 1: 
          this.$router.push('/add-card')
          break;
        case 2: 
          this.$router.push('/add-mpesa')
          break;
        default:
          this.$router.push('/add-card')
          break;
      }
    }
  },
}
</script>