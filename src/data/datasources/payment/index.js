import PaymentStatus from "../../../Models/payment/paymentStatus";

class PaymentDataSource {

  constructor(store) {
    this.store = store;
  }

  async checkout(payload, version) {
    const version1 = version ?? "v3";
    const fullPayload = {
      url: payload.pay_direction !== 'PAY_ON_DELIVERY' ?  `/api/${version1}/process` : '/api/v3/pod/process',
      params: payload,
    };

    try {
      const response = await this.store.dispatch('paymentAxiosPost', fullPayload);
      return new PaymentStatus(response);
    } catch(err) {
      return err;
    }
  }

  async getTransactionStatus(transaction_id) {
    showTimer.value = true;
  
    const payload = {
      url: `/api/v1/process/status/${transaction_id}`,
    }
    try{
      const response = await this.store.dispatch('paymentAxiosGet', payload);
      const res = new PaymentStatus(response);
      return res;
    } catch(err) {
      return(err);
    }
  }

  async getTransactionStatusPod(transaction_id) {
    showTimer.value = true;
  
    const payload = {
      url: `/api/v1/process/pod/status/${transaction_id}`,
    }
    try{
      const response = await this.store.dispatch('paymentAxiosGet', payload);
      const res = new PaymentStatus(response);
      return res;
    } catch(err) {
        return(err);
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
        return(err);
    }
  }

}

export default PaymentDataSource;