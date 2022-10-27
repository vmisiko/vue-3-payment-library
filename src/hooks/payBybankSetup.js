import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "./globalProperties";
import { useState } from "./useState";
import { datadogRum } from "@datadog/browser-rum";
import { useSegement } from "./useSegment";


const state = reactive({
  loading: false,
  showProcessing: false,
  count: true,
  showPhone: false,
  phone: '',
});

export function usePayBybankSetup() {
  
  const { getBupayload } = useState();
  const store = useStore();
  const { router, route } = useGlobalProp();
  const { commonTrackPayload } = useSegement();

  const getBalance = async () => {
    const fullPayload = {
      url: `/api/v3/onepipe/balance/?entityId=${getBupayload.value.entity_id}&userId=${getBupayload.value.user_id}&countryCode=${getBupayload.value.country_code}`,
    };

    const response = await store.dispatch('paymentAxiosGet', fullPayload);
    return response.availableBalance;
  }
  const openAccount =  async () => {
    state.showProcessing = true;
    window.analytics.track("View pay by bank setup processing", {
      ...commonTrackPayload(),
      payment_method: 'Pay by bank'
    });

    state.count = true;
    window.analytics.track("Agree and Continue",  {
      ...commonTrackPayload(),
      payment_method: 'Pay by bank'
    });

    const phone = state.phone || getBupayload.phonenumber?.split("+")[1];
    const payload = {
      user_id: getBupayload.value.user_id,
      first_name: getBupayload.value.firstname,
      surname: getBupayload.value.lastname,
      email: getBupayload.value.email,
      mobile_number: phone,
      entity: getBupayload.value.entity_id,
      country_code: getBupayload.value.country_code,
    };

    const fullPayload = {
      url: "/api/v3/onepipe/open_account",
      params: payload,
    };

    const response = await store.dispatch('paymentAxiosPost', fullPayload);
    state.showProcessing = false;
    if (response.status) {
      store.commit('setVirtualAccounts', response.accounts);
      const account = response.accounts.filter(
        (el) => el.is_primary === true
      );
      window.analytics.track("Payment option saved successfully", {
        ...commonTrackPayload(),
        payment_method: 'Pay by bank',
        message: response.message,
      });
      store.commit('setSelectedVirtualAccount', account[0].account_number);
      router.push({ name: "AccountReadyView" });
      return;
    }
    if (route.name !== 'FailedAccountSetup') {
      router.push({ name: "FailedAccountSetup" });
    }
    window.analytics.track("Payment option failed to save", {
      ...commonTrackPayload(),
      message: response.message,
      reason: response.message,
      payment_method: 'Pay by bank'
    });
    store.commit('setErrorText', response.message);
    datadogRum.addError(new Error(response.message));
  };

  const setPhone = (phone) => {
    state.phone =phone;
  }

  return {
    ...toRefs(state),
    openAccount,
    getBalance,
    setPhone,
  }
}