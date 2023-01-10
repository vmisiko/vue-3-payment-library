import PaymentMethod from "./paymentMethod";

class PaymentOption {
  constructor(payload) {
    this.user_id = payload.user_id;
    this.pay_method_id = payload.pay_method_id;
    this.pay_method_details = payload.pay_method_details;
    this.pay_detail_id = payload.pay_detail_id;
    this.status = payload.status;
    this.pay_direction = payload.pay_direction;
    this.id = payload.id;
    this.pay_method_name = payload.pay_method_name;
    this.default = payload.default;
    this.psp = payload.psp;
    this.category = payload.category;
    this.stk_limit = payload.stk_limit;
    this.daily_limit = payload.daily_limit;
    this.transaction_limit = payload.transaction_limit;
    this.minimum_limit = payload.minimum_limit;
    this.withdrawal_limit = payload.withdrawal_limit;
    this.bank_code = payload.bank_code;
    this.bank_name = payload.bank_name;
    this.phonenumber = payload.phonenumber;
  }

  isMpesa = () => this.pay_method_id === PaymentMethod.PAYMENT_METHOD_ID_MPESA;
  isCard  = () => this.pay_method_id === PaymentMethod.PAYMENT_METHOD_ID_CARD;
  isPayWithBankTransfer = () => this.pay_method_id === PaymentMethod.PAYMENT_METHOD_ID_PAY_WITH_TRANSFER;
  isMtnMomo = () => this.pay_method_id === PaymentMethod.PAYMENT_METHOD_ID_MTN_MOMO;
  isAirtelMoney = () => this.pay_method_id === PaymentMethod.PAYMENT_METHOD_ID_AIRTEL_MONEY;
  isOrangeMoney =  () => this.pay_method_id === PaymentMethod.PAYMENT_METHOD_NAME_ORANGE_MONEY;
  isDefault = () => this.default === 1;
  isMobileMoney = () => PaymentMethod.mobileMoneyPaymentMethods.includes(this.pay_method_id);
  exceedsDailyLimit = (orderAmount) => this.daily_limit > 0 && orderAmount > this.daily_limit;
  exceedsTransactionLimit = (orderAmount) => this.transaction_limit > 0 && orderAmount > this.transaction_limit;

}

export default PaymentOption;
