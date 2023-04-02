import { shallowMount, config } from '@vue/test-utils';
import ChooseOption from '@/views/ChoosePayment/components/ChooseOption';
import { i18n } from "@/plugins/i18n";
import { createStore } from "vuex";
import fixtureReader from '../../../../fixures/fixure_reader';
import PaymentOption from '../../../../../src/Models/PaymentOptions';
import BuPayload from '../../../../../src/Models/BuPayload';

let wrapper;
let getters;
let store;
let mutations;
let state;
let actions;
const paymentOptionJson = fixtureReader('payment_option');
const bupayload = new BuPayload(fixtureReader('bu_payload'));
actions = {
  paymentNotification: () => true,
};

getters = {
    getBupayload: () => bupayload,
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
config.global.provide = {
    paymentOptionDataSource: {
        getVirtualAccountBalance: async () => await fixtureReader('virtual_account_balance')
    }
},


describe('MyComponent', () => {
  beforeEach(() => {
    wrapper = shallowMount(ChooseOption, {
      props: {
        modelValue: 'c35055ee-e69c-4d72-8cac-10568fd11842', 
        paymentOption: new PaymentOption(paymentOptionJson),
        value: "c35055ee-e69c-4d72-8cac-10568fd11842"
      },
    });
  });

  describe('disableLogic', () => {


    it('check if payment option is not disabled when amount is within daily limit', async () => {
        wrapper = shallowMount(ChooseOption, {
            props: {
              modelValue: 'c35055ee-e69c-4d72-8cac-10568fd11842', 
              paymentOption: new PaymentOption(paymentOptionJson),
              value: "c35055ee-e69c-4d72-8cac-10568fd11842"
            },
        });
        expect(wrapper.vm.disableLogic).toBeFalsy();
    });

    it('check if payment option is disabled when amount exceeds daily limit', async () => {
        wrapper = shallowMount(ChooseOption, {
            props: {
              modelValue: 'c35055ee-e69c-4d72-8cac-10568fd11842', 
              paymentOption: new PaymentOption(fixtureReader('payment_option_exceed_limit')),
              value: "c35055ee-e69c-4d72-8cac-10568fd11842"
            },
        });
        expect(wrapper.vm.disableLogic).toBeTruthy();
    });
  })

  describe('isChecked', () => {

    it('check if isChecked when the payment option is default', async () => {
        wrapper = shallowMount(ChooseOption, {
            props: {
              modelValue: 'c35055ee-e69c-4d72-8cac-10568fd11842', 
              paymentOption: new PaymentOption(paymentOptionJson),
              value: "c35055ee-e69c-4d72-8cac-10568fd11842"
            },
        });
        expect(wrapper.vm.isChecked).toBeTruthy();
    });
  })
  describe.skip('getBalance', () => {

    it('check if getbalance has not been called payment option is not pay by bank', async () => {
      const getBalance = jest.spyOn(ChooseOption.methods, 'getBalance');
 
      wrapper = shallowMount(ChooseOption, {
            props: {
              modelValue: 'c35055ee-e69c-4d72-8cac-10568fd11842', 
              paymentOption: new PaymentOption(paymentOptionJson),
              value: "c35055ee-e69c-4d72-8cac-10568fd11842"
            },
        });
      expect(getBalance).toHaveBeenCalled();
    });
  })
});