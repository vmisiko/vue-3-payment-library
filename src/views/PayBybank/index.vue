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

        <div class="direction-flex mgt-2" v-if="(topupAmount > 0)">
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

      <div class="mgt-6" v-if="(topupAmount > 0)">
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
      <div class="mgt-6" v-else>
        <span class="body-2-regular"
          >{{ $translate('account_has_sufficient_balance')}}</span
        >
        <span class="body-1-semibold text-gray90"
            >“{{ $translate("confirm_transfer") }}”</span
          >
          <span> {{ $translate("to_complete_payment") }}</span>
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
import { usePayment } from "../../hooks/payment";

const { getBupayload, state } = useState();
const { t, router } = useGlobalProp();
const store = useStore();
const { commonTrackPayload } = useSegement();
const { checkout } = usePayment();

const loading =  ref(false);
const showProcessing=  ref(false);
const title = ref(t("confirming_transfer"));
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
var checkPolltimer;

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
  const bankAccount = getDefaultBankAccount();
  balance.value = await getBalance(bankAccount);
  account.value = getSelectedVirtualAccount.value;
  showProcessing.value = false;
  title.value = t("confirming_transfer");
  processingText.value = "";
});

const getDefaultBankAccount = () => {
  const bankAccount = getVirtualAccounts.value ? getVirtualAccounts.value?.filter((el) => el?.is_primary)[0] : '';
  return bankAccount;
};

const confirm = async () => {
  loading.value = true;
  showProcessing.value = true;
  count.value = true;
  window.analytics.track("Tap Confirm Payment",  {
    ...commonTrackPayload(),
    payment_method: 'Pay with Transfer',
    amount: topupAmount.value,
    currency: getBupayload.value.currency,
  });
  if (topupAmount.value <= 0) {
    await poDCheckout();
    return;
  }
  pollBalance();
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
        if (poll_count.value === poll_limit.value) {
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
        poll_count.value++;
        getBalanceP();
        if (local_count === poll_limit.value - 1) {
          getBalanceP();
          showProcessing.value = false;
          loading.value = false;
          showFailedTransfer.value = true;
          window.analytics.track("Pay with Transfer Failed",  {
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

const pollBalance = () => {
  const waitCountMax = 600
  let waitCount = waitCountMax;
  const checkInterval = 30;
  let timer = 0;
  checkPolltimer = setInterval(() => {
    timer++;
    waitCount--;
    if (timer % checkInterval === 0) {
      getBalanceP();
      if (waitCount <=0)  {
        clearInterval(checkPolltimer);
        showProcessing.value = false;
        loading.value = false;
        showFailedTransfer.value = true;
        window.analytics.track("Pay with Transfer Failed",  {
          ...commonTrackPayload(),
          amount: topupAmount.value,
          currency: getBupayload.value.currency,
          payment_method: 'Pay with Transfer'
        });
      }
    }
  }, 1000);
}
const poDCheckout = async () => {
  const bankAccount = getDefaultBankAccount();
  const payload = {
        country: getBupayload.value.country_code,
        amount: getBupayload.value.amount,
        txref: getBupayload.value.txref,
        userid: getBupayload.value.user_id,
        currency: getBupayload.value.currency,
        bulk: getBupayload.value.bulk,
        entity: getBupayload.value.entity_id,
        company_code: getBupayload.value.company_code,
        paymethod: state.defaultPaymentMethod.pay_method_id,
        platform: 'web',
        pay_direction: getBupayload.value.pay_direction,
        phonenumber: getBupayload.value?.phonenumber ?? state.defaultPaymentMethod?.phonenumber,
        test: getBupayload?.value?.test ?? false,
        pay_detail_id: state.defaultPaymentMethod.pay_detail_id,
        bank: bankAccount.bank_code,
        bank_account: bankAccount.account_number,
        email: getBupayload.value.email,
        firstname: getBupayload.value.firstname,
        lastname: getBupayload.value.lastname,
  };
  await checkout(payload);
}

const getBalanceP = async ()  => {
  const bankAccount = getDefaultBankAccount();
  const bal = await getBalance(bankAccount);

  if (bal >= getBupayload.value.amount ) {
    clearInterval(checkPolltimer);
    if (getBupayload.value.isPayOnDelivery()) {
      await poDCheckout();
      return;
    }
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

  if (bal < getBupayload.value.amount  && bal > balance.value) {
    clearInterval(checkPolltimer);
    amountDue.value = topupAmount.value;
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
