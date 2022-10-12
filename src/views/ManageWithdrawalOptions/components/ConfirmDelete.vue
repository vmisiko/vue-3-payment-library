<template>
  <div id="cvv-modal" class="modal" ref="confirmModal">
    <div class="modal-content">
      <div class="mgt-5">
        <span>{{ $translate("sure_remove_withdrawal_option") }}</span>
      </div>

      <div class="direction-flex mgt-5">
        <div class="w-38 mgy-auto">
          <img 
          class="mgx-auto" :src="`${iconUrl}/${selectedPaymentOption?.pay_method_name?.toLowerCase()}-withdrawal.svg`" alt="">
        </div>

        <div class="mgl-4" v-if="selectedPaymentOption?.pay_method_id === 10">
          <span class="text-caption-1 semi-bold text-gray90">{{ $translate("bank_name") }}</span>: <span class="text-caption-1">{{ selectedPaymentOption?.bankDetails?.operator_name   || "N/A" }}</span> <br/>
          <span class="text-caption-1 semi-bold text-gray90"> {{ $translate("acc_name") }}</span>: <span class="text-caption-1">{{ selectedPaymentOption?.bankDetails?.account_name || `${getBupayload.firstname} ${getBupayload.lastname}` }}</span> <br/>
          <span class="text-caption-1 semi-bold text-gray90">{{ $translate("acc_no") }}</span>: <span class="text-caption-1">{{ selectedPaymentOption.pay_method_details }}</span> <br/>
        </div>

        <div class="mgl-4" v-if="selectedPaymentOption?.pay_method_id === 1">
          <span class="text-caption-1 semi-bold text-gray90">M-PESA</span> <br/>
          <span class="text-caption-1 semi-bold text-gray90">{{ $translate("mobile_number") }}</span>: <span class="text-caption-1">{{ selectedPaymentOption.pay_method_details || "N/A" }}</span> <br/>
        </div>
      </div>

      <div class="flex justify-between">
        <sendy-btn
          color="info"
          class="mgt-5"
          type="text"
          @click="$emit('close')"
        >
          {{ $translate('cancel') }}
        </sendy-btn>
        <span class="mgx-4"></span>
        <sendy-btn
          color="primary"
          class="mgt-5 w-full"
          type="submit"
          @click="submit"
          :loading="loading"
        >
          {{ selectedPaymentOption?.pay_method_id === 1 ? $translate('remove_mpesa') :  $translate('remove_bank')}}
        </sendy-btn>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "../../../hooks/globalProperties";
import { useOtp } from "../../../hooks/useOtp";
import { useWithdrawals } from "../../../hooks/useWithdrawals";

const confirmModal = ref(null);
const props = defineProps(["show"]);
const emit = defineEmits(['close']);
const { router }  = useGlobalProp();
const store = useStore();
const iconUrl = ref("https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons");

const { getOtp, loading } = useOtp();
const { selectedPaymentOption,  selectedBank, accountName, accountNumber } = useWithdrawals();

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

const submit  = async () => {
  const response = await getOtp();
  if (response.status) {
    router.push({ name: 'ConfirmOtp', params: { delete: true }});
    return;
  }
  store.dispatch('paymentNotification' , {
    text:response.message,
    type: "error"
  });

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
