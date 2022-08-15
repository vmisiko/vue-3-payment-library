<template>
  <div id="verify-phone" class="modal" ref="verifyPhone">
    <div class="modal-content">
      <div>
        <svg v-if="step !== 3" @click="$emit('close')" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.699778 0.71001C0.792292 0.617307 0.90218 0.543759 1.02315 0.493577C1.14413 0.443396 1.27381 0.417566 1.40478 0.417566C1.53575 0.417566 1.66543 0.443396 1.7864 0.493577C1.90738 0.543759 2.01726 0.617307 2.10978 0.71001L6.99978 5.59001L11.8898 0.70001C11.9824 0.607428 12.0923 0.533988 12.2132 0.483883C12.3342 0.433778 12.4638 0.40799 12.5948 0.40799C12.7257 0.40799 12.8554 0.433778 12.9763 0.483883C13.0973 0.533988 13.2072 0.607428 13.2998 0.70001C13.3924 0.792592 13.4658 0.902502 13.5159 1.02347C13.566 1.14443 13.5918 1.27408 13.5918 1.40501C13.5918 1.53594 13.566 1.66559 13.5159 1.78655C13.4658 1.90752 13.3924 2.01743 13.2998 2.11001L8.40978 7.00001L13.2998 11.89C13.3924 11.9826 13.4658 12.0925 13.5159 12.2135C13.566 12.3344 13.5918 12.4641 13.5918 12.595C13.5918 12.7259 13.566 12.8556 13.5159 12.9766C13.4658 13.0975 13.3924 13.2074 13.2998 13.3C13.2072 13.3926 13.0973 13.466 12.9763 13.5161C12.8554 13.5662 12.7257 13.592 12.5948 13.592C12.4638 13.592 12.3342 13.5662 12.2132 13.5161C12.0923 13.466 11.9824 13.3926 11.8898 13.3L6.99978 8.41001L2.10978 13.3C2.0172 13.3926 1.90728 13.466 1.78632 13.5161C1.66536 13.5662 1.53571 13.592 1.40478 13.592C1.27385 13.592 1.1442 13.5662 1.02323 13.5161C0.902269 13.466 0.792359 13.3926 0.699778 13.3C0.607196 13.2074 0.533755 13.0975 0.48365 12.9766C0.433545 12.8556 0.407757 12.7259 0.407757 12.595C0.407757 12.4641 0.433545 12.3344 0.48365 12.2135C0.533755 12.0925 0.607196 11.9826 0.699778 11.89L5.58978 7.00001L0.699778 2.11001C0.319777 1.73001 0.319777 1.09001 0.699778 0.71001Z" fill="#606266"/>
        </svg>

        <svg  v-if="step === 3" @click="step=2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.582 7.00002L3.41203 7.00002L8.29203 2.12002C8.68203 1.73002 8.68203 1.09002 8.29203 0.700022C7.90203 0.310021 7.27203 0.310021 6.88203 0.700022L0.29203 7.29002C0.199327 7.38253 0.125779 7.49242 0.0755978 7.6134C0.0254164 7.73437 -0.000411987 7.86405 -0.000411987 7.99502C-0.000411987 8.12599 0.0254164 8.25567 0.0755978 8.37664C0.125779 8.49762 0.199327 8.60751 0.29203 8.70002L6.87203 15.3C6.96461 15.3926 7.07452 15.466 7.19549 15.5161C7.31645 15.5663 7.4461 15.592 7.57703 15.592C7.70796 15.592 7.83761 15.5663 7.95857 15.5161C8.07954 15.466 8.18945 15.3926 8.28203 15.3C8.37461 15.2074 8.44805 15.0975 8.49816 14.9766C8.54826 14.8556 8.57405 14.726 8.57405 14.595C8.57405 14.4641 8.54826 14.3344 8.49816 14.2135C8.44805 14.0925 8.37461 13.9826 8.28203 13.89L3.41203 9.00002L14.582 9.00002C15.132 9.00002 15.582 8.55002 15.582 8.00002C15.582 7.45002 15.132 7.00002 14.582 7.00002Z" fill="#606266"/>
        </svg>

      </div>
      <div class="mgt-9" v-if="step === 1">
        <div >
          <span class="text-subtitle-2"> {{ $translate('verify_phone_number') }}</span>
        </div>
        <div class="mgt-4">
          <label for="" class="text-caption-1"> {{ $translate('your_phone_number') }}</label>
          <div class="mgt-1">
            <vue-tel-input
              v-model="phone"
              autoFormat
              :defaultCountry="getBupayload.country_code"
              :dropdownOptions="dropdownOptions"
              mode="national"
              :invalidMsg="$translate('phone_number_invalid')"
              @validate="validatePhone"
            >
            </vue-tel-input>
            <span class="text-caption-2 text-error" v-if="error">
              {{ error }}</span
            >
          </div>
        </div>
        <div class="mgt-8">
          <sendy-btn
            block="true"
            class=""
            color="primary"
            :disabled="!disable"
            @click="getOtp"
            :loading="loading"
          >
            {{ $translate('get_security_code') }}
          </sendy-btn>
        </div>
      </div>

      <div class="mgt-9" v-if="step=== 2">
        <div>
          <span class="text-subtitle-2"> {{ $translate('enter_verification_code') }} </span>
        </div>

         <div class="mgt-4">
          <label for="" class="text-caption-1 text-gray-80"> {{ $translate('mobile') }}: {{ formattedPhone }}</label>
          <div class="mgt-1">
            <v-otp-input
              ref="otpInput"
              class="mgl-n9"
              input-classes="otp-input"
              separator="-"
              :num-inputs="pinLength"
              :should-auto-focus="true"
              :is-input-num="true"
              @on-complete="handleOnComplete"
            />
            <span class="mgl-2 text-caption-2 text-error" v-if="otpError">{{ otpError }}</span>
            <div class="mgt-3">
              <span @click="step=3" class="text-midnightBlue20 pointer">{{ $translate('did_not_recieve_code') }}</span>
              <span class="text-body-2 text-gray70 float-right"> {{ otpCounter }} </span>
            </div>
          </div>
        </div>
        <div class="mgt-8">
          <sendy-btn
            block="true"
            class=""
            color="primary"
            :disabled="disableotp"
            @click="validateOtp"
          >
            {{ $translate('confirm') }}
          </sendy-btn>
        </div>
      </div>

      <div class="mgt-9" v-if="step===3">
        <div>
          <span class="text-subtitle-2"> {{ $translate('did_not_recieve_code') }} </span>
        </div>

        <div class="text-gray70 mt-2">
          {{  $translate('click_resend_code') }}
        </div>

        <div class="mgt-8 text-body-2 text-gray80">
          <span>{{ $translate('mobile') }}: {{ formattedPhone }}</span>
        </div>

        <div class="mgt-8">
          <sendy-btn
          :block="true"
          color="primary"
          @click="getOtp"
          :loading="loading"
          >
           {{ $translate('resend_code')}}
          </sendy-btn>

          <sendy-btn
          color="primary"
          class="mgt-5"
          @click="step=1"
          :outline="true"
          >
            {{ $translate('change_phone_number') }}
          </sendy-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { watch, onMounted, ref, computed } from 'vue';
import { useGlobalProp } from '../../../../hooks/globalProperties';
import { useState } from '../../../../hooks/useState';
import { VueTelInput } from "vue3-tel-input";
import VOtpInput from 'vue3-otp-input';
import * as moment from "moment";
import "moment-duration-format";
import { useStore } from 'vuex';
import { usePayBybankSetup } from "../../../../hooks/payBybankSetup";
 
  const { t } = useGlobalProp();
  const { getBupayload } = useState();
  const store = useStore();

  const props = defineProps(["show"]);
  const emit = defineEmits(["close"]);
  const verifyPhone = ref(null);
  // const phone = ref('');
  const formattedPhone = ref('');
  const disable = ref(false);
  const disableotp = ref(false);
  const otp = ref('');
  const pinLength = ref(4);
  const requestId = ref("");
  const step = ref(1);
  const countDown = ref(300);
  var stopCountdown;
  const error = ref("");
  const otpError = ref("");
  const loading = ref("");
  const dropdownOptions = ref({
    disabled: true,
    showFlags: true,
    showDialCodeInSelection: true,
  });

  const otpCounter = computed(()=> {
    return moment.duration(countDown.value, "seconds").format("mm:ss");
  });

  const { openAccount, phone } = usePayBybankSetup();

  watch(() => props.show, (val) => {
      val ? handleOpen() : handleClose();
    }
  );

  watch(step, (value) => {
    if (value === 2) {
      countDown.value = 300;
      clearInterval(stopCountdown);
      startCount();
    }
  });

  
  onMounted(() => {
    props.show ? handleOpen() : handleClose();
  });

  const handleOpen = () => {
      let el = verifyPhone.value;
      el.style.display = "block";
  };

  const handleClose = () => {
    step.value = 1;
    let el = verifyPhone.value;
    el.style.display = "none";
  };

  const validatePhone = (val) => {
    phone.value = val.valid ? val.number.split("+")[1] : null;
    formattedPhone.value = `+${val.countryCallingCode} ${val.nationalNumber}`;
    disable.value = val.valid;
    if (val.valid) {
      error.value = '';
    }
  };

  const getOtp = async () => {
    error.value = '';
    const payload = {
      mobile_number: phone.value,
      company_code: getBupayload.value.company_code,
    }

    const fullPayload = {
      params: payload,
      url: "/api/v1/otp/get" 
    }
    loading.value = true;
    const result = await store.dispatch('paymentAxiosPost', fullPayload);
    loading.value = false;
    if (result.status) {
      pinLength.value = result.config?.pinLength || 4;
      requestId.value = result.config.request_id;
      step.value = 2;
      return;
    }
    error.value = result?.message;
    phone.value = '';
  };

  const handleOnComplete = (val) => {
    otp.value = val;
    disableotp.value = false;
  };

  const validateOtp = async () => {
    if (!otp.value) { return false};
    const payload =  {
      request_id: requestId.value,
      code: otp.value,
      company_code: getBupayload.value.company_code,
    }

    const fullPayload = {
      url: "/api/v1/otp/validate",
      params: payload
    }

    const result = await store.dispatch('paymentAxiosPost', fullPayload);
    
    if (result.status) {
      openAccount();
      emit('close');
      return;
    }
    otpError.value =  result.message;
  }

  const startCount = () => {
    stopCountdown = setInterval(() => {
      countDown.value -= 1;

      if (countDown.value < 1 ) {
        clearInterval(stopCountdown);
        step.value = otp.value ? 2 : 3;
      }
    }, 1000);
  };

</script>

<style lang="scss" scoped>
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

.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 480px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
}

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

.vti__input {
    border: none;
    border-radius: 0 2px 2px 0;
    width: 100%;
    outline: none;
    padding: 16px 8px;
}

.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.otp-input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
