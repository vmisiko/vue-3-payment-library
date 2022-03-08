<template>
  <div>
    <div class="direction-flex">
      <div v-if="paymentOption.pay_method_id === 1" class="direction-flex">
        <IconView icon="mpesa" />
        <span class="mgl-2">{{ paymentOption.pay_method_name }}</span>
      </div>
      <div v-if="paymentOption.pay_method_id === 2" class="direction-flex">
        <IconView :icon="$cardIconValidator(paymentOption.psp.toLowerCase()) ? paymentOption.psp.toLowerCase() : 'card' " />
        <span class="mgl-2">{{ paymentOption.psp }}</span>
        <span class="gray80-text mgl-2"> {{$formatLastFour(paymentOption.pay_method_details) }}</span>  
      </div>
      
      <span class="spacer"></span> 
      <div>
        <input class="float-right" name="paymentoption" type="radio" :value="paymentOption.pay_detail_id" :disabled="paymentOption.daily_limit && getBupayload.amount > paymentOption.daily_limit" v-model="picked" v-on="inputListeners">
      </div>
    </div> 
    <div class="text-caption-2 text-sendy-red-30 mgt-3" v-if="paymentOption.daily_limit && getBupayload.amount > paymentOption.daily_limit" >
      <span class="">{{ $t('unavailable') }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PaymentOptionItem',
  inheritAttrs: false,
  props: ['value', 'paymentOption'],
  data() {
    return {
      picked: this.value,
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
    inputListeners() {
      var vm = this
      return Object.assign({},
        this.$listeners,
        {
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    },
  },
}
</script>