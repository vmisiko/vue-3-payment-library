<template>
  <div id="payment">
    <div class="container">
      <div @click="$router.push({ name: 'Entry' })" v-if="false">
        <IconView icon="sendy-logo" />
      </div>
      <router-view />
    </div>
    <NotificationComponent
      :show="showNotification"
      :text="notificationText"
      :type="type"
    />
    <AxiosErrorModal
      :show="showAxiosError"
      :text="errorText"
      @close="showAxiosError = !showAxiosError"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import NotificationComponent from "../components/notificationComponent";
import AxiosErrorModal from "../components/modals/AxiosErrorModal";

export default {
  name: "PaymentEntry",
  components: {
    NotificationComponent,
    AxiosErrorModal,
  },
  data() {
    return {
      showNotification: false,
      showAxiosError: false,
      notificationText: this.$translate("mpesa_added"),
      type: null,
      errorText: this.$translate("failed_network_error"),
    };
  },
  computed: {
    ...mapGetters(["getBupayload"]),
  },
  mounted() {
    this.emitter.on("payment-notification", this.notificationInit);
    this.emitter.on("axios-notification", this.axiosNotif);
  },
  methods: {
    ...mapMutations(["setPaymentMethods", "setSavedPayMethods"]),
    notificationInit(payload) {
      this.notificationText = payload.text;
      this.type = payload.type;
      this.showNotification = !this.showNotification;
    },
    axiosNotif(payload) {
      this.showAxiosError = true;
      this.errorText = payload.text;
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Nunito&display=swap");
@import "@/assets/styles/global.scss";
</style>
