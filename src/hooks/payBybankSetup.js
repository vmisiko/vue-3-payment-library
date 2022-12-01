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

  const getBalance = async (bankCode) => {
    if (getBupayload.value.pay_direction === "PAY_ON_DELIVERY") {
      return await getPodBalance(bankCode);
    }

    const payload = {
      entityId: getBupayload.value.entity_id,
      userId: getBupayload.value.user_id,
      countryCode: getBupayload.value.country_code,
    }

    const fullPayload = {
      params: payload,
      url: `/api/v3/onepipe/balance`,
    };

    const response = await store.dispatch('paymentAxiosGet', fullPayload);
    return response.availableBalance;
  }

  const getPodBalance = async (bankCode) => {
    const payload = {
      user_id: getBupayload.value.user_id,
      first_name: getBupayload.value.firstname,
      surname: getBupayload.value.lastname,
      email: getBupayload.value.email,
      mobile_number: getBupayload.value.phonenumber?.split("+")[1],
      bank_code: bankCode,
      entity: getBupayload.value.entity_id,
      country_code: getBupayload.value.country_code,
    };

    const fullPayload = {
      params: payload,
      url: '/api/v3/pod/pwt/acct_balance',
    }

    const response = await store.dispatch('paymentAxiosPost', fullPayload);
    
    return response.availableBalance;
  };   

  const openAccount =  async () => {
    state.showProcessing = true;
    window.analytics.track("View Pay with Transfer setup processing", {
      ...commonTrackPayload(),
      payment_method: 'Pay with Transfer'
    });

    state.count = true;
    window.analytics.track("Agree and Continue",  {
      ...commonTrackPayload(),
      payment_method: 'Pay with Transfer'
    });

    const phone = state.phone || getBupayload.value.phonenumber?.split("+")[1];
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
      url: getBupayload.value.pay_direction !== "PAY_ON_DELIVERY" ?  "/api/v3/onepipe/open_account" : "/api/v3/pod/pwt/create_account",
      params: payload,
    };

    const response = await store.dispatch('paymentAxiosPost', fullPayload);
    state.showProcessing = false;
    state.count = false;
    if (response.status) {
      store.commit('setVirtualAccounts', response.accounts);
      const account = response.accounts.filter(
        (el) => el.is_primary === true
      );
      window.analytics.track("Payment option saved successfully", {
        ...commonTrackPayload(),
        payment_method: 'Pay with Transfer',
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
      payment_method: 'Pay with Transfer'
    });
    store.commit('setErrorText', response.message);
    datadogRum.addError(new Error(response.message));
  };

  const getAccounts = async () => {
    const payload = {
      entityId: getBupayload.value.entity_id,
      userId: getBupayload.value.user_id,
      countryCode: getBupayload.value.country_code,
    };

    const fullPayload = {
      url: `/api/v3/onepipe/accounts/`,
      params: payload,
    };

    const  response = await store.dispatch('paymentAxiosGet', fullPayload);
    store.commit('setVirtualAccounts', null);
    store.commit('setSelectedVirtualAccount', null);
    if (response.status) {
      store.commit("setVirtualAccounts", response.accounts);
      const account = response.accounts.filter(
        (el) => el.is_primary === true
      );
      store.commit("setSelectedVirtualAccount", account[0].account_number);
    }
  };

  const setPhone = (phone) => {
    state.phone =phone;
  }

  return {
    ...toRefs(state),
    openAccount,
    getBalance,
    getPodBalance,
    getAccounts,
    setPhone,
  }
}