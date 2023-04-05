import { config, shallowMount, mount } from '@vue/test-utils';
import ChoosePayment from '@/views/ChoosePayment';
import { i18n } from "@/plugins/i18n";
import { createStore } from "vuex";
import fixtureReader from '../../../fixures/fixure_reader';
import BuPayload from '../../../../src/Models/BuPayload';
import iconView from "@/components/iconView";
import notification from "@/components/notificationComponent";
import sendyBtn from "@/components/sendyBtn";
import AdditionalCardFields from "@/views/AdditionalCardFields";
import PaymentOptionReponseModel from '../../../../src/data/Models/paymentOptionResponseModel';

let wrapper;
let getters;
let store;
let mutations;
let state;
let actions;
const bupayload = new BuPayload(fixtureReader('bu_payload'));

config.global.stubs = {
  IconView: iconView,
  Snackbar: notification,
  "sendy-btn": sendyBtn,
  AdditionalCardFields,
};

actions = {
  paymentNotification: () => true,
};

mutations = {
	setPaymentMethods: jest.fn(),
	setSavedPayMethods: jest.fn(),
	setLoading: jest.fn(),
}

const mockResponse = fixtureReader('payment_options_response');
const mockResult = new PaymentOptionReponseModel(mockResponse).toDomain();

getters = {
  getBupayload: () => bupayload,
	getSavedPayMethods: () => mockResult.paymentOptions,
	getLoading: () => false,
};

store = createStore({
  actions,
  getters,
  mutations,
  state,
});

formatCurrency = jest.fn();
const mockRouter = {
	push: jest.fn(),
}
config.global.mocks = {
  $translate: (key) => i18n.global.t(key),
  t: jest.fn(),
  $formatCurrency: jest.fn().mockReturnValue('2,000'),
	$router: mockRouter,	
	router: mockRouter,	
};

config.global.plugins = [i18n, store];


config.global.provide = {
	paymentOptionDataSource: {
		getPaymentOptions: async () => mockResult,
		getVirtualAccountBalance: async () => await fixtureReader('virtual_account_balance'),
		setDefaultPaymentOption: async () => await fixtureReader('status_response'),
	},
	sendyOptions: {
      config: {
        VGS_ENVIRONMENT: 'sandbox',
      }
    },
},
describe('ChoosePayment', () => {

	beforeEach(() => {
		wrapper = shallowMount(ChoosePayment);
	});

	it('displays Top Info with correct title', async () => {
		await flushPromises()
		expect(wrapper.findComponent({name: 'TopInfo'}).isVisible()).toBe(true);
		expect(wrapper.vm.icon).toContain('back');
	});

	it('renders the ChooseOption component', () => {
		expect(wrapper.findComponent({ name: 'ChooseOption' }).exists()).toBe(true);
	});

	it.skip('Redirect to Add Payment Method page when Add payment method is tapped', async () => {
		wrapper = shallowMount(ChoosePayment);
		console.log(wrapper.find('#add-payment'));
		await wrapper.find('#add-payment').trigger('click');
		expect(mockRouter.push).toHaveBeenCalledTimes(1);
		expect(mockRouter.push).toHaveBeenCalledWith('/add-payment');
	});

	it('When card choose option is clicked, it should update to default payment method', async () => {
		wrapper = shallowMount(ChoosePayment);
		await wrapper.find('#choose-card').trigger('change');
		expect(wrapper.vm.defaultPaymentMethod.pay_method_name).toBe('Card');
	});

});

