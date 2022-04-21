<template>
  <div class="">
    <div class="mgt-4">
      <span class="input-label">{{ $t("available_banks") }}</span>
      <div class="mgt-1">
        <select
          type="text"
          v-model="account"
          @input="handleInput"
          class="select-input"
          :placeholder="$t('select_payment_methods')"
        >
          <template>
            <option
              v-for="(obj, index) in accounts"
              :key="index"
              :value="obj.account_number"
            >
              {{ obj.bank_name }}
            </option>
          </template>
        </select>
      </div>
    </div>

    <div class="bank-account mgt-6" v-if="selectedAccount">
      <span class="text-body-1"> {{ selectedAccount.bank_name }} </span>
      <div class="mgt-3 direction-flex" @click="handleCopy">
        <span class="title-regular-2" id="account">{{
          selectedAccount.account_number
        }}</span>
        <div class="mgl-3 link">
          <svg
            width="10"
            height="12"
            viewBox="0 0 10 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 0.5H1C0.45 0.5 0 0.95 0 1.5V8C0 8.275 0.225 8.5 0.5 8.5C0.775 8.5 1 8.275 1 8V2C1 1.725 1.225 1.5 1.5 1.5H6.5C6.775 1.5 7 1.275 7 1C7 0.725 6.775 0.5 6.5 0.5ZM6.795 2.795L9.21 5.21C9.395 5.395 9.5 5.65 9.5 5.915V10.5C9.5 11.05 9.05 11.5 8.5 11.5H2.995C2.445 11.5 2 11.05 2 10.5L2.005 3.5C2.005 2.95 2.45 2.5 3 2.5H6.085C6.35 2.5 6.605 2.605 6.795 2.795ZM6.5 6H8.75L6 3.25V5.5C6 5.775 6.225 6 6.5 6Z"
              fill="#324BA8"
            />
          </svg>

          <span class="mgl-1">{{ $t("copy") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AccountsDisplay",
  props: ["value", "accounts"],
  data() {
    return {
      loading: false,
      account: this.value,
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
    selectedAccount() {
      const bank = this.accounts.filter(
        (el) => el.account_number === this.account
      );
      return bank[0];
    },
  },
  watch: {
    value(val) {
      this.account = val;
    },
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
    },
    handleCopy() {
      const cb = navigator.clipboard;
      const span = document.getElementById("account");
      cb.writeText(span.innerText).then(() => {
        this.$paymentNotification({ text: this.$t("copied") });
      });
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
