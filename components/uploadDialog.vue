<script setup>
  import { ref } from 'vue';
  import {closeModal, confirmModal} from '@kolirt/vue-modal'
  import { SteadyAPI } from '../utils/api/platform.js'
  import { titleToFileName } from '../utils/utils.js'
  import { useGeneralStore } from '../stores/general.js'

  import AccentButton from '../components/buttons/AccentButton.vue';

  const steadyAPI = SteadyAPI();
  const generalStore = useGeneralStore();

  const props = defineProps({
    title: {},
    message: {},
    acceptText: "Confirm",
    declineText: "Close",
    cancelText: "Cancel"
  });








</script>
<template>

<SimpleModal :title='props.title' size="md" >

<div class="flex flex-row">

      <!-- Side Bar -->
      <div class="flex max-h-10 max-w-10 flex-col p-4">

      <h1 class="font-bold">Upload</h1>
      <!-- <img :src="currentImage" :alt="currentImage" width="200" height="100">  -->

      </div>
</div>
  <template #footer>
    <div class="w-full">

      <AccentButton :text="props.acceptText" @click="confirmModal({accepted: true })" class="float-right" /> 
  </div>
  </template>
</SimpleModal>

</template>