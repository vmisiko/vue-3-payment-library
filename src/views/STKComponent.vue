<template>
  <div class="flex-center">
    <div class="card-min">
      <TopInfo :icon="icon" :title="title" />

      <div class="mgt-8">
        <span class="text-caption-1"> Amount to pay</span>

        <div class="float-right">
          <span class="text-caption-1">
            {{ getBupayload.currency }}
            {{ formatCurrency(getBupayload.amount) }}
          </span>
        </div>

        <hr />

        <div v-if="!redirect">
          <div class="mgt-8">
            <div class="direction-flex">
              <span class="text-caption-2">Country Code</span>
              <label class="mgl-11 text-caption-2">{{
                state.defaultPaymentMethod.pay_method_id === 1
                  ? "M-PESA payment number"
                  : "Phone Number"
              }}</label>
            </div>

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

          <div class="alert pda-2 mgt-10">
            <span class="text-caption-2 text-midnightBlue20">{{
              state.defaultPaymentMethod.pay_method_id === 1
                ? $translate("mpesa_prompt")
                : $translate("mobile_prompt")
            }}</span>
          </div>

          <div class="mgt-8">
            <sendy-btn
              color="primary"
              class="float-right"
              @click="submit"
              :loading="state.loading"
              :disabled="!disable"
            >
              {{ $translate("continue") }}
            </sendy-btn>
          </div>
        </div>

        <div class="mgt-8" v-else>
          <sendy-btn color="primary" :block="true" @click="init3DS">
            Click here to continue
          </sendy-btn>
        </div>
      </div>
      <TimerModal :show="showTimer" @close="closeTimer" />
      <MpesaErrorModal :show="state.showErrorModal" :text="state.errorText" @close="state.showErrorModal=false" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useStore } from "vuex";
import { VueTelInput } from "vue3-tel-input";
import TopInfo from "../components/topInfo";
import TimerModal from "../components/modals/timerModal";
import MpesaErrorModal from "../components/modals/MpesaErrorModal";
import { datadogRum } from "@datadog/browser-rum";
import { useSegement } from '../hooks/useSegment';
import { usePayment } from '../hooks/payment';
import { useState } from '../hooks/useState';
import { useGlobalProp } from '../hooks/globalProperties';

const dropdownOptions = ref({
    disabled: true,
    showFlags: true,
    showDialCodeInSelection: true,
});

const promptInfo = ref(false);
const showTimer = ref(false);
const icon = ref('back');
const title = ref("pay_with_mpesa");
const phone = ref('');
const error = ref('');
const disable = ref(false);
const formattedPhone = ref('');
const redirect = ref(false);
const startResponseTime = ref('');

const store = useStore();
const { t, router, } = useGlobalProp();
const { getBupayload, state, } = useState();
const { commonTrackPayload } = useSegement();
const { getDefaultpayMethod } = usePayment();

watch(phone, (val) => {
    if (val && val.length > 8) {
      error.val = "";
    }
});

onMounted(()=> {
  getDefaultpayMethod();
  title.value = state.defaultPaymentMethod?.isMpesa() ? t("pay_with_mpesa")
          : `Pay with ${state.defaultPaymentMethod?.pay_method_name} Money`;
  state.errorText = t("unable_to_send_mpesa_request");

  window.analytics.track('View mobile money stk page', {
    ...commonTrackPayload(),
    payment_method: 'M-PESA',
  });
})

const submit = async () => {
  window.analytics.track('Continue after entering mobile number', {
    ...commonTrackPayload(),
    payment_method: 'M-PESA',
  });
  const entrypoint = localStorage.getItem("entry");
  if (entrypoint === "resolve-payment-checkout") {
    submitRetry();
    return;
  }

  state.loading = true;
  promptInfo.value = true;
  const payload = {
    country: getBupayload.value.country_code,
    amount: getBupayload.value.amount,
    txref: getBupayload.value.txref,
    userid: getBupayload.value.user_id,
    currency: getBupayload.value.currency,
    bulk: getBupayload.value.bulk,
    entity: getBupayload.value.entity_id,
    firstname: getBupayload.value.firstname,
    lastname: getBupayload.value.lastname,
    paymethod: state.defaultPaymentMethod.pay_method_id,
    phonenumber: formattedPhone.value,
    company_code: getBupayload.value.company_code,
    bulkrefno: getBupayload.value.bulk_reference_number,
    email: getBupayload.value.email,
    platform: 'web',
    pay_direction: getBupayload.value.pay_direction,
    test: getBupayload.value?.test ?? false,
    email: getBupayload.value.email,
    firstname: getBupayload.value.firstname,
    lastname: getBupayload.value.lastname,
  };

  const version = getBupayload.value.version ?? 'v3';

  const fullPayload = {
    url: getBupayload.value.pay_direction !== 'PAY_ON_DELIVERY' ?  `/api/${version}/process` : '/api/v3/pod/process',
    params: payload,
  };

  const response = await store.dispatch('paymentAxiosPost', fullPayload);
  state.transaction_id = response.transaction_id;
  if (response.status) {
    if (getBupayload.bulk) {
      state.loading = false;
      router.push({
        name: "SuccessView",
        duration: "",
      });
      return;
    }

    if (response.redirect) {
      state.additionalData = response.additional_data;
      init3DS();
      return;
    }
    pollMpesa();
    return;
  }
  promptInfo.value = false;
  showTimer.value = false;
  state.loading = false;
  state.showErrorModal = true;
  datadogRum.addError(new Error(response.message));
  state.errorText = response.message;
  store.commit('setErrorText', response.message);

  window.analytics.track('Payment processing failed', {
    ...commonTrackPayload(),
    reason: response.message,
    message: response.message,
    sendy_error_code: "",
    payment_method: state.defaultPaymentMethod?.pay_method_name,

  });
};

const submitRetry = async () => {
  if (getBupayload.value.bulk) {
    bulkretry();
    return;
  }

  startResponseTime.value = new Date();

  state.loading = true;
  const payload = {
    user_id: getBupayload.value.user_id,
    company_code: getBupayload.value.company_code,
    entity: getBupayload.value.entity_id,
    pay_detail_id: formattedPhone.value,
    payment_method: state.defaultPaymentMethod.pay_method_id,
    references:getBupayload.value.references,
  };

  const fullPayload = {
    url: "/api/v3/process/retry",
    params: payload,
  };

  const response = await store.dispatch('paymentAxiosPost', fullPayload);

  state.transaction_id = response.transaction_id;
  if (response.status) {
    pollMpesa();
    return;
  }

  promptInfo.value = false;
  showTimer.value = false;
  state.loading = false;
  state.showErrorModal = true;
  store.commit('setErrorText', res.message);

  window.analytics.track('Payment processing failed', {
    ...commonTrackPayload(),
    reason: res.message,
    sendy_error_code: "",
    message: res.message,
  });
  router.push({ name: "FailedView", params: { mpesa: "M-PESA" } });
}

const bulkretry = async () => {
  startResponseTime = new Date();
  state.loading = true;

  const payload = {
    user_id: getBupayload.value.user_id,
    company_code: getBupayload.value.company_code,
    entity: getBupayload.value.entity_id,
    pay_detail_id: formattedPhone.value,
    payment_method: 1,
    references: getBupayload.value.references,
  };

  const fullPayload = {
    url: "/api/v3/bulk/retry",
    params: payload,
  };

  const response = await store('paymentAxiosPost', fullPayload);

  state.transaction_id = response.transaction_id;
  if (response.status) {
    pollMpesa();
    return;
  }
  promptInfo.value = false;
  showTimer.value = false;
  state.loading = false;
  state.showErrorModal = true;
};

const validatePhone = (val) => {
  formattedPhone.value = val.valid ? val.number.split("+")[1] : null;
  disable.value = val.valid;
  return;
};

const pollMpesa = () => {
  state.poll_count = 0;
  for (let poll_count = 0; poll_count < state.poll_limit; poll_count++) {
    (function (poll_count) {
      setTimeout(() => {
        if (state.poll_count === state.poll_limit) {
          poll_count = state.poll_limit;
          return;
        }
        state.poll_count++;
        TransactionIdStatus();
        if (poll_count === state.poll_limit - 1) {
          state.loading = false;
          showTimer.value = false;
          promptInfo.value = false;
          window.analytics.track('Payment processing failed', {
            ...commonTrackPayload(),
            reason: 'The request to charge your M-Pesa account has not been completed. Please wait for about a minute before retrying. If this error persists, please reach out to our customer support team for assistance.',
            sendy_error_code: "",
            message: "The request to charge your M-Pesa account has not been completed. Please wait for about a minute before retrying. If this error persists, please reach out to our customer support team for assistance.",
            payment_method: state.defaultPaymentMethod?.pay_method_name,
          });
          store.commit('setErrorText', "The request to charge your M-Pesa account has not been completed. Please wait for about a minute before retrying. If this error persists, please reach out to our customer support team for assistance.");
          router.push({
            name: "FailedView",
            params: { mpesa: "mpesa" },
          });
          return;
        }
      }, 10000 * poll_count);
    })(poll_count);
  }
};

const TransactionIdStatus = async () => {
  showTimer.value = true;

  const payload = {
    url: getBupayload.value.pay_direction === "PAY_ON_DELIVERY" ? `/api/v1/process/pod/status/${state.transaction_id}` : `/api/v1/process/status/${state.transaction_id}`,
  };

  const res = await store.dispatch('paymentAxiosGet', payload);
  if (res.status) {
    switch (res.transaction_status) {
      case "success":
        state.poll_count = state.poll_limit;
        store.dispatch('paymentNotification', {
          text: res.message,
        });
        state.loading = false;
        showTimer.value = false;
        promptInfo.value = false;
        window.analytics.track('Payment processed successfully', {
          ...commonTrackPayload(),
          payment_method: 'M-PESA',
          phone_number: formattedPhone.value,
          payment_method: state.defaultPaymentMethod?.pay_method_name,
        });
        router.push({
          name: "SuccessView",
          params: { mpesaCode: res.receipt_no },
        });
        break;
      case "failed":
        state.poll_count = state.poll_limit;
        state.loading = false;
        store.commit('setErrorText', res.message);
        showTimer.value = false;
        promptInfo.value = false;
        window.analytics.track('Payment processing failed', {
          ...commonTrackPayload(),
          reason: res.message,
          sendy_error_code: "",
          message: res.message,
          payment_method: state.defaultPaymentMethod?.pay_method_name,
        });
        router.push({
          name: "FailedView",
          params: { mpesa: "mpesa" },
        });
        datadogRum.addError(new Error(res.message));
        break;
      case "pending":
        break;
      default:
        break;
    }
    return res;
  }

  state.loading = false;
  state.poll_count = state.poll_limit;
  showTimer.value = false;
  promptInfo.value = false;
  store.commit('setErrorText', res.message);

  window.analytics.track('Payment processing failed', {
    ...commonTrackPayload(),
    reason: res.message,
    sendy_error_code: "",
    message: res.message,
    payment_method: state.defaultPaymentMethod?.pay_method_name,
  });
  router.push({ name: "FailedView", params: { mpesa: "M-PESA" } });
  datadogRum.addError(new Error(res.message));
};

const closeTimer = () => {
  state.loading = false;
  showTimer.value = false;
  promptInfo.value = false;
  stare.commit('setErrorText', t("unable_to_confirm_mpesa"));
  router.push({ name: "FailedView", params: { mpesa: "mpesa" } });
  datadogRum.addError(new Error(t("unable_to_confirm_mpesa")));
};

const init3DS = () => {
  redirect.value = false;
  const res = additionalData.value
    ? additionalData.value
    : additionalData.value[0];
  const url = res.field;
  const urlWindow = window.open(url, "");

  if (typeof urlWindow == "undefined") {
    redirect.value = true;
    return;
  }
  const timer = setInterval(() => {
    if (urlWindow.closed) {
      pollMpesa();
      clearInterval(timer);
    }
  }, 500);

  setTimeout(() => {
    urlWindow.close();
  }, 180000);
};

const formatCurrency = (amount) =>{
  const result = parseFloat(amount);
  return result.toLocaleString();
};
</script>

<style lang="scss" scoped>
.phone-input {
  padding: 8px;
  height: 40px;
  background: #ffffff;
  border: 0.5px solid #c0c4cc;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}
.alert {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
  position: static;
  width: 296px;
  height: 32px;
  top: 268px;
  background: rgba(211, 221, 246, 0.5);
  border-radius: 4px;
}
.vti__input {
  width: 100%;
  outline: none;
  padding-left: 7px;
  margin-left: 24px !important;
  border: 0.5px solid #c0c4cc !important;
  box-sizing: border-box;
  border-radius: 4px !important;
}
.vti__dropdown {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: relative;
  padding: 7px;
  cursor: pointer;
  border: 1px solid #bbb;
  border: 0.5px solid #dcdfe6;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100px;
  height: 40px;
}
.vue-tel-input {
  border-radius: 3px;
  display: flex;
  // border: 1px solid #bbb;
  border: none !important;
  text-align: left;
}
</style>
