import { shallowMount } from "@vue/test-utils";
import PaymentIcon from "../../../../../src/views/ChoosePayment/components/paymentIcon";
import PaymentOption from '../../../../../src/Models/PaymentOptions';
import fixtureReader from "../../../../fixures/fixure_reader";

let wrapper;

describe('PaymentIcon', () => {


    it('render the correct icon for mpesa', () => {
        let paymentOption = new PaymentOption(fixtureReader('payment_option'));
        wrapper = shallowMount(PaymentIcon, {
            props: {
                paymentOption,
            }
        });

        expect(wrapper.vm.name).toBe(paymentOption.pay_method_name);
    })



    it('Render the correct icon for Card', () => {
        let paymentOption = new PaymentOption(fixtureReader('payment_option_card'));
        wrapper = shallowMount(PaymentIcon, {
            props: {
                paymentOption,
            }
        });

        expect(wrapper.vm.name).toBe(paymentOption.psp);
    });

    it('Render the correct default icon if card icon is not available', () => {
        let paymentOption = new PaymentOption(fixtureReader('payment_option_card'));
        paymentOption.psp = null;
        wrapper = shallowMount(PaymentIcon, {
            props: {
                paymentOption,
            }
        });

        expect(wrapper.vm.name).toBe('card');
    });

});
