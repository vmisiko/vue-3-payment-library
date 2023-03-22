
class PaymentStatus {
  constructor (payload) {
    this.transaction_status = payload.transaction_status;
    this.code = payload.code;
    this.status = payload.status;
    this.message = payload.message;
    this.receipt_no = payload.receipt_no;
    this.transaction_id = payload.transaction_id;
    this.sendy_error_code = payload.sendy_error_code;
  };

  static DS_TIMEOUT_ERRORS = [
    "DS_TIMEOUT",
  ];
  
  get isDstimeout() {
    return PaymentStatus.DS_TIMEOUT_ERRORS.includes(this.sendy_error_code);
  }

}

export default PaymentStatus;
