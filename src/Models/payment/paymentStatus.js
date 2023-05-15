import { Static } from "vue";

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

  static FRAUD_DETECTION_ERROR = 'FRAUD_DETECTION';
  
  get isDstimeout() {
    return PaymentStatus.DS_TIMEOUT_ERRORS.includes(this.sendy_error_code);
  }

  get isFraudDetected() {
    return this.sendy_error_code === PaymentStatus.FRAUD_DETECTION_ERROR && this.status;
  }

  get isSuccess() {
    return this.status && this.transaction_status === 'success';
  }

  get isPending() {
    return this.status && this.transaction_status === 'pending';
  }

  get isFailed() {
    if (this.status && this.transaction_status === 'failed') {
      return true;
    } 

    if (!this.status && his.transaction_status === 'failed') {
      return true;
    }
  }



}

export default PaymentStatus;
