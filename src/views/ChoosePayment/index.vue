<template>
  <div class="flex-center">
    <Processing v-if="getLoading" :text="loadingText" />

    <div class="card" v-else>
      <TopInfo :icon="icon" :title="title" />

      <span v-if="creditCards.length !== 0" class="mgt-2 text-overline">{{
        $t("credit_card_payment")
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
            v-model="picked"
            @change="update(card)"
          />
        </div>
      </div>

      <span v-if="savedMobile.length !== 0" class="mgt-8 text-overline">{{
        $t("mobile_money")
      }}</span>
      <div v-if="savedMobile.length !== 0">
        <div
          v-for="(mobile, index) in savedMobile"
          :key="index"
          class="mgt-4 option-border text-caption-1 pda-3"
          :class="{
            'selected-border': picked === mobile.pay_detail_id,
            disabled:
              mobile.daily_limit && getBupayload.amount > mobile.daily_limit,
          }"
        >
          <ChooseOption
            :paymentOption="mobile"
            v-model="picked"
            @change="update(mobile)"
          />
        </div>
      </div>

      <div class="mgt-8" v-if="virtualAccounts.length !== 0">
        <span class="text-overline"> BANK TRANSFER</span>
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
              v-model="picked"
              @change="update(vaccount)"
            />
          </div>
        </div>
      </div>

      <hr class="mgt-5" />

      <span class="link mgt-5" @click="addPaymentOption">
        + {{ $t("add_payment_option") }}</span
      >

      <div class="mgt-4 text-right">
        <sendy-btn
          color="primary"
          class="mgt-10"
          :disabled="!picked"
          @click="handleRouting"
          :loading="loading"
        >
          {{ $t("continue") }}
        </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, watch } from "vue";
import { useStore } from "vuex";
import TopInfo from "../../components/topInfo";
import ChooseOption from "./components/chooseOption";
import Processing from "../../components/processing";
import { useChoosePayment } from "../../hooks/useChoosePayment";
import { usePayment } from "../../hooks/payment";

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
      title: this.$t("choose_payment_option"),
      loadingText: "Loading..",
    };
  },
  setup() {
    const { retrievePaymentMethods } = usePayment();
    const store = useStore();

    const {
      picked,
      creditCards,
      savedMobile,
      virtualAccounts,
      getBupayload,
      getLoading,
      getSavedPayMethods,
      loading,
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

    function getDefaultpayMethod() {
      const method = getSavedPayMethods.value
        ? getSavedPayMethods.value.filter((method) => method.default === 1)[0]
        : [];
      picked.value = method ? method.pay_detail_id : "";
    }

    return {
      picked,
      creditCards,
      savedMobile,
      virtualAccounts,
      getBupayload,
      getLoading,
      loading,
      update,
      handleRouting,
      addPaymentOption,
    };
  },
};
</script>
