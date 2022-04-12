<template>
  <div class="flex-center">
    <div>
      <Processing v-if="getLoading" :text="loadingText" :count="count" />
      <div v-if="!getLoading">
        <AdditionalCardFields
          :additionalData="additionalData"
          :transaction_id="transaction_id"
          v-if="showAdditionalCardFields"
          @continue="handleContinue"
          @continue3DS="handleContinue3DS"
        />

        <div class="card" v-else>
          <TopInfo :icon="icon" :title="title" />

          <span v-if="creditCards.length !== 0" class="mgt-2 text-overline">{{
            $t("credit_card_payment")
          }}</span>
          <div class="" v-if="creditCards.length !== 0">
            <div
              v-for="(card, index) in creditCards"
              :key="index"
              class="mgt-4 option-border text-caption-1 pda-3"
              :class="{ 'selected-border': picked === card.pay_detail_id }"
            >
              <ChooseOption
                :paymentOption="card"
                v-model="picked"
                @change="update"
              />
            </div>
          </div>

          <span v-if="savedMobile.length !== 0" class="mgt-8 text-overline">{{
            $t("mobile_money")
          }}</span>
          <div v-if="savedMobile.length !== 0">
            <div
              v-for="(mobile, index) in savedMobile"
              :key="index"
              class="mgt-4 option-border text-caption-1 pda-3"
              :class="{
                'selected-border': parseInt(picked) === mobile.pay_method_id,
                disabled:
                  mobile.daily_limit &&
                  getBupayload.amount > mobile.daily_limit,
              }"
            >
              <ChooseOption
                :paymentOption="mobile"
                v-model="picked"
                @change="update(mobile)"
              />
            </div>
          </div>

          <div class="mgt-8" v-if="virtualAccounts.length !== 0">
            <span class="text-overline"> BANK TRANSFER</span>
            <div>
              <div
                v-for="(vaccount, index) in virtualAccounts"
                :key="index"
                class="mgt-4 option-border text-caption-1 pda-3"
                :class="{
                  'selected-border': picked === vaccount.pay_detail_id,
                  disabled:
                    vaccount.daily_limit &&
                    getBupayload.amount > vaccount.daily_limit,
                }"
              >
                <ChooseOption
                  :paymentOption="vaccount"
                  v-model="picked"
                  @change="update"
                />
              </div>
            </div>
          </div>

          <hr class="mgt-5" />

          <div class="mgt-4 direction-flex pda-3">
            <div class="">
              <span class="text-caption text-gray70">{{
                $t("amount_to_pay")
              }}</span>
              <div class="text-secondary">
                {{ getBupayload.currency }}
                {{ $formatCurrency(getBupayload.amount) }}
              </div>
            </div>
            <span class="spacer"></span>
            <sendy-btn
              color="primary"
              class="mgt-2"
              @click="submit"
              :loading="loading1"
              :disabled="!picked"
            >
              {{ $t("confirm_and_pay") }}
            </sendy-btn>
          </div>
        </div>
      </div>
    </div>

    <TransactionLimitModal
      :show="showTransactionLimit"
      @close="showTransactionLimit = false"
    />
    <ErrorModal
      :show="showErrorModal"
      :text="errorText"
      @close="handleErrorModalClose"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import TopInfo from "../../components/topInfo.vue";
import Processing from "../../components/processing";
import paymentGenMxn from "../../mixins/paymentGenMxn";
import TransactionLimitModal from "../../components/modals/transactionalLimitModal";
import AdditionalCardFields from "./../AdditionalCardFields";
import ErrorModal from "../../components/modals/ErrorModal";
import ChooseOption from "./components/chooseOption";

export default {
  name: "ChoosePaymentCheckout",
  mixins: [paymentGenMxn],
  components: {
    TopInfo,
    Processing,
    TransactionLimitModal,
    AdditionalCardFields,
    ErrorModal,
    ChooseOption,
  },
  data() {
    return {
      icon: "back",
      title: this.$t("choose_payment_option"),
      picked: "",
      loading: false,
      count: false,
      defaultPaymentMethod: null,
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      errorText: "",
      mpesaCode: "",
      loading1: false,
      showTransactionLimit: false,
      showAdditionalCardFields: false,
      additionalData: null,
      showErrorModal: false,
      loadingText: "Loading",
    };
  },
  computed: {
    ...mapGetters(["getSavedPayMethods", "getBupayload", "getErrorText"]),
    creditCards() {
      const result = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter(
            (element) => element.pay_method_id === 2
          )
        : [];
      return result;
    },
    savedMobile() {
      const result = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter(
            (element) => element.category === "Mobile Money"
          )
        : [];
      return result;
    },
    virtualAccounts() {
      const result = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter(
            (element) => element.pay_method_id === 20
          )
        : [];
      return result;
    },
  },
  watch: {
    getSavedPayMethods(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getDefaultpayMethod();
      }
    },
  },
  async mounted() {
    this.setLoading(true);
    this.loadingText = "Loading...";
    await this.retrievePaymentMethods();
    this.setLoading(false);
    this.loadingText = this.$t("please_wait");
    this.getDefaultpayMethod();
  },
  methods: {
    ...mapMutations([
      "setErrorText",
      "setPaymentMethods",
      "setSavedPayMethods",
    ]),
    getDefaultpayMethod() {
      const method = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter((method) => method.default === 1)[0]
        : null;
      this.picked = method ? method.pay_detail_id : "";
      this.defaultPaymentMethod = method;
      if (!this.defaultPaymentMethod) {
        this.$router.push({ name: "AddPayment", params: { entry: "entry" } });
        return;
      }
    },

    async update(mobile) {
      const methods = this.getSavedPayMethods.filter((element) => element.pay_detail_id === this.picked)[0];
      const payload = {
        user_id: this.getBupayload.user_id,
        pay_detail_id: mobile.pay_method_id ? null : this.picked,
        pay_method_id: mobile.pay_method_id ? mobile.pay_method_id : methods.pay_method_id,
        country_code: this.getBupayload.country_code,
        entity_id: parseInt(this.getBupayload.entity_id),
      };

      const fullPayload = {
        url: `/set_default`,
        params: payload,
      };

      const payment_method =  mobile.pay_method_name ? mobile.pay_method_name : this.getSavedPayMethods.filter(
        (elements) => elements.pay_detail_id === this.picked
      )[0].pay_method_name;
      window.analytics.track("Choose Payment Option", {
        ...this.commonTrackPayload(),
        payment_method: payment_method,
      });

      this.loading = true;
      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;
      this.$paymentNotification({
          type: response.status ? '' : 'error',
          text: response.status ? `${this.setSelectedName(mobile)} selected for payment.` : 'Request failed, Please try again!',
      });
    },

    setSelectedName(mobile) {
      const result = mobile.pay_method_name ? mobile : this.getSavedPayMethods.filter(
        (element) => element.pay_detail_id === this.picked
      )[0];
      return result ? result.pay_method_name : "";
    },
    async submit() {
      const entry = localStorage.getItem("entry");

      if (entry === "resolve-payment-checkout") {
        this.submitRetry();
        return;
      }

      if (
        this.defaultPaymentMethod.daily_limit &&
        this.getBupayload.amount > this.defaultPaymentMethod.daily_limit
      ) {
        this.showTransactionLimit = true;
        return;
      }

      if (this.defaultPaymentMethod.category === "Mobile Money") {
        if (this.defaultPaymentMethod.pay_method_id === 1) {
          this.amount > this.defaultPaymentMethod.transaction_limit
            ? this.$router.push("/mpesa-c2b")
            : this.$router.push("/mpesa-stk");
          return;
        }

        this.amount > this.defaultPaymentMethod.transaction_limit
          ? (this.showTransactionLimit = true)
          : this.$router.push("/mpesa-stk");
        return;
      }

      if (this.defaultPaymentMethod.pay_method_id === 20) {
        this.payBybankCollect();
        return;
      }

      this.setLoading(true);
      const payload = {
        country: this.getBupayload.country_code,
        amount: this.getBupayload.amount,
        cardno: this.defaultPaymentMethod.pay_method_details,
        txref: this.getBupayload.txref,
        userid: this.getBupayload.user_id,
        currency: this.getBupayload.currency,
        bulk: this.getBupayload.bulk,
        entity: this.getBupayload.entity_id,
        company_code: this.getBupayload.company_code,
        bulkrefno: this.getBupayload.bulk_reference_number,
      };

      const fullPayload = {
        url: "/api/v3/process",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.transaction_id = response.transaction_id;
      if (response.status) {
        if (response.additional_data) {
          this.additionalData = response.additional_data;
          this.showAdditionalCardFields = true;
          this.setLoading(false);
          return;
        }

        switch (response.transaction_status) {
          case "pending":
            if (this.getBupayload.bulk) {
              this.setLoading(false);
              this.$router.push({
                name: "SuccessView",
              });
              return;
            }
            this.pollCard();
            break;
          case "success":
            this.setLoading(false);
            this.$paymentNotification({
              text: this.$t("card_details_added"),
            });
            this.$router.push("/choose-payment");
            this.setLoading(false);
            break;
          default:
            break;
        }
        return;
      }
      this.setErrorText(response.message);
      this.setLoading(false);
      this.$router.push({ name: "FailedView" });
    },
    async bulkretry() {
      this.startResponseTime = new Date();

      if (this.defaultPaymentMethod.pay_method_id === 1) {
        this.amount > this.defaultPaymentMethod.stk_limit
          ? this.$router.push("/mpesa-c2b")
          : this.$router.push("/mpesa-stk");
        return;
      }

      this.setLoading(true);
      const payload = {
        user_id: this.getBupayload.user_id,
        company_code: this.getBupayload.company_code,
        entity: this.getBupayload.entity_id,
        pay_detail_id: this.defaultPaymentMethod.pay_method_details,
        payment_method: this.defaultPaymentMethod.pay_method_id,
        references: this.getBupayload.references,
      };

      const fullPayload = {
        url: "/api/v3/bulk/retry",
        params: payload,
      };

      try {
        const response = await this.$paymentAxiosPost(fullPayload);
        this.transaction_id = response.transaction_id;
        if (response.status) {
          switch (response.transaction_status) {
            case "pending":
              this.pollCard();
              break;
            case "success":
              this.setLoading(false);
              this.$paymentNotification({
                text: this.$t("card_details_added"),
              });
              this.$router.push("/choose-payment");
              this.setLoading(false);
              break;
            default:
              break;
          }
          return;
        }
        this.setErrorText(response.message);
        this.setLoading(false);
        this.subtitle = response.message;
      } catch {
        this.$paymentNotification({
          text: this.$t("error_occurred"),
          type: "error",
        });
        this.setErrorText(this.$t("error_occurred"));
        this.setLoading(false);
      }
    },

    async submitRetry() {
      if (this.getBupayload.bulk) {
        this.bulkretry();
        return;
      }

      this.startResponseTime = new Date();

      if (this.defaultPaymentMethod.pay_method_id === 1) {
        this.getBupayload.amount > this.defaultPaymentMethod.stk_limit
          ? this.$router.push("/mpesa-c2b")
          : this.$router.push("/mpesa-stk");
        return;
      }

      if (this.defaultPaymentMethod.pay_method_id === 20) {
        this.payBybankCollect();
        return;
      }

      this.setLoading(true);
      const payload = {
        user_id: this.getBupayload.user_id,
        company_code: this.getBupayload.company_code,
        entity: this.getBupayload.entity_id,
        pay_detail_id: this.defaultPaymentMethod.pay_method_details,
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
        if (response.additional_data) {
          this.additionalData = response.additional_data;
          this.showAdditionalCardFields = true;
          this.setLoading(false);
          return;
        }

        switch (response.transaction_status) {
          case "pending":
            this.pollCard();
            break;
          case "success":
            this.setLoading(false);
            this.$router.push({ name: "SuccessView" });
            break;
          default:
            break;
        }
        return;
      }
      this.setErrorText(response.message);
      this.setLoading(false);
    },
    pollCard() {
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
              that.setLoading(false);
              that.errorText = this.$t("failed_to_charge_card");
              that.setErrorText(that.errorText);
              that.$router.push({ name: "FailedView" });
              return;
            }
          }, 10000 * poll_count);
        })(poll_count);
      }
    },

    async TransactionIdStatus() {
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
              this.setLoading(false);
              this.$router.push({ name: "SuccessView" });
              break;
            case "failed":
              this.poll_count = this.poll_limit;
              this.setLoading(false);
              this.errorText = res.message;
              this.setErrorText(res.message);
              this.$router.push({ name: "FailedView" });
              this.failView();
              break;
            case "pending":
              break;
            default:
              break;
          }
          return res;
        }
        this.poll_count = this.poll_limit;
        this.showAdditionalCardFields = false;
        this.setLoading(false);
        this.errorText = res.message;
        this.showErrorModal = true;
      });
    },

    addPaymentOption() {
      window.analytics.track("Add Payment Option", {
        ...this.commonTrackPayload(),
        timezone: this.paymentTimezone,
        country_code: this.getBupayload.country_code,
      });
      this.$router.push("/add-payment");
    },

    handleContinue(val) {
      if (val) {
        this.setLoading(true);
        this.pollCard();
        return;
      }
      this.setLoading(false);
      this.errorText = this.$t("failed_to_collect_card_details");
      this.showErrorModal = true;
    },

    handleContinue3DS(val) {
      this.showAdditionalCardFields = false;
      this.additionalData = val.additionalData.filter(
        (element) => element.field_id === "url"
      );
      this.init3DS();
    },

    init3DS() {
      const res = !this.additionalData
        ? this.additionalData
        : this.additionalData[0];
      const url = res.field;
      const urlWindow = window.open(url, "");

      const timer = setInterval(() => {
        if (urlWindow.closed) {
          this.init3dsPoll();
          clearInterval(timer);
        }
      }, 500);
    },

    async init3dsPoll() {
      this.setLoading(true);
      const payload = {
        transaction_id: this.transaction_id,
        tds: true,
      };

      const fullPayload = {
        params: payload,
        url: "/api/v2/submit_info",
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.setLoading(false);
      if (response.status) {
        switch (response.transaction_status) {
          case "pending":
            this.pollCard();
            this.count = true;
            break;
          case "success":
            this.setLoading(false);
            this.$paymentNotification({
              text: this.$t("card_details_added"),
            });
            this.$router.push("/choose-payment");
            this.setLoading(false);
            break;
          default:
            break;
        }
        return;
      }
      this.setLoading(false);
      this.errorText = this.$t("failed_to_collect_card_details");
      this.showErrorModal = true;
    },
    handleErrorModalClose() {
      this.showErrorModal = false;
      this.showAdditionalCardFields = false;
    },
  },
};
</script>
