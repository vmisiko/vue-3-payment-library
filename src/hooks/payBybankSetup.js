import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "./globalProperties";
import { useState } from "./useState";

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
  const { router } = useGlobalProp();

   const getBalance = async () => {
    const fullPayload = {
      url: `/api/v3/onepipe/balance/?entityId=${getBupayload.value.entity_id}&userId=${getBupayload.value.user_id}&countryCode=${getBupayload.value.country_code}`,
    };

    const response = await store.dispatch('paymentAxiosGet', fullPayload);
    return response.availableBalance;
  }
  const openAccount =  async () => {
    state.showProcessing = true;
    state.count = true;
    window.analytics.track("Agree and Continue",  {
      ...getBupayload,
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
      store.commit('setSelectedVirtualAccount', account[0].account_number);
      router.push({ name: "AccountReadyView" });
      return;
    }
    router.push({ name: "FailedAccountSetup" });
    store.commit('setErrorText', response.message);
  };

  return {
    ...toRefs(state),
    openAccount,
    getBalance,
  }
}