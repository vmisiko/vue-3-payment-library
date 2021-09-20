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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
