import PaymentOption from '@/Models/PaymentOptions';
import fixtureReader from '../../fixures/fixure_reader';
describe('PaymentOption Model',() => {
	let mpesaPayload;
	let cardPayload;
	let payByBankPayload;
	beforeEach(() => {
		mpesaPayload = fixtureReader('payment_option');
		cardPayload = fixtureReader('payment_option_card');
		payByBankPayload = fixtureReader('payment_option_pay_by_bank');
	});

	describe('isMpesa', () => {
		
		it('return true when payment option is mpesaPayload', () =>{
			const paymentOption = new PaymentOption(mpesaPayload)
			expect(paymentOption.isMpesa).toBe(true);
		});

		it('return False when payment option is not mpesaPayload', ()=> {
			const paymentOption1 = new PaymentOption(cardPayload)
			const paymentOption2 = new PaymentOption(payByBankPayload)

			expect(paymentOption1.isMpesa).toBe(false);
			expect(paymentOption2.isMpesa).toBe(false);
		});
	});

	describe('isCard', () => {
		
		it('return true when payment option is cardPayload', () =>{
			const paymentOption = new PaymentOption(cardPayload)
			expect(paymentOption.isCard).toBe(true);
		});

		it('return False when payment option is not cardPayload', ()=> {
			const paymentOption1 = new PaymentOption(mpesaPayload)
			const paymentOption2 = new PaymentOption(payByBankPayload)

			expect(paymentOption1.isCard).toBe(false);
			expect(paymentOption2.isCard).toBe(false);
		});
	});

	describe('isCard', () => {
		
		it('return true when payment option is cardPayload', () =>{
			const paymentOption = new PaymentOption(cardPayload)
			expect(paymentOption.isCard).toBe(true);
		});

		it('return False when payment option is not cardPayload', ()=> {
			const paymentOption1 = new PaymentOption(mpesaPayload)
			const paymentOption2 = new PaymentOption(payByBankPayload)

			expect(paymentOption1.isCard).toBe(false);
			expect(paymentOption2.isCard).toBe(false);
		});
	});

	describe('isPayWithBankTransfer', () => {
		
		it('return true when payment option is PayWithBankTransfer', () =>{
			const paymentOption = new PaymentOption(payByBankPayload)
			expect(paymentOption.isPayWithBankTransfer).toBe(true);
		});

		it('return False when payment option is not PayWithBankTransfer', ()=> {
			const paymentOption1 = new PaymentOption(mpesaPayload)
			const paymentOption2 = new PaymentOption(cardPayload)

			expect(paymentOption1.isPayWithBankTransfer).toBe(false);
			expect(paymentOption2.isPayWithBankTransfer).toBe(false);
		});
	});

	describe('isMtnMomo', () => {

		it('return False when payment option is not mtnMomo', ()=> {
			const paymentOption1 = new PaymentOption(mpesaPayload)
			const paymentOption2 = new PaymentOption(cardPayload)
			expect(paymentOption1.isMtnMomo).toBe(false);
			expect(paymentOption2.isMtnMomo).toBe(false);
		});
	});

	describe('isAirtelMoney', () => {

		it('return False when payment option is not AirtelMoney', ()=> {
			const paymentOption1 = new PaymentOption(mpesaPayload)
			const paymentOption2 = new PaymentOption(cardPayload)
			expect(paymentOption1.isAirtelMoney).toBe(false);
			expect(paymentOption2.isAirtelMoney).toBe(false);
		});
	});
	describe('isOrangeMoney', () => {
		it('return False when payment option is not OrangeMoney', ()=> {
			const paymentOption1 = new PaymentOption(mpesaPayload)
			const paymentOption2 = new PaymentOption(cardPayload)
			expect(paymentOption1.isOrangeMoney).toBe(false);
			expect(paymentOption2.isOrangeMoney).toBe(false);
		});
	});
	describe('isDefault', () => {
		it('return False when payment option is Default amd false whe its not', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload)
			expect(paymentOption.isDefault).toBe(true);
			paymentOption.unSetDefault();
			expect(paymentOption.isDefault).toBe(false);
		});
	});
	describe('isDefault', () => {
		it('return False when payment option is Default amd false whe its not', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload)
			expect(paymentOption.isDefault).toBe(true);
			paymentOption.unSetDefault();
			expect(paymentOption.isDefault).toBe(false);
		});
	});
	describe('getDisplayName', () => {
		it('Return card for card payment option', ()=> {
			const paymentOption = new PaymentOption(cardPayload)
			const translate = jest.fn().mockReturnValue('Card');
			expect(paymentOption.getDisplayName(translate)).toBe(paymentOption.psp);
		});
		it('Return pay with bank transfer for pay with bank transfer payment option', ()=> {
			const paymentOption = new PaymentOption(payByBankPayload)
			const translate = jest.fn().mockReturnValue('pay_bay_bank');
			expect(paymentOption.getDisplayName(translate)).toBe('pay_bay_bank');
		});
		it('display correct payment option name display for other payment methods apart from the above', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload);
			const translate = jest.fn().mockReturnValue('pay_bay_bank');
			expect(paymentOption.getDisplayName(translate)).toBe(paymentOption.pay_method_name);
		});
	});
	describe('unSetDefault', () => {
		it('should make isDefault to false when called', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload)
			expect(paymentOption.isDefault).toBe(true);
			paymentOption.unSetDefault();
			expect(paymentOption.isDefault).toBe(false);
		});
	});
	describe('setDefault', () => {
		it('should make isDefault to True when called', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload)
			paymentOption.unSetDefault();
			expect(paymentOption.isDefault).toBe(false);
			paymentOption.setDefault();
			expect(paymentOption.isDefault).toBe(true);
		});
	});
	describe('exceedsTransactionLimit', () => {
		it('should return true when it exceeds transaction limit', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload)
			expect(paymentOption.exceedsTransactionLimit(100)).toBe(true);;
		});
		it('should return false when it does not exceed transaction limit', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload)
			expect(paymentOption.exceedsTransactionLimit(5)).toBe(false);;
		});
	});
	describe('exceedsDailyLimit', () => {
		it('should return true when it exceeds DailyLimit', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload)
			expect(paymentOption.exceedsDailyLimit(500000)).toBe(true);;
		});
		it('should return false when it does not exceed DailyLimit', ()=> {
			const paymentOption = new PaymentOption(mpesaPayload)
			expect(paymentOption.exceedsDailyLimit(500)).toBe(false);;
		});
	});
});

