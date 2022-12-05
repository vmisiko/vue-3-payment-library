import { shallowMount, config } from "@vue/test-utils";
import noOptionsModal from "@/components/modals/noOptionsModal";
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

describe("noOptionsModal", () => {
  const wrapper = shallowMount(noOptionsModal, {
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
