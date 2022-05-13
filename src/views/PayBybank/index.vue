<template>
  <div class="flex-center">
    <Processing
      @close="showProcessing = false"
      :count="count"
      :title="title"
      :text="processingText"
      v-if="showProcessing"
    />
    <div class="card" v-else>
      <div class="">
        <IconView icon="back" />
        <div class="mgt-4">
          <span class="subtitle-2-semibold">
            {{ $t("bank_transfer_details") }}</span
          >
        </div>

        <div class="direction-flex mgt-2">
          <span class="body-2-regular text-gray70">{{
            $t("amount_to_transfer")
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
          >{{ $t("complete_your_payment_transfer") }}
          <span class="body-1-semibold text-gray90"
            >{{ getBupayload.currency }} {{ getBupayload.amount }}
          </span>
          {{ $t("account_details_shown") }}
          <span class="body-1-semibold text-gray90"
            >“{{ $t("confirm_transfer") }}”</span
          >
          {{ $t("once_done") }}</span
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
          :text="$t('confirm_transfer')"
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
        :amountDue="amountDue"
        :lastTransferAmount="lastTransferAmount"
        :pendingAmount="pendingAmount"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import AccountsDisplay from "./components/AccountDisplay";
import Processing from "../../components/processing";
import paymentGenMxn from "../../mixins/paymentGenMxn";
import FailedTransferModal from "./components/modals/FailedTransferModal";
import InsufficientTransferModal from "./components/modals/InsufficientTransferModal";

export default {
  name: "PayByBank",
  mixins: [paymentGenMxn],
  components: {
    AccountsDisplay,
    Processing,
    FailedTransferModal,
    InsufficientTransferModal,
  },
  data() {
    return {
      loading: false,
      showProcessing: false,
      title: this.$t("confirming_transfer"),
      processingText: "",
      count: false,
      account: "",
      balance: 0,
      poll_count: 0,
      poll_limit: 30,
      errorText: "",
      showFailedTransfer: false,
      showInsufficientTransfer: false,
      amountDue: 0,
      lastTransferAmount: 0,
      pendingAmount: 0,
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
    topupAmount() {
      const amount = this.getBupayload.amount - this.balance;
      return amount < 0 ? 0 : amount;
    },
  },
  watch: {
    getSelectedVirtualAccount(val) {
      this.account = val;
    },
  },
  async mounted() {
    this.showProcessing = true;
    this.title = "";
    this.processingText = "Loading ...";
    await this.getAccounts();
    await this.getBalance();
    this.showProcessing = false;
    this.title = this.$t("confirming_transfer");
    this.processingText = "";
  },
  methods: {
    ...mapMutations(["setErrorText"]),
    async getBalance() {
      const fullPayload = {
        url: `/api/v3/onepipe/balance/?entityId=${this.getBupayload.entity_id}&userId=${this.getBupayload.user_id}&countryCode=${this.getBupayload.country_code}`,
      };

      const response = await this.$paymentAxiosGet(fullPayload);
      this.balance = response.availableBalance;
    },
    confirm() {
      this.loading = true;
      this.showProcessing = true;
      this.count = true;

      window.analytics.track("Confirm Pay By Bank Transfer",  {
        ...this.commonTrackPayload,
        amount: this.topupAmount,
        currency: this.getBupayload.currency,
      });
      
      this.pollbalance();
    },
    pollbalance() {
      this.poll_count = 0;
      for (let poll_count = 0; poll_count < this.poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === that.poll_limit) {
              poll_count = that.poll_limit;
              return;
            }

            that.getBalanceP();
            if (poll_count === that.poll_limit - 1) {
              that.showProcessing = false;
              that.loading = false;
              that.showFailedTransfer = true;
              window.analytics.track("Pay By Bank Transfer Failed",  {
                ...that.commonTrackPayload,
                amount: that.topupAmount,
                currency: that.getBupayload.currency,
              });
              that.getBalance();
              return;
            }
          }, 10000 * poll_count);
        })(poll_count);
      }
    },
    async getBalanceP() {
      const payload = {
        entityId: this.getBupayload.entity_id,
        userId: this.getBupayload.user_id,
        countryCode: this.getBupayload.country_code,
      }

      const fullPayload = {
        params: payload,
        url: `/api/v3/onepipe/balance`,
      };

      const response = await this.$paymentAxiosGet(fullPayload);

      if (this.getBupayload.amount <= response.availableBalance) {
        this.poll_count = this.poll_limit;
        this.$router.push({
          name: "SuccessView",
          params: {
            transferredAmount: this.topupAmount,
            title: this.$t("transfer_successful"),
          },
        });
        return;
      }

      if (this.balance !== response.availableBalance) {
        this.poll_count = this.poll_limit;
        this.amountDue = this.topupAmount;
        this.lastTransferAmount =
          parseFloat(response.availableBalance) - parseFloat(this.balance);
        this.pendingAmount =
          parseFloat(this.topupAmount) - parseFloat(this.lastTransferAmount);
        this.showInsufficientTransfer = true;
        window.analytics.track("Pay By Bank Transfer Insufficient",  {
          ...this.commonTrackPayload,
          amount: this.amountDue,
          currency: this.getBupayload.currency,
          transfer_amount: this.lastTransferAmount
        });
      }
      this.balance = response.availableBalance;
    },
  },
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