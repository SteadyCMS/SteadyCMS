<script setup>
  import { ref } from 'vue';
  import {closeModal, confirmModal} from '@kolirt/vue-modal'
  import { SteadyAPI } from '../utils/api/platform.js'
  import { titleToFileName } from '../utils/utils.js'
  import { useGeneralStore } from '../stores/general.js'

  import uploadDialog from './uploadDialog.vue'
  import {openModal} from '@kolirt/vue-modal'

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
const selectedImages = ref('');
const selectedImagePath = ref('');

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
         // fileNames.value[0].selected = true; 
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
    selectedImages.value =array[index].name;
    selectedImagePath.value = array[index].path + array[index].name;
    

  }



  function showUploadDialog() {
  openModal(uploadDialog, {
      title: 'Upload Media',
      message: '',
      acceptText: 'Select',
      declineText: 'x',
      cancelText: '_'
  })
      // runs when modal is closed via confirmModal
      .then((data) => {
        console.log('success', data)
   
      })
      // runs when modal is closed via closeModal or esc
      .catch(() => {
        console.log('catch')
      })
}

</script>
<template>
  <SimpleModal :title='props.title' size="xxl" >
  <div class="">
    <div class="flex flex-row">
  
          <div class="flex flex-col flex-grow">
            <!-- Media top bar -->
            <div class="flex flex-row h-10 w-full">
              <h1>TOP BAR</h1>
            </div>

            <!-- Media List -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 flex-grow overflow-scroll h-96" >
              <div v-for="file in fileNames" :key="file.name" @click="" class="">
                <div class="flex flex-row justify-center items-center bg-slate-200 border-solid border-4 rounded-sm"
                :class="{'border-accent': file.selected, 'border-white': !file.selected }"
                @click="selectMediaItem(fileNames, file)">
                  <div class="flex flex-col text-center w-full">
                    <div class="bg-no-repeat bg-cover h-40 w-full mx-auto rounded-sm" :style="'background-image: url(' + file.path + file.name + ')'"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Side Bar -->
          <div class="flex h-10 max-w-10 flex-col p-4 mt-6">
          <h1 class="font-bold">Media Info</h1>
          <img :src="currentImage" :alt="currentImage" class="rounded-sm my-2 max-h-36 max-w-36">
          <span class="text-sm">{{ currentImage.split("/")[currentImage.split("/").length - 1] }}</span>
          </div>

    </div>
  </div>

    <template #footer>
      <div class="w-full">
        <AccentButton text="Upload" 
        @click="showUploadDialog" 
        class="bg-white text-black border border-black border-solid font-bold"/> 
        <AccentButton :text="props.acceptText" 
        @click="confirmModal({accepted: true, selected: selectedImages, selectedPath: selectedImagePath })" 
        class="float-right bg-black text-white font-bold" /> 
    </div>
    </template>
  </SimpleModal>
</template>







