<template>
  <div class="flex-center">
    <Processing v-if="loading" text="Please wait while we confirm payment" />
    <NoOptionsModal v-if="!defaultPaymentMethod && getSavedPayMethods && getSavedPayMethods.length === 0" />
    <div class="card" v-if="!loading && getSavedPayMethods">
      <TopInfo :icon="icon" :title="title"/>

      <span v-if="creditCards.length !== 0" class="mgt-2 text-overline">CREDIT OR DEBIT CARD</span>
      <div class="" v-if="creditCards.length !== 0" >
        <div v-for="(card, index) in creditCards" :key="index" class="mgt-4 text-caption-1 direction-flex pda-3" :class="{'selected-border': (picked === card.pay_detail_id)}" >
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
        <div v-for="(mobile, index) in savedMobile" :key="index" class="mgt-4 option-border text-caption-1 pda-3 " :class="{'selected-border': picked === mobile.pay_detail_id, 'disabled': mobile.daily_limit && getBupayload.amount > mobile.daily_limit }">
          <div class="direction-flex">
            <IconView icon="mpesa" />
            <span class="mgl-2">M-PESA</span>
            <span class="spacer"></span>   
            <div class="">
              <input name="paymentoption" type="radio" :value="mobile.pay_detail_id" :disabled="mobile.daily_limit && getBupayload.amount > mobile.daily_limit" v-model="picked" @change="update">
            </div>
          </div> 
          <div class="text-caption-2 text-sendy-red-30 mgt-3" v-if="mobile.daily_limit && getBupayload.amount > mobile.daily_limit" >
            <span class="">Unavailable. Amount exceeds daily transaction limit</span>
          </div>
        </div>
      </div> 

      <span class="link mgt-5" @click="addPaymentOption"> + Add payment option</span>

      <hr class="mgt-5" />

      <div class="mgt-4 direction-flex pda-3">
        <div class="">
          <span class="text-caption text-gray70">Amount to pay</span>
          <div class="text-secondary">
            {{ getBupayload.currency }} {{ $formatCurrency(getBupayload.amount) }}
          </div>
        </div>
        <span class="spacer"></span> 
        <sendy-btn 
          color='primary'
          class="mgt-2"
          @click="submit"
          :loading="loading1"
          :disabled="!picked"
        >
          Confirm and Pay
        </sendy-btn>
      </div>
    </div>
    <TransactionLimitModal :show="showTransactionLimit" @close="showTransactionLimit = false" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TopInfo from '../components/topInfo';
import Processing from '../components/processing';
import paymentGenMxn from '../mixins/paymentGenMxn';
import TransactionLimitModal from '../components/modals/transactionalLimitModal';
import NoOptionsModal from '../components/modals/noOptionsModal';

export default {
  name: 'ChoosePaymentCheckout',
  mixins: [paymentGenMxn],
  components: {
    TopInfo,
    Processing,
    TransactionLimitModal,
    NoOptionsModal,
  },
  data() {
    return {
      icon: 'back',
      title: 'Choose payment option',
      picked: '',
      loading: false,
      defaultPaymentMethod: null,
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      errorText: '',
      mpesaCode: '',
      loading1: false,
      showTransactionLimit: false,
    }
  },
  computed: {
    ...mapGetters(['getSavedPayMethods', 'getBupayload', 'getErrorText']),
    creditCards() {
      const result = this.getSavedPayMethods ? this.getSavedPayMethods.filter(element => element.pay_method_id === 2) : [];
      return result;
    },
    savedMobile() {
      const result = this.getSavedPayMethods ? this.getSavedPayMethods.filter(element => element.pay_method_id === 1) : [];
      return result;
    }
  },
  watch: {
    getSavedPayMethods(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getDefaultpayMethod();
      }
    }
  },
  mounted() {
    this.retrievePaymentMethods();
    this.getDefaultpayMethod();
  },
  methods: {
    ...mapMutations(['setErrorText', 'setPaymentMethods', 'setSavedPayMethods']),
    getDefaultpayMethod() {
      const method = this.getSavedPayMethods ? this.getSavedPayMethods.filter(method => method.default === 1)[0] : null;
      this.picked = method ? method.pay_detail_id : '';
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

      this.loading1 = true
      const response = await this.$paymentAxiosPut(fullPayload);
      this.loading1 = false;
      if (response) {
        this.retrievePaymentMethods();
        this.$paymentNotification({ text: `${this.setSelectedName()} selected for payment.`})
      }
    },

    setSelectedName() {
      const result = this.getSavedPayMethods.filter(element => element.pay_detail_id === this.picked)[0];
      return result ? result.pay_method_name : '';
    },
    async submit() {

      if (this.defaultPaymentMethod.daily_limit && this.getBupayload.amount > this.defaultPaymentMethod.daily_limit) {
        this.showTransactionLimit = true;
        return;
      }

      if (this.defaultPaymentMethod.pay_method_id === 1) {
        this.amount > this.defaultPaymentMethod.stk_limit ? this.$router.push('/mpesa-c2b') : this.$router.push('/mpesa-stk');
        return;
      }

      this.loading = true;
      const payload = {
        country: this.getBupayload.country_code,
        amount: this.getBupayload.amount,
        cardno: this.defaultPaymentMethod.pay_method_details,
        txref: this.getBupayload.txref,
        userid: this.getBupayload.user_id,
        currency: this.getBupayload.currency,
        bulk: this.getBupayload.bulk,
        entity: this.getBupayload.entity_id
      }

      const fullPayload = {
        url: '/api/v1/process',
        params: payload,
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      this.transaction_id = response.transaction_id;
      if (response.status) {
        this.pollCard();
        return;
      }
      this.setErrorText(response.message);
      this.loading = false;
      this.$router.push({ name: 'FailedView' });
    },

    pollCard() {
      this.poll_count = 0;
      for (let poll_count = 0; poll_count < this.poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === that.poll_limit) {
              poll_count = that.poll_limit;
              return;
            }

            that.TransactionIdStatus(); 
            if (poll_count === (that.poll_limit - 1)) {
              that.loading = false;
              that.errorText = 'Failed to charge card. Please try again.';
              that.setErrorText(that.errorText);
              that.$router.push({name: 'FailedView'});
              return;
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },

    async TransactionIdStatus() {

      const payload = {
        url: `/api/v1/process/status/${this.transaction_id}`,
      }
      this.$paymentAxiosGet(payload).then((res) => {
        if (res.status) { 
          switch (res.transaction_status) {
            case 'success':
              this.poll_count = this.poll_limit;
              this.$paymentNotification({
                text: res.message,
              });
              this.loading = false;
              this.$router.push({name: 'SuccessView'});
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.errorText = res.message;
              this.setErrorText(res.message);
              this.$router.push({name: 'FailedView'});
              this.failView()
              break;
            case 'pending':
              break;
            default:
              break;
          }
          return res;
        }
        this.errorText = res.message;
        this.showErrorModal= true;
      })
    },

    addPaymentOption() {
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
