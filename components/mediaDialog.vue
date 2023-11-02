<script setup>
  import { ref } from 'vue';
  import { closeModal, confirmModal, openModal } from '@kolirt/vue-modal';

  import { SteadyAPI } from '../utils/api/platform.js';
  import { titleToFileName } from '../utils/utils.js';
  import { useGeneralStore } from '../stores/general.js';
  import uploadDialog from './uploadDialog.vue';

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

  const fileNames = ref([]);
  const currentImage = ref('');
  const selectedImage = ref('');
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
          } else {
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
    selectedImage.value = array[index].name;
    selectedImagePath.value = array[index].path + array[index].name;
  }

  function showUploadDialog() {
    openModal(uploadDialog, {
        title: 'Upload media',
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
  <SimpleModal :title='props.title' size="xl" >
    <div class="flex flex-row">
      <!-- Media list -->
      <div class="flex w-3/4">
        <p v-if="fileNames.length == 0" class="text-tint-7 mt-20 mx-auto">No media.</p>
        <div class="grid grid-cols-4 lg:grid-cols-5 overflow-y-scroll h-[30rem]">
          <div v-for="file in fileNames" :key="file.name">
            <div @click="selectMediaItem(fileNames, file)" class="p-20 bg-cover bg-center bg-tint-3 border-4 rounded duration-100 ease-in-out" :class="{'border-accent': file.selected, 'border-white': !file.selected }" :style="'background-image: url(' + file.path + file.name + ')'">
            </div>
          </div>
        </div>
      </div>
      <!-- Sidebar -->
      <div v-if="fileNames.length > 0" class="w-1/4 flex h-10 max-w-10 flex-col pl-6 pr-2">
        <h2 class="text-lg text-tint-10 font-medium">Media Info</h2>
        <img :src="currentImage" :alt="currentImage" class="rounded my-2 w-auto h-auto" loading="lazy">
        <p class="text-tint-10 font-medium text-sm break-words leading-tight">{{ currentImage.substr(currentImage.lastIndexOf('/') + 1) }}</p>
        <p class="text-tint-8 text-xs mt-1 mb-2">1920x1080  2MB  9/23/2023</p>
        <a class="text-error text-xs hover:underline duration-300 ease-in-out" href="">Delete permanently</a>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row justify-between w-full">
        <button @click="showUploadDialog" class="flex flex-row space-x-2 items-center py-2 px-4 border border-tint-10 text-tint-10 hover:text-tint-8 bg-white text-base font-medium rounded-lg ease-in-out duration-300"> 
          <UploadIcon class="fill-tint-10 w-5 h-5 mr-1"/>
          Upload
        </button>
        <button @click="confirmModal({accepted: true, selected: selectedImage, selectedPath: selectedImagePath })" class="py-2 px-4 text-white hover:text-white/80 bg-black hover:bg-black text-base font-medium rounded-lg ease-in-out duration-300"> 
          {{ props.acceptText }}
        </button>
      </div>
    </template>
  </SimpleModal>
</template>