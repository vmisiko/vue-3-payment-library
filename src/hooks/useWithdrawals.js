import {ref, computed } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "./globalProperties";
import { useState } from "./useState";
import { datadogRum } from "@datadog/browser-rum";
import { useSegement } from "./useSegment";
import PaymentStatus from "../Models/payment/paymentStatus";

const accountName = ref('');
const selectedBank = ref(null);
const accountNumber = ref('');
const selectedPaymentOption = ref("");
const phone = ref("");
const failureReason = ref("");

export function useWithdrawals() {

  const banks = ref([]);
  const store = useStore();
  const loading = ref(false);
  const transactionId = ref("");
  const poll_limit = ref(30);
  const polling_count = ref(0);
  const loadingText = ref('Loading ...');
  const { route , router} = useGlobalProp();

  const { getBupayload } = useState();
  const { commonTrackPayload } = useSegement();

  const isEdit = computed(() => {
    return route.params.edit ? true : false;
  });

  const getBanks = async () => {    
    const fullPayload = {
      url: `/api/v1/dashboard/bank/country/${getBupayload.value.country_code}`,
    }

    const response = await store.dispatch('paymentAxiosGet', fullPayload);
    banks.value = response;
  }

  const addBank = async () => {
    const payload = {
      "operator_id": selectedBank.value.operator_id,
      "operator_name": selectedBank.value.name,
      "user_account_no": accountNumber.value,
      "account_name": accountName.value,
      "user_id": getBupayload.value.user_id,
      "country_code": getBupayload.value.country_code,
      "entity_id": getBupayload.value.entity_id,
      "pay_method_id": selectedPaymentOption.value.payment_method_id,
      "test": false,
    };
    const fullPayload = {
      params: payload,
      url: "/api/v3/payout/account"
    }
    loading.value = true;
    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    loading.value = false;
    if (response.status) {
      window.analytics.track("Withdrawal option saved successfully", {
        ...commonTrackPayload(),
        message: response.message,
        withdrawal_option: selectedPaymentOption.value.name,
      });
      const entrypoint = localStorage.getItem('entry');
      entrypoint === "withdraw-checkout" ? router.push({ name: "WithdrawalCheckout"})  : router.push({ name: "ManageWithdrawal"});
      store.dispatch("paymentNotification", {
        text: `${selectedBank.value.name}. | Acc No: ${accountNumber.value} has been added`,
      })
      selectedPaymentOption.value = "";
      selectedBank.value = "";
      accountName.value = ""
      selectedBank.value = ""
      accountNumber.value = ""
      return;
    }
    else if (response.duplicate) {
      window.analytics.track("Withdrawal option already exists", {
        ...commonTrackPayload(),
        message: response.message,
        withdrawal_option: selectedPaymentOption.value.name,
      });
      router.push({ name: "DuplicateAccount"});
      return;
    }
    window.analytics.track("Withdrawal option failed to save", {
      ...commonTrackPayload(),
      message: response.message,
      reason: response.message,
      sendy_error_code: "",
      withdrawal_option: selectedPaymentOption.value.name,
    });
    store.dispatch("paymentNotification", {
        text: `Withdrawal option failed to save`,
        type: "error"
    });
    loading.value = false;
  };

  const addMpesa = async () => {

    const payload = {
      "operator_id": 1,
      "operator_name": "MPESA",
      "psp": "SAFARICOM",
      "user_account_no": phone.value,
      "user_id": getBupayload.value.user_id,
      "country_code": getBupayload.value.country_code,
      "entity_id": getBupayload.value.entity_id,
      "pay_method_id": selectedPaymentOption.value.payment_method_id,
      "test": false,
    };

    const fullPayload = {
      params: payload,
      url: "/api/v3/payout/account"
    }
    loading.value = true;
    const response = await store.dispatch("paymentAxiosPost", fullPayload);
    loading.value = false;
    if (response.status) {
      window.analytics.track("Withdrawal option saved successfully", {
        ...commonTrackPayload(),
        message: response.message,
        withdrawal_option: selectedPaymentOption.value.name,
      });
      const entrypoint = localStorage.getItem('entry');
      entrypoint === "withdraw-checkout"  ? router.push({name: "WithdrawalCheckout"})  : router.push({name: "ManageWithdrawal"});
      store.dispatch("paymentNotification", {
        text: `M-PESA | Mobile No: ${phone.value} has been added`,
      })
      selectedPaymentOption.value = "";
      selectedBank.value = "";
      accountName.value = ""
      selectedBank.value = ""
      accountNumber.value = ""
      return;
    }
    else if (response.duplicate) {
      window.analytics.track("Withdrawal option already exists", {
        ...commonTrackPayload(),
        message: response.message,
        withdrawal_option: selectedPaymentOption.value.name,
      });
      router.push({ name: "DuplicateAccount"});
      return;
    } 
    window.analytics.track("Withdrawal option failed to save", {
      ...commonTrackPayload(),
      message: response.message,
      reason: response.message,
      sendy_error_code: "",
    });
    store.dispatch("paymentNotification", {
        text: response.message,
        type: "error"
    });
  };

  const deleteWithdrawalOption = async () => {
  
    const fullPayload = {
      url: `/api/v3/payout/account/${selectedPaymentOption.value.pay_detail_id}`
    }
    
    loading.value = true;
    const response = await store.dispatch('paymentAxiosDelete', fullPayload);
    loading.value = false;

    if (response.status) {
      window.analytics.track("Withdrawal option deleted successfully", {
        ...commonTrackPayload(),
        message: response.message,
        withdrawal_option: selectedPaymentOption.value.pay_method_name,
      });
      router.push({ name: 'ManageWithdrawal'});
      const message = selectedPaymentOption.value.pay_method_id === 10 ? `${selectedPaymentOption.value.bankDetails.operator_name}. | Acc No: ${selectedPaymentOption.value.pay_method_details} has been deleted` : `M-PESA | Mobile No: ${selectedPaymentOption.value.pay_method_details} has been removed`;
      store.dispatch("paymentNotification", {
        text: message
      });
      selectedPaymentOption.value = "";
      selectedBank.value = "";
      accountName.value = ""
      selectedBank.value = ""
      accountNumber.value = ""
      return;
    }

    window.analytics.track("Withdrawal option failed to delete", {
      ...commonTrackPayload(),
      reason: response.message,
      message: response.message,
      sendy_error_code: null,
      withdrawal_option: selectedPaymentOption.value.pay_method_name,
    });
  
    store.dispatch("paymentNotification", {
      text: `Failed to delete`,
      type: "error"

    });
  }; 

  const withdraw = async () => {
    const payload = {
      country: getBupayload.value.country_code,
      amount: getBupayload.value.amount,
      phone: selectedPaymentOption.value.pay_method_id === 1 ? selectedPaymentOption.value.pay_method_details : "",
      email: getBupayload.value.email,
      txref: getBupayload.value.txref,
      userid: getBupayload.value.user_id,
      currency: getBupayload.value.currency,
      bulk: getBupayload.value.bulk,
      entity: getBupayload.value.entity_id,
      company_code: getBupayload.value.company_code,
      pay_detail_id: selectedPaymentOption.value.pay_detail_id,
      paymethod: selectedPaymentOption.value.pay_method_id,
      bank : selectedPaymentOption.value?.bankDetails?.operator_name || null,
      bank_account: selectedPaymentOption?.value?.pay_method_details || null,
      platform: 'web',
      pay_direction: getBupayload.value.pay_direction,
      test: getBupayload?.value?.test ?? false,
    }

    const fullPayload = {
      params: payload,
      url: '/api/v3/process'
    }
    store.commit("setLoading", true);
    window.analytics.track("View confirming withdrawal payment processing page", {
      ...commonTrackPayload(),
      withdrawal_option: selectedPaymentOption.value.pay_method_name,
    });
    loadingText.value = "Confirming your payment. This may take a moment.";
    const result = await store.dispatch('paymentAxiosPost', fullPayload);
    const response = new PaymentStatus(result);
    transactionId.value = response.transaction_id;

    if (response.status) {
      if (response.isFraudDetected) {
        router.push({name: 'WithdrawalApproval'});
        return;
      }
      switch (response.transaction_status) {
        case "pending": {
          poll();
          break;
        }
        case "success": {
          window.analytics.track("Withdrawal successfully processed", {
            ...commonTrackPayload(),
            message: response.message,
            withdrawal_option: selectedPaymentOption.value.pay_method_name,
            account_number: selectedPaymentOption.value.pay_method_details,
          });
          store.commit("setLoading", false);
          router.push({
            name: "WithdrawalSuccess",
            params: {
              reciept: response?.receipt_no,
            }
          });
          break;
        }
        default:
          break;
      }
      return;
    }
    store.commit("setLoading", false);
    window.analytics.track("Withdrawal failed to be processed", {
      ...commonTrackPayload(),
      reason: response.message,
      message: response.message,
      sendy_error_code: "",
      withdrawal_option: selectedPaymentOption.value.pay_method_name,
      account_number: selectedPaymentOption.value.pay_method_details,
    });
    failureReason.value = response.message;
    router.push({ name: "WithdrawalFailed" });
  }

  const poll = () => {
    store.commit("setLoading", true);
    for (let poll_count = 0; poll_count < poll_limit.value; poll_count++) {
      (function (poll_count) {
        setTimeout(() => {
          if (polling_count.value === poll_limit.value) {
            poll_count = poll_limit.value;
            return;
          }

          TransactionIdStatus();
          if (poll_count === poll_limit.value - 1) {
            store.commit("setLoading", false);
            window.analytics.track('Withdrawal failed to be processed', {
              ...commonTrackPayload(),
              reason: 'Time out',
              sendy_error_code: '',
              message: "Time Out",
              withdrawal_option: selectedPaymentOption.value.pay_method_name,
              account_number: selectedPaymentOption.value.pay_method_details,
            });
            failureReason.value = "Withdrawal failed to be processed, Please try again later.";
            router.push({ name: "WithdrawalFailed" });
            datadogRum.addError(new Error("Polling time out"));
            return;
          }
        }, 10000 * poll_count);
      })(poll_count);
    }
  }

  const TransactionIdStatus = async () =>  {
    const payload = {
      url: `/api/v1/process/status/${transactionId.value}`,
    };

    const response = await store.dispatch("paymentAxiosGet", payload);

    const res = new PaymentStatus(response);
    if (res.status) {
      if (res.isFraudDetected) {
        router.push({name: 'WithdrawalApproval'});
        return;
      }
      switch (res.transaction_status) {
        case "success": {
          polling_count.value = poll_limit.value;
          store.dispatch("paymentNotification", {
            text: res.message,
          });
          store.commit("setLoading", false);
          store.commit("setLoading", false);
          window.analytics.track('Withdrawal successfully processed', {
            ...commonTrackPayload(),
            withdrawal_option: selectedPaymentOption.value.pay_method_name,
            account_number: selectedPaymentOption.value.pay_method_details,
          });
          router.push({
            name: "WithdrawalSuccess",
            params: {
              reciept: res?.receipt_no,
            }
          });
          break;
        }
        case "failed": {
          polling_count.value = poll_limit.value;
          store.commit("setLoading", false);
          store.commit("setErrorText", res.message);
          failureReason.value = res.message;
          window.analytics.track('Withdrawal failed to be processed', {
            ...commonTrackPayload(),
            reason: res.message,
            sendy_error_code: '',
            message: res.message,
            withdrawal_option: selectedPaymentOption.value.pay_method_name,
            account_number: selectedPaymentOption.value.pay_method_details,
          });
          router.push({
            name: "WithdrawalFailed",
          });
          datadogRum.addError(new Error(res.message));
          break;
        }
        case "pending":
          break;
        default:
          break;
      }
      return res;
    }
    polling_count.value = poll_limit.value;
    store.commit("setLoading", false);
    store.commit("setErrorText", res.message);
    failureReason.value = res.message;
    window.analytics.track('Withdrawal failed to be processed', {
      ...commonTrackPayload(),
      reason: res.message,
      sendy_error_code: '',
      message: res.message,
      withdrawal_option: selectedPaymentOption.value.pay_method_name,
      account_number: selectedPaymentOption.value.pay_method_details,
    });
    router.push({
      name: "WithdrawalFailed",
    });
    datadogRum.addError(new Error(res.message));

  }

  const formatCurrency = (amount)  => {
    const result = parseFloat(amount);
    return result.toLocaleString();
  };

  return {
    isEdit,
    accountName,
    selectedBank,
    accountNumber,
    banks,
    selectedPaymentOption,
    loading,
    phone,
    loadingText,
    failureReason,
    getBanks,
    addBank,
    addMpesa,
    deleteWithdrawalOption,
    formatCurrency,
    withdraw,
  }
}