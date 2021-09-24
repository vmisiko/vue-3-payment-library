<template>
  <div class="flex-center">

    <div class="card-min">
      <TopInfo :icon="icon" :title="title"/>

      <div class="mt-8">
        <span class="text-caption-1"> Amount to pay</span>

        <div class="float-right">
          <span class="text-caption-1">
            KES 27,500.00 
          </span>
        </div>

        <hr />

        <div class="mt-8">
          <label class="text-caption-2 ">M-PESA payment number</label>
          <div class="mt-1">
            <input 
              type="text" 
              v-model="phone" 
              class="phone-input"
              placeholder="0700 00000"
             >
          </div>
          
        </div>

        <div class="alert mt-10">
          <span class="text-caption-2 pt-2 text-midnightBlue20">You'll receive a prompt to enter your M-PESA PIN</span>
        </div>

        <div class="mt-8">
          <sendy-btn 
            color='primary'
            class="float-right"
            @click="$router.push('/processing')"
          >
            continue
          </sendy-btn>
        </div>

    </div>

    </div>  
  </div>
</template>

<script>
export default {
  name: 'STKComponent',
  components: {
    TopInfo: () => import('@/components/topInfo'),
  },
  data() {
    return {
      icon: 'back',
      title: 'Pay with M-PESA',
    }
  }
}
</script>

<style lang="scss">
.phone-input {
  padding: 8px;
  height: 40px;
  background: #FFFFFF;
  border: 0.5px solid #C0C4CC;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}
.alert {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
  position: static;
  width: 296px;
  height: 32px;
  left: 0px;
  top: 268px;
  background: rgba(211, 221, 246, 0.5);
  border-radius: 4px;
}
</style>