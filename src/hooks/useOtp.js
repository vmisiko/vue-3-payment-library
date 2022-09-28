import {ref } from "vue";
import { useStore } from "vuex";
import { useState } from "./useState";

const pinLength = ref(4);
const requestId = ref("");


export function useOtp()  {
  const otpError = ref("");
  const error = ref("");
  const store = useStore();
  const loading = ref(false);

  const { getBupayload } = useState();

  const getOtp = async () => {
    const payload = {
      email: getBupayload.value.email,
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
    }
    
    return result;
  };

  const validateOtp = async (otp) => {
    if (!otp) { return false};
    const payload =  {
      request_id: requestId.value,
      code: otp,
      company_code: getBupayload.value.company_code,
    }

    const fullPayload = {
      url: "/api/v1/otp/validate",
      params: payload
    }
    loading.value = true;
    const result = await store.dispatch('paymentAxiosPost', fullPayload);
    loading.value = false;

    if (!result.status) {
      otpError.value = result.message;
    }
   return result;
  }

  return {
    loading,
    pinLength,
    requestId,
    error,
    otpError,
    getOtp,
    validateOtp,
  }
}