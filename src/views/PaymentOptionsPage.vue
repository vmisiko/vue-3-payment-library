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
import { mapGetters } from 'vuex';

export default {
  name: 'PaymentOptionsPage',
  components: {
    TopInfo: () => import('@/components/topInfo'),
    PaymentOption: () => import('../components/paymentOption')
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
    console.log(this.getSavedPayMethods, this.creditCards);
  }
}
</script>
