<template>
  <div class="flex-center">
    <div class="card" v-if="getSelectedPayOption">
      <TopInfo
        :icon="icon"
        :title="title"
      />

      <div class="mgt-10">
        <span class="text-subtitle-1">{{ getSelectedPayOption.getDisplayName($translate) }}</span>
        
        <div class="float-right mgt-n2">
          <PaymentIcon 
            width="68"
            height="48"
            :paymentOption="getSelectedPayOption"
          />
        </div>
        
      </div>

      <div class="text-body-2 text-gray70" v-if="getSelectedPayOption.isCard()">
        <span >{{ $formatCardno(getSelectedPayOption.pay_method_details) }}</span>
        <div>
          <span>{{ $translate("expiry_date") }} {{ card_expiry || "N/A" }}</span>
        </div>
      </div>

      <hr class="mgt-10" />
      <div v-if="!getSelectedPayOption.isMobileMoney()" class="mgt-8"></div>
      <div v-if="!getSelectedPayOption.isMobileMoney()" class="mgt-8 text-btn direction-flex pointer" @click="removeCard">
        <IconView icon="delete" />
        <span class="text-btn">{{ `Remove ${getSelectedPayOption.getDisplayName($translate)}` }}</span>
      </div>
    </div>
    <DeletModal
      :show="showDeleteModal"
      @close="showDeleteModal = !showDeleteModal"
    />
  </div>
</template>

<script>
import TopInfo from "../components/topInfo";
import DeletModal from "../components/modals/DeleteModal";
import paymentGenMxn from "../mixins/paymentGenMxn";
import { mapGetters } from "vuex";
import PaymentIcon from "./ChoosePayment/components/PaymentIcon";

export default {
  name: "paymentOptionDetail",
  components: {
    TopInfo,
    DeletModal,
    PaymentIcon
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: "back",
      showDeleteModal: false,
      iconUrl: "https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons",
      card_expiry: false,
    };
  },
  computed: {
    ...mapGetters(["getSelectedPayOption"]),
    title() {
      let result = '';
      switch (this.getSelectedPayOption.category) {
        case 'Mobile Money':
          result = 'Mobile Money';
          break;
        case 'Credit or Debit Card': 
          result = 'Card Details'
          break;
        case 'Bank': 
          result = 'Pay with Transfer'
          break;
        default:
          break;
      }
      return result
    },
    paymentOption() {
      let result = '';
      switch (this.getSelectedPayOption.category) {
        case 'Mobile Money':
          result = this.getSelectedPayOption.pay_method_name;
          break;
        case 'Credit or Debit Card': 
          result = this.getSelectedPayOption.psp;
          break;
        case 'Bank': 
          result = 'Pay with Transfer';
          break;
        default:
          break;
      }
      return result;
    }
  },
  async mounted() {
    if (this.getSelectedPayOption.isCard()) {
      await this.fetchCardDetails();
    }
    window.analytics.track("View Payment Option", {
      ...this.commonTrackPayload(),
      payment_method: this.getSelectedPayOption.pay_method_name,
    });
  },
  methods: {
    removeCard() {
      window.analytics.track(`Remove ${this.getSelectedPayOption.getDisplayName(this.$translate)}`, {
        ...this.commonTrackPayload(),
        payment_method: this.getSelectedPayOption.getDisplayName(this.$translate),

      });
      this.showDeleteModal = true;
    },
    async fetchCardDetails() {
      const payload = {
        cardno: this.getSelectedPayOption.pay_method_details,
        userid: this.getBupayload.user_id,
      };

      const fullPayload = {
        url: "/api/v1/card/fetch",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.card_expiry = response.expirydate;
    },
  },
};
</script>
