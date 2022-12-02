
import { shallowMount, config } from "@vue/test-utils";
import cvvModal from "@/components/modals/cvvModal";
import iconView from "@/components/iconView";
import notification from "@/components/notificationComponent";
import sendyBtn from "@/components/sendyBtn";
import { i18n } from "@/plugins/i18n";


config.global.stubs = {
  IconView: iconView,
  Snackbar: notification,
  "sendy-btn": sendyBtn,
};

config.global.mocks = {
  $translate: (key) => i18n.global.t(key)
};

config.global.plugin = [i18n];

describe("cvvModal", () => {
  const wrapper = shallowMount(cvvModal, {
    props: {
      show: true,
    },
  });
  it("renders props when passed", () => {
    expect(wrapper.props("show")).toBeTruthy();
  });

  it("Tests handleCvv() function", () => {
    wrapper.vm.handleCvv();
    expect(wrapper.find(".modal").isVisible()).toBeTruthy();
  });

  it("Tests closeCvv() function", () => {
    wrapper.vm.closeCvv();
    expect(wrapper.find(".modal").isVisible()).toBeFalsy();
  });
});
