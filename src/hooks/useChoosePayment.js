import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useState } from "./useState";
import { useGlobalProp } from "./globalProperties";
import { useSegement } from "./useSegment";
import moment from "moment-timezone";

export function useChoosePayment() {
  const { router } = useGlobalProp();
  const store = useStore();
  const { getSavedPayMethods, getBupayload, getLoading } = useState();
  const { commonTrackPayload } = useSegement();

  const picked = ref("");
  const loading = ref(false);

  const creditCards = computed(() => {
    const result = getSavedPayMethods
      ? getSavedPayMethods.value.filter((element) => element.pay_method_id === 2)
      : [];
    return result;
  });

  const savedMobile = computed(() => {
    const result = getSavedPayMethods
      ? getSavedPayMethods.value.filter(
          (element) => element.category === "Mobile Money"
        )
      : [];
    return result;
  });

  const virtualAccounts = computed(() => {
    const result = getSavedPayMethods
      ? getSavedPayMethods.value.filter((element) => element.pay_method_id === 20)
      : [];
    return result;
  });

  

  async function update(method) {
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

    window.analytics.track("Choose Payment Option", {
      ...commonTrackPayload(),
      payment_method: method.pay_method_name,
    });

    loading.value = true;
    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    loading.value = false;
    store.dispatch("paymentNotification", {
      type: response.status ? "" : "error",
      text: response.status
        ? `${method.pay_method_name} selected for payment.`
        : "Request failed, Please try again!",
    });
  }

  // function setSelectedName(mobile) {
  //   const result = mobile.pay_method_name
  //     ? mobile
  //     : getSavedPayMethods.value.filter(
  //         (element) => element.pay_detail_id === picked.value
  //       )[0];
  //   return result ? result.pay_method_name : "";
  // }

  function handleRouting() {
    const entryRoute = localStorage.entry_route;
    const entryPoint = localStorage.entry;
    const method = getSavedPayMethods.value.filter(
      (elements) => elements.pay_detail_id === picked.value
    )[0];

    const payment_method = method
      ? method
      : getSavedPayMethods.value.filter(
          (elements) => elements.pay_method_id === parseInt(picked.value)
        )[0];

    const countSavedCards = getSavedPayMethods.value.filter(
      (element) => element.pay_method_id === 2
    );

    switch (payment_method.pay_method_id) {
      case 1:
        window.analytics.track("Continue after selecting  M-Pesa", {
          ...commonTrackPayload(),
        });
        break;
      case 2:
        window.analytics.track("Continue after selecting Card", {
          ...commonTrackPayload(),
          number_of_cards: countSavedCards.length,
          selected_cards_network: payment_method.psp,
        });
        break;
      case 20:
        window.analytics.track("Continue after selecting Pay by bank", {
          ...commonTrackPayload(),
          number_of_cards: countSavedCards.length,
          selected_cards_network: payment_method.psp,
        });
        break;
      default:
        break;
    }

    if (payment_method.pay_method_id === 20) {
      router.push({ name: entryRoute });
      return;
    }

    switch (entryPoint) {
      case "checkout":
        router.push({ name: "Entry" });
        break;
      case "choose-payment":
        router.push({ name: entryRoute });
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
    window.analytics.track("Add Payment Option", {
      ...commonTrackPayload(),
      timezone: paymentTimezone,
      country_code: getBupayload.value.country_code,
    });
    router.push("/add-payment");
  }

  return {
    picked,
    creditCards,
    savedMobile,
    virtualAccounts,
    getBupayload,
    getLoading,
    getSavedPayMethods,
    loading,
    update,
    handleRouting,
    addPaymentOption,
  };
}
