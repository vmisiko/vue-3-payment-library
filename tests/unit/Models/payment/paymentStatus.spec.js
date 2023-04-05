
import PaymentStatus from '../../../../src/Models/payment/paymentStatus';
import fixtureReader from '../../../fixures/fixure_reader';

describe('PaymentStatus Model',() => {
	let payload
	beforeEach(() => {
		payload = fixtureReader('payment_status_failed');
	});

	describe('isDstimeout', () => {
    it('return true when sendy_error_code is DS_TIMEOUT', () =>{
			const paymentStatus = new PaymentStatus(payload)
			expect(paymentStatus.isDstimeout).toBe(true);
		});
        
		it('return false when sendy_error_code is not DS_TIMEOUT', () =>{
			const paymentStatus = new PaymentStatus(payload)
			paymentStatus.sendy_error_code = "sdsdsds";
			expect(paymentStatus.isDstimeout).toBe(false);
		});
	});
});

