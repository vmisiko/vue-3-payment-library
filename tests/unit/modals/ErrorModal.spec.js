import { shallowMount, config } from "@vue/test-utils";
import ErrorModal from "@/components/modals/ErrorModal";
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
};;
config.global.stubs = {
  IconView: iconView,
  Snackbar: notification,
  "sendy-btn": sendyBtn,
};

config.global.plugins = [i18n];

describe("ErrorModal", () => {
  const wrapper = shallowMount(ErrorModal, {
    props: {
      show: true,
      text: "An error Occurred!",
      title: "Failed to Charge Card"
    },
  });
  it("renders props when passed", () => {
    const msg = "An error Occurred!";
    expect(wrapper.props("show")).toBeTruthy();
    expect(wrapper.props("text")).toContain(msg);
  });

  it("Tests handleOpen() function", () => {
    wrapper.vm.handleOpen();
    expect(wrapper.find(".modal").isVisible()).toBeTruthy;
  });

  it("Tests handleClose() function", () => {
    wrapper.vm.handleClose();
    expect(wrapper.find(".modal").isVisible()).toBeFalsy();
  });
  it("Tests props title, text supplied", () => {
    const title = "Failed to Charge Card";
    const text = "An error Occurred!"
    expect(wrapper.props('title')).toEqual(title);
    expect(wrapper.props('text')).toEqual(text);
  });
});
