<template>
  <div class="flex-center">
    <div class="card" :class="{'card-min': paymentStatus }">
      <IconView icon='back'/>

      <TopInfo class="mgt-9" :icon="icon" :title="title" :subtitle="getErrorText" />

      <PaymentDetail v-if="defaultPaymentMethod" :currency="currency" :amount="amount" :paymentMethod="defaultPaymentMethod"  :paymentStatus="paymentStatus" />

      <div class="mgt-8 text-right">
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          @click="submitRetry"
        >
          {{ $route.params.mpesa ? 'Retry' : 'Try Again' }}
        </sendy-btn>
      </div>

      <div class="mgt-8 text-right" v-if="paymentStatus === 'retry'">
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class=""
        >
          Retry in 3min 57seconds...
        </sendy-btn>
      </div>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TopInfo from '../components/topInfo';
import PaymentDetail from '../components/paymentDetail';
import paymentGenMxn from '../mixins/paymentGenMxn';

export default {
  name: 'Payment',
  components: {
    TopInfo,
    PaymentDetail,
  },
  mixins: [paymentGenMxn],
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
      transaction_id: null,
      poll_count: 0,
      poll_limit: 30,
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
    routeRetry() {
      const entry = localStorage.entry;
      window.analytics.track('Try again after Failed Payment', {
        ...this.commonTrackPayload(),
      });
     
    },
    async submitRetry() {
    this.startResponseTime = new Date(); 

      window.analytics.track('Try again after Failed Payment', {
        ...this.commonTrackPayload(),
      });


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
        entity: this.getBupayload.entity_id,
        company_code: this.getBupayload.company_code,
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
              this.collectLoad = false;
              this.$paymentNotification({
                text: res.message,
              });
              this.loading = false;
              const duration = Date.now() - this.startResponseTime;
              this.$router.push({
                name: 'SuccessView',
                duration: duration,
              });
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.collectLoad = false;
              this.errorText = res.message;
              this.setErrorText(res.message);
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
    }
  }
}

</script>