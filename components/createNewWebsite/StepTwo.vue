<script setup>
  import { ref } from 'vue';

  import { SteadyAPI } from '../../utils/api/platform.js'
  import ArrowSquareOutIcon from '../icons/ArrowSquareOutIcon.vue';

  const steadyAPI = SteadyAPI();
  const emit = defineEmits(['chooseTemplate']);

  var fileUploadText = ref('');

  const themeTemplates = [
    {
      "name": "Paper",
      "thumb": "assets/themes/paper.png",
      "url": "https://hugo-paper.vercel.app",
      "zip": "https://github.com/nanxiaobei/hugo-paper/archive/refs/heads/main.zip",
    },
    {
      "name": "Blist",
      "thumb": "assets/themes/blist.png",
      "url": "https://blist.vercel.app",
      "zip": "https://github.com/apvarun/blist-hugo-theme/archive/refs/heads/main.zip",
    },
  ];

  function openWebURL(url) {
    steadyAPI.openInNewBrowserTab(url);
  }

  // TODO: Make Sure they pick one
  // TODO: handle dnd
  function manualSelectHandler(ev) {
    let files = ev.target.files;
    for (let i = 0; i < files.length; i++) {
      var fileType = files[i].path.split('.')
      if (fileType[fileType.length - 1] == "zip") {
        fileUploadText.value = files[i].name;
        emit('chooseTemplate', files[i].name, files[i].path, true);
      } else {
        fileUploadText.value = "Must be a .zip file";
        console.log("Must be a .zip file");
      }
    }
  }
</script>
<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-col flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Choose a template.</h1>
        <p class="text-tint-8 mt-2">Find more themes at themes.gohugo.io</p>
      </div>
    </div>

    <div class="inline-flex mt-8">
      <div class="flex flex-col group mr-6">
        <div class="w-80 h-40 text-center flex items-center rounded-lg bg-tint-0 border-2 border-dashed border-tint-4 cursor-pointer group-hover:opacity-90 duration-300 ease-in-out">
          <div class="flex flex-col mx-auto">
            <p>Use a custom template</p>
            <small class="text-tint-7 mx-auto">Select or drop a .zip file</small>
            <label for="file" class="mt-3 py-2 px-4 cursor-pointer text-white hover:text-white/80 bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300 w-fit mx-auto">
              Select file
            </label>
            <input id="file" type="file" class="hidden" @change="manualSelectHandler"/>
            <small class="text-tint-10 mt-1">{{ fileUploadText }}</small>
          </div>
        </div>
      </div>
      <!-- Templates -->
      <div class="inline-flex" v-for="template in themeTemplates" :key="template.name">
        <div class="flex flex-col group mr-6">
          <div class="bg-cover bg-center w-64 h-40 rounded-lg cursor-pointer group-hover:opacity-90 duration-300 ease-in-out" :style="'background-image: url(' + template.thumb + ');'"></div>
          <div @click="openWebURL(template.url)" target="blank" class="inline-flex items-center cursor-pointer mt-2">
            <p class="text-tint-10 text-lg font-medium">{{ template.name }}</p>
            <ArrowSquareOutIcon class="fill-tint-10 stroke-tint-10 w-4 h-4 ml-2" />
          </div>
        </div>
      </div>

<!-- 
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
  -->
    </div>
  </div> 
</template>