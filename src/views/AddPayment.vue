<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>
  
      <div class="mt-6">
        <div class="" v-for="(method, index) in getPaymentMethods" :key="index">
          <PaymentOption :paymentMethod="method" />
          <hr v-if="index !== paymentMethods.length-1" class="mt-4 mb-5" />
        </div> 
      </div>
    
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TopInfo from '../components/topInfo';
import PaymentOption from '../components/paymentOption';

export default {
  name: 'AddPayment',
  components: {
    TopInfo,
    PaymentOption,
  },
  data() {
    return {
      icon: 'back',
      title: 'Add Payment option',
      paymentMethods:[
        {
          id: 1,
          icon: 'credit',
          name: 'Credit or Debit card',
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
  methods: {
  }
}
</script>
