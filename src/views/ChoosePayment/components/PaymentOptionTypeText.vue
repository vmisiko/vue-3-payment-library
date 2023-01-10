<template>
  <div class="mgl-2">
    <div v-if="paymentOption.isCard()" class="direction-flex">
        <span>{{ paymentOption.psp }} </span>
        <span class="gray80-text mgl-2">
          {{ paymentOption.pay_method_details ? $formatLastFour(paymentOption.pay_method_details)  : $translate('credit_stroke_debit_card')}}</span
        >
    </div>
    <div v-if="paymentOption.isPayWithTransfer" >
        <div class="mgy-auto">
          <span> {{ $translate('pay_by_bank') }}</span>
          <div class="caption-2-semibold text-gray70 direction-flex" v-if="(getBupayload.isPayOnDelivery() && !hideAvalailablebalance)">
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
    <div v-if="!paymentOption.isCard() && !paymentOption.isPayWithTransfer">
      <span>{{ paymentOption.pay_method_name }}</span>
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

const isCheckout = computed(() =>  route.name === 'Entry');

const hideAvalailablebalance = computed(() => {
  return route.name === 'Entry' || route.name === 'FailedView' || route.name === 'SuccessView';
} );

console.log(props.paymentOption, props.paymentOption.isCard() );

</script>
