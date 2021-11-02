<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>

      <span v-if="creditCards.length !== 0" class="mgt-2 text-overline">CREDIT OR DEBIT CARD</span>
      <div class="" v-if="creditCards.length !== 0" >
        <div v-for="(card, index) in creditCards" :key="index" class="mgt-4 option-border text-caption-1 direction-flex pda-3" :class="{'selected-border': (picked === card.pay_detail_id)}" >
            <IconView :icon="$cardIconValidator(card.psp.toLowerCase()) ? card.psp.toLowerCase() : 'card' " />
            <span class="mgl-2">{{ card.psp }}</span>
            <span class="gray80-text mgl-2"> {{$formatLastFour(card.pay_method_details) }}</span>   
            <span class="spacer"></span>   
            <div class="">
              <input name="paymentoption" type="radio" :value="card.pay_detail_id"  v-model="picked" @change="update" >
             </div>
        </div>
      </div>

      <span v-if="savedMobile.length !== 0" class="mgt-8 text-overline">Mobile Money</span>
      <div v-if="savedMobile.length !== 0">
        <div v-for="(mobile, index) in savedMobile" :key="index" class="mgt-4 option-border text-caption-1 pda-3 " :class="{'selected-border': picked === mobile.pay_detail_id, 'disabled': mobile.daily_limit !== 0 && getBupayload.amount > mobile.daily_limit }">
          <div class="direction-flex">
            <IconView icon="mpesa" />
            <span class="mgl-2">M-PESA</span>
            <span class="spacer"></span>   
            <div class="">
              <input name="paymentoption" type="radio" :value="mobile.pay_detail_id" :disabled="mobile.daily_limit !== 0 && getBupayload.amount > mobile.daily_limit" v-model="picked" @change="update">
            </div>
          </div> 
          <div class="text-caption-2 text-sendy-red-30 mgt-3" v-if="mobile.daily_limit !== 0 && getBupayload.amount > mobile.daily_limit" >
            <span class="">Unavailable. Amount exceeds daily transaction limit</span>
          </div>

        </div>
      </div> 
      <hr class="mgt-5" />
      <span class="link mgt-5" @click="addPaymentOption"> + Add payment option</span>

      <div class="mgt-4 text-right">
         <sendy-btn 
          color='primary'
          class="mgt-10"
          @click="handleRouting"
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
import paymentGenMxn from '../mixins/paymentGenMxn';

export default {
  name: 'ChoosePayment',
  mixins: [paymentGenMxn],
  components: {
    TopInfo,
  },
  data() {
    return {
      icon: 'back',
      title: 'Choose payment option',
      picked: '',
      loading: false,
      startTime: null,
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
    this.startTime = Date.now();
  },
  methods: {
    ...mapMutations(['setPaymentMethods', 'setSavedPayMethods']),
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

      const payment_method = this.getSavedPayMethods.filter(elements => elements.pay_detail_id === this.picked)[0].pay_method_name;
      window.analytics.track('Choose Payment Option', {
        ...this.commonTrackPayload(),
        payment_method: payment_method,
      });

      this.loading = true
      const response = await this.$paymentAxiosPut(fullPayload);
      this.loading = false;
      if (response) {
        this.$paymentNotification({ text: `${this.setSelectedName()} selected for payment.`})
      }
    },

    setSelectedName() {
      const result = this.getSavedPayMethods.filter(element => element.pay_detail_id === this.picked)[0];
      return result ? result.pay_method_name : '';
    },
    handleRouting() {
      const entryRoute = localStorage.entry_route;
      const entryPoint = localStorage.entry;
      const payment_method = this.getSavedPayMethods.filter(elements => elements.pay_detail_id === this.picked)[0];
      const countSavedCards = this.getSavedPayMethods.filter(element => element.pay_method_id === 2);
      
      switch (payment_method.pay_method_id) {
        case 1:
          window.analytics.track('Continue after selecting  M-Pesa', {
            ...this.commonTrackPayload(), 
          }); 
          break;
        case 2: 
          window.analytics.track('Continue after selecting Card', {
            ...this.commonTrackPayload(), 
            number_of_cards: countSavedCards.length,
            selected_cards_network: payment_method.psp
          }); 
          break;
        default:
          break;
      }
           
      switch(entryPoint) {
        case 'checkout':
          this.$router.push({name: 'Entry'});
          break;
        case 'choose-payment':
          this.$router.push({ name: entryRoute });
          break;
        case 'choose-payment-checkout':
          this.$router.push({ name: 'ChoosePaymentCheckout'});
          break;
        case 'payment-option':
          this.$router.push({ name: 'PaymentOptionsPage'});
          break;
        default:
          this.$router.push({name: 'Entry'});
          break;
      }
    }, 
    addPaymentOption() {
      const finishTime = Date.now - this.startTime;
      window.analytics.track('Add Payment Option', {
        ...this.commonTrackPayload(),
        timezone: this.paymentTimezone,
        country_code: this.getBupayload.country_code,
      })
      this.$router.push('/add-payment');
    }
  }
}
</script>

