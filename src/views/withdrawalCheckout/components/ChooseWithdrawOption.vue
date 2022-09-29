<template>
  <div class="direction-flex pointer">
    <IconView :icon="paymentMethod?.pay_method_name.toLowerCase()"  class="mgy-auto"/>

    <div class="mgl-4" v-if="paymentMethod?.pay_method_id === 10">
      <span class="text-caption-1 semi-bold">{{ bankDetails.operator_name }}</span> <br/>
      <span class="text-caption-1  text-gray80">Acc Name : {{ bankDetails.account_name || getBupayload.firstname + " " + getBupayload.lastname }}</span> <br/>
      <span class="text-caption-1 text-gray80">Acc No : {{ paymentMethod.pay_method_details }}</span> <br/>
    </div>

    <div class="mgl-4" v-if="paymentMethod?.pay_method_id === 1">
      <span class="text-caption-1 semi-bold">{{ paymentMethod?.pay_method_name }}</span> <br/>
      <span class="text-caption-1  text-gray80">Mobile Number : {{ paymentMethod?.pay_method_details }}</span> <br/>
    </div>
    
    <span class="spacer"></span>

    <div class="mgy-auto">
        <input
          class="float-right payment-input"
          name="withdrawalOption"
          type="radio"
          :value="paymentMethod"
          @input="(event) => {
            $emit('update:modelValue', event.target.value);
            handleSelect();
          }"
        />
      </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { useStore } from "vuex";
  import { useGlobalProp } from "../../../hooks/globalProperties";
  import { useState } from "../../../hooks/useState";
  import { useWithdrawals } from "../../../hooks/useWithdrawals";
  
  const props = defineProps(['paymentMethod', 'modelValue']);
  const emit = defineEmits(['update:modelValue']);
  const bankDetails = ref("");
  
  const store = useStore();
  const { getBupayload } = useState();
  const { router } = useGlobalProp();
  const iconUrl = ref("https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons");
  
  const { selectedPaymentOption } = useWithdrawals();
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
    selectedPaymentOption.value  = { ...props.paymentMethod, bankDetails: bankDetails.value };
  };


  
  </script>
  