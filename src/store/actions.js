import axios from "axios";
import * as Sentry from "@sentry/vue";
import { datadogRum } from "@datadog/browser-rum";


export default {
  paymentCustomHeaders({ state }) {
    const authToken = state.bupayload.authToken;
    const param = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authToken,
        "Accept-Language": state.bupayload.locale
          ? state.bupayload.locale
          : "en-US,en;q=0.5",
      },
    };
    return param;
  },
  async paymentAxiosPost({ dispatch }, payload) {
    const headers = await dispatch("paymentCustomHeaders");
    try {
      const { url, params } = payload;
      const { data } = await axios.post(
        `${this.$sendyOptions.config.BASE_URL}${url}`,
        params,
        headers
      );
      return data;
    } catch (err) {
      await dispatch("handlePaymentAxiosErrors", err.response.status);
      Sentry.captureException(err);
      datadogRum.addError(err);
      return err;
    }
  },
  async paymentAxiosGet({ dispatch }, payload) {
    try {
      const { url, params } = payload;
      const headers = await dispatch("paymentCustomHeaders");

      const values = {
        params,
        headers: headers.headers,
      };

      const { data } = await axios.get(
        `${this.$sendyOptions.config.BASE_URL}${url}`,
        values
      );
      return data;
    } catch (err) {
      await dispatch("handlePaymentAxiosErrors", err.response.status);
      Sentry.captureException(err);
      datadogRum.addError(err);
      return err;
    }
  },
  async paymentAxiosPut({ dispatch }, payload) {
    try {
      const { url, params } = payload;
      const headers = await dispatch("paymentCustomHeaders");
      const { data } = await axios.put(
        `${this.$sendyOptions.config.BASE_URL}${url}`,
        params,
        headers
      );
      return data;
    } catch (err) {
      await dispatch("handlePaymentAxiosErrors", err.response.status);
      Sentry.captureException(err);
      datadogRum.addError(err);
      return err;
    }
  },
  async paymentAxiosDelete({dispatch}, payload) {
    try {
      const { url, params } = payload;
      const headers = await dispatch("paymentCustomHeaders");
      const { data } = await axios.delete(
        `${this.$sendyOptions.config.BASE_URL}${url}`,
        params,
        headers
      );
      return data;
    } catch (err) {
      await dispatch("handlePaymentAxiosErrors", err.response.status);
      Sentry.captureException(err);
      datadogRum.addError(err);
      return err;
    }
  },
  /*eslint-disable */
  async handlePaymentAxiosErrors({ state }, error) {
    switch (error) {
      case 401:
        this.emitter.emit("axios-notification", {
          text: "Unauthorized! Please Login Again.",
        });
        break;
      case 403:
        this.emitter.emit("axios-notification", {
          text: "Unauthorized! Please Login Again.",
        });
        break;
      case 204:
        this.emitter.emit("axios-notification", {
          text: "Your session has expired. Please login again",
        });
        console.clear();
        break;
      case 500:
        this.emitter.emit("axios-notification", {
          text: "Oops an error has Occurred. Please try again",
        });
        break;
      default:
    }
  },
  paymentNotification({state}, payload) {
    this.emitter.emit("payment-notification", payload);
  }
};
