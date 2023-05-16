<template>
  <div class=" pointer" :class="{'disabled': isDisabled}">
    <div class="direction-flex">
      <div class="w-38 mgy-auto">
        <img 
          class="mgx-auto" 
          :src="`${iconUrl}/${paymentMethod?.pay_method_name?.toLowerCase()}-withdrawal.svg`" alt=""
        >
      </div>

      <div class="mgl-4" v-if="paymentMethod?.pay_method_id === 10">
        <span class="text-caption-1 semi-bold">{{ bankDetails.operator_name }}</span> <br/>
        <span class="text-caption-1  text-gray80">{{ $translate('acc_name') }} : {{ bankDetails.account_name || getBupayload.firstname + " " + getBupayload.lastname }}</span> <br/>
        <span class="text-caption-1 text-gray80">{{ $translate('acc_no') }} : {{ paymentMethod.pay_method_details }}</span> <br/>
      </div>

      <div class="mgl-4" v-if="paymentMethod?.pay_method_id === 1">
        <span class="text-caption-1 semi-bold">{{ paymentMethod?.pay_method_name }}</span> <br/>
        <span class="text-caption-1  text-gray80">{{ $translate('mobile_number') }} : {{ paymentMethod?.pay_method_details }}</span> <br/>
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
    <div class="text-caption-2 text-sendy-red-30 mgt-3" v-if="isDisabled">
      <span class="">{{ $translate("unavailable_withdrawal") }}</span>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from "vue";
  import { useStore } from "vuex";
  import { useGlobalProp } from "../../../hooks/globalProperties";
import { useSegement } from "../../../hooks/useSegment";
  import { useState } from "../../../hooks/useState";
  import { useWithdrawals } from "../../../hooks/useWithdrawals";
  
  const props = defineProps(['paymentMethod', 'modelValue']);
  const emit = defineEmits(['update:modelValue']);
  const bankDetails = ref("");
  const { commonTrackPayload } = useSegement();
  
  const store = useStore();
  const { getBupayload } = useState();
  const { iconUrl } = useGlobalProp();

  const { selectedPaymentOption } = useWithdrawals();

  const isDisabled = computed(() => {
    return getBupayload.value.amount > (props.paymentMethod?.withdrawal_limit || 0);
  });

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
    window.analytics.track("Select withdraw cash option", {
      ...commonTrackPayload(),
      selected_option: props.paymentMethod.pay_method_name,
      account: props.paymentMethod.pay_method_details,
    });
    selectedPaymentOption.value  = { ...props.paymentMethod, bankDetails: bankDetails.value };
  };


  
  </script>
  