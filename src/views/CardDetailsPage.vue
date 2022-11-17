<template>
  <div class="flex-center">
    <div class="card">
      <TopInfo :icon="icon" :title="title" />

      <div class="mgt-10">
        <span class="text-subtitle-1">{{ $route.params.cardTitle }}</span>
        <IconView
          :icon="
            $cardIconValidator($route.params.cardTitle.toLowerCase())
              ? $route.params.cardTitle.toLowerCase()
              : 'card'
          "
          class="float-right mgt-n2"
          width="68"
          height="48"
        />
      </div>

      <div class="text-body-2 text-gray70">
        <span>{{ $formatCardno($route.params.cardno) }}</span>
        <div>
          <span>{{ $translate("expiry_date") }} {{ card_expiry || "N/A" }}</span>
        </div>
      </div>

      <hr class="mgt-10" />

      <div class="mgt-8 text-btn direction-flex pointer" @click="removeCard">
        <IconView icon="delete" />
        <span class="text-btn">{{ $translate("remove_card") }}</span>
      </div>
    </div>
    <DeletModal
      :show="showDeleteModal"
      @close="showDeleteModal = !showDeleteModal"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopInfo from "../components/topInfo";
import DeletModal from "../components/modals/DeleteModal";
import paymentGenMxn from "../mixins/paymentGenMxn";

export default {
  name: "CardDetailsPage",
  components: {
    TopInfo,
    DeletModal,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: "back",
      title: this.$translate("card_details"),
      showDeleteModal: false,
      card_expiry: false,
      cardDetails: null,
    };
  },
  computed: {
    ...mapGetters(["getSavedPayMethods", "getBupayload", ]),
  },
  mounted() {
    this.fetchCardDetails();
  },
  methods: {
    async fetchCardDetails() {
      const payload = {
        cardno: this.$route.params.cardno,
        userid: this.getBupayload.user_id,
      };

      const fullPayload = {
        url: "/api/v1/card/fetch",
        params: payload,
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.card_expiry = response.expirydate;
    },
    removeCard() {
      window.analytics.track("Remove card", {
        ...this.commonTrackPayload(),
        payment_method: "card",
      });
      this.showDeleteModal = true;
    },
  },
};
</script>
