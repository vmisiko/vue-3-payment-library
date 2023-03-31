

import PaymentStatus from "../../../Models/payment/paymentStatus";
import NetworkConstants from "../../../constants";
import PaymentOptionReponseModel from "../../Models/paymentOptionResponseModel";


class PaymentOptionDataSource {

  constructor(store) {
    this.store = store;
  }

	async getPaymentOptions(payload, isPayOnDelivery) {
		const fullPayload = {
      url: !isPayOnDelivery ? "/payment_methods" : "/pod/pay_methods",
      params: payload,
    };

		try {
			const response =  await store.dispatch("paymentAxiosPost", fullPayload);
			const res = new PaymentOptionReponseModel(response);
			console.log(res.toDomain());
			return  res.toDomain();
		} catch(err) {
			return err;
		}
	}

	async submitInfo(payload) { 
    const fullPayload = {
      params: payload,
      url: "/api/v3/submit_info",
    };
    try{
      const response = await this.store.dispatch("paymentAxiosPost", fullPayload);
      const res = new PaymentStatus(response);
      return res;
    } catch(err) {
        return err;
    }
  }

	async setDefaultPaymentOption(payload) {
		const fullPayload = {
      url: `/set_default`,
      params: payload,
    };
		try{
			const response = await store.dispatch("paymentAxiosPost", fullPayload);
			return response;
		} catch(err) {
			return err;
		}
	}

  async getPaybill(payload, isSandbox) {

    const endpoint = "/api/v2/config/psp/safaricom/mpesa/pay_bill_config";

    const url = isSandbox ?  NetworkConstants.paymentServiceBaseStagingurl : NetworkConstants.paymentServiceBaseurl;
    const headers = await store.dispatch("paymentCustomHeaders");

    const values = {
      params: payload,
      headers: headers.headers,
    };

		try {
			const {data} = await axios.get(
				`${url}${endpoint}`,
				values
			);
			return data;
		} catch(err) {
			return err;
		}
  }

	async getSaveCardStatus() {}
  async saveCard() {}
	async savePaymentOption() {}
	async deletePaymentOption() {}
	async deleteCard() {}
	async fetchCardDetails() {}
	async setUpPayByBank() {}
	async payByBankOtp() {}
	async validateOtp() {}
	async getVirtualAccountBalance() {}
	async listVirtualAccounts() {}
}

export default PaymentOptionDataSource;
