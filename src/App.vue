<template>
  <div id="app">
    <div class="container">
      <img class="mt-8" :src="require('@/assets/logo.svg')" />
        <router-view/>
    </div>
    <NotificationComponent :show="showNotification" :text="notificationText" />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    NotificationComponent: () => import('./components/notificationComponent'),
  },
  data() {
    return {
      showNotification: false,
      notificationText: 'M-PESA option added and selected for payment.',
    }
  },
  mounted() {
    this.$root.$on('payment-notification', this.notificationInit);
  },
  methods: {
    notificationInit(payload) {
      console.log(payload);
      this.notificationText = payload.text;
      this.showNotification = !this.showNotification;
    }
  }
 }
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
@import '@/assets/styles/global.scss';

// #app {
//   font-family: 'Nunito';
// }

//  $linkColor: #324BA8;
//   $sizes: 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15;
//   $px: "px";

//   @function mult($number) {
//     $result: $number * 4;
//     @return $result + px;
//   }

//   @each $size in $sizes {
//     .ml-#{$size} {
//       margin-left: mult($size);
//     }

//     .mr-#{$size} {
//       margin-right: mult($size);
//     }

//     .mt-#{$size} {
//       margin-top: mult($size);
//     }

//     .mb-#{$size} {
//       margin-bottom: mult($size);
//     }

//     .pl-#{$size} {
//       padding-left: mult($size);
//     }

//     .pr-#{$size} {
//       padding-right: mult($size);
//     }

//     .pt-#{$size} {
//       padding-top: mult($size);
//     }

//     .pb-#{$size} {
//       padding-bottom: mult($size);
//     }
    
//   }

//   .container {
//     margin-left: 40px;
//     margin-right: 40px;
//   }

//   .flex-center {
//     display: flex;
//     justify-content: center;
//   }

//   .d-flex {
//     display: flex;
//     .flex-column {
//       display: flex;
//       flex-direction: column;
//     }
//   }

//   .card {
//     border: 1px solid #E2E7ED;
//     border-radius: 4px;
//     padding: 32px;
//     display: flex;
//     flex-direction: column;
//     width: 480px;
//   }

//   .title-payment {
//     font-size: 21px;
//     line-height: 36px;
//     line-height: 126%;
//   }

//   .normal-text {
//     font-family: Nunito;
//     font-style: normal;
//     font-weight: normal;
//     font-size: 15px;
//     color: #606266;
//     flex: none;
//     order: 0;
//     flex-grow: 0;
//     margin: 0px 0px;
//   }
  
//   .amount-text {
//     font-family: Nunito;
//     font-style: normal;
//     font-weight: 600;
//     font-size: 21px;
//     line-height: 36px
//   }

//   .float-right {
//    float: right;
//   }

//   .text-caption-1 {
//     font-family: Nunito;
//     font-style: normal;
//     font-weight: normal;
//     font-size: 13px;
//     line-height: 20px;
//     color: #303133;
//   }

//   .text-right {
//     text-align: right;
//   }

  
//   hr {
//     border: 1px solid #E2E7ED;
//     width: 100%;
//   }

//   .link {
//     color: $linkColor;
//     cursor: pointer;
//   }

//   .primary-btn {
//     border: none;
//     background-color: $linkColor;
//     padding: 12px 32px;
//     color:white;
//     text-align: center;
//     border-radius: 4px;
//     cursor: pointer;
//   }

//   .primary-btn-block {
//     background-color: $linkColor;
//     padding: 12px 32px;
//     color:white;
//     text-align: center;
//     border-radius: 4px;
//     width: 100%
//   }

</style>

