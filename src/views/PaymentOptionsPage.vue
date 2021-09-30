<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>

      <span class="mt-2 text-overline">CREDIT OR DEBIT CARD</span>
      <div class="" v-if="creditCards.length !== 0" >
        <div v-for="(card, index) in creditCards" :key="index" >
          <PaymentOption :payMethod="card" />
        </div>
      </div>

      <span class="mt-8 text-overline">Mobile money</span>
      <div v-if="savedMobile.length !== 0">
        <div v-for="(mobile, index) in savedMobile" :key="index">
            <PaymentOption :payMethod="mobile" />
        </div>
      </div> 
      <hr class="mt-5" />
      <span class="link mt-5" @click="$router.push('/add-payment')"> + Add payment option</span>

      <div class="mt-4 text-right">
         <sendy-btn 
          color='primary'
          class="mt-10"
          @click="$router.push('/')"
          :loading="loading"
          >
            Continue
          </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TopInfo from '../components/topInfo';
import PaymentOption from '../components/paymentOptionPage/paymentOption';

export default {
  name: 'PaymentOptionsPage',
  components: {
    TopInfo,
    PaymentOption,
  },
  data() {
    return {
      icon: 'back',
      title: 'Payment options',
      picked: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['getSavedPayMethods', 'getBupayload']),
    creditCards() {
      const result = this.getSavedPayMethods ? this.getSavedPayMethods.filter(element => element.pay_method_id === 2) : [];
      return result;
    },
    savedMobile() {
      const result = this.getSavedPayMethods ? this.getSavedPayMethods.filter(element => element.pay_method_id === 1) : [];
      return result;
    }
  },
  mounted() {
    this.retrievePaymentMethods();
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
  }
}
</script>
