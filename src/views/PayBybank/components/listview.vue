<template>
  <div class="direction-flex mgt-6">

        <div class="list-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="#F2F5F9"/>
          </svg>
        </div>

        <div class="mgl-6" >
          <span class="text-body-2 text-gray90"> {{ text }} </span>
        </div>
  </div>
</template>

<script>
export default {
  name: 'ListView',
  props: [ 'text' ]
}
</script>