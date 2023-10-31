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
<div class="flex grow">


      <div class="flex flex-col border-dashed border-2 border-gray-400 rounded-sm m-5 p-20 content-center grow">

       <h1 class="font-bold mx-auto">Drop files to upload into media libary</h1> 
       <span class="tent-sm text-gray-400  mx-auto">or</span>
      <!-- <img :src="currentImage" :alt="currentImage" width="200" height="100">  -->


      <AccentButton text="Select files" @click="confirmModal({accepted: true })" class="font-bold mx-auto bg-black text-white" /> 
      </div>

</div>
  <template #footer>
  </template>
</SimpleModal>

</template>