import { computed } from "vue";
import { useStore } from "vuex";
import { useState } from "./useState";
import { useGlobalProp } from "./globalProperties";
import { useSegement } from "./useSegment";
import moment from "moment-timezone";

export function useChoosePayment() {
  const { router, t } = useGlobalProp();
  const store = useStore();
  const { state } = useState();
  const { getSavedPayMethods, getBupayload, getLoading } = useState();
  const { commonTrackPayload } = useSegement();

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
          (element) => element.pay_method_id === 20
        )
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

    state.loading = true;
    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    state.loading = false;
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
    const method = getSavedPayMethods.value.filter(
      (elements) => elements.pay_detail_id === state.picked
    )[0];

    const payment_method = method
      ? method
      : getSavedPayMethods.value.filter(
          (elements) => elements.pay_method_id === parseInt(state.picked)
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
        window.analytics.track(`Continue after selecting  ${payment_method.pay_method_name}`, {
          ...commonTrackPayload(),
        });
        break;
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
