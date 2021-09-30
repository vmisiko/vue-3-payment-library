import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    component: () => import('@/views/paymentEntry'),
    children: [
      {
        path: '/',
        name: 'Entry',
        component: () => import('@/views/payment')
      },
      {
        path: '/success-view/:mpesaCode?',
        name: 'SuccessView',
        component: () => import('@/views/successView')
      },
      {
        path: '/failed-view/:mpesa?',
        name: 'FailedView',
        component: () => import('@/views/FailedView')
      },
      {
        path: '/retry-view',
        name: 'RetryView',
        component: () => import('@/views/FailedView')
      },
      {
        path: '/processing',
        name: 'Processing',
        component: () => import('@/views/processing')
      },
      {
        path: '/success',
        name: 'Success',
        component: () => import('@/views/payment')
      },
      {
        path: '/choose-payment',
        name: 'ChoosePayment',
        component: () => import('@/views/choosePayment')
      },
      {
        path: '/add-payment',
        name: 'AddPayment',
        component: () => import('@/views/AddPayment')
      },
      {
        path: '/add-card',
        name: 'AddCard',
        component: () => import('@/views/AddCard')
      },
      {
        path: '/add-mpesa',
        name: 'AddMpesa',
        component: () => import('@/views/AddMpesa')
      },
      {
        path: '/mpesa-stk',
        name: 'STKComponent',
        component: () => import('@/views/STKComponent')
      },
      {
        path: '/mpesa-c2b',
        name: 'MpesaC2B',
        component: () => import('@/views/MpesaC2B')
      },
      {
        path: '/no-payment-option',
        name: 'NoPaymentOption',
        component: () => import('@/views/NoPaymentOption')
      },
      {
        path: '/payment-option-page',
        name: 'PaymentOptionsPage',
        component: () => import('@/views/PaymentOptionsPage')
      },
      {
        path: '/card-details/:cardno',
        name: 'CardDetails',
        component: () => import('@/views/CardDetailsPage')
      },
      {
        path: '/mobile-details/:id',
        name: 'MpesaDetails',
        component: () => import('@/views/MpesaDetail')
      },
    ]
  },



//   {
//     path: '/success-view',
//     name: 'SuccessView',
//     component: () => import('@/views/payment')
//   },
//   {
//     path: '/failed-view',
//     name: 'FailedView',
//     component: () => import('@/views/payment')
//   },
//   {
//     path: '/retry-view',
//     name: 'RetryView',
//     component: () => import('@/views/payment')
//   },
//   {
//     path: '/processing',
//     name: 'Processing',
//     component: () => import('@/views/processing')
//   },
//   {
//     path: '/success',
//     name: 'Success',
//     component: () => import('@/views/payment')
//   },
//   {
//     path: '/choose-payment',
//     name: 'ChoosePayment',
//     component: () => import('@/views/choosePayment')
//   },
//   {
//     path: '/add-payment',
//     name: 'AddPayment',
//     component: () => import('@/views/AddPayment')
//   },
//   {
//     path: '/add-card',
//     name: 'AddCard',
//     component: () => import('@/views/AddCard')
//   },
//   {
//     path: '/add-mpesa',
//     name: 'AddMpesa',
//     component: () => import('@/views/AddMpesa')
//   },
//   {
//     path: '/mpesa-stk',
//     name: 'STKComponent',
//     component: () => import('@/views/STKComponent')
//   },
//   {
//     path: '/mpesa-c2b',
//     name: 'MpesaC2B',
//     component: () => import('@/views/MpesaC2B')
//   },
//   {
//     path: '/no-payment-option',
//     name: 'NoPaymentOption',
//     component: () => import('@/views/NoPaymentOption')
//   },
//   {
//     path: '/payment-option-page',
//     name: 'PaymentOptionsPage',
//     component: () => import('@/views/PaymentOptionsPage')
//   },
//   {
//     path: '/card-details',
//     name: 'CardDetails',
//     component: () => import('@/views/CardDetailsPage')
//   },
]

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

export default routes
