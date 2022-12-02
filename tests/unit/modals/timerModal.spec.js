import { shallowMount, config } from "@vue/test-utils";
import timerModal from "@/components/modals/timerModal";
import iconView from "@/components/iconView";
import notification from "@/components/notificationComponent";
import sendyBtn from "@/components/sendyBtn";
import { i18n } from "@/plugins/i18n";
import { createStore } from "vuex";

config.global.stubs = {
  IconView: iconView,
  Snackbar: notification,
  "sendy-btn": sendyBtn,
};

const trackPayload = {
  user_id: "123",
  product: "Fulfillment",
  timestamp: Date.now(),
  platform_name: "web",
  duration_on_page: '',
  pay_direction: "",
};

config.global.mocks = {
  $translate: (key) => i18n.global.t(key),
  commonTrackPayload: () => trackPayload,
};

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

const store = createStore({
  getters: {
    getPaymentMethods: () => paymentMethods,
    getSavedPayMethods: () => savedPaymentMethods,
    getBupayload: () => bupayload,
  },
});

config.global.plugins = [i18n, store];
describe("timerModal", () => {
 
  const wrapper = shallowMount(timerModal, {
    props: {
      show: true,
    },
  });

  it("renders props when passed", () => {
    expect(wrapper.props("show")).toBeTruthy();
  });

  it("Tests handleOpen() function", () => {
    wrapper.vm.handleOpen();
    expect(wrapper.find(".modal").isVisible()).toBeTruthy();
  });

  it("Tests handleClose() function", () => {
    wrapper.vm.handleClose();
    expect(wrapper.find(".modal").isVisible()).toBeFalsy();
  });
});
