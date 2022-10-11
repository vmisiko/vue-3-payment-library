<template>
  <div>
    <div class="flex-center">
      <Processing v-if="getLoading" :text="loadingText" :count="count" />
    </div>
    <div class="flex-center" v-if="!getLoading">
      <AdditionalCardFields
        :additionalData="additionalData"
        :transaction_id="transaction_id"
        v-if="showAdditionalCardFields"
        @continue="handleContinue"
        @continue3DS="handleContinue3DS"
      />

      <div class="card" v-else>
        <TopInfo :icon="icon" :title="title" />

        <span v-if="creditCards.length !== 0" class="mgt-2 text-overline">{{
          $translate("credit_card_payment")
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
              :value="card.pay_detail_id"
              v-model="picked"
              @change="update(card)"
            />
          </div>
        </div>

        <span v-if="savedMobile.length !== 0" class="mgt-8 text-overline">{{
          $translate("mobile_money")
        }}</span>
        <div v-if="savedMobile.length !== 0">
          <div
            v-for="(mobile, index) in savedMobile"
            :key="index"
            class="mgt-4 option-border text-caption-1 pda-3"
            :class="{
              'selected-border': picked === mobile.pay_detail_id,
              disabled:
                mobile.daily_limit &&
                getBupayload.amount > mobile.daily_limit,
            }"
          >
            <ChooseOption
              :paymentOption="mobile"
              :value="mobile.pay_detail_id"
              v-model="picked"
              @change="update(mobile)"
            />
          </div>
        </div>

        <div class="mgt-8" v-if="virtualAccounts.length !== 0">
          <span class="text-overline"> {{ $translate('bank_transfer') }}</span>
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
                :value="vaccount.pay_detail_id"
                v-model="picked"
                @change="update(vaccount)"
              />
            </div>
          </div>
        </div>

        <hr class="mgt-5" />

        <div class="mgt-4 direction-flex pda-3">
          <div class="">
            <span class="text-caption text-gray70">{{
              $translate("amount_to_pay")
            }}</span>
            <div class="payment-text-secondary">
              {{ getBupayload.currency }}
              {{ $formatCurrency(getBupayload.amount) }}
            </div>
          </div>
          <span class="spacer"></span>
          <sendy-btn
            color="primary"
            class="mgt-2"
            @click="submit"
            :loading="getLoading"
            :disabled="!picked"
          >
            {{ $translate("confirm_and_pay") }}
          </sendy-btn>
        </div>
      </div>
    </div>

    <TransactionLimitModal
      :show="showTransactionLimit"
      @close="showTransactionLimit = false"
    />
    <ErrorModal
      :show="showErrorModal"
      :text="errorText"
      @close="handleErrorModalClose"
    />
  </div>
</template>

<script>
import { onMounted, watch, toRefs } from "vue";
import { useStore } from "vuex";
import TopInfo from "../../components/topInfo.vue";
import Processing from "../../components/processing";
import TransactionLimitModal from "../../components/modals/transactionalLimitModal";
import AdditionalCardFields from "./../AdditionalCardFields";
import ErrorModal from "../../components/modals/ErrorModal";
import ChooseOption from "./components/chooseOption";
import { useChoosePayment } from "../../hooks/useChoosePayment";
import { usePayment } from "../../hooks/payment";
import { useState } from "../../hooks/useState";

export default {
  name: "ChoosePaymentCheckout",
  components: {
    TopInfo,
    Processing,
    TransactionLimitModal,
    AdditionalCardFields,
    ErrorModal,
    ChooseOption,
  },
  data() {
    return {
      icon: "back",
      title: this.$translate("choose_payment_option"),
    };
  },
  setup() {
    const { state } = useState();
    const { retrievePaymentMethods, getDefaultpayMethod, submit } =
      usePayment();
    const store = useStore();

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
    });

    function handleErrorModalClose() {
      state.showErrorModal = false;
      state.showAdditionalCardFields = false;
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
      handleErrorModalClose,
      submit,
    };
  },
};
</script>
