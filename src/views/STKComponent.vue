<template>
  <div class="flex-center">
    <div class="card-min">
      <TopInfo :icon="icon" :title="title" />

      <div class="mgt-8">
        <span class="text-caption-1"> Amount to pay</span>

        <div class="float-right">
          <span class="text-caption-1">
            {{ getBupayload.currency }}
            {{ $formatCurrency(getBupayload.amount) }}
          </span>
        </div>

        <hr />

        <div v-if="!redirect">
          <div class="mgt-8">
            <div class="direction-flex">
              <span class="text-caption-2">Country Code</span>
              <label class="mgl-11 text-caption-2">{{
                defaultPaymentMethod.pay_method_id === 1
                  ? "M-PESA payment number"
                  : "Phone Number"
              }}</label>
            </div>

            <div class="mgt-1">
              <vue-tel-input
                v-model="phone"
                autoFormat
                :defaultCountry="getBupayload.country_code"
                :dropdownOptions="dropdownOptions"
                mode="national"
                :invalidMsg="$t('phone_number_invalid')"
                @validate="validatePhone"
              >
              </vue-tel-input>
              <span class="text-caption-2 text-error" v-if="error">
                {{ error }}</span
              >
            </div>
          </div>

          <div class="alert mgt-10">
            <span class="text-caption-2 pdt-2 text-midnightBlue20">{{
              defaultPaymentMethod.pay_method_id === 1
                ? $t("mpesa_prompt")
                : $t("mobile_prompt")
            }}</span>
          </div>

          <div class="mgt-8">
            <sendy-btn
              color="primary"
              class="float-right"
              @click="submit"
              :loading="loading"
              :disabled="!disable"
            >
              {{ $t("continue") }}
            </sendy-btn>
          </div>
        </div>

        <div class="mgt-8" v-else>
          <sendy-btn color="primary" :block="true" @click="init3DS">
            Click here to continue
          </sendy-btn>
        </div>
      </div>
      <TimerModal :show="showTimer" @close="closeTimer" />
      <MpesaErrorModal :show="showErrorModal" :text="errorText" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { VueTelInput } from "vue-tel-input";
import TopInfo from "../components/topInfo";
import TimerModal from "../components/modals/timerModal";
import MpesaErrorModal from "../components/modals/MpesaErrorModal";

export default {
  name: "STKComponent",
  components: {
    TopInfo,
    TimerModal,
    VueTelInput,
    MpesaErrorModal,
  },
  data() {
    return {
      icon: "back",
      title: this.$t("pay_with_mpesa"),
      phone: null,
      promptInfo: false,
      error: "",
      loading: false,
      transaction_id: null,
      poll_count: 0,
      poll_limit: 30,
      showTimer: false,
      dropdownOptions: {
        disabled: true,
        showFlags: true,
        showDialCodeInSelection: true,
      },
      formattedPhone: null,
      disable: false,
      showErrorModal: false,
      errorText: this.$t("unable_to_send_mpesa_request"),
      defaultPaymentMethod: 1,
      additional_data: null,
      redirect: false,
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
  },
  watch: {
    phone(val) {
      if (val && val.length > 8) {
        this.error = "";
      }
    },
  },
  mounted() {
    this.getDefaultpayMethod();
  },
  methods: {
    ...mapMutations(["setErrorText"]),
    getDefaultpayMethod() {
      this.defaultPaymentMethod = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter((method) => method.default === 1)[0]
        : [];
      this.title =
        this.defaultPaymentMethod.pay_detail_id === 1
          ? this.$t("pay_with_mpesa")
          : `Pay with ${this.defaultPaymentMethod.pay_method_name} Money`;
    },
    async submit() {
      const entrypoint = localStorage.getItem("entry");
      if (entrypoint === "resolve-payment-checkout") {
        this.submitRetry();
        return;
      }

      this.loading = true;
      this.promptInfo = true;
      const payload = {
        country: this.getBupayload.country_code,
        amount: this.getBupayload.amount,
        txref: this.getBupayload.txref,
        userid: this.getBupayload.user_id,
        currency: this.getBupayload.currency,
        bulk: this.getBupayload.bulk,
        entity: this.getBupayload.entity_id,
        firstname: this.getBupayload.firstname,
        lastname: this.getBupayload.lastname,
        paymethod: this.defaultPaymentMethod.pay_method_id,
        phonenumber: this.formattedPhone,
        company_code: this.getBupayload.company_code,
        bulkrefno: this.getBupayload.bulk_reference_number,
        email: this.getBupayload.email,
      };

      const fullPayload = {
        url: "/api/v3/process",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.transaction_id = response.transaction_id;
      if (response.status) {
        if (this.getBupayload.bulk) {
          this.loading = false;
          this.$router.push({
            name: "SuccessView",
            duration: "",
          });
          return;
        }

        if (response.redirect) {
          this.additionalData = response.additional_data;
          this.init3DS();
          return;
        }
        this.pollMpesa();
        return;
      }
      this.promptInfo = false;
      this.showTimer = false;
      this.loading = false;
      this.showErrorModal = true;
    },
    async submitRetry() {
      if (this.getBupayload.bulk) {
        this.bulkretry();
        return;
      }

      this.startResponseTime = new Date();

      this.loading = true;
      const payload = {
        user_id: this.getBupayload.user_id,
        company_code: this.getBupayload.company_code,
        entity: this.getBupayload.entity_id,
        pay_detail_id: this.formattedPhone,
        payment_method: this.defaultPaymentMethod.pay_method_id,
        references: this.getBupayload.references,
      };

      const fullPayload = {
        url: "/api/v3/process/retry",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);

      this.transaction_id = response.transaction_id;
      if (response.status) {
        this.pollMpesa();
        return;
      }
      this.promptInfo = false;
      this.showTimer = false;
      this.loading = false;
      this.showErrorModal = true;
    },
    async bulkretry() {
      this.startResponseTime = new Date();
      this.loading = true;
      const payload = {
        user_id: this.getBupayload.user_id,
        company_code: this.getBupayload.company_code,
        entity: this.getBupayload.entity_id,
        pay_detail_id: this.formattedPhone,
        payment_method: 1,
        references: this.getBupayload.references,
      };

      const fullPayload = {
        url: "/api/v3/bulk/retry",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);

      this.transaction_id = response.transaction_id;
      if (response.status) {
        this.pollMpesa();
        return;
      }
      (this.promptInfo = false), (this.showTimer = false);
      this.loading = false;
      this.showErrorModal = true;
    },
    validatePhone(val) {
      this.formattedPhone = val.valid ? val.number.split("+")[1] : null;
      this.disable = val.valid;
      return;
    },
    pollMpesa() {
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
            if (poll_count === that.poll_limit - 1) {
              that.loading = false;
              that.showTimer = false;
              that.promptInfo = false;
              that.setErrorText(this.$t("failed_to_charge_using_mpesa"));
              that.$router.push({
                name: "FailedView",
                params: { mpesa: "mpesa" },
              });
              return;
            }
          }, 10000 * poll_count);
        })(poll_count);
      }
    },

    async TransactionIdStatus() {
      this.showTimer = true;

      const payload = {
        url: `/api/v1/process/status/${this.transaction_id}`,
      };
      this.$paymentAxiosGet(payload).then((res) => {
        if (res.status) {
          switch (res.transaction_status) {
            case "success":
              this.poll_count = this.poll_limit;
              this.$paymentNotification({
                text: res.message,
              });
              this.loading = false;
              this.showTimer = false;
              this.promptInfo = false;
              this.$router.push({
                name: "SuccessView",
                params: { mpesaCode: res.receipt_no },
              });
              break;
            case "failed":
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.setErrorText(res.message);
              this.showTimer = false;
              this.promptInfo = false;
              this.$router.push({
                name: "FailedView",
                params: { mpesa: "mpesa" },
              });
              break;
            case "pending":
              break;
            default:
              break;
          }
          return res;
        }
        this.loading = false;
        this.poll_count = this.poll_limit;
        this.showTimer = false;
        (this.promptInfo = false), this.setErrorText(res.message);
        this.$router.push({ name: "FailedView", params: { mpesa: "M-Pesa" } });
      });
    },
    closeTimer() {
      this.loading = false;
      this.showTimer = false;
      this.promptInfo = false;
      this.setErrorText(this.$t("unable_to_confirm_mpesa"));
      this.$router.push({ name: "FailedView", params: { mpesa: "mpesa" } });
    },
    init3DS() {
      this.redirect = false;
      const res = !this.additionalData
        ? this.additionalData
        : this.additionalData[0];
      const url = res.field;
      const urlWindow = window.open(url, "");

      if (typeof urlWindow == "undefined") {
        this.redirect = true;
        return;
      }
      const timer = setInterval(() => {
        if (urlWindow.closed) {
          this.pollMpesa();
          clearInterval(timer);
        }
      }, 500);

      setTimeout(() => {
        urlWindow.close();
      }, 180000);
    },
  },
};
</script>

<style lang="scss" scoped>
.phone-input {
  padding: 8px;
  height: 40px;
  background: #ffffff;
  border: 0.5px solid #c0c4cc;
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
.vti__input {
  width: 100%;
  outline: none;
  padding-left: 7px;
  margin-left: 24px !important;
  border: 0.5px solid #c0c4cc !important;
  box-sizing: border-box;
  border-radius: 4px !important;
}
.vti__dropdown {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: relative;
  padding: 7px;
  cursor: pointer;
  border: 1px solid #bbb;
  border: 0.5px solid #dcdfe6;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100px;
  height: 40px;
}
.vue-tel-input {
  border-radius: 3px;
  display: flex;
  // border: 1px solid #bbb;
  border: none !important;
  text-align: left;
}
</style>
