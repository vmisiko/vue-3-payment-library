<template>
  <div class="flex-center">
    <div class="card-min">

      <TopInfo :icon="icon" :title="title"  :mpesaCode="mpesaCode"/>

      <PaymentDetail v-if="defaultPaymentMethod" :currency="currency" :amount="amount" :paymentMethod="defaultPaymentMethod"  :paymentStatus="paymentStatus" />


      <div class="mt-8 text-right" >
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class="mt-10"
        >
          Done
        </sendy-btn>
      </div>

      <div class="text-center mt-8">
        <span class="link">Contact Support</span>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Payment',
  components: {
    TopInfo: () => import('../components/topInfo'),
    PaymentDetail: () => import('../components/paymentDetail'),
  },
  data() {
    return {
      icon: 'success',
      title: 'Payment successful',
      subtitle: '',
      paymentStatus: null,
      currency: 'KES',
      amount: 0.00,
      loading: false,
      defaultPaymentMethod: null,
      paymentStatus: true,
    }
  },
  computed: {
    ...mapGetters(['getSavedPayMethods', 'getBupayload', 'getErrorObject']),
  },
  watch: {
    getSavedPayMethods(val) {
      this.defaultPaymentMethod = val ? val.filter(method => method.default === 1)[0]: [];
    }
  },
  mounted() {
    this.retrievePaymentMethods();
    this.getDefaultpayMethod();
  },
  methods: {
    ...mapMutations(['setErrorText', 'setPaymentMethods', 'setSavedPayMethods']),
    getDefaultpayMethod() {
      this.defaultPaymentMethod = this.getSavedPayMethods ? this.getSavedPayMethods.filter(method => method.default === 1)[0] : [];
      this.currency = this.getBupayload.currency;
      this.amount = this.getBupayload.amount;
      this.mpesaCode = this.$route.params.mpesaCode;
    },
    async retrievePaymentMethods() {
      const payload = {
        country_code : this.getBupayload.country_code,
        entity_id : this.getBupayload.entity_id,
        user_id : this.getBupayload.user_id,
      };

      const fullPayload = {
        url: '/payment_methods',
        params: payload,
      }
      
      const response = await this.$paymentAxiosPost(fullPayload);
      if (response.status) {
        this.setPaymentMethods(response.payment_methods);
        this.setSavedPayMethods(response.saved_payment_methods);
      }
    },
  }
}

</script>