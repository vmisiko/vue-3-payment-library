
import BuPayload from '../../../src/Models/BuPayload';
import fixtureReader from '../../fixures/fixure_reader';
describe('BuPayload Model',() => {
	let payload
	beforeEach(() => {
		payload = fixtureReader('bu_payload');
	});

	describe('isPayOnDelivery', () => {
        it('return false when pay direction is not PAY_ON_DELIVERY', () =>{
			const buPayload = new BuPayload(payload)
			expect(buPayload.isPayOnDelivery).toBe(false);
		});
        
		it('return true when pay direction is PAY_ON_DELIVERY', () =>{
			const buPayload = new BuPayload(payload)
            buPayload.pay_direction = 'PAY_ON_DELIVERY'
			expect(buPayload.isPayOnDelivery).toBe(true);
		});
	});
	describe('isPayout', () => {
        it('return false when pay direction is not PAY_OUT', () =>{
			const buPayload = new BuPayload(payload)
			expect(buPayload.isPayout).toBe(false);
		});
        
		it('return true when pay direction is pay on Delivery', () =>{
			const buPayload = new BuPayload(payload)
            buPayload.pay_direction = 'PAY_OUT';
			expect(buPayload.isPayout).toBe(true);
		});
	});

	describe('isPayIn', () => {
        it('return false when pay direction is no PAY_IN', () =>{
			const buPayload = new BuPayload(payload)
			buPayload.pay_direction = 'PAY_OUT';
			expect(buPayload.isPayIn).toBe(false);
		});
        
		it('return true when pay direction is PAY_IN', () =>{
			const buPayload = new BuPayload(payload)
			expect(buPayload.isPayIn).toBe(true);
		});
	});

});

