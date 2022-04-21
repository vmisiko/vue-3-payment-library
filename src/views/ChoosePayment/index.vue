<template>
  <div class="flex-center">
    <Processing v-if="getLoading" :text="loadingText" />

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
              mobile.daily_limit && getBupayload.amount > mobile.daily_limit,
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

      <span class="link mgt-5" @click="addPaymentOption">
        + {{ $t("add_payment_option") }}</span
      >

      <div class="mgt-4 text-right">
        <sendy-btn
          color="primary"
          class="mgt-10"
          :disabled="!picked"
          @click="handleRouting"
          :loading="loading"
        >
          {{ $t("continue") }}
        </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import TopInfo from "../../components/topInfo";
import paymentGenMxn from "../../mixins/paymentGenMxn";
import ChooseOption from "./components/chooseOption";
import Processing from "../../components/processing";

export default {
  name: "ChoosePayment",
  mixins: [paymentGenMxn],
  components: {
    TopInfo,
    ChooseOption,
    Processing,
  },
  data() {
    return {
      icon: "back",
      title: this.$t("choose_payment_option"),
      loadingText: "Loading..",
      picked: "",
      loading: false,
      startTime: null,
    };
  },
  computed: {
    ...mapGetters(["getSavedPayMethods", "getBupayload"]),
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
    await this.retrievePaymentMethods();
    this.setLoading(false);
    this.getDefaultpayMethod();
    this.startTime = Date.now();
  },
  methods: {
    ...mapMutations(["setPaymentMethods", "setSavedPayMethods"]),
    getDefaultpayMethod() {
      const method = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter((method) => method.default === 1)[0]
        : [];
      this.picked = method ? method.pay_detail_id : "";
    },

    async update(mobile) {
      const methods = this.getSavedPayMethods.filter(
        (element) => element.pay_detail_id === this.picked
      )[0];
      const payload = {
        user_id: this.getBupayload.user_id,
        pay_detail_id: mobile.pay_method_id
          ? mobile.pay_detail_id
          : this.picked,
        pay_method_id: mobile.pay_method_id
          ? mobile.pay_method_id
          : methods.pay_method_id,
        country_code: this.getBupayload.country_code,
        entity_id: parseInt(this.getBupayload.entity_id),
      };

      const fullPayload = {
        url: `/set_default`,
        params: payload,
      };

      const payment_method = mobile.pay_method_name
        ? mobile.pay_method_name
        : this.getSavedPayMethods.filter(
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
        type: response.status ? "" : "error",
        text: response.status
          ? `${this.setSelectedName(mobile)} selected for payment.`
          : "Request failed, Please try again!",
      });
    },

    setSelectedName(mobile) {
      const result = mobile.pay_method_name
        ? mobile
        : this.getSavedPayMethods.filter(
            (element) => element.pay_detail_id === this.picked
          )[0];
      return result ? result.pay_method_name : "";
    },
    handleRouting() {
      const entryRoute = localStorage.entry_route;
      const entryPoint = localStorage.entry;
      const method = this.getSavedPayMethods.filter(
        (elements) => elements.pay_detail_id === this.picked
      )[0];

      const payment_method = method
        ? method
        : this.getSavedPayMethods.filter(
            (elements) => elements.pay_method_id === parseInt(this.picked)
          )[0];

      const countSavedCards = this.getSavedPayMethods.filter(
        (element) => element.pay_method_id === 2
      );

      switch (payment_method.pay_method_id) {
        case 1:
          window.analytics.track("Continue after selecting  M-Pesa", {
            ...this.commonTrackPayload(),
          });
          break;
        case 2:
          window.analytics.track("Continue after selecting Card", {
            ...this.commonTrackPayload(),
            number_of_cards: countSavedCards.length,
            selected_cards_network: payment_method.psp,
          });
          break;
        case 20:
          window.analytics.track("Continue after Pay by bank", {
            ...this.commonTrackPayload(),
            number_of_cards: countSavedCards.length,
            selected_cards_network: payment_method.psp,
          });
          break;
        default:
          break;
      }

      if (payment_method.pay_method_id === 20) {
        this.$router.push({ name: entryRoute });
        return;
      }

      switch (entryPoint) {
        case "checkout":
          this.$router.push({ name: "Entry" });
          break;
        case "choose-payment":
          this.$router.push({ name: entryRoute });
          break;
        case "choose-payment-checkout":
          this.$router.push({ name: "ChoosePaymentCheckout" });
          break;
        case "payment-option":
          this.$router.push({ name: "PaymentOptionsPage" });
          break;
        default:
          this.$router.push({ name: "Entry" });
          break;
      }
    },
    addPaymentOption() {
      window.analytics.track("Add Payment Option", {
        ...this.commonTrackPayload(),
        timezone: this.paymentTimezone,
        country_code: this.getBupayload.country_code,
      });
      this.$router.push("/add-payment");
    },
  },
};
</script>
