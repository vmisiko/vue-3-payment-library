<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>  

      <div class="mt-10">
        <span class="text-subtitle-1">M-PESA</span>
        <IconView icon='mpesa' class="float-right mt-n2" width="68" height="48"/>
      </div>

      <hr class=" mt-10" />

      <div class="mt-8 text-btn d-flex" @click="showDeleteModal=true">
        <IconView icon="delete"/>
        <span class="text-btn">Remove Card</span>

      </div>

    </div>  
    <DeletModal :show="showDeleteModal" @close="showDeleteModal = !showDeleteModal" />
  </div>
</template>

<script>

export default {
  name: 'MpesaDetail',
  components: {
    TopInfo: () => import('@/components/topInfo'),
    DeletModal: () => import('@/components/modals/DeleteModal')
  },
  data() {
    return {
      icon: 'back',
      title: 'Mobile Money',
      showDeleteModal: false,
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

