<template>
  <div class="flex-center">
    <Processing v-if="loading" text="Please wait while we confirm payment" />
    <NoOptionsModal v-if="!defaultPaymentMethod" />
    <div class="card" :class="{'card-min': paymentStatus }" v-if="!loading && defaultPaymentMethod">

      <TopInfo :icon="icon" :title="title" />

      <PaymentDetail v-if="defaultPaymentMethod" :currency="currency" :amount="amount" :paymentMethod="defaultPaymentMethod"  :paymentStatus="paymentStatus" />

      <div class="mgt-3 text-right" v-if="!paymentStatus">
         <sendy-btn 
          :loading="loading"
          color='primary'
          class="mgt-10"
          @click="submit"
          >
            Confirm and Pay
          </sendy-btn>
      </div>

      <div class="mgt-8 text-right" v-if="paymentStatus === 'success'" >
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class="mgt-10"
        >
          Done
        </sendy-btn>
      </div>

      <div class="mgt-8 text-right" v-if="paymentStatus === 'failed'">
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class="mgt-10"
          @click="$router.push({ name: 'Entry'})"
        >
          Try Again
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
import Processing from '../components/processing';
import NoOptionsModal from '../components/modals/noOptionsModal';
import paymentGenMxn from '../mixins/paymentGenMxn';


export default {
  name: 'Payment',
  mixins: [paymentGenMxn],
  components: {
    TopInfo,
    PaymentDetail,
    Processing,
    NoOptionsModal,
  },
  data() {
    return {
      icon: 'back',
      title: 'Payment',
      subtitle: '',
      paymentStatus: null,
      currency: 'KES',
      amount: 0.00,
      loading: false,
      defaultPaymentMethod: null,
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      errorText: '',
      mpesaCode: '',
    }
  },
  computed: {
    ...mapGetters(['getSavedPayMethods', 'getBupayload', 'getErrorText']),
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

    sucessView() {
      this.icon = 'success';
      this.title = 'Payment Successful';
      this.subtitle = '';
      this.paymentStatus= 'success';
    },
    async submit() {

       window.analytics.track('Confirm and Pay', {
        ...this.commonTrackPayload(), 
        payment_method: this.defaultPaymentMethod.pay_method_name,
        amount: this.getBupayload.amount,
        currency: this.getBupayload.currency,
      }); 
      
      if (this.defaultPaymentMethod.pay_method_id === 1) {
        this.amount > 150000 ? this.$router.push('/mpesa-c2b') : this.$router.push('/mpesa-stk');
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
      const poll_limit = 6;
      for (let poll_count = 0; poll_count < poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === poll_limit) {
              poll_count = poll_limit;
              return;
            }

            that.TransactionIdStatus(); 
            if (poll_count === 5) {
              that.loading = false;
              this.errorText = 'Failed to charge card. Please try again.';
              this.setErrorText(this.errorText);
              this.$router.push({name: 'FailedView'});
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
              // this.sucessView()
              this.loading = false;
              this.$router.push({name: 'SuccessView'});
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.collectLoad = false;
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
    }
  }
}

</script>