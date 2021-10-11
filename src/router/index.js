import paymentEntry from '../views/paymentEntry';
import payment from '../views/payment';
import successView from '../views/successView';
import FailedView from '../views/FailedView';
import processing from '../views/processing';
import choosePayment from '../views/choosePayment';
import AddPayment from '../views/AddPayment';
import AddCard from '../views/AddCard';
import AddMpesa from '../views/AddMpesa';
import STKComponent from '../views/STKComponent';
import MpesaC2B from '../views/MpesaC2B';
import NoPaymentOption from '../views/NoPaymentOption';
import PaymentOptionsPage from '../views/PaymentOptionsPage';
import CardDetailsPage from '../views/CardDetailsPage';
import MpesaDetail from '../views/MpesaDetail';

const routes = [
  {
    path: '/paymentlib',
    component: paymentEntry,
    children: [
      {
        path: '/',
        name: 'Entry',
        component: payment,
      },
      {
        path: '/success-view/:mpesaCode?',
        name: 'SuccessView',
        component: successView,
      },
      {
        path: '/failed-view/:mpesa?',
        name: 'FailedView',
        component: FailedView,
      },
      {
        path: '/retry-view',
        name: 'RetryView',
        component: FailedView,
      },
      {
        path: '/processing',
        name: 'Processing',
        component: processing,
      },
      {
        path: '/choose-payment',
        name: 'ChoosePayment',
        component: choosePayment,
      },
      {
        path: '/add-payment',
        name: 'AddPayment',
        component: AddPayment,
      },
      {
        path: '/add-card',
        name: 'AddCard',
        component: AddCard,
      },
      {
        path: '/add-mpesa',
        name: 'AddMpesa',
        component: AddMpesa,
      },
      {
        path: '/mpesa-stk',
        name: 'STKComponent',
        component: STKComponent,
      },
      {
        path: '/mpesa-c2b',
        name: 'MpesaC2B',
        component: MpesaC2B,
      },
      {
        path: '/no-payment-option',
        name: 'NoPaymentOption',
        component: NoPaymentOption,
      },
      {
        path: '/payment-option-page',
        name: 'PaymentOptionsPage',
        component: PaymentOptionsPage,
      },
      {
        path: '/card-details/:cardno/:cardTitle?',
        name: 'CardDetails',
        component: CardDetailsPage,
      },
      {
        path: '/mobile-details/:id',
        name: 'MpesaDetails',
        component: MpesaDetail,
      },
    ]
  },
];

export default routes;
