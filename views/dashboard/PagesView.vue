<script setup>
  import { ref } from 'vue';
  import { SteadyAPI } from '../../utils/api/platform.js'
  import {openModal} from '@kolirt/vue-modal'
  import mediaDialog from '../../components/mediaDialog.vue'

  const steadyAPI = SteadyAPI();


  function runModal() {
  openModal(mediaDialog, {
      title: 'Unsaved Changes',
      message: 'Would you like to save your post? All unsaved changes will be lost.',
      acceptText: 'Save',
      declineText: 'Delete',
      cancelText: 'Cancel'
  })
      // runs when modal is closed via confirmModal
      .then((data) => {
        console.log('success', data)
      })
      // runs when modal is closed via closeModal or esc
      .catch(() => {
        console.log('catch')
      })
}

</script>
<template>
  <button @click="runModal">Open modal</button>





</template>