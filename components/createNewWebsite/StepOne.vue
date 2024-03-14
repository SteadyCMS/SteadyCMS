<script setup>
  import { ref } from 'vue';


  const modeChoices = [
    {
      "text": "Standard",
      "modeType": "STANDARD_MODE",
      "selected": true,
    },
    {
      "text": "Advanced",
      "modeType": "ADVANCED_MODE",
      "selected": false,
    },
  ];

  defineEmits(['setCMSDevelopmentMode']);

  function focusSelected(array, value) {
        for (let i = 0; i < array.length; i++) { // Blur them all 
          array[i].selected = false;
        } 
          let index = array.indexOf(value);
          if(index >= 0){ // Focus selected
            array[index].selected = true;
          }
          console.log(array)
  }
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-col flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Choose a mode.</h1>
        <p class="text-tint-8 mt-2">...</p>
      </div>
    </div>
  
    <div class="flex flex-col mt-8">
      <div class="inline-flex" v-for="choice in modeChoices" :key="choice.text">
        <button class="bg-white p-4" 
                :class="{ 'border-4 rounded-lg border-transparent': !choice.selected,'border-4 rounded-lg border-accent': choice.selected, }" 
                @click="$emit('setCMSDevelopmentMode', choice.modeType), focusSelected(modeChoices, choice)">
         {{ choice.text }}
        </button>

      </div>
    </div>
  </div>
</template>