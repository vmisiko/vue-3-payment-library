<template>
  <div
    class="direction-flex normal-text pointer"
    @click="handleSelect(paymentMethod)"
  >
    <div class="w-38"
    :class="{'mgr-5': paymentMethod.payment_method_id === 10}"
    >
      <img 
      class="mgx-auto" :src="`${iconUrl}/${paymentMethod?.name?.toLowerCase()}-withdrawal.svg`" alt="">
    </div>
    <div class="direction-flex mgy-auto mgl-5 w-full">
      <span > {{ optionName }} </span>

      <span class="spacer"></span>

      <IconView class="" icon="greator-gray" width="8" height="12" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useGlobalProp } from '../../../hooks/globalProperties';
import { useSegement } from '../../../hooks/useSegment';
import { useWithdrawals } from "../../../hooks/useWithdrawals";

const props = defineProps(["paymentMethod"]);
const { t: translate, router, }  = useGlobalProp();
const { commonTrackPayload } = useSegement();
const { selectedPaymentOption } = useWithdrawals();
const iconUrl = ref("https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons");

const optionName = computed(()=> {
  let result = translate("credit_card_payment_small");
      switch (props.paymentMethod.payment_method_id) {
        case 1:
          result = props.paymentMethod.name;
          break;
        case 2:
          result = translate("credit_card_payment_small");
          break;
        case 20:
          result = translate("pay_by_bank");
          break;
        case 10:
          result = translate('Bank');
          break;
        default:
          result = props.paymentMethod.name;
          break;
      }
      return result;
});


const  handleSelect = (paymentMethod) =>  {
  selectedPaymentOption.value = paymentMethod;
  switch (paymentMethod.payment_method_id) {
    case 1:
      window.analytics.track("Add M-Pesa", {
        ...commonTrackPayload(),
        phone_number: "",
      });
      router.push({ name: "MobileWithdrawal" });
      break;
    case 10:
      window.analytics.track("Add bank", {
        ...commonTrackPayload(),
        card_network: null,
      });
      router.push({ name: "BankWithdrawal" });
      break;
    case 20:
      window.analytics.track("Add Pay by Bank", {
        ...commonTrackPayload(),
        card_network: null,
      });
      router.push({ name: "HowitWorks" });
      break;
    default:
      router.push("/add-card");
      break;
  }
};

</script>
