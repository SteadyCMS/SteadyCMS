<script setup>
  import { ref } from 'vue';
  import { closeModal, confirmModal, openModal } from '@kolirt/vue-modal';
  import { SteadyAPI } from '../../utils/api/platform.js';

  const steadyAPI = SteadyAPI();

  const currentSiteSettings = ref("");
  const props = defineProps({
    title: {},
    message: {},
    acceptText: "Confirm",
    declineText: "Close",
    cancelText: "Cancel"
  });


  function x() {
    // Load Site settings
    // currentSiteSettings.value = JSON.parse(localStorage.getItem("currentSiteSettings"));
    // while (typeof currentSiteSettings.value != 'object' && currentSiteSettings.value.constructor != Object) {
    //   console.log("TRUE");
    //   currentSiteSettings.value = JSON.parse(currentSiteSettings.value);
    //   console.log( currentSiteSettings.value);
    // }

  }


</script>
<template>
  <SimpleModal :title='props.title' size="xl" >
  

  <div>HI</div>



  </SimpleModal>
</template>