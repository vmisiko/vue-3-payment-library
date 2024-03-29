<template>
  <div class="flex-center">
    <Processing v-if="loading" :text="$translate('please_wait_process_request')" />

    <div class="card" v-else >
      <div class="">
        <IconView :icon="icon" />
        <div class="mgt-4">
          <span class="title-payment">
            {{ $translate('confirmation') }}
          </span>
        </div>

        <div class="mgt-4">
            <span>
              For security, we have sent you a {{ pinLength }}-digit OTP code to the your email '{{ formatEmail }}' to confirm this change
            </span>
        </div>
      </div>

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
          <IconView
              class="mgl-2"
              icon="loading1"
              width="1.5em"
              height="1.5em"
              v-if="loadingOtp"
            />
          <span v-else @click="resendOtp" class="text-midnightBlue20 text-gray70 pointer "> {{ $translate('resend') }} </span>
        </div>
      </div>

      <div class="mgy-10"></div>

      <sendy-btn 
      color="primary"
      class=""
      :block="true"
      text="Confirm"
      :disabled="disableotp"
      @click="submit"
      :loading="loading"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import VOtpInput from 'vue3-otp-input';
import PaymentOption from './components/PaymentOption.vue';
import Processing from "../../components/processing";
import { useState } from '../../hooks/useState';
import { useGlobalProp } from '../../hooks/globalProperties';
import { useOtp } from '../../hooks/useOtp';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { useSegement } from '../../hooks/useSegment';

const icon = ref('back');
const { router , route } = useGlobalProp();
const otp = ref('');
const disableotp = ref(true);
const { getBupayload } = useState();

const { validateOtp, otpError, pinLength, getOtp, loading: loadingOtp } = useOtp();
const { addBank, addMpesa, selectedPaymentOption, accountName, accountNumber , selectedBank, isEdit, deleteBank, deleteWithdrawalOption, loading } = useWithdrawals();
const { commonTrackPayload } = useSegement();

const formatEmail = computed(() => {
  const res = `${getBupayload.value.email.split("@")[0].substr(0,1)}****@${getBupayload.value.email.split("@")[1]}`;
  return res;
});

onMounted(() => {
  window.analytics.track("View withdrawal option OTP confirmation page", {
    ...commonTrackPayload(),
    withdrawal_option: selectedPaymentOption.value?.pay_method_name ?? selectedPaymentOption.value?.name,
  });
});

const handleOnComplete = (val) => {
  otp.value = val;
  disableotp.value = false;
};

const resendOtp = () => {
  window.analytics.track("Tap resend OTP", {
    ...commonTrackPayload(),
    withdrawal_option: selectedPaymentOption.value?.pay_method_name ?? selectedPaymentOption.value?.name,
  });
  getOtp();
};

const submit = async () => {
  window.analytics.track("Tap confirm OTP", {
    ...commonTrackPayload(),
    withdrawal_option: selectedPaymentOption.value?.pay_method_name ?? selectedPaymentOption.value?.name,
  });
  const response = await validateOtp(otp.value);
  if (!response.status) {
    window.analytics.track("OTP Validation Failed", {
      ...commonTrackPayload(),
      withdrawal_option: selectedPaymentOption.value?.pay_method_name ?? selectedPaymentOption.value?.name,
    });
    router.push({ name: 'OtpFail' });
    return;
  }
  window.analytics.track("OTP Validation Passed", {
      ...commonTrackPayload(),
      withdrawal_option: selectedPaymentOption.value?.pay_method_name ?? selectedPaymentOption.value?.name,
    });
  if (route.params.delete) {
    await deleteWithdrawalOption();
    return;
  }
  selectedPaymentOption.value?.payment_method_id === 10 ? await addBank() : await addMpesa(); 
};



</script>

<style>
.margin-hr {
  margin-top: 16px !important;
  margin-bottom: 19px !important;
}
.lib-otp-input {
  width: 30px ;
  height: 30px;
  padding: 5px;
  margin: 0 10px;
  font-size: 15px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
</style>