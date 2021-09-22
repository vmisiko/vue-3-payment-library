import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/payment')
  },
  {
    path: '/processing',
    name: 'Processing',
    component: () => import('@/views/processing')
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
