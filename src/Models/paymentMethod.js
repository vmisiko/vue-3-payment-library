
class PaymentMethod {
  constructor(payload) {
    this.payment_method_id = payload.payment_method_id;
    this.name = payload.name;
    this.daily_limit = payload.daily_limit;
    this.stk_limit = payload.stk_limit;
    this.minimum_limit = payload.minimum_limit;
    this.transaction_limit = payload.transaction_limit;
    this.pay_category_id = payload.pay_category_id;
    this.category = payload.category;
    this.withdrawal_limit = payload.withdrawal_limit;
  }

  // payment method names e.g M-PESA, T-Kash
  static PAYMENT_METHOD_NAME_MPESA = "M-PESA";
  static PAYMENT_METHOD_NAME_CREDIT_OR_DEBIT_CARD = "Credit or Debit Card";
  static PAYMENT_METHOD_NAME_PAY_WITH_BANK_TRANSFER = "Pay With Transfer";
  static PAYMENT_METHOD_NAME_MTN_MOMO = "MTN MOMO";
  static PAYMENT_METHOD_NAME_AIRTEL_MONEY = "Airtel Money";
  static PAYMENT_METHOD_NAME_ORANGE_MONEY = "Orange Money";

  // payment method ids
  static PAYMENT_METHOD_ID_MPESA = 1;
  static PAYMENT_METHOD_ID_CARD = 2;
  static PAYMENT_METHOD_ID_PAY_WITH_TRANSFER = 20;
  static PAYMENT_METHOD_ID_MTN_MOMO = 22;
  static PAYMENT_METHOD_ID_AIRTEL_MONEY = 23;
  static PAYMENT_METHOD_ID_ORANGE_MONEY = 24;

  // payment method categories
  static PAYMENT_METHOD_CATEGORY_MOBILE_MONEY = "Mobile Money";
  static PAYMENT_METHOD_CATEGORY_CARD = "Credit or Debit Card";
  static PAYMENT_METHOD_CATEGORY_BANK = "Bank";

  static mobileMoneyPaymentMethods = [
    PaymentMethod.PAYMENT_METHOD_ID_MPESA,
    PaymentMethod.PAYMENT_METHOD_ID_MTN_MOMO,
    PaymentMethod.PAYMENT_METHOD_ID_AIRTEL_MONEY,
    PaymentMethod.PAYMENT_METHOD_ID_ORANGE_MONEY,
  ];

}

export default PaymentMethod;
