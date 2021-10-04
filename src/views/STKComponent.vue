<template>
  <div class="flex-center">

    <div class="card-min">
      <TopInfo :icon="icon" :title="title"/>

      <div class="mt-8">
        <span class="text-caption-1"> Amount to pay</span>

        <div class="float-right">
           <span class="text-caption-1">
            {{ getBupayload.currency }} {{ $formatCurrency(getBupayload.amount) }}
          </span>
        </div>

        <hr />

        <div class="mt-8">
          <label class="text-caption-2 ">M-PESA payment number</label>
          <div class="mt-1">
            <input 
              type="text" 
              v-model="phone" 
              class="phone-input"
              placeholder="0700 00000"
              required
             >
             <span class="text-caption-2 text-error" v-if="error"> {{ error }}</span>
          </div>
          
        </div>

        <div class="alert mt-10" v-show="promptInfo">
          <span class="text-caption-2 pt-2 text-midnightBlue20">You'll receive a prompt to enter your M-PESA PIN</span>
        </div>

        <div class="mt-8">
          <sendy-btn 
            color='primary'
            class="float-right"
            @click="submit"
            :loading="loading"
          >
            continue
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

export default {
  name: 'STKComponent',
  components: {
    TopInfo,
    TimerModal,
  },
  data() {
    return {
      icon: 'back',
      title: 'Pay with M-PESA',
      phone: null,
      promptInfo: false,
      error: '',
      loading: false,
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      showTimer: false,
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  watch: {
    phone(val) {
      if (val && val.length > 8) {
        this.error = '';
      }
    }
  },
  methods: {
    ...mapMutations(['setErrorText']),
     async submit() {
      if (!this.phone) {
        this.error = 'Phone number is required';
        return;
      }

      this.loading = true;
      this.showTimer = true;
      this.promptInfo = true;
      const payload = {
        country: this.getBupayload.country_code,
        amount: this.getBupayload.amount,
        txref: this.getBupayload.txref,
        userid: this.getBupayload.user_id,
        currency: this.getBupayload.currency,
        bulk: this.getBupayload.bulk,
        entity: this.getBupayload.entity_id,
        firstname: "",
        lastname: "",
        phonenumber: this.phone,
      }

      const fullPayload = {
        url: '/api/v1/process',
        params: payload,
      }
      
      const response = await this.$paymentAxiosPost(fullPayload);
      this.transaction_id = response.transaction_id;
      if (response.status) {
        this.pollMpesa();
        return;
      }
      this.promptInfo = false,
      this.showTimer = false;
      this.loading = false;
      this.setErrorText(response.message);
      this.$router.push({name: 'FailedView'});
    },
    phoneValidation() {
    return;
    },
    pollMpesa() {
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
              this.showTimer = false;
              this.promptInfo = false,
              this.setErrorText('Failed to charge using Mpesa. Please try again.');
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
              this.$paymentNotification({
                text: res.message,
              });
              this.loading = false;
              this.showTimer = false;
              this.promptInfo = false,
              this.$router.push({name: 'SuccessView', params: { mpesaCode: res.receipt_no }});
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.setErrorText(res.message);
              this.showTimer = false;
              this.promptInfo = false,
              this.$router.push({name: 'FailedView'});
              break;
            case 'pending':
              break;
            default:
              break;
          }
          return res;
        }
        this.loading = false;
        this.showTimer = false;
        this.promptInfo = false,
        this.setErrorText(res.message);
        this.$router.push({name: 'FailedView'});
      })
    }
  }
}
</script>

<style lang="scss">
.phone-input {
  padding: 8px;
  height: 40px;
  background: #FFFFFF;
  border: 0.5px solid #C0C4CC;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}
.alert {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
  position: static;
  width: 296px;
  height: 32px;
  left: 0px;
  top: 268px;
  background: rgba(211, 221, 246, 0.5);
  border-radius: 4px;
}
</style>