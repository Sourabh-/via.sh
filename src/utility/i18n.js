import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          "To get started, edit <1>src/App.js</1> and save to reload.": "To get started, edit <1>src/App.js</1> and save to reload.",
          "Welcome to React": "Welcome to React and react-i18next",
          "message404": "The page you are looking for does not exist here.",
          "thatsWeird": "That's weird!",
          "pageNotFound": "We sincerely apologise.",
          "onyxMessage": "Either Onyx ate it or maybe it was never here in the first place.",
          "poweredBy": "POWERED BY",
          "noInternet": "No Internet!",
          "noConnection": "Connection seems to be offline.",
          "onyxWireMessage": "We hope onyx didn't eat the wires.",
          "trackingYetToStart": "You can start tracking in a while.",
          "deliveringOrdersNearBy": "Delivering orders nearby",
          "packageDispatched": "Your package has been dispatched",
          "packageAssigned": "was assigned the order",
          "packageNotStarted": "Your package has not been dispatched",
          "packageDelivered": "delivered your order",
          "esAT": "Estimated Arrival Time",
          "pin": "PIN",
          "pay": "Pay",
          "receive": "Receive",
          "paid": "Paid",
          "orderDelivered": "Order Delivered",
          "orderCancelled": "Order Cancelled",
          "from": "FROM",
          "to": "TO",
          "willDeliverOrder": "will deliver your order",
          "deliveringNearBy": "is delivering another order nearby",
          "order": "ORDER",
          "orderDetails": "ORDER DETAILS",
          "gst": "GST",
          "netAmount": "Net Amount",
          "totalAmount": "Total Amount",
          "items": "Items"
        }
      },
      de: {
        translations: {
          "To get started, edit <1>src/App.js</1> and save to reload.": "Starte in dem du, <1>src/App.js</1> editierst und speicherst.",
          "Welcome to React": "Willkommen bei React und react-i18next"
        }
      }
    },
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },

    react: {
      wait: true
    }
  });

export default i18n;