<template>
  <div class="flex-center">
    <Processing
      @close="finishProcessing"
      :count="count"
      :title="title"
      :countDownStart="countDown"
      :text="processingText"
      v-if="showProcessing"
    />
    <div class="card" v-else>
      <div class="">
        <IconView icon="back" />
        <div class="mgt-4">
          <span class="subtitle-2-semibold">
            {{ $translate("bank_transfer_details") }}</span
          >
        </div>

        <div class="direction-flex mgt-2">
          <span class="body-2-regular text-gray70">{{
            $translate("amount_to_transfer")
          }}</span>
          <span class="spacer"></span>
          <span class="body-1-semibold text-gray90">
            {{ getBupayload.currency }} {{ $formatCurrency(topupAmount) }}</span
          >
        </div>
      </div>

      <hr class="mgt-7" />

      <div class="mgt-6">
        <span class="body-2-regular"
          >{{ $translate("complete_your_payment_transfer") }}
          <span class="body-1-semibold text-gray90"
            >{{ getBupayload.currency }} {{ $formatCurrency(topupAmount) }}
          </span>
          {{ $translate("account_details_shown") }}
          <span class="body-1-semibold text-gray90"
            >“{{ $translate("confirm_transfer") }}”</span
          >
          {{ $translate("once_done") }}</span
        >
      </div>

      <AccountsDisplay
        v-model="account"
        :accounts="getVirtualAccounts"
        class="mgt-6"
      />

      <div class="mgt-8 text-center">
        <sendy-btn
          :block="true"
          color="primary"
          :text="$translate('confirm_transfer')"
          :loading="loading"
          @click="confirm()"
        />
      </div>
      <FailedTransferModal
        :show="showFailedTransfer"
        @close="showFailedTransfer = false"
      />
      <InsufficientTransferModal
        :show="showInsufficientTransfer"
        @close="showInsufficientTransfer = false"
        :amountDue="topupAmount"
        :lastTransferAmount="lastTransferAmount"
        :pendingAmount="pendingAmount"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import AccountsDisplay from "./components/AccountDisplay";
import Processing from "../../components/processing";
import FailedTransferModal from "./components/modals/FailedTransferModal";
import InsufficientTransferModal from "./components/modals/InsufficientTransferModal";
import { useState } from '../../hooks/useState';
import { useGlobalProp } from '../../hooks/globalProperties';
import { useStore } from 'vuex';
import { usePayBybankSetup } from '../../hooks/payBybankSetup';
import { useSegement } from '../../hooks/useSegment';

const { getBupayload } = useState();
const { t } = useGlobalProp();
const store = useStore();
const { commonTrackPayload } = useSegement();

const loading =  ref(false);
const showProcessing=  ref(false);
const title = t("confirming_transfer");
const processingText = ref('');
const count = ref(false);
const countDown = ref(600);
const account = ref("");
const balance = ref(0);
const poll_count =  ref(0);
const poll_limit = ref(600);
const errorText = ref("");
const showFailedTransfer = ref(false);
const showInsufficientTransfer = ref(false);
const amountDue = ref(0);
const lastTransferAmount = ref(0);
const pendingAmount = ref(0);

const topupAmount = computed(() => {
  const amount = getBupayload.value.amount - balance.value;
  return amount < 0 ? 0 : amount;
});

const getVirtualAccounts = computed(() => store.getters.getVirtualAccounts);
const getSelectedVirtualAccount = computed(() => store.getters.getSelectedVirtualAccount);

watch(getSelectedVirtualAccount,  (val) => {
  account.value = val;
});

const { getBalance, getAccounts } = usePayBybankSetup();

onMounted( async () => {
  showProcessing.value = true;
  title.value = "";
  processingText.value = "Loading ...";
  getBupayload.value.pay_direction !== "PAY_ON_DELIVERY" ? await getAccounts() : null;
  balance.value = await getBalance();
  account = getSelectedVirtualAccount.value;
  showProcessing.value = false;
  title.value = t("confirming_transfer");
  processingText.value = "";
});


const confirm = () => {
  loading.value = true;
  showProcessing.value = true;
  count.value = true;
  window.analytics.track("Tap Confirm Payment",  {
    ...commonTrackPayload(),
    payment_method: 'Pay with Transfer',
    amount: topupAmount.value,
    currency: getBupayload.value.currency,
  });
  pollbalance();
};

const finishProcessing = () => {
  showProcessing.value = false;
  loading.value = false;
  poll_count.value = poll_limit;
  showFailedTransfer.value = true;
};

const pollbalance = () => {
  poll_count.value = 0;
  for (let local_count = 0; local_count < poll_limit.value; local_count++) {
    (function (local_count) {
      setTimeout(() => {
        if (local_count === poll_limit.value) {
          local_count = poll_limit.value;
          showProcessing.value = false;
          loading.value = false;
          showFailedTransfer.value = true;
          window.analytics.track("Pay with Transfer Transfer Failed",  {
            ...commonTrackPayload(),
            amount: topupAmount(),
            currency: getBupayload.value.currency,
            payment_method: 'Pay with Transfer'
          });
          return;
        }

        getBalanceP();
        if (local_count === poll_limit.value - 1) {
          getBalanceP();
          showProcessing.value = false;
          loading.value = false;
          showFailedTransfer.value = true;
          window.analytics.track("Pay with Transfer Transfer Failed",  {
            ...commonTrackPayload(),
            amount: topupAmount.value,
            currency: getBupayload.value.currency,
            payment_method: 'Pay with Transfer'
          });
          return;
        }
      }, 30000 * local_count);
    })(local_count);
  }
};

const getBalanceP = async ()  => {
  const bal = await getBalance();

  if (getBupayload.amount <= bal) {
    poll_count.value = poll_limit.value;
    window.analytics.track("Payment processed successfully", {
      ...commonTrackPayload(),
      message: t("transfer_successful"),
      payment_method: 'Pay with Transfer'
    });
    router.push({
      name: "SuccessView",
      params: {
        transferredAmount: topupAmount.value,
        title: t("transfer_successful"),
      },
    });
    return;
  }

  if (balance.value !== bal) {
    poll_count.value = poll_limit.value;
    amountDue = topupAmount;
    lastTransferAmount.value =
      parseFloat(bal) - parseFloat(balance.value);
    pendingAmount.value =
      parseFloat(topupAmount.value) - parseFloat(lastTransferAmount.value);
    showProcessing.value = false;
    showInsufficientTransfer.value = true;
    loading.value = false;
    window.analytics.track("Pay with Transfer Transfer Insufficient",  {
      ...commonTrackPayload(),
      amount: amountDue.value,
      currency: getBupayload.value.currency,
      transfer_amount: lastTransferAmount.value,
      payment_method: 'Pay with Transfer'
    });
  }
  balance.value = bal; 
};

// export default {
//   name: "PayByBank",
//   mixins: [paymentGenMxn],
//   components: {
//     AccountsDisplay,
//     Processing,
//     FailedTransferModal,
//     InsufficientTransferModal,
//   },
//   data() {
//     return {
//       loading: false,
//       showProcessing: false,
//       title: this.$translate("confirming_transfer"),
//       processingText: "",
//       count: false,
//       countDown: 600,
//       account: "",
//       balance: 0,
//       poll_count: 0,
//       poll_limit: 60,
//       errorText: "",
//       showFailedTransfer: false,
//       showInsufficientTransfer: false,
//       amountDue: 0,
//       lastTransferAmount: 0,
//       pendingAmount: 0,
//     };
//   },
//   computed: {
//     ...mapGetters(["getBupayload"]),
//     topupAmount() {
//       const amount = this.getBupayload.amount - this.balance;
//       return amount < 0 ? 0 : amount;
//     },
//   },
//   watch: {
//     getSelectedVirtualAccount(val) {
//       this.account = val;
//     },
//   },
//   async mounted() {
//     this.showProcessing = true;
//     this.title = "";
//     this.processingText = "Loading ...";
//     await this.getAccounts();
//     await this.getBalance();
//     this.account = this.getSelectedVirtualAccount;
//     this.showProcessing = false;
//     this.title = this.$translate("confirming_transfer");
//     this.processingText = "";
//   },
//   methods: {
//     ...mapMutations(["setErrorText"]),
//     async getBalance() {
//       const fullPayload = {
//         url: `/api/v3/onepipe/balance/?entityId=${this.getBupayload.entity_id}&userId=${this.getBupayload.user_id}&countryCode=${this.getBupayload.country_code}`,
//       };

//       const response = await this.$paymentAxiosGet(fullPayload);
//       this.balance = response.availableBalance;
//     },
//     confirm() {
//       this.loading = true;
//       this.showProcessing = true;
//       this.count = true;

//       window.analytics.track("Tap Confirm Payment",  {
//         ...this.commonTrackPayload,
//         payment_method: 'Pay with Transfer',
//         amount: this.topupAmount,
//         currency: this.getBupayload.currency,
//       });
      
//       this.pollbalance();
//     },
//     async finishProcessing() {
//       this.showProcessing = false;
//       this.loading = false;
//       this.poll_count=this.poll_limit;
//       this.showFailedTransfer = true;
//     },
//     pollbalance() {
//       this.poll_count = 0;
//       for (let poll_count = 0; poll_count < this.poll_limit; poll_count++) {
//         const that = this;
//         (function (poll_count) {
//           setTimeout(() => {
//             if (that.poll_count === that.poll_limit) {
//               poll_count = that.poll_limit;
//               that.showProcessing = false;
//               that.loading = false;
//               that.showFailedTransfer = true;
//               window.analytics.track("Pay with Transfer Transfer Failed",  {
//                 ...that.commonTrackPayload,
//                 amount: that.topupAmount,
//                 currency: that.getBupayload.currency,
//                 payment_method: 'Pay with Transfer'
//               });
//               return;
//             }

//             that.getBalanceP();
//             if (poll_count === that.poll_limit - 1) {
//               that.getBalanceP();
//               that.showProcessing = false;
//               that.loading = false;
//               that.showFailedTransfer = true;
//               window.analytics.track("Pay with Transfer Transfer Failed",  {
//                 ...that.commonTrackPayload,
//                 amount: that.topupAmount,
//                 currency: that.getBupayload.currency,
//                 payment_method: 'Pay with Transfer'
//               });
//               return;
//             }
//           }, 30000 * poll_count);
//         })(poll_count);
//       }
//     },
//     async getBalanceP() {
//       const payload = {
//         entityId: this.getBupayload.entity_id,
//         userId: this.getBupayload.user_id,
//         countryCode: this.getBupayload.country_code,
//       }

//       const fullPayload = {
//         params: payload,
//         url: `/api/v3/onepipe/balance`,
//       };

//       const response = await this.$paymentAxiosGet(fullPayload);

//       if (this.getBupayload.amount <= response.availableBalance) {
//         this.poll_count = this.poll_limit;
//         window.analytics.track("Payment processed successfully", {
//           ...this.commonTrackPayload(),
//           message: this.$translate("transfer_successful"),
//           payment_method: 'Pay with Transfer'
//         });
//         this.$router.push({
//           name: "SuccessView",
//           params: {
//             transferredAmount: this.topupAmount,
//             title: this.$translate("transfer_successful"),
//           },
//         });
//         return;
//       }

//       if (this.balance !== response.availableBalance) {
//         this.poll_count = this.poll_limit;
//         this.amountDue = this.topupAmount;
//         this.lastTransferAmount =
//           parseFloat(response.availableBalance) - parseFloat(this.balance);
//         this.pendingAmount =
//           parseFloat(this.topupAmount) - parseFloat(this.lastTransferAmount);
//         this.showProcessing = false;
//         this.showInsufficientTransfer = true;
//         this.loading = false;
//         window.analytics.track("Pay with Transfer Transfer Insufficient",  {
//           ...this.commonTrackPayload,
//           amount: this.amountDue,
//           currency: this.getBupayload.currency,
//           transfer_amount: this.lastTransferAmount,
//           payment_method: 'Pay with Transfer'
//         });
//       }
//       this.balance = response.availableBalance; 
//     },
//   },
// };
</script>

<style scoped>
.input-label {
  font-family: "Nunito" "Sans";
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
