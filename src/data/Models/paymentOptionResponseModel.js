import PaymentOption from "../../Models/PaymentOptions";
import PaymentMethod from "../../Models/paymentMethod";

export default class PaymentOptionReponseModel {

    constructor(response) {
        this.status = response.status;
        this.paymentOptions = response.saved_payment_methods;
        this.paymentMethods  = response.payment_methods;
    }

    toDomain() {
        const res =  {
            status: this.status,
            paymentOptions: this.paymentOptions?.map(element => new PaymentOption(element)),
            paymentMethods: this.paymentMethods?.map(element => new PaymentMethod(element)),
        }
        return res
    }
}