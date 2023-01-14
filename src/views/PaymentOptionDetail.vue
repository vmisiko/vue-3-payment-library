<template>
  <div class="flex-center">
    <div class="card" v-if="getSelectedPayOption">
      <TopInfo
        :icon="icon"
        :title="title"
      />

      <div class="mgt-10">
        <span class="text-subtitle-1">{{ paymentOption }}</span>
        
        <div class="float-right mgt-n2">
         <img
            v-if="getSelectedPayOption.category === 'Credit or Debit Card'"
            :src="`${iconUrl}/${getSelectedPayOption.psp.toLowerCase()}.svg`"
            alt=""
            width="68"
            height="48"
          />

          <img
            v-if="getSelectedPayOption.isMobileMoney"
            :src="`${iconUrl}/${getSelectedPayOption.pay_method_name.toLowerCase()}.svg`"
            alt=""
            width="68"
            height="48"
          />

          <img
            v-if="getSelectedPayOption.isBank'"
            :src="`${iconUrl}/pay_by_bank.svg`"
            alt=""
            width="68"
            height="48"
          />
        </div>
        
      </div>

      <div class="text-body-2 text-gray70" v-if="card_expiry">
        <span>{{ $formatCardno(getSelectedPayOption.pay_method_details) }}</span>
        <div>
          <span>{{ $translate("expiry_date") }} {{ card_expiry || "N/A" }}</span>
        </div>
      </div>

      <hr class="mgt-10" />

      <div v-if="getSelectedPayOption.category !=='Mobile Money'" class="mgt-8"></div>
      <div v-if="getSelectedPayOption.category !=='Mobile Money'" class="mgt-8 text-btn direction-flex pointer" @click="removeCard">
        <IconView icon="delete" />
        <span class="text-btn">{{ `Remove ${paymentOption}` }}</span>
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

export default {
  name: "paymentOptionDetail",
  components: {
    TopInfo,
    DeletModal,
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
    if (this.getSelectedPayOption.category === 'Credit or Debit Card') {
      await this.fetchCardDetails();
    }
    window.analytics.track("View Payment Option", {
      ...this.commonTrackPayload(),
      payment_method: this.getSelectedPayOption.pay_method_name,
    });
  },
  methods: {
    removeCard() {
      window.analytics.track(`Remove ${this.paymentOption}`, {
        ...this.commonTrackPayload(),
        payment_method: this.getSelectedPayOption.pay_method_name,

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
