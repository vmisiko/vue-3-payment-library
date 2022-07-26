import { reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useSegement } from "./useSegment";

const state = reactive({
  loading: false,
  showProcessing: false,
  count: true,
  showPhone: false,
});

export function usePayBybankSetup() {
  
  const { getBupayload } = useSegement();
  const store = useStore();

  const openAccount =  async () =>{
    state.showProcessing = true;
    state.count = true;
    window.analytics.track("Agree and Continue",  {
      ...getBupayload,
    });

    const phone = getBupayload.phonenumber.includes("+") ? getBupayload.phonenumber.split("+")[1] : getBupayload.phonenumber;

    const payload = {
      user_id: getBupayload.user_id,
      first_name: getBupayload.firstname,
      surname: getBupayload.lastname,
      email: getBupayload.email,
      mobile_number: phone,
      entity: getBupayload.entity_id,
      country_code: getBupayload.country_code,
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
  }
}