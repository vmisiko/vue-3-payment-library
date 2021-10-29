<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>

      <div class="">
        <span class="text-caption-1"> Amount to pay</span>

        <div class="float-right">
          <span class="text-caption-1">
            {{ getBupayload.currency }} {{ $formatCurrency(getBupayload.amount) }}
          </span>
        </div>

        <hr />
        
        <IconView icon="mpesa" width="68px" height="48px" />

        <div class="mgt-3">
          <span class="text-list-title"> Payment instructions</span>
          <div class="mgt-4 pdl-4">
            <ol style="padding-left: 0px;">
              <li class="text-body-2">Open M-PESA on you phone</li>
              <li class="text-body-2 mgt-2">
                Select Lipa na M-PESA > Pay Bill 
              </li>
              <li class="text-body-2 mgt-2">
                Enter Business no. <span class="text-bold"> {{ getBupayload.paybill_no }} </span>
              </li>
              <li class="text-body-2 mgt-2">
                Enter Account no. <span class="text-bold"> {{ getBupayload.txref }} </span>
              </li> 
              <li class="text-body-2 mgt-2">
                Enter Amount no. <span class="text-bold"> {{ getBupayload.currency }} {{ $formatCurrency(getBupayload.amount) }} </span>
              </li>   
              <li class="text-body-2 mgt-2">
                Enter your M-PESA PIN and click OK to send
              </li>   
              <li class="text-body-2 mgt-2">
                You’ll receive a confirmation SMS from M-PESA
              </li>    
              <li class="text-body-2 mgt-2">
                Click "Complete payment" below to continue
              </li>  
            </ol>
            
          </div>
        </div>

        <div class="mgt-8">
          <sendy-btn 
          :loading="loading"
          color='primary'
          class="float-right"
          @click="pollC2B"
          >
            Complete payment
          </sendy-btn>
        </div>

    </div>
    <TimerModal :show="showTimer" />
    </div>  
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TopInfo from '../components/topInfo';
import TimerModal from '../components/modals/timerModal';
import paymentGenMxn from '../mixins/paymentGenMxn';

export default {
  name: 'MpesaC2B',
  components: {
    TopInfo,
    TimerModal,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: 'back',
      title: 'Pay with M-PESA',
      loading: false,
      poll_count: 0,
      poll_limit: 6,
      showTimer: false,
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  methods: {
    ...mapMutations(['setErrorText']),
    pollC2B() {
      this.poll_count = 0;
      this.showTimer = true;
      const poll_limit = 6;

      window.analytics.track('Complete Payment', {
        ...this.commonTrackPayload(),
      });

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
              that.showTimer = false;
              that.promptInfo = false,
              that.setErrorText('Failed to charge using Mpesa. Please try again.');
              that.$router.push({name: 'FailedView', params: { mpesa: 'mpesa'} });
              return;
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },

    async TransactionIdStatus() {
      const payload = {
        url: `/api/v1/process/refstatus/${this.getBupayload.txref}`,
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
              this.showTimer = false;
              this.promptInfo = false,
              this.$router.push({name: 'SuccessView', params: { mpesaCode: res.receipt_no } } );
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.setErrorText(res.message);
              this.showTimer = false;
              this.promptInfo = false,
              this.$router.push({name: 'FailedView', params: { mpesa: 'mpesa'}  });
              break;
            case 'pending':
              break;
            default:
              break;
          }
          return res;
        }

        this.poll_count = this.poll_limit;
        this.loading = false;
        this.showTimer = false;
        this.promptInfo = false,
        this.setErrorText(res.message);
        this.$router.push({name: 'FailedView', params: { mpesa: 'mpesa'} });
      })
    }
  }
}
</script>

<style lang="scss">
.text-bold {
  font-family: Nunito;
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;
  color: #606266;
}
</style>
