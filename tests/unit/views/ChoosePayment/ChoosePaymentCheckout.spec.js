import { config, shallowMount, mount } from '@vue/test-utils';
import ChoosePaymentCheckout from '@/views/ChoosePayment/ChoosePaymentCheckout';
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
let windowSpy;
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
config.global.plugins = [i18n, store];

formatCurrency = jest.fn();
config.global.mocks = {
  $translate: (key) => i18n.global.t(key),
  t: (key) => i18n.global.t(key),
  $formatCurrency: jest.fn().mockReturnValue('2,000'),
};


config.global.provide = {
	paymentOptionDataSource: {
		getPaymentOptions: async () => mockResult,
		getVirtualAccountBalance: async () => await fixtureReader('virtual_account_balance')
	},
	sendyOptions: {
      config: {
        VGS_ENVIRONMENT: 'sandbox',
      }
    },
},
describe('ChoosePaymentCheckout', () => {

	beforeEach(() => {
		// windowSpy = jest.spyOn(window, "window", "get");
		// windowSpy.mockImplementation(() =>({
		// 	analytics: {
		// 		track: jest.fn(),
		// 	},
		// 	performance: {
		// 		now: jest.fn(),
		// 	}
		// }));
		wrapper = shallowMount(ChoosePaymentCheckout);
		
	});

	it('displays the correct title', () => {
		expect(wrapper.vm.title).toContain('choose_payment_option');
	});

	it('renders the ChooseOption component', () => {
		expect(wrapper.findComponent({ name: 'ChooseOption' }).exists()).toBe(true);
	});

	it('displays the VgsSecure component if default payment method is card', async () => {
		
		const mockResponse1 = fixtureReader('payment_options_response_card_default');
		const mockResult = new PaymentOptionReponseModel(mockResponse1).toDomain();

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
		config.global.plugins = [i18n, store];		
		
		config.global.provide = {
			paymentOptionDataSource: {
				getPaymentOptions: async () => mockResult,
				getVirtualAccountBalance: async () => await fixtureReader('virtual_account_balance')
			},
			sendyOptions: {
				config: {
					VGS_ENVIRONMENT: 'sandbox',
				}
			},
		};
		const wrapper2 = shallowMount(ChoosePaymentCheckout);
		await wrapper2.vm.getDefaultpayMethod();
		expect(wrapper2.findComponent({ name: 'VgsSecure' }).exists()).toBe(true);
	});

	it('Show TransactionLimitModal when the payment amount Exceeds the transaction Limit', async () => {
		wrapper = shallowMount(ChoosePaymentCheckout);
		wrapper.vm.showTransactionLimit = true;
		expect(wrapper.findComponent({ name: 'TransactionLimitModal' }).isVisible()).toBe(true);
	});

	it('Show ErrorModal when the an error Occurs', async () => {
		wrapper = shallowMount(ChoosePaymentCheckout);
		wrapper.vm.showErrorModal = true;
		expect(wrapper.findComponent({ name: 'ErrorModal' }).isVisible()).toBe(true);
	});
	it.skip("Show AdditionalCardFields when additionalData is present and it's not loading", async () => {
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
		config.global.plugins = [i18n, store];
		config.global.provide = {
			paymentOptionDataSource: {
				getPaymentOptions: async () => mockResult,
				getVirtualAccountBalance: async () => await fixtureReader('virtual_account_balance')
			},
			sendyOptions: {
				config: {
					VGS_ENVIRONMENT: 'sandbox',
				}
			},
		};
		const wrapper2 = shallowMount(ChoosePaymentCheckout,);
		wrapper2.vm.additionalData = [{
			field_id: '3',
			field: 'cvv',
			type: 'text',
		}];
		wrapper2.vm.showAdditionalCardFields = true;

		expect(wrapper2.findComponent({ name: 'AdditionalCardFields' }).isVisible()).toBe(true);
	});
});

