<template>
  <div class="flex-center">
    <NoOptionsModal v-if="!defaultPaymentMethod" />
    <div v-else>
       <Processing v-if="loading" :count="count" :text="loading_text" />
      <div v-else>
        <AdditionalCardFields 
          :additionalData="additionalData" 
          :transaction_id="transaction_id"
          v-if="showAdditionalCardFields" 
          @continue="handleContinue"
          @continue3DS="handleContinue3DS"
        />

        <div class="card" :class="{'card-min': paymentStatus }" v-else>
          <IconView icon='back'/>

          <TopInfo class="mgt-9" :icon="icon" :title="title" :subtitle="subtitle" />

          <PaymentDetail v-if="defaultPaymentMethod" :currency="currency" :amount="amount" :paymentMethod="defaultPaymentMethod"  :paymentStatus="paymentStatus" />

          <div class="mgt-8 text-right">
            <sendy-btn 
              :block="true"
              :loading="loading"
              color='primary'
              @click="submitRetry"
            >
              {{ $t('retry_payment') }}
            </sendy-btn>
          </div>
        </div>
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
import Processing from '../components/processing';
import NoOptionsModal from '../components/modals/noOptionsModal';

export default {
  name: 'ResolvePaymentView',
  components: {
    TopInfo,
    PaymentDetail,
    ErrorModal,
    AdditionalCardFields,
    Processing,
    NoOptionsModal,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: 'warning',
      title: this.$t('payment_unsuccessful'),
      subtitle: '',
      paymentStatus: true,
      currency: '',
      amount: 0.00,
      loading: false,
      loading_text: 'Confirming your payment. This may takes a moment.',
      defaultPaymentMethod: null,
      errorText: this.$t('could_not_process'),
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      showTransactionLimit: false,
      showAdditionalCardFields: false,
      additionalData: null,
      showErrorModal: false,
      count: false,
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
    this.subtitle = this.getBupayload.resolve_payment_message;
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
    async submitRetry() {
      this.startResponseTime = new Date(); 

      window.analytics.track('Try again after Failed Payment', {
        ...this.commonTrackPayload(),
      });

      this.loading = true;
      const payload = {
        bulk_reference_number: this.getBupayload.bulk_reference_number,
        user_id: this.getBupayload.user_id,
      }

      const fullPayload = {
        url: '/bulk/retry',
        params: payload,
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      this.transaction_id = response.transaction_id;
      if (response.status) {
        switch (response.transaction_status) {
          case 'pending':
            this.pollCard();
            break;
          case 'success':
            this.loading = false;
            this.$paymentNotification({
              text: this.$t('card_details_added')
            });
            this.$router.push('/choose-payment');
            this.loading = false;
            break;
          default:
            break;
        }
        return;
      }
      this.setErrorText(response.message);
      this.loading = false;
    },

    pollCard() {
      this.loading = true;
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
        this.poll_count = this.poll_limit;
        this.showAdditionalCardFields = false;
        this.loading = false;
        this.errorText = res.message;
        this.showErrorModal= true;
      })
    },

    handleContinue(val) {
      this.showAdditionalCardFields = false;
      if (val) {
        this.loading = true;
        this.pollCard();
        this.count = true;
        return;
      }
      this.loading = false;
      this.errorText = this.$t('failed_to_collect_card_details');
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
      this.loading = true;
      const payload = {
        transaction_id: this.transaction_id,
        tds: true,
      }

      const fullPayload = {
        params: payload,
        url: '/api/v2/submit_info'
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;
      if (response.status) {
        switch (response.transaction_status) {
            case 'pending':
              this.pollCard();
              this.count = true;
              break;
            case 'success':
              this.showProcessing = false;
              this.$paymentNotification({
                text: this.$t('card_details_added')
              });
              this.$router.push('/choose-payment');
              this.loading = false;
              break; 
            case 'failed':
              this.loading = false;
              this.poll_count  = this.poll_limit;
              this.showProcessing = false;
              this.errorText = this.$t('failed_to_collect_card_details');
              this.showErrorModal= true;
              break; 
            default:
              break;
        };
        return;
      }
      this.poll_count  = this.poll_limit;
      this.loading = false;
      this.showProcessing = false;
      this.errorText = this.$t('failed_to_collect_card_details');
      this.showErrorModal= true;
    },

    handleErrorModalClose() {
      this.showErrorModal = false;
      this.showAdditionalCardFields = false;
    }
  }
}

</script>
