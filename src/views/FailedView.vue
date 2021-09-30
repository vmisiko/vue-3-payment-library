<template>
  <div class="flex-center">
    <div class="card" :class="{'card-min': paymentStatus }">

      <TopInfo :icon="icon" :title="title" :subtitle="getErrorText" />

      <PaymentDetail v-if="defaultPaymentMethod" :currency="currency" :amount="amount" :paymentMethod="defaultPaymentMethod"  :paymentStatus="paymentStatus" />

      <div class="mt-8 text-right">
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class="mt-10"
          @click="$router.push({ name: 'Entry'})"
        >
          {{ $route.params.mpesa ? 'Retry' : 'Try Again' }}
        </sendy-btn>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'retry'">
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class=""
        >
          Retry in 3min 57seconds...
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
import TopInfo from '../components/topInfo';
import PaymentDetail from '../components/paymentDetail';

export default {
  name: 'Payment',
  components: {
    TopInfo,
    PaymentDetail,
  },
  data() {
    return {
      icon: 'warning',
      title: this.$route.params.mpesa ? 'Unable to confirm payment' : 'Payment failed',
      paymentStatus: true,
      currency: 'KES',
      amount: 0.00,
      loading: false,
      defaultPaymentMethod: null,
      errorText: "Could not process transaction",
    }
  },
  computed: {
    ...mapGetters(['getSavedPayMethods', 'getBupayload', 'getErrorText']),
  },
  watch: {
    getSavedPayMethods(val) {
      this.defaultPaymentMethod = val ? val.filter(method => method.default === 1)[0]: [];
    },
  },
  mounted() {
    this.retrievePaymentMethods();
    this.getDefaultpayMethod();
  },
  methods: {
    ...mapMutations(['setErrorText', 'setPaymentMethods', 'setSavedPayMethods']),
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
    getDefaultpayMethod() {
      this.defaultPaymentMethod = this.getSavedPayMethods ? this.getSavedPayMethods.filter(method => method.default === 1)[0] : [];
      this.currency = this.getBupayload.currency;
      this.amount = this.getBupayload.amount;
    },
  }
}

</script>