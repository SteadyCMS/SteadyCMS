<script setup>
import { ref } from 'vue';

import { openModal } from '@kolirt/vue-modal';
import Dialog from '../dialogs/Dialog.vue';
import { SteadyAPI } from '../../utils/api/platform.js'
import ArrowSquareOutIcon from '../icons/ArrowSquareOutIcon.vue';
import themeTemplates from '../../common/themes.js';

const steadyAPI = SteadyAPI();
const emit = defineEmits(['chooseTemplate']);

var fileUploadText = ref('');

const props = defineProps(['templateSelected', 'currentCMSDevelopmentMode']);

function openWebURL(url) {
  steadyAPI.openInNewBrowserTab(url);
}


// TODO: handle dnd
function manualSelectHandler(ev) {
  let files = ev.target.files;
  for (let i = 0; i < files.length; i++) {
    var fileType = files[i].path.split('.')
    if (fileType[fileType.length - 1] == "zip") {
      fileUploadText.value = files[i].name;

      // Ask user if the template requires advanced configuration
      openModal(Dialog, {
        title: 'Open terminal during site building for configuration?',
        message: 'Does this custom theme require any special configuration? (Do you need to run "npm install", "npm i -g postcss-cli" etc. to build the theme properly?)',
        acceptText: 'Yes',
        declineText: 'No',
        cancelText: 'Dont press me.'
      }).then((data) => {
        if (data.accepted) { 
          // Accepted
          emit('chooseTemplate', files[i].name, files[i].path, true, true);
        } else {
          // Declined
          emit('chooseTemplate', files[i].name, files[i].path, true, false);
        }
      }).catch(() => {
        // Canceled

      });

    } else {
      fileUploadText.value = "Must be a .zip file";
      //console.log("Must be a .zip file");
    }
  }
}

function focusSelected(array, value) {
  for (let i = 0; i < array.length; i++) { // Blur them all 
    array[i].selected = false;
  }
  let index = array.indexOf(value);
  if (index >= 0) { // Focus selected
    array[index].selected = true;
  }
}

</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-col flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Choose a template.</h1>
        <p v-if="props.currentCMSDevelopmentMode == 'ADVANCED_MODE'" class="text-tint-8 mt-2">
          Find more themes at themes.gohugo.io
        </p>
      </div>
    </div>

    <div class="flex flex-col mt-8">
      <div class="flex flex-row">
        <div v-if="props.currentCMSDevelopmentMode == 'ADVANCED_MODE'" class="flex flex-col group mr-6">
          <div
            class="w-80 h-40 text-center flex items-center rounded-lg bg-tint-0 border-2 border-dashed border-tint-4 cursor-pointer group-hover:opacity-90 duration-300 ease-in-out">
            <div class="flex flex-col mx-auto">
              <p>Use a custom template</p>
              <small class="text-tint-7 mx-auto">Select or drop a .zip file</small>
              <label for="file"
                class="mt-3 py-2 px-4 cursor-pointer text-white hover:text-white/80 bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300 w-fit mx-auto">
                Select file
              </label>
              <input id="file" type="file" class="hidden" @change="manualSelectHandler" />
              <small class="text-tint-10 mt-1">{{ fileUploadText  }}</small>
            </div>
          </div>
        </div>
        <!-- Templates -->
        <div class="inline-flex" v-for="template in themeTemplates" :key="template.name">
          <div class="flex flex-col group mr-6"
            @click="$emit('chooseTemplate', template.name, template.zip, false, false), focusSelected(themeTemplates, template)">
            <!-- TODO: Set the fourth vaule in chooseTemplate to tell if it needs specal config ^^^^-->
            <div
              class="bg-cover bg-center w-64 h-40 rounded-lg cursor-pointer group-hover:opacity-90 duration-300 ease-in-out"
              :class="{ 'border-4 rounded-lg border-transparent': !template.selected, 'border-4 rounded-lg border-accent': template.selected, }"
              :style="'background-image: url(' + template.thumb + ');'"></div>
            <div @click="openWebURL(template.url)" target="blank" class="inline-flex items-center cursor-pointer mt-2">
              <p class=" text-lg font-medium"
                :class="{ 'text-tint-10': !template.selected, 'text-accent': template.selected, }">{{ template.name }}
              </p>
              <ArrowSquareOutIcon class="w-4 h-4 ml-2"
                :class="{ 'fill-tint-10 stroke-tint-10': !template.selected, 'fill-accent': template.selected, }" />
            </div>
          </div>
        </div>
      </div>
      <small v-if="!props.templateSelected" class="text-error mt-3">
        Please choose a template.
      </small>
    </div>
  </div>
</template>
