import { shallowMount, config } from "@vue/test-utils";
import PaymentOptionTypeText from "../../../../../src/views/ChoosePayment/components/PaymentOptionTypeText";
import PaymentOption from '../../../../../src/Models/PaymentOptions';
import fixtureReader from "../../../../fixures/fixure_reader";
import { i18n } from "@/plugins/i18n";

let wrapper;


describe('PaymentOptionTypeText', () => {


    it('render the correct formatted card format as payment option text', () => {
        let paymentOption = new PaymentOption(fixtureReader('payment_option_card'));
        wrapper = shallowMount(PaymentOptionTypeText, {
            props: {
                paymentOption,
            }
        });

        expect(wrapper.find('#psp').text()).toBe(paymentOption.psp);
        expect(wrapper.find('#card-id').text()).toBe('**** 0259');
    })

    it('render the correct payment method detail for non card and not pay by bank payment option', () => {
        let paymentOption = new PaymentOption(fixtureReader('payment_option'));
        wrapper = shallowMount(PaymentOptionTypeText, {
            props: {
                paymentOption,
            }
        });

        expect(wrapper.find('#non-card').text()).toBe(paymentOption.pay_method_name);
    })

    it.skip('render the correct payment method name for Pay By Bank payment option', () => {
        let paymentOption = new PaymentOption(fixtureReader('payment_option_pay_by_bank'));
        wrapper = shallowMount(PaymentOptionTypeText, {
            mocks: {
                $translate: (key) => i18n.global.t(key),
            },
            props: {
                paymentOption,
            },
            global: {
                plugins: [i18n]
            },
            
        });
        expect(wrapper.find('#pay-by-bank').text()).toBe('pay_by_bank');
    })
});
