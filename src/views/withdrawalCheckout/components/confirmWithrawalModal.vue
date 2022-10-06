<template>
  <div id="cvv-modal" class="modal" ref="confirmModal">
    <div class="modal-content">
      <div class="mgt-4">
        
        <div class="flex">
          <span class="text-subtitle-1"
            > {{ $translate('confirm_details') }}  </span
          >

          <span class="spacer"></span>
          <svg @click="$emit('close')" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.699778 0.71001C0.792292 0.617307 0.90218 0.543759 1.02315 0.493577C1.14413 0.443396 1.27381 0.417566 1.40478 0.417566C1.53575 0.417566 1.66543 0.443396 1.7864 0.493577C1.90738 0.543759 2.01726 0.617307 2.10978 0.71001L6.99978 5.59001L11.8898 0.70001C11.9824 0.607428 12.0923 0.533988 12.2132 0.483883C12.3342 0.433778 12.4638 0.40799 12.5948 0.40799C12.7257 0.40799 12.8554 0.433778 12.9763 0.483883C13.0973 0.533988 13.2072 0.607428 13.2998 0.70001C13.3924 0.792592 13.4658 0.902502 13.5159 1.02347C13.566 1.14443 13.5918 1.27408 13.5918 1.40501C13.5918 1.53594 13.566 1.66559 13.5159 1.78655C13.4658 1.90752 13.3924 2.01743 13.2998 2.11001L8.40978 7.00001L13.2998 11.89C13.3924 11.9826 13.4658 12.0925 13.5159 12.2135C13.566 12.3344 13.5918 12.4641 13.5918 12.595C13.5918 12.7259 13.566 12.8556 13.5159 12.9766C13.4658 13.0975 13.3924 13.2074 13.2998 13.3C13.2072 13.3926 13.0973 13.466 12.9763 13.5161C12.8554 13.5662 12.7257 13.592 12.5948 13.592C12.4638 13.592 12.3342 13.5662 12.2132 13.5161C12.0923 13.466 11.9824 13.3926 11.8898 13.3L6.99978 8.41001L2.10978 13.3C2.0172 13.3926 1.90728 13.466 1.78632 13.5161C1.66536 13.5662 1.53571 13.592 1.40478 13.592C1.27385 13.592 1.1442 13.5662 1.02323 13.5161C0.902269 13.466 0.792359 13.3926 0.699778 13.3C0.607196 13.2074 0.533755 13.0975 0.48365 12.9766C0.433545 12.8556 0.407757 12.7259 0.407757 12.595C0.407757 12.4641 0.433545 12.3344 0.48365 12.2135C0.533755 12.0925 0.607196 11.9826 0.699778 11.89L5.58978 7.00001L0.699778 2.11001C0.319777 1.73001 0.319777 1.09001 0.699778 0.71001Z" fill="#606266"/>
          </svg>
        </div>

        <hr class="mgt-6">

        <div class="mgy-4">
          <span class="body-2-semibold text-gray80"> {{ $translate('send_money_to') }}</span>
        </div>


        <div class="direction-flex">
          
          <div class="w-38 mgy-auto">
            <img 
            class="mgx-auto" :src="`${iconUrl}/${selectedPaymentOption?.pay_method_name?.toLowerCase()}-withdrawal.svg`" alt="">
          </div>

          <div class="mgl-4" v-if="selectedPaymentOption?.pay_method_id === 10">
            <span class="text-caption-1 semi-bold text-gray90">{{ $translate('bank_name') }}</span>: <span class="text-caption-1">{{ selectedPaymentOption?.bankDetails?.operator_name   || "N/A" }}</span> <br/>
            <span class="text-caption-1 semi-bold text-gray90">{{ $translate('acc_name') }}</span>: <span class="text-caption-1">{{ `${getBupayload.firstname} ${getBupayload.lastname}` }}</span> <br/>
            <span class="text-caption-1 semi-bold text-gray90">{{ $translate('acc_no') }}</span>: <span class="text-caption-1">{{ selectedPaymentOption.pay_method_details }}</span> <br/>
          </div>
          <div class="mgl-4" v-if="selectedPaymentOption?.pay_method_id === 1">
            <span class="text-caption-1 semi-bold text-gray90">M-PESA</span> <br/>
            <span class="text-caption-1 semi-bold text-gray90">{{ $translate('mobile_number') }}</span>: <span class="text-caption-1">{{ selectedPaymentOption.pay_method_details || "N/A" }}</span> <br/>
          </div>
        </div>
      
      </div>

      <div class="flex justify-between mgt-5">
        <div class="w-full">
          <span class="text-caption text-gray70">
            {{ $translate('withdrawal_amount') }}
          </span>
          <div class="payment-text-secondary">
            {{ getBupayload.currency }}
            {{ formatCurrency(getBupayload.amount) }}
          </div>
        </div>
        <span class="mgx-4"></span>
        <sendy-btn
        class=""
        color="primary"
        type="submit"
        @click="submit"
        :loading="getLoading"
      >
        {{ $translate('withdrawal') }}
      </sendy-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useGlobalProp } from "../../../hooks/globalProperties";
import { useWithdrawals } from "../../../hooks/useWithdrawals";
import  { useOtp } from "../../../hooks/useOtp";
import { useStore } from "vuex";
import { useState } from "../../../hooks/useState";

const confirmModal = ref(null);
const props = defineProps(["show", "payMethod"]);
const emit = defineEmits(['close']);
const store = useStore();
const { router , iconUrl }  = useGlobalProp();
const { getLoading } = useState();
const { selectedPaymentOption, phone, formatCurrency, withdraw } = useWithdrawals();


watch(() => props.show, (val) => {
  val ? handleOpen() : handleClose();
});

onMounted(() => {
  props.show ? handleOpen() : handleClose();
})

const handleOpen = () => {
  confirmModal.value.style.display = "block";
};

const handleClose = () => {
  confirmModal.value.style.display  = "none";
};

const submit = () => {
  withdraw();
  emit('close');
}


</script>

<style lang="scss">
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 150px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

/* The Close Button */
.close {
  color: black;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
