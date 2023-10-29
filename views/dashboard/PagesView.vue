<script setup>
  import { ref } from 'vue';
  import { SteadyAPI } from '../../utils/api/platform.js'
  import {openModal} from '@kolirt/vue-modal'
  import mediaDialog from '../../components/mediaDialog.vue'




  function showMediaDialog() {
  openModal(mediaDialog, {
      title: 'Select Or Upload Media',
      message: '',
      acceptText: 'Select',
      declineText: 'x',
      cancelText: '_'
  })
      // runs when modal is closed via confirmModal
      .then((data) => {
        console.log('success', data.accepted)
        console.log("selected", data.selected)
      })
      // runs when modal is closed via closeModal or esc
      .catch(() => {
        console.log('catch')
      })
}



</script>
<template>

</template>