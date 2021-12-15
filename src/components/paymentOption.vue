<template>
   <div class="direction-flex normal-text pointer" @click="$handlePaymentMethod(paymentMethod)">

    <IconView class="text-center mgt-0" :icon="paymentMethod.name.toLowerCase()" />

    <span class="mgl-5"> {{ optionName }} </span>

    <span class="spacer"></span>

    <IconView icon="greator-gray" width="8" height="12"  />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import paymentGenMxn from '../mixins/paymentGenMxn';

export default {
  name: 'PaymentOption',
  mixins: [paymentGenMxn],
  props: ['paymentMethod'],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
    optionName() {
      let result = this.$t('credit_card_card_small');
      switch (this.paymentMethod.payment_method_id) {
        case 1:
          result = this.paymentMethod.name
          break;
        case 2:
          result = this.$t('credit_card_card_small');
          break;
        default:
          break;
      }

      return result;
    }
  },
  methods: {
    handleSelect() {
      switch (this.paymentMethod.id) {
        case 1: 
          window.analytics.track('Add Card', {
            ...this.commonTrackPayload(),
            card_network: null,
          });
          this.$router.push('/add-card')
          break;
        case 2: 
          window.analytics.track('Add M-Pesa', {
            ...this.commonTrackPayload(),
            phone_number: '',
          });
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
