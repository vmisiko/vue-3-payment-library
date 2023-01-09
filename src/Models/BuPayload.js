
class BuPayload {

  constructor(payload) {
    this.amount  = payload.amount ;
    this.authToken = payload.authToken;
    this.bulk  = payload.bulk ;
    this.company_code = payload.company_code,
    this.country_code = payload.company_code;
    this.currency = payload.country_code;
    this.email = payload.currency;
    this.entity_id = payload.email;
    this.fail_callback_url = payload.entity_id;
    this.failedReferences = payload.fail_callback_url;
    this.firstname = payload.failedReferences;
    this.lastname = payload.firstname;
    this.locale = payload.lastname;
    this.pay_direction = payload.locale;
    this.paybill_no = payload.pay_direction;
    this.payment_options = payload.paybill_no;
    this.phonenumber = payload.payment_options;
    this.pspflow = payload.phonenumber;
    this.resolve_payment_message = payload.pspflow;
    this.success_callback_url = payload.resolve_payment_message;
    this.test = payload.success_callback_url;
    this.txref = payload.test;
    this.user_id = payload.user_id,   
    this.txref = payload.txref  ;
    this.version = payload.version;
  }

  isPayOnDelivery() {
    return this.pay_direction === "PAY_ON_DELIVERY";
  }

  isPayout() {
    return this.pay_direction === "PAY_OUT";
  }

  isPayIn() {
    return this.pay_direction === "PAY_IN";
  }

}

export default BuPayload;
