<template>
  <div class="flex-center">
    <div class="card-min">
      <TopInfo
        :icon="icon"
        :title="$translate('withdrawal_successful')"
        :mpesaCode="$route.params.reciept"
      />

    <div>
      <div class="mgt-8">
        <span class="normal-text">
          {{
            $translate("amount_paid")
          }}</span
        >

        <div class="float-right">
          <span class="amount-text" >
            {{ getBupayload.currency }} {{ formatCurrency(getBupayload.amount) }}
          </span>
        </div>
      </div>

      <hr class="margin-hr" />

      <div class="mgt-8">
        <span class="normal-text">
          {{
            $translate('payment_method')
          }}</span
        >

        <div class="direction-flex float-right">
          
          <img 
           :src="`${iconUrl}/${selectedPaymentOption.pay_method_name.toLowerCase()}-withdrawal.svg`" 
           alt=""
           >
          <span
            class="mgl-2 text-caption-1"
            v-if="selectedPaymentOption.pay_method_id === 1"
          >
            {{ selectedPaymentOption.pay_method_name }}</span
          >

          <span
            class="mgl-2 text-caption-1"
            v-if="selectedPaymentOption.pay_method_id === 10"
          >
            {{ selectedPaymentOption.bankDetails.operator_name }}
          </span>
        </div>
      </div>
    </div>

    <hr class="margin-hr" />

    <div class="direction-flex">
          
      <div class="w-38 mgy-auto">
        <img 
        class="mgx-auto" :src="`${iconUrl}/${selectedPaymentOption.pay_method_name.toLowerCase()}-withdrawal.svg`" alt="">
        </div>

      <div class="mgl-4" v-if="selectedPaymentOption?.pay_method_id === 10">
        <span class="text-caption-1 semi-bold text-gray90">{{ $translate('bank_name') }}</span>: <span class="text-caption-1">{{ selectedPaymentOption?.bankDetails?.operator_name   || "N/A" }}</span> <br/>
        <span class="text-caption-1 semi-bold text-gray90">{{ $translate('acc_name') }}</span>: <span class="text-caption-1">{{ selectedPaymentOption?.bankDetails?.account_name || `${getBupayload.firstname} ${getBupayload.lastname}` }}</span> <br/>
        <span class="text-caption-1 semi-bold text-gray90">{{ $translate('acc_no') }}</span>: <span class="text-caption-1">{{ selectedPaymentOption.pay_method_details }}</span> <br/>
      </div>
      <div class="mgl-4" v-if="selectedPaymentOption?.pay_method_id === 1">
        <span class="text-caption-1 semi-bold text-gray90">M-PESA</span> <br/>
        <span class="text-caption-1 semi-bold text-gray90">{{ $translate('mobile_number') }}</span>: <span class="text-caption-1">{{ selectedPaymentOption.pay_method_details || "N/A" }}</span> <br/>
      </div>
    </div>

      <div class="mgt-8 text-right">
        <sendy-btn
          color="primary"
          class="mgt-10"
          @click="routing"
        >
          {{ $translate("done") }}
        </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { mapGetters, mapMutations } from "vuex";
import TopInfo from "../../components/topInfo";
import PaymentDetail from "../../components/paymentDetail";
import { useState } from '../../hooks/useState';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useGlobalProp } from '../../hooks/globalProperties';
import { useSegement } from '../../hooks/useSegment';

const icon = ref("success");
const title = ref("Withdrawal Successful");
const subtitle = ref("");
const loading = ref("");
const mpesaCode = ref("");

const { getBupayload , getSavedPayMethods, } = useState()
const { selectedPaymentOption , formatCurrency } = useWithdrawals();
const { route, router, iconUrl } = useGlobalProp();
const { commonTrackPayload } = useSegement();

const routing = () => {
  window.analytics.track("Tap done after successful withdrawal", {
    ...commonTrackPayload(),
  });
  router.push(localStorage.entry_route);
};


</script>
