<template>
  <div class="flex-center">
    <div class="card">
      <TopInfo
        :icon="icon"
        :title="$route.params.title ? $route.params.title : title"
      />

      <div class="mgt-10">
        <span class="text-subtitle-1">{{
          $route.params.paymentOption ? $route.params.paymentOption : "M-PESA"
        }}</span>
        <IconView
          :icon="$route.params.icon ? $route.params.icon : 'mpesa'"
          class="float-right mgt-n2"
          width="68"
          height="48"
        />
      </div>

      <hr class="mgt-10" />

      <div class="mgt-8 text-btn direction-flex pointer" @click="removeCard">
        <IconView icon="delete" />
        <span class="text-btn">{{
          $route.params.paymentOption
            ? `Remove ${$route.params.paymentOption}`
            : $t("remove_mpesa")
        }}</span>
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
  name: "MpesaDetail",
  components: {
    TopInfo,
    DeletModal,
  },
  mixins: [paymentGenMxn],
  data() {
    return {
      icon: "back",
      title: "Mobile Money",
      showDeleteModal: false,
    };
  },
  computed: {
    ...mapGetters(["getSelectedPayOption"]),
  },
  mounted() {},
  methods: {
    removeCard() {
      window.analytics.track("Remove Mobile Money", {
        ...this.commonTrackPayload(),
      });
      this.showDeleteModal = true;
    },
  },
};
</script>
