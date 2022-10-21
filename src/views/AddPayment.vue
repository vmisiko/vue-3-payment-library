<template>
  <div class="flex-center">
    <Processing v-if="showProcessing" text="Please wait ..." />
    <div class="card" v-else>
      <TopInfo :icon="icon" :title="title">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            {{ $translate('click_here_to_add') }}
          </span>
        </template>
      </TopInfo>

      <div class="mgt-10">
        <div class="" v-for="(method, index) in getPaymentMethods" :key="index">
          <PaymentOption :paymentMethod="method" @loading="handleLoading" />
          <hr
            v-if="index !== getPaymentMethods.length - 1"
            class="margin-hr"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopInfo from "../components/topInfo";
import PaymentOption from "../components/paymentOption";
import paymentGenMxn from "../mixins/paymentGenMxn";
import Processing from "../components/processing";
import { onMounted } from 'vue';
import { usePayment } from "../hooks/payment";
import { useSegement } from '../hooks/useSegment';

export default {
  name: "AddPayment",
  components: {
    TopInfo,
    PaymentOption,
    Processing,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: "back",
      title: this.$translate("add_payment_option"),
      showProcessing: false,
    };
  },
  computed: {
    ...mapGetters(["getPaymentMethods"]),
  },
  setup() {
    const { retrievePaymentMethods } = usePayment();
    const { commonTrackPayload } = useSegement();
    onMounted(() => {
      window.analytics.track("View Add Payment Options", {
      ...commonTrackPayload(),
    });
      retrievePaymentMethods();
    });
  },
  methods: {
    handleLoading(val) {
      this.showProcessing = val;
    },
  },
};
</script>

<style>
.margin-hr {
  margin-top: 16px !important;
  margin-bottom: 19px !important;
}
</style>