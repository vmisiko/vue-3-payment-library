<template>
  <div class="">
    <NoOptionsModal :show="true"/>
  </div>
</template>

<script>
import NoOptionsModal from '../components/modals/noOptionsModal';

export default {
  name: 'AddPaymentOption',
  components: {
    NoOptionsModal,
  },
  data() {
    return {
      icon: 'back',
      title: 'Add Payment option',
    }
  }
}
</script>
