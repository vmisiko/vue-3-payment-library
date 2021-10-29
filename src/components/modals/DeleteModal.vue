<template>
  <div id="delete-modal" class="modal">
      <div class="modal-content">

        <div class="mgt-4">
          <span class="text-body-1">
            Are you sure you want to delete this payment option?
          </span>
        </div>
        
        <sendy-btn 
          :block="true" 
          color='error'
          class="mgt-8"
          type="submit"
          @click="handleDelete"
          :loading="loading"
        >
          Delete
        </sendy-btn>

        <sendy-btn 
          :block="true" 
          color='info'
          class="mgt-4"
          type="submit"
         @click="cancelRemove"
        >
          Cancel
        </sendy-btn>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import paymentGenMxn from '../../mixins/paymentGenMxn';

export default {
  name: 'DeletModal',
  mixins: [paymentGenMxn],
  props: ['show'],
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['getBupayload']),
  },
  watch: {
    show(val) {
      val ? this.handleOpen(): this.handleClose();
    }
  },
  methods: {
    handleOpen() {
      document.getElementById('delete-modal').style.display = 'block';
    },
    handleClose() {
      document.getElementById('delete-modal').style.display = 'none';
    },
    handleDelete() {
      switch (this.$route.name) {
        case 'MpesaDetails':
          this.deleteMpesa();
          break;
        case 'CardDetails':
          this.deleteCard();
          break;
        default:
          this.deleteCard();
          break;
       }
    },
    async deleteCard() {
      this.loading = true;
      const startTime = new Date();
      window.analytics.track('Delete card', {
        ...this.commonTrackPayload(),
        card_network: this.$route.params.cardTitle,
      });

      const payload = {
        cardno:  this.$route.params.cardno,
        userid: this.getBupayload.user_id,
      };
      
      const fullPayload = {
        url: '/api/v1/card/delete',
        params: payload,
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      this.loading = false;
      const finishTime = Date.now() - startTime;
      window.analytics.track( response.status ? 'Card Deleted Successfully': 'Card Not Deleted' ,  {
        ...this.commonTrackPayload(),
        duration_taken: finishTime,
        card_network: this.$route.params.cardTitle,
        ...(!response.status && {failure_reason: response.message}),
      });

      if (response.status) {
        this.loading = false;
        this.$paymentNotification({ text: 'Card details removed', type: 'info' });
        this.$router.push({name: 'PaymentOptionsPage'});
        return;
      }

      this.$paymentNotification({ text: response.message, type: 'error' });
    },
    async deleteMpesa() {
      this.loading = true;
      const startTime = new Date();
      window.analytics.track('Delete Mobile Money', {
        ...this.commonTrackPayload(),
        mobile_money_network: 'M-Pesa',
      });

      const payload = {
        pay_detail_id:  this.$route.params.id,
        user_id: this.getBupayload.user_id,
      };

      const fullPayload = {
        url: '/delete_payment_method',
        params: payload,
      }

      const response = await this.$paymentAxiosPost(fullPayload);
      
      const finishTime = Date.now() - startTime;
      window.analytics.track( response.status ? 'Mobile Money Deleted Successfully': 'Mobile Money Not Deleted' ,  {
        ...this.commonTrackPayload(),
        duration_taken: finishTime,
      });

      this.loading = false;
      if (response.status) {
        this.$paymentNotification({ text: 'M-PESA option removed', type: "info" })
        this.$router.push({ name: 'PaymentOptionsPage' });
      }
      this.$paymentNotification({ text: response.message, type: 'error' });


    },
    cancelRemove() {
      switch (this.$route.name) {
        case 'MpesaDetails':
          window.analytics.track('Cancel Remove M-Pesa', {
            ...this.commonTrackPayload(),
            mobile_money_network: 'M-Pesa',
          });
          break;
        case 'CardDetails':
          window.analytics.track('Cancel Remove Card', {
            ...this.commonTrackPayload(),
            card_network: this.$route.params.cardTitle,
          });
          break;
        default:
          break;
      }
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss">     
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 150px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%; 
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.5);

}

.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

.close {
  color: black;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

</style>
