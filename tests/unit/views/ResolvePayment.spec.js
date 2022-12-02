import { shallowMount, config } from "@vue/test-utils";
import ResolvePayment from "@/views/ResolvePayment";
import iconView from "@/components/iconView";
import notification from "@/components/notificationComponent";
import sendyBtn from "@/components/sendyBtn";
import paymentGenMxn from "@/mixins/paymentGenMxn";
import AdditionalCardFields from "@/views/AdditionalCardFields";
import { i18n } from "@/plugins/i18n";
import { createStore } from "vuex";



let wrapper;
let getters;
let store;
let mutations;
let state;
let actions;
const paymentMethods = [
  {
    payment_method_id: 1,
    name: "M-PESA",
    daily_limit: 30,
    stk_limit: 10,
  },
  {
    payment_method_id: 2,
    name: "Card",
    daily_limit: null,
    stk_limit: null,
  },
];

const savedPaymentMethods = [
  {
    id: 582,
    user_id: "12345",
    pay_method_id: 2,
    pay_method_details: "4543-14XX-XXXX-5140",
    pay_detail_id: "fcfb5306-0be3-448a-8228-d22d560dfb30",
    pay_method_name: "Card",
    default: 1,
    psp: "VISA",
    category: "Credit or Debit Card",
    status: 1,
  },
];

const bupayload = {
  user_id: "12345",
  entity_id: "3",
  currency: "KES",
  country_code: "KE",
  amount: "1",
  phonenumber: "0721649416",
  success_callback_url: "",
  fail_callback_url: "",
  txref: "PRiAAANK2",
  bulk: false,
  paybill_no: "",
  email: "victormisiko.vm@gmail.com",
  authToken: "",
  firstname: "",
  lastname: "",
  payment_options: "[1,2]",
  company_code: "FFKE",
  locale: "en",
  resolve_payment_message:
    "We are unable to process your transaction. Your card has insufficient funds.",
};

getters = {
  getPaymentMethods: () => paymentMethods,
  getSavedPayMethods: () => savedPaymentMethods,
  getBupayload: () => bupayload,
};
mutations = {
  setSelectedMenu() {
    state.selectedMenu = "";
  },
  setErrorText() {
    state.errorText = "";
  },
  setPaymentMethods() {
    state.paymentMethods = paymentMethods;
  },
  setSavedPayMethods() {
    state.savedpaymethods = savedPaymentMethods;
  },
};

actions = {
  paymentAxiosPost: () => savedPaymentMethods,
};
store = createStore({
  actions,
  getters,
  mutations,
  state,
});

config.global.mixins = [paymentGenMxn],
config.global.plugins = [i18n, store];

config.global.stubs = {
  IconView: iconView,
  Snackbar: notification,
  "sendy-btn": sendyBtn,
  AdditionalCardFields: AdditionalCardFields,
};

config.global.mocks = {
  $translate: (key) => i18n.global.t(key),
  $paymentAxiosPost: () => savedPaymentMethods,
  $paymentAxiosGet: () => {},
};

describe("ResolvePayment", () => {
  beforeEach(() => {
    wrapper = shallowMount(ResolvePayment);
  });

  it("Test getDefaultpayMethod()", () => {
    wrapper.vm.getDefaultpayMethod();
    expect(wrapper.vm.defaultPaymentMethod).toEqual(savedPaymentMethods[0]);
    expect(wrapper.vm.currency).toEqual(bupayload.currency);
    expect(wrapper.vm.amount).toEqual(bupayload.amount);
  });

  it("Test retrievePaymentMethods()", async () => {
    await wrapper.vm.retrievePaymentMethods();
    expect(wrapper.vm.getSavedPayMethods).toEqual(savedPaymentMethods);
  });

  it("Test handleContinue()", () => {
    wrapper.vm.handleContinue(true);
    expect(wrapper.vm.loading).toBeTruthy();
  });

  it("Test handleErrorModalClose(", () => {
    wrapper.vm.handleErrorModalClose();
    expect(wrapper.vm.showErrorModal).toBeFalsy();
    expect(wrapper.vm.showAdditionalCardFields).toBeFalsy();
  });

  it("Test pollCard() if limit is 6", (done) => {
    wrapper.vm.pollCard();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.loading).toBeTruthy();
      done();
    });
  });
});
