import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { getCurrentInstance } from 'vue'

const currentInstance = getCurrentInstance()

const store = useStore();

export function useAxios(root) {

  const config = currentInstance.appContext.config.globalProperties.$sendyOptions

  function paymentCustomHeaders() {
    const authToken = store.getters.getBupayload.authToken;
    const param = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authToken,
        "Accept-Language": store.getters.getBupayload.locale
          ? store.getters.getBupayload.locale
          : "en-US,en;q=0.5",
      },
    };
    return param;
  }

  async function paymentAxiosPost(payload) {
    const headers = paymentCustomHeaders();
    try {
      const { url, params } = payload;
      const { data } = await axios.post(
        `${config.BASE_URL}${url}`,
        params,
        headers
      );
      return data;
    } catch (err) {
        handlePaymentAxiosErrors(err.response.status);
      return err;
    }
  }

  async function paymentAxiosGet(payload) {
    try {
      const { url, params } = payload;
      const headers = paymentCustomHeaders();

      const values = {
        params,
        headers: headers.headers,
      };

      const { data } = await axios.get(
        `${config.BASE_URL}${url}`,
        values
      );
      return data;
    } catch (err) {
        handlePaymentAxiosErrors(err.response.status);
      return err;
    }
  }

  async function paymentAxiosPut(payload) {

    try {
      const { url, params } = payload;
      const headers = paymentCustomHeaders();
      const { data } = await axios.put(
        `${config.BASE_URL}${url}`,
        params,
        headers
      );
      return data;
    } catch (err) {
        handlePaymentAxiosErrors(err.response.status);
      return err;
    }
  }

  async function handlePaymentAxiosErrors(error) {
    switch (error) {
      case 403:
        root.$initAxiosErrorNotif({ text: "Please Login Again." });
        break;
      case 204:
        root.$initAxiosErrorNotif({
          text: "Your session has expired. Please login again",
        });
        console.clear();
        break;
      case 500:
        root.$initAxiosErrorNotif({
          text: "Oops an error has Occurred. Please try again",
        });
        break;
      default:
    }
  }

  return {
    config,
    paymentAxiosPost,
    handlePaymentAxiosErrors,
    paymentAxiosGet,
    paymentAxiosPut,
  }
}

