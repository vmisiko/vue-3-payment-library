<template>
  <div class="flex-center">

    <div class="card">
      <TopInfo :icon="icon" :title="title"/>  

      <div class="mt-10">
        <span class="text-subtitle-1">UnionPay</span>
        <IconView icon='union-pay' class="float-right mt-n2" width="68" height="48"/>
      </div>

      <div class="text-body-2 text-gray70">
        <span >{{ $formatCardno($route.params.cardno) }}</span>
        <div>
          <span>Expiry Date 05/2022</span>
        </div>
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
  name: 'CardDetailsPage',
  components: {
    TopInfo: () => import('@/components/topInfo'),
    DeletModal: () => import('@/components/modals/DeleteModal')
  },
  data() {
    return {
      icon: 'back',
      title: 'Card Details',
      showDeleteModal: false,
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

