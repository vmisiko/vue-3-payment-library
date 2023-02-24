
class BuPayload {

  constructor(payload) {
    this.amount  = payload.amount ;
    this.authToken = payload.authToken;
    this.bulk  = payload.bulk ;
    this.company_code = payload.company_code,
    this.country_code = payload.country_code;
    this.currency = payload.currency;
    this.email = payload.email;
    this.entity_id = payload.entity_id;
    this.fail_callback_url = payload.fail_callback_url;
    this.failedReferences = payload.failedReferences;
    this.firstname = payload.firstname;
    this.lastname = payload.lastname;
    this.locale = payload.locale;
    this.pay_direction = payload.pay_direction;
    this.paybill_no = payload.paybill_no;
    this.payment_options = payload.payment_options;
    this.phonenumber = payload.phonenumber;
    this.pspflow = payload.pspflow;
    this.resolve_payment_message = payload.resolve_payment_message;
    this.success_callback_url = payload.success_callback_url;
    this.test = payload.test;
    this.txref = payload.txref;
    this.user_id = payload.user_id,   
    this.version = payload.version;
  }

  isPayOnDelivery = () => this.pay_direction === "PAY_ON_DELIVERY";

  isPayout = () => this.pay_direction === "PAY_OUT";

  isPayIn = () => this.pay_direction === "PAY_IN";

}

export default BuPayload;
