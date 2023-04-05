<template>
  <div class="flex-center">
    <Processing v-if="getLoading" :text="loadingText" />

    <div class="card" v-else>
      <TopInfo :icon="icon" :title="title" />

      <span v-if="creditCards?.length !== 0" class="mgt-2 text-overline">{{
        t("credit_card_payment")
      }}</span>
      <div class="" v-if="creditCards?.length !== 0">
        <div
          v-for="(card, index) in creditCards"
          :key="index"
          class="mgt-4"
        >
          <ChooseOption
            id="choose-card"
            :paymentOption="card"
            :value="card.pay_detail_id"
            v-model="picked"
            @change="update(card)"
          />
        </div>
      </div>

      <span v-if="savedMobile?.length !== 0" class="mgt-8 text-overline">{{
        t("mobile_money")
      }}</span>
      <div v-if="savedMobile?.length !== 0">
        <div
          v-for="(mobile, index) in savedMobile"
          :key="index"
          class="mgt-4" 
        >
          <ChooseOption
            :paymentOption="mobile"
            :value="mobile.pay_detail_id"
            v-model="picked"
            @change="update(mobile)"
          />
        </div>
      </div>

      <div class="mgt-8" v-if="virtualAccounts?.length">
        <span class="text-overline"> {{ t('bank_transfer') }}</span>
        <div>
          <div
            v-for="(vaccount, index) in virtualAccounts"
            :key="index"
            class="mgt-4"
          >
            <ChooseOption
              :paymentOption="vaccount"
              :value="vaccount.pay_detail_id"
              v-model="picked"
              @change="update(vaccount)"
            />
          </div>
        </div>
      </div>

      <hr class="mgt-5" />

      <span id="add-payment" class="link mgt-5" @click="addPaymentOption">
        + {{ t("add_payment_option") }}</span
      >

      <div class="mgt-4 text-right">
        <sendy-btn
          color="primary"
          class="mgt-10"
          :disabled="!picked"
          @click="handleRouting"
          :loading="loading"
        >
          {{ t("continue") }}
        </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, toRefs, watch } from "vue";
import { useStore } from "vuex";
import TopInfo from "../../components/topInfo";
import ChooseOption from "./components/chooseOption";
import Processing from "../../components/processing";
import { useChoosePayment } from "../../hooks/useChoosePayment";
import { usePayment } from "../../hooks/payment";
import { useState } from "../../hooks/useState";
import { useSegement } from '../../hooks/useSegment';
import { useGlobalProp } from "../../hooks/globalProperties";

export default {
  name: "ChoosePayment",
  components: {
    TopInfo,
    ChooseOption,
    Processing,
  },
  data() {
    return {
      icon: "back",
      title: this.t("choose_payment_option"),
      loadingText: "Loading..",
    };
  },
  setup() {
    const { retrievePaymentMethods } = usePayment();
    const store = useStore();
    const { state } = useState();
    const { commonTrackPayload } = useSegement();
    const { t } = useGlobalProp();
    const {
      creditCards,
      savedMobile,
      virtualAccounts,
      getBupayload,
      getLoading,
      getSavedPayMethods,
      update,
      handleRouting,
      addPaymentOption,
    } = useChoosePayment();

    watch(getSavedPayMethods, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        getDefaultpayMethod();
      }
    });

    onMounted(async () => {
      store.commit("setLoading", true);
      await retrievePaymentMethods();
      store.commit("setLoading", false);
      getDefaultpayMethod();
      window.analytics.track("View choose payment option", {
        ...commonTrackPayload(),
        "defaulted_payment_option": state?.defaultPaymentMethod?.pay_method_name
      });
    });

    function getDefaultpayMethod() {
       state.defaultPaymentMethod = getSavedPayMethods.value
        ? getSavedPayMethods.value.filter((method) => method.default === 1)[0]
        : {};
      state.picked = state.defaultPaymentMethod ? state.defaultPaymentMethod.pay_detail_id : "";
    }

    return {
      ...toRefs(state),
      creditCards,
      savedMobile,
      virtualAccounts,
      getBupayload,
      getLoading,
      update,
      handleRouting,
      addPaymentOption,
      t,
    };
  },
};
</script>
