<script setup>
import { ref } from 'vue';
import { closeModal, confirmModal, openModal } from '@kolirt/vue-modal';
import { SteadyAPI } from '../../utils/api/platform.js';

import FolderOpenIcon from '../icons/FolderOpenIcon.vue';
import TerminalWindowIcon from '../icons/TerminalWindowIcon.vue';
import PaintBrushBroadIcon from '../icons/PaintBrushBroadIcon.vue';

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

  function openCommandLine() {
    steadyAPI.openTerminal("path");
  }


</script>
<template>
  <SimpleModal :title='props.title' size="xl">
    <div class="flex flex-col max-w-3xl mt-8 px-10">
      <div class="flex flex-col flex-grow align-center justify-between mb-6">
        <div class="inline-flex items-center space-x-2">
          <PaintBrushBroadIcon class="w-7 h-7 fill-tint-10" />
          <h1 class="text-3xl text-tint-10 font-bold">
            Theme configuration
          </h1>
        </div>
        <h2 class="text-base text-tint-8 mt-1">
          You indicated that this theme needs extra configuration during setup
        </h2>
      </div>

      <div class="flex flex-col space-y-8 mb-5">
        <!-- Step 1 -->
        <div>
          <h3 class="text-2xl text-tint-10 font-medium">1. Check the theme documentation.</h3>
          <p class="text-tint-8 mt-2">
            Check the theme's documentation to see what packages you may need to install and which terminal commands you
            need to run in order to setup the theme properly.
          </p>
        </div>
        <!-- Step 2 -->
        <div>
          <h3 class="text-2xl text-tint-10 font-medium">2. Configure the theme.</h3>
          <p class="text-tint-8 mt-2">
            Run the terminal commands and install any applications necessary to configure your theme.
          </p>
          <ul class="text-tint-8 list-disc list-inside mt-1">
            <li>Do not run any commands starting with <code
                class="text-white bg-tint-10 rounded-lg px-2 py-1">hugo</code>.</li>
            <li>Do not run <code class="text-white bg-tint-10 rounded-lg px-2 py-1">npm start</code>.</li>
            <li>Do not copy, move, or edit any documents in the site folder.</li>
          </ul>
          <div class="flex flex-row mt-5 space-x-3">
            <button @click="openCommandLine()"
              class="inline-flex py-3 px-6 bg-white text-tint-10 border border-tint-2 hover:bg-tint-1 text-sm font-semibold rounded-lg ease-in-out duration-500">
              <TerminalWindowIcon class="w-5 h-5 fill-tint-9 mr-1" /> Open terminal
            </button>
            <button
              class="inline-flex py-3 px-6 bg-white text-tint-10 border border-tint-2 hover:bg-tint-1 text-sm font-semibold rounded-lg ease-in-out duration-500">
              <FolderOpenIcon class="w-5 h-5 fill-tint-9 mr-1" /> Open website folder
            </button>
          </div>
        </div>
        <!-- Step 3 -->
        <div>
          <h3 class="text-2xl text-tint-10 font-medium">3. Once you're finished, click Continue.</h3>
        </div>
      </div>


    </div>



  </SimpleModal>
</template>