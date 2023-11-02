<script setup>
  import { ref } from 'vue';
  import { closeModal, confirmModal } from '@kolirt/vue-modal';
  import { SteadyAPI } from '../utils/api/platform.js';
  import { titleToFileName } from '../utils/utils.js';
  import { useGeneralStore } from '../stores/general.js';

  import UploadIcon from './icons/UploadIcon.vue';


  const steadyAPI = SteadyAPI();
  const generalStore = useGeneralStore();

  const props = defineProps({
    title: {},
    message: {},
    acceptText: "Confirm",
    declineText: "Close",
    cancelText: "Cancel"
  });


  // var files;
  // if (e.target.files) {
  //   files=e.target.files
  // } else {
  //   files=e.dataTransfer.files
  // }
  // if (files.length==0) {
  //   alert('What you dropped is not a file.');
  //   return;
  // }


</script>

<template>
  <SimpleModal :title='props.title' size="md" >
    <!-- <input type="file" multiple="multiple" class="w-full h-full bg-slate-600 absolute top-0 bottom-0 left-0 right-0 cursor-pointer opacity-0"/> -->
    <div class="w-full h-full">
      <div class="flex flex-col border-dashed border-2 border-tint-6 bg-white rounded-sm p-20 content-center grow">
        <UploadIcon class="w-16 h-16 fill-tint-10 mx-auto"/>
        <h1 class="font-medium text-tint-10 mx-auto mt-4 text-lg">Drop file to upload into media library</h1> 
        <span class="tent-sm text-tint-9 mx-auto">or</span>
        <button @click="confirmModal({ accepted: true })" class="mt-2 py-2 px-4 text-white hover:text-white/80 bg-black hover:bg-black text-base font-medium rounded-lg ease-in-out duration-300 w-fit mx-auto"> 
          Select file
        </button>
      </div>
    </div>
  </SimpleModal>
</template>
