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
          <span>Expiry Date {{ card_expiry || 'N/A' }}</span>
        </div>
      </div>

      <hr class=" mt-10" />

      <div class="mt-8 text-btn d-flex pointer" @click="showDeleteModal=true">
        <IconView icon="delete"/>
        <span class="text-btn">Remove Card</span>

      </div>

    </div>  
    <DeletModal :show="showDeleteModal" @close="showDeleteModal = !showDeleteModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TopInfo from '../components/topInfo';
import DeletModal from '../components/modals/DeleteModal';

export default {
  name: 'CardDetailsPage',
  components: {
    TopInfo,
    DeletModal,
  },
  data() {
    return {
      icon: 'back',
      title: 'Card Details',
      showDeleteModal: false,
      card_expiry: false,
    }
  },
  computed: {
    ...mapGetters(['getSavedPayMethods', 'getBupayload']),
  },
  mounted() {
    this.fetchCardDetails();
  },
  methods: {
    async fetchCardDetails() {
      const payload = {
        cardno: this.$route.params.cardno,
        userid: this.getBupayload.user_id,
      };

      const fullPayload = {
        url: '/api/v1/card/fetch',
        params: payload
      };

      const response = await this.$paymentAxiosPost(fullPayload);
      this.card_expiry = response.expirydate;
    }
  }
}
</script>

