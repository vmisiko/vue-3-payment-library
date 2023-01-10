<template>
  <div class="">
    <img
      width="34"
      :src="`${iconUrl}/${name?.toLowerCase()}.svg`"
      alt=""
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps([ 'paymentOption']);
const iconUrl = 'https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons';

const name = computed(() => {
  const cardName = props.paymentOption?.psp || 'card';
  return props?.paymentOption?.isCard() ? cardName : props.paymentOption.pay_method_name;
}); 

</script>
