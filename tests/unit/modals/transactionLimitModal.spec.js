import { shallowMount, config } from "@vue/test-utils";
import transactionLimitModal from "@/components/modals/transactionalLimitModal";
import iconView from "@/components/iconView";
import notification from "@/components/notificationComponent";
import sendyBtn from "@/components/sendyBtn";
import { i18n } from "@/plugins/i18n";
import { createStore } from 'vuex'

config.global.stubs = {
  IconView: iconView,
  Snackbar: notification,
  "sendy-btn": sendyBtn,
};

config.global.mocks = {
  $translate: (key) => i18n.global.t(key),
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
const store = createStore({
  getters: {
    getPaymentMethods: () => paymentMethods,
    getSavedPayMethods: () => savedPaymentMethods,
  },
});

config.global.plugins = [i18n, store];

describe("transactionLimitModal", () => {
  const wrapper = shallowMount(transactionLimitModal, {
    props: {
      show: true,
      text: "An error Occurred!",
    },
  });
  
  it("renders props when passed", () => {
    const msg = "An error Occurred!";
    expect(wrapper.props("show")).toBeTruthy();
    expect(wrapper.props("text")).toContain(msg);
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
