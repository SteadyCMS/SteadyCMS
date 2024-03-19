<script setup>
import { ref } from 'vue';
import RocketIcon from '../icons/RocketIcon.vue';
import RocketLaunchIcon from '../icons/RocketLaunchIcon.vue';
import CheckmarkIcon from '../icons/CheckmarkIcon.vue';
import modeChoices from '../../common/modes.js';

defineEmits(['setCMSDevelopmentMode']);

function focusSelected(array, value) {
  for (let i = 0; i < array.length; i++) { // Blur them all 
    array[i].selected = false;
  }
  let index = array.indexOf(value);
  if (index >= 0) { // Focus selected
    array[index].selected = true;
  }
  console.log(array)
}
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-col flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Select a mode.</h1>
      </div>
    </div>
    <div class="w-full flex flex-col mt-8">
      <div class="flex flex-row space-x-5">
        <div v-for="mode in modeChoices" :key="mode.title"
          @click="$emit('setCMSDevelopmentMode', mode.modeType), focusSelected(modeChoices, mode)"
          class="relative w-1/2 flex flex-col p-5 h-64 cursor-pointer ease-in-out duration-300"
          :class="{ 'border-4 rounded-lg border-transparent': !mode.selected, 'border-4 rounded-lg border-accent': mode.selected, }">
          <span v-if="mode.selected" class="absolute right-2 top-2">
            <CheckmarkIcon class="w-7 h-7 fill-accent" />
          </span>
          <div class="flex items-center text-center w-14 h-14 border border-tint-2 rounded-full p-2">
            <span class="mx-auto" v-if="mode.modeType == 'STANDARD_MODE'">
              <RocketIcon class="w-9 h-9 fill-tint-10" />
            </span>
            <span class="mx-auto" v-else>
              <RocketLaunchIcon class="w-9 h-9 fill-tint-10" />
            </span>
          </div>
          <div class="mt-4">
            <h4 class="text-2xl text-tint-10 font-bold">{{ mode.title }}</h4>
            <h5 class="text-lg text-tint-9">{{ mode.subtitle }}</h5>
            <p class="text-sm text-tint-8 mt-1">{{ mode.description }}</p>
          </div>
        </div>
      </div>
      <small class="text-tint-7 mt-3">You can change your choice later in settings.</small>
    </div>
  </div>
</template>