<script setup>
  import { ref } from 'vue';
  import {closeModal, confirmModal} from '@kolirt/vue-modal'
  import { SteadyAPI } from '../utils/api/platform.js'
  import { titleToFileName } from '../utils/utils.js'
  import { useGeneralStore } from '../stores/general.js'

  import AccentButton from '../components/buttons/AccentButton.vue';

  import UploadIcon from '../components/icons/UploadIcon.vue';

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
    <div class="flex grow bg-tint">
      <div class="flex flex-col border-dashed border-2 border-tint-6 bg-white rounded-sm m-5 p-20 content-center grow">
        <UploadIcon class="w-16 h-16 fill-tint-10 mx-auto"/>
        <h1 class="font-semibold text-tint-10 mx-auto mt-4 text-lg">Drop file to upload into media library</h1> 
        <span class="tent-sm text-tint-9 mx-auto">or</span>
        <AccentButton text="Select file" @click="confirmModal({accepted: true })" class="mt-2 py-2 px-4 text-white hover:text-white/80 bg-black hover:bg-black text-sm font-semibold rounded-lg ease-in-out duration-300 w-fit mx-auto" /> 
      </div>
    </div>
  </SimpleModal>
</template>