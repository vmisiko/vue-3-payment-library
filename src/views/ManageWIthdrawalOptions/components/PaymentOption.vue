<template>
  <div
    class="direction-flex normal-text pointer"
    @click="handleSelect(paymentMethod)"
  >
    <IconView
      class="text-center mgt-n2"
      :icon="paymentMethod.name.toLowerCase()"
    />

    <span class="mgl-5"> {{ optionName }} </span>

    <span class="spacer"></span>

    <IconView icon="greator-gray" width="8" height="12" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useGlobalProp } from '../../../hooks/globalProperties';
import { useSegement } from '../../../hooks/useSegment';

const props = defineProps(["paymentMethod"]);
const { t: translate, router, }  = useGlobalProp();
const { commonTrackPayload } = useSegement();

const optionName = computed(()=> {
  let result = translate("credit_card_payment_small");
      switch (props.paymentMethod.payment_method_id) {
        case 1:
          result = this.paymentMethod.name;
          break;
        case 2:
          result = translate("credit_card_payment_small");
          break;
        case 20:
          result = "Pay by Bank";
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
      switch (paymentMethod.payment_method_id) {
        case 1:
          window.analytics.track("Add M-Pesa", {
            ...commonTrackPayload(),
            phone_number: "",
          });

          router.push({ name: "MobileWithrawal" });
          break;
        case 10:
          window.analytics.track("Add bank", {
            ...commonTrackPayload(),
            card_network: null,
          });
          router.push({ name: "MobileWithrawal" });
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
