<template>
  <div id="error-modal" class="modal" ref="errorModal">
    <div class="modal-content-pl">
      <div>
        <IconView icon="warning" />
      </div>

      <div class="mgt-4">
        <span> {{ title ? title : $translate("could_not_add_card") }} </span>
        <div>
          <span class="text-caption text-sendy-red-30">
            {{ text }}
          </span>
        </div>
      </div>

      <div v-if="$route.name ==='AddCard' && getBupayload.isPayOnDelivery() ">

        <sendy-btn
          :block="true"
          color="info"
          class="mgt-8"
          :outline="true"
          @click="$emit('close')"
        >
          {{ $translate("retry") }}
        </sendy-btn>
        
        <div class="text-center mgt-7">
          <span class="link" @click="handleChange">
            {{ $translate("change_payment_method") }}
          </span>
        </div>
      </div>

      <sendy-btn
        v-else
        :block="true"
        color="info"
        class="mgt-8"
        @click="$emit('close')"
      >
        {{ $translate("close") }}
      </sendy-btn>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "ErrorModal",
  props: ["show", "text" , "title"],
  data() {
    return {};
  },
  watch: {
    show(val) {
      val ? this.handleOpen() : this.handleClose();
    },
  },
  computed: {
    ...mapGetters('getBupayload')
  },
  mounted() {
    this.show ? this.handleOpen() : this.handleClose();
  },
  methods: {
    handleOpen() {
      let el = this.$refs.errorModal;
      el.style.display = "block";
    },
    handleClose() {
      let el = this.$refs.errorModal;
      el.style.display = "none";
    },
    handleChange() {
      this.$router.push({ name: 'ChoosePaymentCheckout' });
      this.$emit('close');
    }
  },
};
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
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content-pl {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
}

@-webkit-keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
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
