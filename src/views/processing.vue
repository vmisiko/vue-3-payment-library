<template>
  <div class="flex-center">
    <div class="card-min">
      <div class="flex-center">
        <div class="processing-box"></div>
      </div>
      <div class="text-center mgt-8">
        <span class="normal-text">Processing your card payment</span>
      </div>

      <div class="text-center mgt-24">
        <span class="link">Contact Support</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'processing',
  }
</script>

<style lang="scss">
  .processing-box {
    width: 240px;
    height: 240px;
    left: 60px;
    top: 32px;
    background: rgb(240, 237, 237);
  }
</style>