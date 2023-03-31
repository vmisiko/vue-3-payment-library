

import PaymentStatus from "../../../Models/payment/paymentStatus";
import NetworkConstants from "../../../constants";
import PaymentOptionReponseModel from "../../Models/paymentOptionResponseModel";


class PaymentOptionDataSource {

  constructor(store, axios) {
    this.store = store;
	this.axios = axios;
  }

	async getPaymentOptions(payload, isPayOnDelivery) {
		const fullPayload = {
      url: !isPayOnDelivery ? "/payment_methods" : "/pod/pay_methods",
      params: payload,
    };

		try {
			const response =  await this.store.dispatch("paymentAxiosPost", fullPayload);
			const res = new PaymentOptionReponseModel(response);
			return  await res.toDomain();
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
			const response = await this.store.dispatch("paymentAxiosPost", fullPayload);
			return response;
		} catch(err) {
			return err;
		}
	}

  async getPaybill(payload, isSandbox) {

    const endpoint = "/api/v2/config/psp/safaricom/mpesa/pay_bill_config";

    const url = isSandbox ?  NetworkConstants.paymentServiceBaseStagingurl : NetworkConstants.paymentServiceBaseurl;
    const headers = await this.store.dispatch("paymentCustomHeaders");

    const values = {
      params: payload,
      headers: headers.headers,
    };

		try {
			const {data} = await this.axios.get(
				`${url}${endpoint}`,
				values
			);
			return data;
		} catch(err) {
			return err;
		}
  }
	
	async savePaymentOption(payload) {

		try {
			const fullPayload = {
        url: "/save_payment_method",
        params: payload,
      };

      const response = await this.store.dispatch('paymentAxiosPost', fullPayload);
			return response;
		} catch (error) {
			return error;
		}
	}
	async deletePaymentOption(payload) {
		const fullPayload = {
			url: "/delete_payment_method",
			params: payload,
		};

		try {
			const response = await this.store.dispatch('paymentAxiosPost',fullPayload); 
			return response;
		} catch(err) {
			return err;
		}
	}
	async deleteCard(payload) {
		const fullPayload = {
			url: "/api/v1/card/delete",
			params: payload,
		};
		try {
			const response = await this.store.dispatch('paymentAxiosPost', fullPayload);
			return response;
		} catch(err) {
			return err;
		}
	}
	async fetchCardDetails(payload) {
		const fullPayload = {
			url: "/api/v1/card/fetch",
			params: payload,
		};

		try {
			const response = await this.store.dispatch('paymentAxiosPost',fullPayload);
			return response;
		} catch(err) {
			return err;
		}
		
	}

	async openAccount(payload) {
		const fullPayload = {
      url:  "/api/v3/onepipe/open_account",
      params: payload,
    };

		try {
			const response = await this.store.dispatch('paymentAxiosPost', fullPayload);
			return response;
		} catch (error) {
			return error;
		}
	}

	async openAccountPOD(payload) {
		const fullPayload = {
      url:  "/api/v3/pod/pwt/open_account",
      params: payload,
    };

		try {
			const response = await this.store.dispatch('paymentAxiosPost', fullPayload);
			return response;
		} catch (error) {
			return error;
		}
	}

	async getOtp() {
		const fullPayload = {
      params: payload,
      url: "/api/v1/otp/get"
    }
		try {
			const result = await this.store.dispatch('paymentAxiosPost', fullPayload);
			return result;
		} catch (error) {
			return error;
		}
	}

	async validateOtp(payload) {
		const fullPayload = {
      url: "/api/v1/otp/validate",
      params: payload
    }
		try {
			const result = await this.store.dispatch('paymentAxiosPost', fullPayload);
			return result;
		} catch (error) {
			return error;
		}
	}
	async getVirtualAccountBalance(payload) {
		const fullPayload = {
      params: payload,
      url: `/api/v3/onepipe/balance`,
    };

		try {
			const response = await this.store.dispatch('paymentAxiosGet', fullPayload);
			return response;
		} catch (error) {
			return error;
		}
   
	}
	async getVirtualAccountBalancePOD(payload) {
		const fullPayload = {
      params: payload,
      url: '/api/v3/pod/pwt/balance',
    };

		try {
			const response = await this.store.dispatch('paymentAxiosPost', fullPayload);
			return response;
		} catch (error) {
			return error;
		}
   
	}
	async listVirtualAccounts(payload) {
		const fullPayload = {
      url: `/api/v3/onepipe/accounts/`,
      params: payload,
    };

		try {
			const response = await this.store.dispatch('paymentAxiosGet', fullPayload);
			return response;
		} catch (error) {
			return error;
		}
	}
}

export default PaymentOptionDataSource;
