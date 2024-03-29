import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useGlobalProp } from "./globalProperties";

export function useSegement() {
  const startTime = ref("");
  const store = useStore();
  const getBupayload = computed(() => store.getters.getBupayload);
  const { sendyOptions } = useGlobalProp();

  onMounted(() => {
    startTime.value = new Date();
    LoadSegment();
  });

  function LoadSegment() {
    var analytics = (window.analytics = window.analytics || []);

    if (!analytics.initialize)
      if (analytics.invoked) return;
      else {
        analytics.invoked = !0;
        analytics.methods = [
          "trackSubmit",
          "trackClick",
          "trackLink",
          "trackForm",
          "pageview",
          "identify",
          "reset",
          "group",
          "track",
          "ready",
          "alias",
          "debug",
          "page",
          "once",
          "off",
          "on",
          "addSourceMiddleware",
          "addIntegrationMiddleware",
          "setAnonymousId",
          "addDestinationMiddleware",
        ];
        analytics.factory = function (e) {
          return function () {
            var t = Array.prototype.slice.call(arguments);
            t.unshift(e);
            analytics.push(t);
            return analytics;
          };
        };
        for (var e = 0; e < analytics.methods.length; e++) {
          var key = analytics.methods[e];
          analytics[key] = analytics.factory(key);
        }
        analytics.load = function (key, e) {
          var t = document.createElement("script");
          t.type = "text/javascript";
          t.async = !0;
          t.src =
            "https://cdn.segment.com/analytics.js/v1/" +
            key +
            "/analytics.min.js";
          var n = document.getElementsByTagName("script")[0];
          n?.parentNode?.insertBefore(t, n);
          analytics._loadOptions = e;
        };
        const segmentKey = sendyOptions.config.VGS_ENVIRONMENT === 'sandbox' ? "rKWx4tQ7ZV5kKMJAODDbtwrpewLjA0DV" : "926xrVY1VJtPAPzFx5E9UjxjRJFGOBor";
        analytics._writeKey = segmentKey
        analytics.SNIPPET_VERSION = "4.15.3";
        analytics.load(segmentKey);
      }
  }

  function commonTrackPayload() {
    const date = new Date();
    const finishTime = date - startTime.value;
    const payload = {
      user_id: getBupayload.value.user_id,
      product: parseInt(getBupayload.value.entity_id) === 6 ? "Fulfillment" : "Supply",
      timestamp: Date.now(),
      platform_name: isMobile ? getMobileOs() : "web",
      duration_on_page: finishTime,
      pay_direction: getBupayload.value.pay_direction,
    };
    return payload;
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  function getMobileOs() {
    let name = "web";
    if (navigator.userAgent.indexOf("Android") != -1) {
      name = "Android";
    }
    if (navigator.userAgent.indexOf("like Mac") != -1) {
      name = "iOS";
    }
    return name;
  }

  return {
    startTime,
    commonTrackPayload,
  };
}
