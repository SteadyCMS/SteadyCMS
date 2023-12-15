<script setup>
  import { ref } from 'vue';

  const emit = defineEmits(['chooseTemplate']);

  // TODO: Make Sure they pick one

  function manualSelectHandler(ev) {
  let files = ev.target.files;
  for (let i = 0; i < files.length; i++) {
    var fileType = files[i].path.split('.')
    if (fileType[fileType.length - 1] == "zip") {
      emit('chooseTemplate', files[i].name, files[i].path, true);
    } else {
      console.log("Must be a .zip file");
    }
  }
}

</script>
<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Choose a template.</h1>
      </div>
    </div>

    <div class="mt-8">
      <button class="py-10 px-10 border border-accent text-tint-10 text-sm font-bold rounded-lg" 
        @click="$emit('chooseTemplate', 'Paper', 'https://github.com/nanxiaobei/hugo-paper/archive/refs/heads/main.zip', false)">
        Paper
      </button>
      <button class="py-10 px-10 border border-accent text-tint-10 text-sm font-bold rounded-lg" 
        @click="$emit('chooseTemplate', 'Blist', 'https://github.com/apvarun/blist-hugo-theme/archive/refs/tags/v2.1.0.zip', false)">
        Blist
      </button>

      <button class="py-10 px-10 border border-accent text-tint-10 text-sm font-bold rounded-lg" >
        <input 
        type="file"
        @change="manualSelectHandler">
        Choose Your Own Theme
      </button>
 


    </div>
  </div> 
</template>