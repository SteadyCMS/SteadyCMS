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

const fileNames = ref([]);
const currentImage = ref('');

(function() {

steadyAPI.getPathTo('steady').then(path => {
    //console.log(path)
    steadyAPI.getListOfFilesIn(path + "/sites/" + titleToFileName(generalStore.currentSite) + '/static/', '.jpg').then( dirs => {
        if (dirs.length >= 1 && dirs != "error") {
          for (let i = 0; i < dirs.length; i++) {
              
              //console.log(path + "sites/" + titleToFileName(generalStore.currentSite) + '/static/' + dirs[i])
              fileNames.value.splice(0,0, { "name": dirs[i], "path": path.replace(/[/\\*]/g, "/") + "sites/" + titleToFileName(generalStore.currentSite) + '/static/', "selected": false });
          
          }
          //areFiles = true;

          // Set a defult current image 
          currentImage.value = path.replace(/[/\\*]/g, "/") + "sites/" + titleToFileName(generalStore.currentSite) + '/static/' + dirs[dirs.length - 1];
          fileNames.value[0].selected = true; 
        }else{
        // No posts  
        //areFiles = false;
        }
    });
});
            
})();


  function selectMediaItem(array, value) {

    for (let i = 0; i < array.length; i++) {
        array[i].selected = false;
      } 

    let index = array.indexOf(value);
    array[index].selected = true;

    currentImage.value = array[index].path + array[index].name;

  }




</script>
<template>
  <SimpleModal :title='props.title' size="xxl" >

  <div class="flex flex-row">

    <!-- Media List -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 flex-grow overflow-scroll max-h-96" >
      <div v-for="file in fileNames" :key="file.name" @click="" class="">

        <div class="flex flex-row justify-center items-center bg-slate-200 border-solid border-4 rounded-sm"
        :class="{'border-accent': file.selected, 'border-white': !file.selected }"
        @click="selectMediaItem(fileNames, file)">
          <div class="flex flex-col text-center w-full">
            <div class="bg-no-repeat bg-cover h-40 w-full mx-auto" :style="'background-image: url(' + file.path + file.name + ')'"></div>
          </div>
        </div>

      </div>
    </div>

        <!-- Side Bar -->
        <div class="flex max-h-10 max-w-10 flex-col p-4">

        <h1 class="font-bold">Media Info</h1>
        <img :src="currentImage" :alt="currentImage" width="200" height="100"> 

        </div>
  </div>






        <!--<div class="flex flex-col overflow-scroll max-h-full">
         <div v-for="file in fileNames" :key="file.name" @click="" class="rounded-lg cursor-pointer py-5 px-6 bg-tint-0 hover:bg-tint-1 duration-500">
            <div class="flex flex-row justify-between items-center">
            <h4 class="flex items-center text-xl text-tint-10 font-bold">{{ file.name }}
                <span class="text-sm text-tint-7 ml-1 font-semibold"></span> 
            </h4>
            <span class="text-xs text-tint-7"></span>
            </div>
        </div> 
       </div>-->

    <template #footer>
      <div class="w-full">
        <AccentButton text="Upload" @click="" /> 
        <AccentButton :text="props.acceptText" @click="confirmModal({accepted: true})" class="float-right" /> 
    </div>
    </template>
  </SimpleModal>
</template>







