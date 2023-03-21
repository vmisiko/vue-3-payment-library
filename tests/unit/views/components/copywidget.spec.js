import { shallowMount, config } from '@vue/test-utils';
import CopyWidget from '@/components/CopyWidget';
import { i18n } from "@/plugins/i18n";
import { createStore } from "vuex";


let wrapper;
let getters;
let store;
let mutations;
let state;
let actions;
let text= 123;
actions = {
  paymentNotification: () => true,
};
store = createStore({
  actions,
  getters,
  mutations,
  state,
});

config.global.plugins = [i18n, store];
config.global.mocks = {
  $translate: (key) => i18n.global.t(key),
  t: (key) => i18n.global.t(key),
};

describe('MyComponent', () => {
  beforeEach(() => {
    wrapper = shallowMount(CopyWidget, {
      props: {
        text,
      },
    });
  });

  it('copies text to clipboard when clicked', async () => {
    // Arrange
    const text1 = 123;
    const cb = {
      writeText: jest.fn().mockResolvedValue(),
    };
    global.navigator.clipboard = cb;
    // Act
    await wrapper.find('.link').trigger('click');

    // Assert
    expect(cb.writeText).toHaveBeenCalledWith(text1);
  });

  it.skip('dispatches paymentNotification when text is copied', async () => {
    // Arrange
    const cb = {
      writeText: jest.fn().mockResolvedValue(),
    };
    global.navigator.clipboard = cb;

    const dispatch = jest.fn();
    // Act
    await wrapper.find('.link').trigger('click');
    // Assert
    expect(dispatch).toHaveBeenCalledWith('paymentNotification', { text: 'Copied!' });
  });
});