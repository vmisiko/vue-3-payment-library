import PaymentOptionDataSource from '@/data/datasources/paymentOption';
import PaymentOptionReponseModel from '@/data/Models/paymentOptionResponseModel';
import PaymentStatus from '@/Models/payment/paymentStatus';
import fixtureReader from '../../../../fixures/fixure_reader';

describe('PaymentOptionDataSource', () => {
  let mockStore;
  let mockAxios;
  let dataSource;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
    };
    mockAxios = {
      get: jest.fn(),
    };
    dataSource = new PaymentOptionDataSource(mockStore, mockAxios);
  });

  describe('getPaymentOptions', () => {
    it('should call store.dispatch with the correct arguments and return a PaymentOptionReponseModel instance', async () => {
      const payload = await fixtureReader('payment_options_request');
      const mockResponse = await fixtureReader('payment_options_response');
      mockStore.dispatch.mockResolvedValue(mockResponse)
			const mockResult = new PaymentOptionReponseModel(mockResponse).toDomain();

      const result = await dataSource.getPaymentOptions(payload, false);
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

  describe('setDefaultPaymentOption', () => {
    it('should call store.dispatch with the correct arguments and return correct response', async () => {
      const payload = await fixtureReader('update_payment_option_request');
      const mockResponse = await fixtureReader('status_response');
      mockStore.dispatch.mockResolvedValue(mockResponse);

      const result = await dataSource.setDefaultPaymentOption(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/set_default',
        params: payload,
      });
      expect(result.status).toEqual(mockResponse.status);
      expect(result.message).toEqual(mockResponse.message);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('update_payment_option_request');
      const mockError = new Error('An error occurred.');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.setDefaultPaymentOption(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/set_default',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('getPaybill', () => {
    it('should call store.dispatch with the correct arguments and return correct response', async () => {
      const payload = await fixtureReader('get_paybill_request');
      const mockResponse = await fixtureReader('get_paybill_response');
      const mockHeadResponse = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "authToken",
          "Accept-Language": "en-US,en;q=0.5",
        }
      };
      mockStore.dispatch.mockResolvedValue(mockHeadResponse);
      mockAxios.get.mockResolvedValue({data: mockResponse});
      const result = await dataSource.getPaybill(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentCustomHeaders');
      expect(result.description).toEqual(mockResponse.description);
      expect(result.short_code).toEqual(mockResponse.short_code);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('get_paybill_request');
      const mockError = new Error('An error occurred.');
      const mockHeadResponse = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "authToken",
          "Accept-Language": "en-US,en;q=0.5",
        }
      };
      mockStore.dispatch.mockResolvedValue(mockHeadResponse);
      mockAxios.get.mockResolvedValue({data: mockError});
      const result = await dataSource.getPaybill(payload);
      expect(result).toEqual(mockError);
    });
  });

  describe('savePaymentOption', () => {
    it('should call store.dispatch with the correct arguments and return correct response', async () => {
      const payload = await fixtureReader('save_payment_option_request');
      const mockResponse = await fixtureReader('status_response');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.savePaymentOption(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/save_payment_method',
        params: payload,
      });
      expect(result.message).toEqual(mockResponse.message);
      expect(result.status).toEqual(mockResponse.status);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('save_payment_option_request');
      const mockError = new Error('An error occurred.');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.savePaymentOption(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/save_payment_method',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('deletePaymentOption', () => {
    it('should call store.dispatch with the correct arguments and return correct response', async () => {
      const payload = await fixtureReader('update_payment_option_request');
      const mockResponse = await fixtureReader('status_response');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.deletePaymentOption(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/delete_payment_method',
        params: payload,
      });
      expect(result.message).toEqual(mockResponse.message);
      expect(result.status).toEqual(mockResponse.status);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('update_payment_option_request');
      const mockError = await fixtureReader('status_response_false');
      mockStore.dispatch.mockResolvedValue(mockError);
      const result = await dataSource.deletePaymentOption(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/delete_payment_method',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('deleteCard', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('delete_card_request');
      const mockResponse = await fixtureReader('status_response');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.deleteCard(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v1/card/delete',
        params: payload,
      });
      expect(result.message).toEqual(mockResponse.message);
      expect(result.status).toEqual(mockResponse.status);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('delete_card_request');
      const mockError = await fixtureReader('status_response_false');
      mockStore.dispatch.mockResolvedValue(mockError);
      const result = await dataSource.deleteCard(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v1/card/delete',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('fetchCardDetails', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('fetch_card_details_request');
      const mockResponse = await fixtureReader('card_details');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.fetchCardDetails(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v1/card/fetch',
        params: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('fetch_card_details_request');
      const mockError = await fixtureReader('card_details');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.fetchCardDetails(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v1/card/fetch',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('openAccount', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('set_up_pay_by_bank_req_model');
      const mockResponse = await fixtureReader('list_virtual_accounts_resp');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.openAccount(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v3/onepipe/open_account',
        params: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('set_up_pay_by_bank_req_model');
      const mockError = await fixtureReader('list_virtual_accounts_resp_error');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.openAccount(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v3/onepipe/open_account',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('openAccountPOD', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('set_up_pay_by_bank_req_model');
      const mockResponse = await fixtureReader('list_virtual_accounts_resp');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.openAccountPOD(payload);
      
      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v3/pod/pwt/open_account',
        params: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('set_up_pay_by_bank_req_model');
      const mockError = await fixtureReader('list_virtual_accounts_resp_error');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.openAccountPOD(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v3/pod/pwt/open_account',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe.skip('getOtp', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('otp_request');
      const mockResponse = await fixtureReader('otp_response');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.getOtp(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v1/otp/get',
        params: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('otp_request');
      const mockError = await fixtureReader('otp_response_failed');;
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.getOtp(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v1/otp/get',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('validateOtp', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('set_up_pay_by_bank_req_model');
      const mockResponse = await fixtureReader('list_virtual_accounts_resp');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.validateOtp(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v1/otp/validate',
        params: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = { foo: 'bar' };
      const mockError = new Error('An error occurred.');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.validateOtp(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v1/otp/validate',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('getVirtualAccountBalance', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('virtual_account_balance_request');
      const mockResponse = await fixtureReader('virtual_account_balance');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.getVirtualAccountBalance(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosGet', {
        url: '/api/v3/onepipe/balance',
        params: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('virtual_account_balance_request');
      const mockError = await fixtureReader('virtual_account_balance_error');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.getVirtualAccountBalance(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosGet', {
        url: '/api/v3/onepipe/balance',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('getVirtualAccountBalancePOD', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('virtual_account_balance_request');
      const mockResponse = await fixtureReader('virtual_account_balance');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.getVirtualAccountBalancePOD(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v3/pod/pwt/balance',
        params: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('virtual_account_balance_request');
      const mockError = await fixtureReader('virtual_account_balance_error');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.getVirtualAccountBalancePOD(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosPost', {
        url: '/api/v3/pod/pwt/balance',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('listVirtualAccounts', () => {
    it('should call store.dispatch with the correct arguments and return correct status response', async () => {
      const payload = await fixtureReader('list_virtual_accounts_request');
      const mockResponse = await fixtureReader('list_virtual_accounts_resp');
      mockStore.dispatch.mockResolvedValue(mockResponse);
      const result = await dataSource.listVirtualAccounts(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosGet', {
        url: '/api/v3/onepipe/accounts/',
        params: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return an error if store.dispatch rejects', async () => {
      const payload = await fixtureReader('list_virtual_accounts_request');
      const mockError = await fixtureReader('list_virtual_accounts_resp_error');
      mockStore.dispatch.mockRejectedValue(mockError);

      const result = await dataSource.listVirtualAccounts(payload);

      expect(mockStore.dispatch).toHaveBeenCalledWith('paymentAxiosGet', {
        url: '/api/v3/onepipe/accounts/',
        params: payload,
      });
      expect(result).toEqual(mockError);
    });
  });
}
);