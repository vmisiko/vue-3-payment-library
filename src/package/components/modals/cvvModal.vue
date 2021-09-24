<template>
  <div id="cvv-modal" class="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <div>
          <IconView icon='magnify-cvv' />
        </div>

        <div class="mt-4">
          <span>What is CVV?</span>
          <div>
            <span class="text-caption">This is a 3 or 4 digit security code found on the back of you card.</span>
          </div>
        </div>

        <sendy-btn 
          :block="true" 
          color='primary'
          class="mt-8"
          type="submit"
         @click="$emit('close')"
        >
          ok
        </sendy-btn>
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
      val ? this.handleCvv(): this.closeCvv();
    }
  },
  methods: {
    handleCvv() {
      document.getElementById('cvv-modal').style.display = 'block';
    },
    closeCvv() {
      document.getElementById('cvv-modal').style.display = 'none';
    },
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

/* Modal Content */
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

</style>
