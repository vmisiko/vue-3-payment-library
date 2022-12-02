import { mount, config } from "@vue/test-utils";
import AxiosErrorModal from "@/components/modals/AxiosErrorModal";
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


config.global.plugins = [i18n];
describe("AxiosErrorModal", () => {
  const wrapper = mount(AxiosErrorModal, {
    props: {
      show: true,
      text: "An error occurred",
    },
  });
  it("renders props when passed", () => {
    const msg = "An error occurred";
    expect(wrapper.props("show")).toBeTruthy()
    expect(wrapper.props("text")).toContain(msg);
  });

  it("Tests handleOpen() function", () => {
    wrapper.setProps({show: true});
    expect(wrapper.find("#axios-modal").isVisible()).toBeTruthy();
  });

  it("Tests handleClose() function", () => {
    wrapper.vm.handleClose();
    expect(wrapper.find("#axios-modal").isVisible()).toBeFalsy();
  });
});
