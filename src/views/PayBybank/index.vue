<template>
  <div class="flex-center">
    <Processing @close="showProcessing=false" :count="count" title="Confirming your transfer" text="" v-if="showProcessing" />
    <div class="card" v-else>
      <div class="">
        <IconView icon="back" />
        <div class="mgt-4">
          <span class="subtitle-2-semibold"> Bank transfer details</span>
        </div>

        <div class="direction-flex mgt-2">
          <span class="body-2-regular text-gray70">Amount to transfer</span>
          <span class="spacer"></span>
          <span class="body-1-semibold text-gray90"> {{ getBupayload.currency }} {{getBupayload.amount }}</span>
        </div>
      </div>

      <hr class="mgt-7">

      <div class="mgt-6">
        <span class="body-2-regular">To complete your payment, transfer  <span class="body-1-semibold text-gray90">{{ getBupayload.currency }} {{getBupayload.amount }} </span> the account details shown, then click <span class="body-1-semibold text-gray90">“Confirm transfer”</span> once you’re done.</span>
      </div>
   
      <AccountsDisplay
        v-model="account"
        :accounts="accounts"
        class="mgt-6"
      />

      <div class="mgt-8 text-center">
        <sendy-btn
          :block="true"
          color="primary"
          text="Confirm Transfer"
          :loading="loading"
          @click="confirm()"
        />
      </div>
    
  </div> 
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import AccountsDisplay from './components/AccountDisplay';
import Processing from '../../components/processing'
import paymentGenMxn from '../../mixins/paymentGenMxn';

export default {
  name: 'PayByBank',
  mixins: [paymentGenMxn],
  components: {
    AccountsDisplay,
    Processing,
  },
  data() {
    return {
      loading: false,
      showProcessing: false,
      count: false,
      account: 3343545454545,
      accounts: [
        {
          account: 3343545454545,
          bank: 'SunTrust',
          primary: true,
        },
        {
          account: 33435454345545,
          bank: 'Equity',
          primary: false,
        },
        {
          account: 33435454345535,
          bank: 'Polaris',
          primary: false,
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  watch: {
    getVirtualAccounts(val) {
      this.accounts = val;
    },
    getSelectedVirtualAccount(val) {
      this.account = account;
    }
  },
  mounted() {
    this.getAccounts();
  },
  methods: {
    ...mapMutations(['setErrorText']),
    confirm() {
      this.loading = true;
      this.showProcessing = true;
      this.count = true;
      setTimeout(() => {
        this.loading = false;
        this.showProcessing = false;
        this.setErrorText("{Error message from OnePipe}");
        this.$router.push({ name: 'FailedView'});
      }, 2000);
    }
  }
}
</script>

<style scoped>
.input-label {
  font-family: 'Nunito' 'Sans';
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  letter-spacing: 0.005em;
  color: #606266;
}

.select-input {
  display: block;
  height: 40px;
  width: -webkit-fill-available;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.bank-account {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  height: 100px;
  background: rgba(211, 221, 246, 0.4);
  border-radius: 8px;
}



</style>