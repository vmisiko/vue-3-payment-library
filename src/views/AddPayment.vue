<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>
  
      <div class="mgt-6">
        <div class="" v-for="(method, index) in getPaymentMethods" :key="index">
          <PaymentOption :paymentMethod="method" />
          <hr v-if="index !== paymentMethods.length-1" class="mgt-4 mgb-5" />
        </div> 
      </div>
    
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TopInfo from '../components/topInfo';
import PaymentOption from '../components/paymentOption';
import paymentGenMxn from '../mixins/paymentGenMxn';

export default {
  name: 'AddPayment',
  components: {
    TopInfo,
    PaymentOption,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: 'back',
      title: this.$t('add_payment_option'),
      paymentMethods:[
        {
          id: 1,
          icon: 'credit',
          name: this.$t('credit_card_payment_small'),
        },
        {
          id: 2,
          icon: 'mobile',
          name: 'M-Pesa',
        },
      ]
    }
  },
  computed: {
    ...mapGetters(['getPaymentMethods']),
  },
  mounted() {
    this.retrievePaymentMethods();
  },
}
</script>
