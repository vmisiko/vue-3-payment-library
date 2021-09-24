<template>
  <div class="card-min">
      <div class="flex-center">
        <div class="processing-box">
          <IconView icon="loading" class="flex-center mt-24" />
        </div>
      </div>
      <div class="text-center mt-8">
        <span class="normal-text">{{ text }}</span>
      </div>

      <div class="text-center mt-24">
        <span class="link">Contact Support</span>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'Processing',
    props: ['text']
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