<template>
  <div class="flex-center">
    <Processing
      @close="showProcessing = false"
      :count="count"
      :title="$translate('pay_by_bank_setup')"
      :text="$translate('assign_your_unique_account')"
      v-if="showProcessing"
    />
    <div class="card" v-else>
      <div class="">
        <div class="">
          <span class="title text-gray90">{{ $translate("terms_of_service") }}</span>
        </div>
      </div>
      <div class="mgt-4 iframe-div">
        <iframe
          frameBorder="0"
          width="100%"
          height="450"
          src="https://docs.google.com/document/d/e/2PACX-1vRPx-4L-5lSb1QZ0L3Amph5mtRGR3wxiVgfmahbZIOZZIhty2b6tdEqWJqHNoFSfg/pub?embedded=true"
        ></iframe>
      </div>

      <div class="direction-flex mgt-13">
        <div class="mgy-auto">
          <span @click="handleCancel" class="link"> {{ $translate("cancel") }}</span>
        </div>

        <div class="spacer"></div>
        <sendy-btn
          :loading="loading"
          color="primary"
          :text="$translate('agree_and_continue')"
          @click="handleContinue"
        />
      </div>
    </div>
    <VerifyPhoneModal :show="showPhone" @close="showPhone=false" />
  </div>
</template>

<script setup>
import { mapGetters, mapMutations } from "vuex";
import Processing from "../../components/processing";
import { useGlobalProp } from "../../hooks/globalProperties";
import { usePayBybankSetup } from "../../hooks/payBybankSetup";
import { useSegement } from "../../hooks/useSegment";
import paymentGenMxn from "../../mixins/paymentGenMxn";
import VerifyPhoneModal from "./components/modals/verifyPhoneModal.vue";

const { showProcessing, showPhone, count, loading, openAccount  } = usePayBybankSetup();
const {router } = useGlobalProp();
const { commonTrackPayload } = useSegement();

const handleCancel = () => {
  router.go(-1)
  window.analytics.track("Cancel agreeing to terms of service", {
    ...commonTrackPayload(),
    payment_method: "Pay with Transfer"
  });
}

const handleContinue = () => {
  showPhone.value = true;
  window.analytics.track("Agree to terms of service", {
    ...commonTrackPayload(),
    payment_method: "Pay with Transfer",
  });
}

</script>

<style scoped>
.title {
  font-family: "Nunito" "Sans";
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.003em;
  color: #303133;
}

.iframe-div {
  display: block;
  overflow: hidden;
  background: #f7f9fc;
  height: 450px;
  border-radius: 10px;
  transform: translateZ(0px);
  /* border: 3px solid #eee; */
}

iframe .c27 {
  background-color: #f7f9fc !important;
}
</style>
