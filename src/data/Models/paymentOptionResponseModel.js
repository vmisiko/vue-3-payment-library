import PaymentOption from "../../Models/PaymentOptions";
import PaymentMethod from "../../Models/paymentMethod";

export default class PaymentOptionReponseModel {

    constructor(response) {
        this.status = response.status;
        this.paymentOptions = response.saved_payment_methods;
        this.paymenMethods  = response.payment_methods;
    }

    toDomain() {
        return {
            status: this.status,
            paymentOptions: this.paymentOptions.forEach(element => {
                return new PaymentOption(element);
            }),
            paymentMethods: this.paymentMethods.forEach(element => {
                return new PaymentMethod(element);
            }),
        }
    }
}