import PaymentOptionDataSource from '@/data/datasources/paymentOption';
import PaymentOptionReponseModel from '@/data/Models/paymentOptionResponseModel';
import PaymentStatus from '@/Models/payment/paymentStatus';
import fixtureReader from '../../../../fixures/fixure_reader';

describe('PaymentOptionDataSource', () => {
  let mockStore;
  let dataSource;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
    };
    dataSource = new PaymentOptionDataSource(mockStore);
  });

  describe('getPaymentOptions', () => {
    it('should call store.dispatch with the correct arguments and return a PaymentOptionReponseModel instance', async () => {
      const payload = await fixtureReader('payment_options_request');
      const mockResponse = await fixtureReader('payment_options_response');
      mockStore.dispatch.mockResolvedValue(mockResponse)
			const mockResult = new PaymentOptionReponseModel(mockResponse).toDomain();

      const result = await dataSource.getPaymentOptions(payload, false);
			// console.log(result, "result");
      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/payment_methods',
        params: payload,
      });

      expect(JSON.stringify(result)).toEqual(JSON.stringify(mockResult));
    });

    it('should call store.dispatch with the correct arguments for pay on delivery and return a PaymentOptionReponseModel instance', async () => {
      const payload = await fixtureReader('payment_options_request');
      const mockResponse = await fixtureReader('payment_options_response');
      mockStore.dispatch.mockResolvedValue(mockResponse);

			const mockResult = new PaymentOptionReponseModel(mockResponse).toDomain();

      const result = await dataSource.getPaymentOptions(payload, true);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/pod/pay_methods',
        params: payload,
      });

      expect(JSON.stringify(result)).toEqual(JSON.stringify(mockResult));
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = { foo: 'bar' };
      const mockError = new Error('An error occurred.');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.getPaymentOptions(payload, false);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/payment_methods',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('submitInfo', () => {
    it('should call store.dispatch with the correct arguments and return a PaymentStatus instance', async () => {
      const payload = {"transaction_id": "1", "cvv": "123"};
      const mockResponse = await fixtureReader('save_card_status');
      mockStore.dispatch.mockResolvedValue(mockResponse);

      const result = await dataSource.submitInfo(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v3/submit_info',
        params: payload,
      });
      expect(result).toBeInstanceOf(PaymentStatus);
      expect(result.status).toEqual(mockResponse.status);
      expect(result.message).toEqual(mockResponse.message);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = { foo: 'bar' };
      const mockError = new Error('An error occurred.');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.submitInfo(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v3/submit_info',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });
}
);