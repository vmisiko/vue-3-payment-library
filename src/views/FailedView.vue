<template>
  <div class="flex-center">
    <AdditionalCardFields 
      :additionalData="additionalData" 
      :transaction_id="transaction_id" 
      v-if="showAdditionalCardFields" 
      @continue="handleContinue"
      @continue3DS="handleContinue3DS"
    />

    <div class="card" :class="{'card-min': paymentStatus }" v-else>
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
          {{ $t('retry_in') }}
        </sendy-btn>
      </div>

      <div class="mgt-8 direction-flex flex-center link" @click="$route.name === 'ResolvePayment' ? $router.push('/choose-payment-checkout') : $router.push('/choose-payment')"  >
        <span> {{ $t('change_payment_option') }}</span>
        <IconView class="mgl-2" icon="greator"/>
      </div>

    </div>
    <ErrorModal :show="showErrorModal" :text="errorText" @close="handleErrorModalClose" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TopInfo from '../components/topInfo';
import PaymentDetail from '../components/paymentDetail';
import paymentGenMxn from '../mixins/paymentGenMxn';
import AdditionalCardFields from './AdditionalCardFields';
import ErrorModal from '../components/modals/ErrorModal';

export default {
  name: 'FailedView',
  components: {
    TopInfo,
    PaymentDetail,
    ErrorModal,
    AdditionalCardFields,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: 'warning',
      title: this.$route.params.mpesa ? this.$t('unable_to_confirm') : this.$t('payment_failed'),
      paymentStatus: true,
      currency: 'KES',
      amount: 0.00,
      loading: false,
      defaultPaymentMethod: null,
      errorText: this.$t('could_not_process'),
      transaction_id: null,
      poll_count: 0,
      poll_limit: 30,
      showTransactionLimit: false,
      showAdditionalCardFields: false,
      additionalData: null,
      showErrorModal: false,
    }
  },
  computed: {
    ...mapGetters(['getSavedPayMethods', 'getBupayload', 'getErrorText']),
  },
  watch: {
    getSavedPayMethods(val) {
      this.defaultPaymentMethod = val ? val.filter(method => method.default === 1)[0]: [];
    },
    getLoading(val) {
      this.loading = val;
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

      if (this.defaultPaymentMethod.pay_method_id === 20) {
        this.payBybankCollect()
        return;
      }

      this.setLoading(true);
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
        bulkrefno: this.getBupayload.bulk_reference_number,
        paymethod: this.defaultPaymentMethod.pay_method_id,
      }

      const fullPayload = {
        url: '/api/v3/process',
        params: payload,
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      this.transaction_id = response.transaction_id;
      if (response.status) {
      
        if(response.additional_data) {
          this.additionalData = response.additional_data;
          this.showAdditionalCardFields = true;
          this.setLoading(false);
          return;
        }

        const duration = Date.now() - this.startResponseTime;

        switch (response.transaction_status) {
          case 'pending':
            if (this.getBupayload.bulk) {
              this.setLoading(false);
              this.$router.push({
                name: 'SuccessView',
                duration: duration,
              });
              return;
            }
            this.pollCard();
            break;
          case 'success':
            this.setLoading(false);
            this.$paymentNotification({
              text: this.$t('card_details_added')
            });
            this.$router.push('/choose-payment');
            break;
          default:
            break;
        }
        return;
      }
      this.setErrorText(response.message);
      this.setLoading(false);
      this.subtitle = response.message;
    },

    pollCard() {
      this.setLoading(true);
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
              that.setLoading(false);
              that.errorText = this.$t('failed_to_collect_card_details');
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
              this.setLoading(false);
              const duration = Date.now() - this.startResponseTime;
              this.$router.push({
                name: 'SuccessView',
                duration: duration,
              });
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.setLoading(false);
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
        this.poll_count = this.poll_limit;
        this.showAdditionalCardFields = false;
        this.setLoading(false);
        this.errorText = res.message;
        this.showErrorModal= true;
      })
    },

    handleContinue(val) {
      if (val) {
        this.setLoading(true);
        this.pollCard();
        return;
      }
      this.setLoading(false);
      this.errorText = this.$t('failed_to_collect_card_details')
      this.showErrorModal= true;
    },

    handleContinue3DS(val) {
      this.showAdditionalCardFields = false;
      this.additionalData = val.additionalData.filter(element => element.field_id === 'url');
      this.init3DS();
    },

    init3DS() {
      const res = !this.additionalData ? this.additionalData : this.additionalData[0];
      const url = res.field;
      const urlWindow = window.open(url, '');

      const timer = setInterval(() => {
			  if (urlWindow.closed) {
          this.init3dsPoll();
          clearInterval(timer);
        }
	  	}, 500);

    },

    async init3dsPoll() {
      this.setLoading(true);
      const payload = {
        transaction_id: this.transaction_id,
        tds: true,
      }

      const fullPayload = {
        params: payload,
        url: '/api/v2/submit_info'
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      this.setLoading(false);
      if (response.status) {
        switch (response.transaction_status) {
            case 'pending':
              this.pollCard();
              this.count = true;
              break;
            case 'success':
              this.setLoading(false);
              this.$paymentNotification({
                text: this.$t('card_details_added')
              });
              this.$router.push('/choose-payment');
              this.setLoading(false);
              break;
            default:
              break;
        };
        return;
      }
      this.setLoading(false);
      this.errorText = this.$t('failed_to_collect_card_details');
      this.showErrorModal= true;
    },

    handleErrorModalClose() {
      this.showErrorModal = false;
      this.showAdditionalCardFields = false;
    },
  }
}

</script>