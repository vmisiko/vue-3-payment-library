<template>
  <div class="mgl-2">
    <div v-if="paymentOption.isCard" class="direction-flex mgy-auto">
        <span id="psp">{{ paymentOption.psp }} </span>
        <span id="card-id" class="gray80-text mgl-2">
          {{ paymentOption.pay_method_details ? formatLastFour(paymentOption.pay_method_details)  : $translate('credit_stroke_debit_card')}}</span
        >
    </div>
    <div v-if="paymentOption.isPayWithBankTransfer" >
        <div class="mgy-auto">
          <span id="pay-by-bank"> {{ $translate('pay_by_bank') }}</span>
          <div class="caption-2-semibold text-gray70 direction-flex" v-if="(!getBupayload.isPayOnDelivery && !hideAvalailablebalance)">
            <span> {{  $translate('available_balance') }}</span>

            <IconView
              class="mgl-2"
              icon="loading1"
              width="1.5em"
              height="1.5em"
              v-if="loading"
            />
            
            <span class="mgl-2" v-else>
              {{ getBupayload.currency }} {{ balance }}</span
            >
          </div>
        </div>
    </div>
    <div class="mgy-auto" v-if="!paymentOption.isCard && !paymentOption.isPayWithBankTransfer">
      <span id="non-card">{{ paymentOption.pay_method_name }}</span>
    </div>
   
  </div>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import { useGlobalProp } from "../../../hooks/globalProperties";
import { useState } from "../../../hooks/useState";

const props = defineProps([ 'paymentOption', 'loading', 'balance']);
const { route } = useGlobalProp();

const { getBupayload } = useState();

const formatLastFour = (cardno) => {
  const result = cardno?.substr(-4);
  return `**** ${result}`
} 

const hideAvalailablebalance = computed(() => {

  const routeNames = [
    'Entry',
    'FailedView',
    'SuccessView',
    'PaymentOptionsPage',
  ]
  return routeNames.includes(route.name);
} );

</script>
