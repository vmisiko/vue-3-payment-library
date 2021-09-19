<template>
<div class="container">
  <img class="mt-8" :src="require('@/assets/logo.svg')" />

  <div class="flex-center">

    <div class="card">

      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 8.99998H3.83L8.71 13.88C9.1 14.27 9.1 14.91 8.71 15.3C8.32 15.69 7.69 15.69 7.3 15.3L0.709999 8.70998C0.617295 8.61747 0.543748 8.50758 0.493567 8.3866C0.443385 8.26563 0.417557 8.13595 0.417557 8.00498C0.417557 7.87401 0.443385 7.74433 0.493567 7.62336C0.543748 7.50238 0.617295 7.39249 0.709999 7.29998L7.29 0.699979C7.38258 0.607397 7.49249 0.533957 7.61346 0.483852C7.73442 0.433747 7.86407 0.407959 7.995 0.407959C8.12593 0.407959 8.25558 0.433747 8.37654 0.483852C8.49751 0.533957 8.60742 0.607397 8.7 0.699979C8.79258 0.792561 8.86602 0.902472 8.91613 1.02344C8.96623 1.1444 8.99202 1.27405 8.99202 1.40498C8.99202 1.53591 8.96623 1.66556 8.91613 1.78652C8.86602 1.90749 8.79258 2.0174 8.7 2.10998L3.83 6.99998H15C15.55 6.99998 16 7.44998 16 7.99998C16 8.54998 15.55 8.99998 15 8.99998Z" fill="#909399"/>
      </svg>

      <span class="mt-4 title-payment"> Payment </span>

      <div class="mt-8">
        <span class="normal-text"> Amount to pay</span>

        <div class="float-right">
          <span class="amount-text">
            KES 415,000.00
          </span>
        </div>
      </div>
      <hr />
      <div class="mt-8">
        <span class="normal-text"> Pay with</span>

        <div class="float-right ">
           <!-- visa icon -->
          <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="33" height="23" rx="3.5" fill="white" stroke="#D9D9D9"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7503 15.8583H8.69056L7.146 9.79247C7.07269 9.51344 6.91703 9.26676 6.68806 9.1505C6.11664 8.85833 5.48696 8.6258 4.80005 8.50853V8.27499H8.11813C8.57607 8.27499 8.91953 8.6258 8.97677 9.03323L9.77817 13.4087L11.8369 8.27499H13.8394L10.7503 15.8583ZM14.9843 15.8583H13.039L14.6408 8.27499H16.5861L14.9843 15.8583ZM19.1028 10.3758C19.16 9.96738 19.5035 9.73384 19.9042 9.73384C20.5338 9.6752 21.2197 9.79248 21.7922 10.0836L22.1356 8.45091C21.5632 8.21737 20.9335 8.1001 20.3621 8.1001C18.4741 8.1001 17.1003 9.1505 17.1003 10.6083C17.1003 11.7174 18.0734 12.2997 18.7603 12.6505C19.5035 13.0003 19.7897 13.2338 19.7324 13.5836C19.7324 14.1083 19.16 14.3419 18.5886 14.3419C17.9017 14.3419 17.2147 14.167 16.5861 13.8748L16.2426 15.5086C16.9295 15.7997 17.6727 15.917 18.3596 15.917C20.4766 15.9746 21.7922 14.9252 21.7922 13.3501C21.7922 11.3666 19.1028 11.2503 19.1028 10.3758ZM28.6 15.8583L27.0555 8.27499H25.3965C25.053 8.27499 24.7095 8.50853 24.5951 8.85833L21.7349 15.8583H23.7374L24.1371 14.7503H26.5976L26.8265 15.8583H28.6ZM25.6827 10.3172L26.2541 13.1752H24.6523L25.6827 10.3172Z" fill="#172B85"/>
          </svg>
          <!-- visa icon  -->

          <span class="ml-2 text-caption-1 "> **** 4003</span>
        </div>
      </div>
      <hr />

      <div class="mt-4 text-right link">
        <span> Change payment option</span>
        <!-- icon greater than -->
        <svg class="ml-2" width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.66656 0L0.726562 0.94L3.7799 4L0.726562 7.06L1.66656 8L5.66656 4L1.66656 0Z" fill="#324BA8"/>
        </svg>
        <!-- icon greator than -->
      </div>

      <div class="mt-8 text-right">
        <button class="primary-btn">Confirm and Pay </button>
      </div>
    </div>

  </div>

</div>
</template>

<script>
export default {
  name: 'Payment',

}
</script>

<style lang="scss">

  $linkColor: #324BA8;
  $sizes: 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15;
  $px: "px";

  @function mult($number) {
    $result: $number * 4;
    @return $result + px;
  }

  @each $size in $sizes {
    .ml-#{$size} {
      margin-left: mult($size);
    }

    .mr-#{$size} {
      margin-right: mult($size);
    }

    .mt-#{$size} {
      margin-top: mult($size);
    }

    .mb-#{$size} {
      margin-bottom: mult($size);
    }

    .pl-#{$size} {
      padding-left: mult($size);
    }

    .pr-#{$size} {
      padding-right: mult($size);
    }

    .pt-#{$size} {
      padding-top: mult($size);
    }

    .pb-#{$size} {
      padding-bottom: mult($size);
    }
    
  }

  .container {
    margin-left: 40px;
    margin-right: 40px;
  }

  .flex-center {
    display: flex;
    justify-content: center;
  }

  .d-flex {
    display: flex;
    .flex-column {
      display: flex;
      flex-direction: column;
    }
  }

  .card {
    border: 1px solid #E2E7ED;
    border-radius: 4px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    width: 480px;
  }

  .title-payment {
    font-size: 21px;
    line-height: 36px;
    line-height: 126%;
  }

  .normal-text {
    font-family: Nunito;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    color: #606266;
    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 0px;
  }
  
  .amount-text {
    font-family: Nunito;
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 36px
  }

  .float-right {
   float: right;
  }

  .text-caption-1 {
    font-family: Nunito;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 20px;
    color: #303133;
  }

  .text-right {
    text-align: right;
  }

  
  hr {
    border: 1px solid #E2E7ED;
    width: 100%;
  }

  .link {
    color: $linkColor;
    cursor: pointer;
  }

  .primary-btn {
    border: none;
    background-color: $linkColor;
    padding: 12px 32px;
    color:white;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
  }

  .primary-btn-block {
    background-color: $linkColor;
    padding: 12px 32px;
    color:white;
    text-align: center;
    border-radius: 4px;
    width: 100%
  }

</style>