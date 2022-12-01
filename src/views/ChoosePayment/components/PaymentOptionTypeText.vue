<template>
  <div class="mgl-2">
    <div v-if="paymentOption.pay_method_id === 2" class="direction-flex">
        <span>{{ paymentOption.psp }} </span>
        <span class="gray80-text mgl-2">
          {{ $formatLastFour(paymentOption.pay_method_details) }}</span
        >
    </div>
    <div v-if="paymentOption.pay_method_id === 20" >
        <div class="mgy-auto">
          <span> {{ $translate('pay_by_bank') }}</span>
          <div class="caption-2-semibold text-gray70 direction-flex" v-if="getBupayload.pay_direction !== 'PAY_ON_DELIVERY' ">
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
    <div v-if="paymentOption.pay_method_id !== 2 && paymentOption.pay_method_id === 20">
      <span>{{ paymentOption.pay_method_name }}</span>
    </div>
   
  </div>
</template>

<script setup>
import { useState } from "../../../hooks/useState";

const props = defineProps([ 'paymentOption', 'loading', 'balance']);

const { getBupayload } = useState();
</script>
