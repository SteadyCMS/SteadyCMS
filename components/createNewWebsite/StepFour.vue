<script setup>
import { ref } from 'vue';

import themeTemplates from '../../common/themes.js';
import RocketIcon from '../icons/RocketIcon.vue';
import RocketLaunchIcon from '../icons/RocketLaunchIcon.vue';
import PaintBrushBroadIcon from '../icons/PaintBrushBroadIcon.vue';
import FolderOpenIcon from '../icons/FolderOpenIcon.vue';
import modeChoices from '../../common/modes.js';
import WrenchIcon from '../icons/WrenchIcon.vue';
import { SteadyAPI } from '../../utils/api/platform.js';

const steadyAPI = SteadyAPI();

const folderPath = ref('');
var currentThemeName = ref('');
var templateThumbnail = ref('');
var isCustomTemplate = ref(false);

const props = defineProps(['websiteInfo', 'currentCMSDevelopmentMode', 'templateNeedsConfig']);

if (props.websiteInfo.template.endsWith('.zip')) {
  isCustomTemplate.value = true;
  currentThemeName.value = props.websiteInfo.template;
} else {
  isCustomTemplate.value = false;

  var currentTheme = themeTemplates.filter(function (item) {
    return item.name == props.websiteInfo.template;
  })[0]

  currentThemeName.value = currentTheme.name;
  templateThumbnail = currentTheme.thumb
}

const currentModeName = modeChoices.filter(function (item) {
  return item.modeType == props.currentCMSDevelopmentMode;
})[0].title;

steadyAPI.getPathTo('documents').then(path => {
  folderPath.value = `${path}\\SteadyCMS\\sites`;
});
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Review your website setup.</h1>
      </div>
    </div>
    <div class="mt-8 text-tint-10">
      <div class="flex flex-row items-center rounded-lg border border-tint-1 p-5">
        <div class="w-1/2">
          <h2 class="text-3xl text-tint-10 font-bold">{{ props.websiteInfo.website }}</h2>
          <ul class="flex flex-col text-base space-y-2 mt-5">
            <li v-if="props.currentCMSDevelopmentMode == 'ADVANCED_MODE'" class="inline-flex">
              <RocketLaunchIcon class="w-6 h-6 fill-tint-9 mr-2" /> {{ currentModeName }}
            </li>
            <li v-else class="inline-flex">
              <RocketIcon class="w-6 h-6 fill-tint-9 mr-2" /> {{ currentModeName }}
            </li>
            <li class="inline-flex">
              <PaintBrushBroadIcon class="w-6 h-6 fill-tint-9 mr-2" /> {{ currentThemeName }}
            </li>
            <li class="inline-flex">
              <FolderOpenIcon class="w-6 h-6 fill-tint-9 mr-2" /> {{ folderPath }}
            </li>
            <li v-if="props.templateNeedsConfig" class="inline-flex text-info">
              <WrenchIcon class="w-6 h-6 fill-info mr-2" /> The current template requires extra
              configuration
            </li>
          </ul>
        </div>
        <div v-if="isCustomTemplate" class="w-1/2">
          <div class="w-full h-72 bg-tint-1 rounded-lg"></div>
        </div>
        <div v-else class="w-1/2">
          <img class="w-auto h-auto rounded-lg" :src="templateThumbnail" alt="Theme">
        </div>
      </div>
    </div>
  </div>
</template>