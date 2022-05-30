<template>
  <div class="flex-center">
    <div class="card-mini-full">
      <div class="grid-container">
        <div class="first-row pdr-4 pdt-22">
          <AvatarListView
            icon="success"
            :title="$t('ready_pay_by_bank')"
            :subtitle="$t('during_checkout')"
            class=""
          />
        </div>

        <div class="mgt-8 pdl-6">
          <span class="text-subtitle-1">{{ $t("account_details") }}</span>

          <AccountsDisplay
            v-model="account"
            :accounts="getVirtualAccounts"
            class="mgy-6"
            v-if="account"
          />
        </div>
      </div>

      <div class="direction-flex">
        <span class="spacer"></span>
        <div class="mgt-14">
          <sendy-btn
            color="primary"
            :text="$t('finish_setup')"
            @click="finish"
          ></sendy-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarListView from "./components/AvatarListView";
import AccountsDisplay from "./components/AccountDisplay";
import { mapGetters } from "vuex";
import paymentGenMxn from "../../mixins/paymentGenMxn";

export default {
  name: "AccountReadyView",
  mixins: [paymentGenMxn],
  components: {
    AvatarListView,
    AccountsDisplay,
  },
  data() {
    return {
      account: this.getSelectedVirtualAccount
        ? this.getSelectedVirtualAccount
        : "",
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
  },
  watch: {
    getSelectedVirtualAccount(val) {
      this.account = val;
    },
  },
  async mounted() {
    await this.getAccounts();
    this.account = this.getSelectedVirtualAccount;
  },
  methods: {
    finish() {
      this.$paymentNotification({
        text: this.$t('pay_by_bank_added'),
      });
      this.$router.push({ name: "ChoosePayment" });
    },
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 50% 50%;
}

.first-row {
  border-right: 1px solid #e2e7ed;
}
</style>
