<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>

      <span class="mt-2 text-overline">CREDIT OR DEBIT CARD</span>
      <div class="" v-if="creditCards.length !== 0" >
        <div v-for="(card, index) in creditCards" :key="index" class="mt-4 text-caption-1 d-flex pa-3" :class="{'selected-border': (picked === card.pay_detail_id)}" >
            <IconView :icon="$cardIconValidator(card.psp.toLowerCase()) ? card.psp.toLowerCase() : 'card' " />
            <span class="ml-2">{{ card.psp }}</span>
            <span class="gray80-text ml-2"> {{$formatLastFour(card.pay_method_details) }}</span>   
            <span class="spacer"></span>   
            <div class="">
              <input name="paymentoption" type="radio" :value="card.pay_detail_id"  v-model="picked" @change="update" >
             </div>
        </div>
      </div>

      <span class="mt-8 text-overline">Mobile money</span>
      <div v-if="savedMobile.length !== 0">
        <div v-for="(mobile, index) in savedMobile" :key="index" class="mt-4 text-caption-1 d-flex pa-3 " :class="{'selected-border': picked === mobile.pay_detail_id}">
            <IconView icon="mpesa" />
            <span class="ml-2">M-PESA</span>
            <span class="spacer"></span>   
            <div class="">
              <input name="paymentoption" type="radio" :value="mobile.pay_detail_id" v-model="picked" @change="update">
            </div>
        </div>
      </div> 
      <hr class="mt-5" />
      <span class="link mt-5" @click="$router.push('/add-payment')"> + Add payment option</span>

      <div class="mt-4 text-right">
         <sendy-btn 
          color='primary'
          class="mt-10"
          @click="$router.push({name: 'Entry'})"
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

export default {
  name: 'ChoosePayment',
  components: {
    TopInfo,
  },
  data() {
    return {
      icon: 'back',
      title: 'Choose payment option',
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
    this.getDefaultpayMethod();
  },
  methods: {
    ...mapMutations(['setPaymentMethods', 'setSavedPayMethods']),
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
      const method = this.getSavedPayMethods ? this.getSavedPayMethods.filter(method => method.default === 1)[0] : [];
      this.picked = method.pay_detail_id;
    },
    async update() {
      const payload = {
        user_id: this.getBupayload.user_id,
        pay_detail_id: this.picked,
      }

      const fullPayload = {
        url: `/set_default`,
        params: payload,
      }

      this.loading = true
      const response = await this.$paymentAxiosPut(fullPayload);
      this.loading = false;
      if (response) {
        this.$paymentNotification({ text: 'Card selected for payment.'})
      }
    }
  }
}
</script>
