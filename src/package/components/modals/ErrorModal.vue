<template>
  <div id="error-modal" class="modal">
      <div class="modal-content">
        <div>
          <IconView icon='warning' />
        </div>

        <div class="mt-4">
          <span> Could not add card </span>
          <div>
            <span class="text-caption text-sendy-red-30">
             {{ text }}
            </span>
          </div>
        </div>

        <sendy-btn 
          :block="true" 
          color='info'
          class="mt-8"
         @click="$emit('close')"
        >
          close
        </sendy-btn>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorModal',
  props: ['show', 'text'],
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
    this.show ? this.handleOpen(): this.handleClose();
  },
  methods: {
    handleOpen() {
      document.getElementById('error-modal').style.display = 'block';
    },
    handleClose() {
      document.getElementById('error-modal').style.display = 'none';
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
