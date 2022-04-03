import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const locales = require.context("../lang", true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

console.log(loadLocaleMessages());

const i18n = createI18n({
  locale: "en",
  globalInjection: true,
  legacy: false,
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
});

console.log(i18n);

export default i18n;
