<template>
  <div class="flex-center">
    <div>
      <Processing v-if="getLoading" :text="loadingText" />
      <div class="card" v-else>
        <TopInfo :icon="icon" :title="title" />

        <span v-if="creditCards.length !== 0" class="mgt-2 text-overline">{{
          $t("credit_card_payment")
        }}</span>
        <div class="" v-if="creditCards.length !== 0">
          <div v-for="(card, index) in creditCards" :key="index">
            <PaymentOption :payMethod="card" />
          </div>
        </div>

        <span v-if="savedMobile.length !== 0" class="mgt-8 text-overline">{{
          $t("mobile_money")
        }}</span>
        <div v-if="savedMobile.length !== 0">
          <div v-for="(mobile, index) in savedMobile" :key="index">
            <PaymentOption :payMethod="mobile" />
          </div>
        </div>

        <div class="mgt-8" v-if="virtualAccounts.length !== 0">
          <span class="text-overline"> BANK TRANSFER</span>
          <div>
            <div v-for="(vaccount, index) in virtualAccounts" :key="index">
              <PaymentOption :payMethod="vaccount" />
            </div>
          </div>
        </div>

        <hr class="mgt-5" />

        <span class="link mgt-5" @click="$router.push('/add-payment')">
          + {{ $t("add_payment_option") }}</span
        >

        <div class="mgt-10"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopInfo from "../components/topInfo";
import PaymentOption from "../components/paymentOptionPage/paymentOption";
import paymentGenMxn from "../mixins/paymentGenMxn";
import Processing from "../components/processing";

export default {
  name: "PaymentOptionsPage",
  components: {
    TopInfo,
    PaymentOption,
    Processing,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: "back",
      title: this.$t("payment_options"),
      picked: "",
      loading1: false,
      loadingText: "",
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
            (element) => element.pay_method_id === 1
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
  async mounted() {
    this.setLoading(true);
    this.loadingText = "Loading ...";
    await this.retrievePaymentMethods();
    this.setLoading(false);
    this.getDefaultpayMethod();
    window.analytics.track("Tap Payment Options Menu", {
      ...this.commonTrackPayload(),
    });
  },
  methods: {
    getDefaultpayMethod() {
      this.defaultPaymentMethod = this.getSavedPayMethods
        ? this.getSavedPayMethods.filter((method) => method.default === 1)[0]
        : [];
      // if (!this.defaultPaymentMethod) {
      //   // this.checkAvailableOptions(this.defaultPaymentMethod);
      // }
    },
    handleRouting() {
      const entryRoute = localStorage.entry_route;
      this.$router.push({ name: entryRoute });
    },
  },
};
</script>
