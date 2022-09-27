<template>
  <div class="direction-flex pointer" @click="handleSelect">
    <IconView :icon="paymentMethod?.pay_method_name.toLowerCase()"  class="mgy-auto"/>

    <div class="mgl-4" v-if="paymentMethod?.pay_method_id === 10">
      <span class="text-caption-1 semi-bold">Absa Bank</span> <br/>
      <span class="text-caption-1  text-gray80">Acc Name : Arabica Coffee</span> <br/>
      <span class="text-caption-1 text-gray80">Acc No : {{ paymentMethod.pay_method_details }}</span> <br/>
    </div>

    <div class="mgl-4" v-if="paymentMethod?.pay_method_id === 1">
      <span class="text-caption-1 semi-bold">{{ paymentMethod?.pay_method_name }}</span> <br/>
      <span class="text-caption-1  text-gray80">Mobile Number : {{ paymentMethod?.pay_method_details }}</span> <br/>
    </div>
    
    <span class="spacer"></span>

    <IconView class="mgy-auto" icon="chevron-right" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "../../../hooks/globalProperties";
import { useState } from "../../../hooks/useState";

const props = defineProps(['paymentMethod']);
const bankName = ref("Absa Bank");
const accountName = ref("Victor Misiko");

const store = useStore();
const { getBupayload } = useState();
const { router } = useGlobalProp();

onMounted(() => {
  console.log(props.paymentMethod);
  if (props.paymentMethod?.pay_method_id === 10 ) {
    getBankDetails();
  }
});

const getBankDetails = async () => {
  const fullPayload = {
    url: `/api/v3/payout/account/${getBupayload.value.user_id}`
  };
  const response = await store.dispatch('paymentAxiosGet', fullPayload);
  console.log(response);
};

const handleSelect = () => {
  switch (props.paymentMethod.pay_method_id) {
    case 10:
      router.push({ name: "BankWithdrawal", params: { edit: true }});
      break;
    case 1:
      console.log("addedd 1");
      router.push({ name: "MobileWithdrawal", params: { edit: true }}); 
      break;
    default:
      router.push({ name: "MobileWithdrawal", params: { edit: true }});
      break;
  }
};

</script>
