<template>
  <div class="flex-center">
    <Processing v-if="loading" text="Please wait while we confirm payment" />
    <div class="card" :class="{'card-min': paymentStatus }" v-else>

      <TopInfo :icon="icon" :title="title" :subtitle="errorText" :mpesaCode="mpesaCode"/>

      <PaymentDetail v-if="defaultPaymentMethod" :currency="currency" :amount="amount" :paymentMethod="defaultPaymentMethod"  :paymentStatus="paymentStatus" />

      <div class="mt-8 text-right" v-if="!paymentStatus">
        <!-- <button class="primary-btn">Confirm and Pay </button> -->
         <sendy-btn 
          :loading="loading"
          color='primary'
          class="mt-10"
          @click="submit"
          >
            Confirm and Pay
          </sendy-btn>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'success'" >
        <!-- <button class="primary-btn-block">Done </button> -->
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class="mt-10"
        >
          Done
        </sendy-btn>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'failed'">
        <!-- <button class="primary-btn-block">Try Again </button> -->
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class="mt-10"
        >
          Try Again
        </sendy-btn>
      </div>

      <div class="mt-8 text-right" v-if="paymentStatus === 'retry'">
        <!-- <button class="primary-btn-block">Retry in 3min 57seconds... </button> -->
        <sendy-btn 
          :block="true"
          :loading="loading"
          color='primary'
          class=""
        >
          Retry in 3min 57seconds...
        </sendy-btn>
      </div>

      <div class="text-center mt-8" >
        <span class="link">Contact Support</span>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Payment',
  components: {
    TopInfo: () => import('@/components/topInfo'),
    PaymentDetail: () => import('@/components/paymentDetail'),
    Processing: () => import('../components/processing'),
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
    ...mapGetters(['getSavedPayMethods', 'getBupayload']),
  },
  watch: {
    getSavedPayMethods(val) {
      this.defaultPaymentMethod = val ? val.filter(method => method.default === 1)[0]: [];
    }
  },
  mounted() {
    switch (this.$route.name){
      case 'SuccessView':
        this.sucessView();
        break;
      case 'FailedView':
        this.failView();
        break;
      case 'RetryView':
        this.retryView();
        break;
      default:
        break;
    }
    this.getDefaultpayMethod();
  },
  methods: {
    getDefaultpayMethod() {
      const bupayload = JSON.parse(localStorage.buPayload);
      this.defaultPaymentMethod = this.getSavedPayMethods ? this.getSavedPayMethods.filter(method => method.default === 1)[0] : [];
      this.currency = bupayload.currency;
      this.amount = bupayload.amount;
    },
    sucessView() {
      this.icon = 'success';
      this.title = 'Payment Successful';
      this.subtitle = '';
      this.paymentStatus= 'success';
    },

    failView() {
      this.icon = 'warning';
      this.title = 'Payment failed';
      this.subtitle = 'We are unable to process your transaction. Your card has insufficient funds.';
      this.paymentStatus= 'failed';
    },

    retryView() {
      this.icon = 'warning';
      this.title = 'Unable to confirm payment';
      this.subtitle = 'We are unable to confirm your M-PESA payment. Please retry again after a couple of minutes or contact our Support team.';
      this.paymentStatus= 'retry';
    },

    async submit() {
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
      console.log(response);
      this.transaction_id = response.transaction_id;
      // if (response.status) {
      //   this.pollCard();
      // }
      this.pollCard();
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
              this.initForm();
              this.errorText = 'Failed to charge card. Please try again.';
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
        console.log(res, 'axiosget');
        if (res.status) { 
          switch (res.transaction_status) {
            case 'success':
              this.poll_count = this.poll_limit;
              this.collectLoad = false;
              this.$paymentNotification({
                text: res.message,
              });
              this.sucessView()
              this.loading = false;
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.collectLoad = false;
              this.errorText = res.message;
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