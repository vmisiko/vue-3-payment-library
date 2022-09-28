<template>
  <div class="flex-center">
    <div class="card-min" >
      <TopInfo :icon="icon" title="Confirmation">
        <template v-slot:subtitle>
          <span class="body-2-regular text-gray70">
            For security, we have sent you a 4-digit OTP code to the your email “s****@gmail.com” to confirm this change
          </span>
        </template>
      </TopInfo>

      <div class="mgt-9">
        <v-otp-input
          ref="otpInput"
          class="mgl-n9"
          input-classes="lib-otp-input"
          separator="-"
          :num-inputs="pinLength"
          :should-auto-focus="true"
          :is-input-num="true"
          @on-complete="handleOnComplete"
        />
        <span class="mgl-2 text-caption-2 text-error" v-if="otpError">{{ otpError }}</span>
        <div class="mgt-3 text-center">
          <span  class="text-gray70 pointer">{{ $translate('did_not_recieve_otp_Code') }}</span>
          <span @click="handleOnComplete" class="text-midnightBlue20 text-gray70 "> Resend </span>
        </div>
      </div>

      <div class="mgy-10"></div>

      <sendy-btn 
      color="primary"
      :block="true"
      text="Confirm"
      :disable="disableotp"
      @click="submit"
      :loading="loading"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import VOtpInput from 'vue3-otp-input';
import TopInfo from '../../components/topInfo.vue';
import PaymentOption from './components/PaymentOption.vue';
import Processing from "../../components/processing";
import { useState } from '../../hooks/useState';
import { useGlobalProp } from '../../hooks/globalProperties';
import { useOtp } from '../../hooks/useOtp';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useStore } from 'vuex';

const title = ref('Add a withdrawal option');
const icon = ref("back");
const { router , route} = useGlobalProp();
const otp = ref();
const disableotp = ref(true);
const store = useStore();

const { validateOtp, otpError, pinLength } = useOtp();
const { addBank, addMpesa, selectedPaymentOption, accountName, accountNumber , selectedBank, isEdit, deleteBank, deleteMpesa, loading } = useWithdrawals();

const handleOnComplete = (val) => {
  otp.value = val;
  disableotp.value = false;
};

const submit = async () => {
  const response = await validateOtp(otp.value);
  if (!response.status) {
    router.push({ name: 'OtpFail' });
  }
  if (route.params.delete) {
    selectedPaymentOption.value?.pay_method_id === 10 ? await deleteBank() : await deleteMpesa(); 
    return;
  }
  await addBank();
};

</script>

<style>
.margin-hr {
  margin-top: 16px !important;
  margin-bottom: 19px !important;
}
</style>