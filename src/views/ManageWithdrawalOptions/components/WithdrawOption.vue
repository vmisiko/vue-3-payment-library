<template>
  <div class="direction-flex pointer" @click="handleSelect">
      <div class="w-38 mgy-auto">
        <img class="mgx-auto" :src="`${iconUrl}/${paymentMethod?.pay_method_name?.toLowerCase()}-withdrawal.svg`" alt="">
      </div>

    <div class="mgl-4" v-if="paymentMethod?.pay_method_id === 10">
      <span class="text-caption-1 semi-bold">{{ bankDetails?.operator_name }}</span> <br/>
      <span class="text-caption-1  text-gray80">{{ $translate("acc_name") }} : {{ `${getBupayload.firstname} ${getBupayload.lastname}` }}</span> <br/>
      <span class="text-caption-1 text-gray80">{{ $translate("acc_no") }} : {{ paymentMethod.pay_method_details }}</span> <br/>
    </div>

    <div class="mgl-4" v-if="paymentMethod?.pay_method_id === 1">
      <span class="text-caption-1 semi-bold">{{ paymentMethod?.pay_method_name }}</span> <br/>
      <span class="text-caption-1  text-gray80">{{ $translate("mobile_number") }} : {{ paymentMethod?.pay_method_details }}</span> <br/>
    </div>
    
    <span class="spacer"></span>

    <IconView class="mgy-auto" icon="chevron-right" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "../../../hooks/globalProperties";
import { useSegement } from "../../../hooks/useSegment";
import { useState } from "../../../hooks/useState";
import { useWithdrawals } from "../../../hooks/useWithdrawals";

const props = defineProps(['paymentMethod']);
const bankDetails = ref("");

const store = useStore();
const { getBupayload } = useState();
const { router } = useGlobalProp();
const iconUrl = ref("https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons");

const { selectedPaymentOption } = useWithdrawals();
const { commonTrackPayload } = useSegement();
onMounted(() => {
  if (props.paymentMethod?.pay_method_id === 10 ) {
    getBankDetails();
  }
});

const getBankDetails = async () => {
  const fullPayload = {
    url: `/api/v3/payout/account/${props.paymentMethod.pay_detail_id}`
  };
  const response = await store.dispatch('paymentAxiosGet', fullPayload);
  bankDetails.value = response;
};

const handleSelect = () => {
  selectedPaymentOption.value = { ...props.paymentMethod, bankDetails: bankDetails.value };
  
  window.analytics.track('Select a withdrawal option', {
    ...commonTrackPayload(),
    intention: 'view',
    withdrawal_option: selectedPaymentOption?.value?.pay_method_name,
    account: selectedPaymentOption?.value?.pay_method_details,
  })
  switch (props.paymentMethod.pay_method_id) {
    case 10:
      router.push({ name: "BankWithdrawal", params: { edit: true }});
      break;
    case 1:
      router.push({ name: "MobileWithdrawal", params: { edit: true }}); 
      break;
    default:
      router.push({ name: "MobileWithdrawal", params: { edit: true }});
      break;
  }
};

</script>
