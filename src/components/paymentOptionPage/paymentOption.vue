<template>
 <div>
  <div class="text-caption-1 direction-flex pda-3" v-if="payMethod.pay_method_id === 2 " @click="handleSelect">
    <IconView :icon="$cardIconValidator(payMethod.psp.toLowerCase()) ? payMethod.psp.toLowerCase() : 'card' " />
    <span class="mgl-2">{{ payMethod.psp }}</span>
    <span class="gray80-text mgl-2"> {{$formatLastFour(payMethod.pay_method_details) }}</span>   
     <span class="spacer"></span>   
    <div class="">
      <IconView icon="greator" />
     </div>
  </div>

  <div v-else class="mgt-4 text-caption-1 direction-flex pda-3" @click="handleSelect">
    <IconView icon="mpesa" />
      <span class="mgl-2">M-PESA</span>
    <span class="spacer"></span>   
     <div class="">
      <IconView icon="greator" />
    </div>
  </div>
</div>
</template>

<script>
import paymentGenMxn from '../../mixins/paymentGenMxn';

export default {
  name: 'PaymentOption',
  mixins: [paymentGenMxn],
  props: ['payMethod'],
  data() {
    return {
    }
  },
  methods: {
    handleSelect() {
      window.analytics.track('Tap Payment Option', {
        ...this.commonTrackPayload(),
      });
      switch (this.payMethod.pay_method_id) {
        case 1: 
          this.$router.push({ 
            name: 'MpesaDetails', 
            params: { 
              id: this.payMethod.pay_detail_id
            }
          });
          break;
        case 2: 
          this.$router.push({ 
            name: 'CardDetails', 
            params: { 
              cardno: this.payMethod.pay_method_details,
              cardTitle: this.payMethod.psp,
            }
          });
          break;
        default:
          break;
      }
    }
  },
}
</script>