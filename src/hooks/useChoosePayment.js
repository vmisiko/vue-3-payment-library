import { computed } from "vue";
import { useStore } from "vuex";
import { useState } from "./useState";
import { useGlobalProp } from "./globalProperties";
import { useSegement } from "./useSegment";
import moment from "moment-timezone";
import { usePayment } from "./payment";

export function useChoosePayment() {
  const { router, t } = useGlobalProp();
  const store = useStore();
  const { state } = useState();
  const { getSavedPayMethods, getBupayload, getLoading } = useState();
  const { commonTrackPayload } = useSegement();
  const { retrievePaymentMethods } = usePayment();

  const creditCards = computed(() => {
    const result = getSavedPayMethods.value
      ? getSavedPayMethods.value.filter(
          (element) => element.pay_method_id === 2
        )
      : [];
    return result;
  });

  const savedMobile = computed(() => {
    const result = getSavedPayMethods.value
      ? getSavedPayMethods.value.filter(
          (element) => element.category === "Mobile Money"
        )
      : [];
    return result;
  });

  const virtualAccounts = computed(() => {
    const result = getSavedPayMethods.value
      ? getSavedPayMethods.value.filter(
          (element) => element.category === 'Bank'
        )
      : []; 
    return result;
  });

  async function update(method) {
    window.analytics.track("Select payment option", {
      ...commonTrackPayload(),
      previous_payment_option: state.defaultPaymentMethod?.pay_method_name,
      new_payment_option: method.pay_method_name,
    });

    state.defaultPaymentMethod = method;
    const savedMethods = getSavedPayMethods.value;
    let selectedSavedMethod = {};
    savedMethods.forEach((el, index) => {
      savedMethods[index].default = 0;
      if (el.pay_detail_id === method.pay_detail_id) {
        selectedSavedMethod =  el 
        selectedSavedMethod.default = 1;
        savedMethods[index] = selectedSavedMethod;
      }
    });      
    store.commit('setSavedPayMethods', savedMethods);
    if (getBupayload.value.pay_direction === 'PAY_ON_DELIVERY') { 
      return;
    } 

    const payload = {
      user_id: getBupayload.value.user_id,
      pay_detail_id: method.pay_detail_id,
      pay_method_id: method.pay_method_id,
      country_code: getBupayload.value.country_code,
      entity_id: parseInt(getBupayload.value.entity_id),
    };

    const fullPayload = {
      url: `/set_default`,
      params: payload,
    };
    state.loading = true;
    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    state.loading = false;
    if (response.status) {
      window.analytics.track("Change Payment option", {
        ...commonTrackPayload(),
        previous_payment_option: state.defaultPaymentMethod.pay_method_name,
        new_payment_option: method.pay_method_name,
      });
      retrievePaymentMethods();
    }
    store.dispatch("paymentNotification", {
      type: response.status ? "" : "error",
      text: response.status
        ? `${method.pay_method_name} ${t('selected_payment_name')}`
        : t('request_failed'),
    });
  }

  function handleRouting() {
    const entryRoute = localStorage.entry_route;
    const entryPoint = localStorage.entry;
   
    const countSavedCards = getSavedPayMethods.value.filter(
      (element) => element.pay_method_id === 2
    );

    window.analytics.track("Continue after selecting payment option", {
      ...commonTrackPayload(),
      payment_method: state.defaultPaymentMethod.pay_method_name,
      number_of_cards: countSavedCards.length,
      selected_cards_network: state.defaultPaymentMethod.psp,
    });

    switch (entryPoint) {
      case "checkout":
        router.push({ name: "Entry" });
        break;
      case "choose-payment":
        router.push(entryRoute);
        break;
      case "choose-payment-checkout":
        router.push({ name: "ChoosePaymentCheckout" });
        break;
      case "payment-option":
        router.push({ name: "PaymentOptionsPage" });
        break;
      default:
        router.push({ name: "Entry" });
        break;
    }
  }

  function paymentTimezone() {
    const localtz = moment.tz.guess();
    return localtz;
  }

  function addPaymentOption() {
    window.analytics.track("Add Payment Option Link", {
      ...commonTrackPayload(),
      timezone: paymentTimezone,
      country_code: getBupayload.value.country_code,
    });
    router.push("/add-payment");
  }

  return {
    creditCards,
    savedMobile,
    virtualAccounts,
    getBupayload,
    getLoading,
    getSavedPayMethods,
    update,
    handleRouting,
    addPaymentOption,
  };
}
