<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>    
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddCard',
  components: {
    TopInfo: () => import('@/components/topInfo'),
  },
  data() {
    return {
      icon: 'back',
      title: 'Add a Card',
    }
  }
}
</script>
