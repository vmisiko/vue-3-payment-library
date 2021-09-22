<template>
  <div id="no-option" class="modal">
      <div class="modal-content">
        <!-- <span class="close" @click="$emit('close')">&times;</span> -->
        <div class="flex-center">
        <div class="processing-box text-center">
          <img class="normal-text" style="margin-top: 35%;" src="" alt="Graphic image to communicate missing payment options">
        </div>
      </div>
      <div class="text-center mt-8">
        <div><span class="text-subtitle-1">Payment option missing</span></div>
        <span class="text-body-2 mt-3">
          Add a new payment method to proceed with the transaction
        </span>
      </div>

      <div class="text-center mt-8" @click="$router.push('/add-payment')">
        <button class="primary-btn"> Add payment option </button>
      </div>

      <div class="text-center mt-8">
        <span class="link" @click="$router.go(-1)">Back</span>
      </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'cvvModule',
  props: ['show'],
  data() {
    return {
    }
  },
  watch: {
    show(val) {
      val ? this.handleOpen(): this.handleClose();
    }
  },
  mounted() {
    this.handleOpen();
  },
  methods: {
    handleOpen() {
      document.getElementById('no-option').style.display = 'block';
    },
    handleClose() {
      document.getElementById('no-option').style.display = 'none';
    },
  }
}
</script>

<style lang="scss">     
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 40px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%; 
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.5);

}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 32px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 348px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

/* The Close Button */
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

.processing-box {
  width: 100%;
  height: 284px;
  background:#C4C4C4;
  padding: auto;
}
</style>
