<script setup>
  import { ref } from 'vue';
  import { closeModal, confirmModal } from '@kolirt/vue-modal';
  import { SteadyAPI } from '../../utils/api/platform.js';
  import { useGeneralStore } from '../../stores/general.js';
  import { createToast } from 'mosha-vue-toastify';
  import { formatBytes, formateDate } from '../../utils/utils.js';

  import UploadIcon from '../icons/UploadIcon.vue';

  const steadyAPI = SteadyAPI();
  const currentSiteSettings = ref();

  const props = defineProps({
    title: {},
    message: {},
    acceptText: "Confirm",
    declineText: "Close",
    cancelText: "Cancel"
  });

const uploadedFiles = ref([]);
const acceptedExtensions = ['png', 'jpg', 'jpeg'];
const showUploadView = ref(false);
const fileNames = ref('');


// Accept files //

 function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        saveFileInfoToList(i, file.name, file.path, file.type, file.size);
      }
    });
    uploadFiles();
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      saveFileInfoToList(i,file.name, file.path, file.type, file.size);
    });
    uploadFiles();
  }
}

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function manualSelectHandler(ev) {
  let files = ev.target.files;
  for (let i = 0; i < files.length; i++) { 
    // Get image dimensions
    addImageProcess(files[i].path).then(dimensions => {
      // Save to list
      saveFileInfoToList(i, files[i].name, files[i].path, files[i].type, formatBytes(files[i].size), formateDate(files[i].lastModifiedDate), dimensions);
      if(i == (files.length - 1)){
        uploadFiles();
      }
    });
  }
}

function saveFileInfoToList(index, name, path, type, size, date, dimensions) {
  if(isImage(name)){
  
    // Save image info to list
    uploadedFiles.value.splice(index + 1, 0,  { name: name, path: path, type: type, size: size, date: date, dimensions: dimensions });
    console.log(uploadedFiles.value)

  }else{
    // The file is not an image
    showWarningToast({ title: 'File is not an image', description: `Only images files are accepted in media library. "${name}" is not an accepted image type.`});
  }
}

function addImageProcess(src){
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(`${img.width}x${img.height}`)
    img.onerror = reject
    img.src = src
  })
}

function isImage(fileName) {
  let name = fileName.split(".");
  let extension = name[name.length - 1];
  if(acceptedExtensions.includes(extension)) {
    return true;
  }else{
    return false;
  }
}

const showWarningToast = (message) => {
    createToast(message, {
      type: 'warning', 
      toastBackgroundColor: '#AF3737',
      showCloseButton: false, 
      swipeClose: true, 
      transition: 'slide', 
      showIcon: false, 
      position: 'top-right',
      timeout: 8000
    });
  }


  // Upload files // 
  function uploadFiles(){ 
    if(uploadedFiles.value.length > 0){
      // Load in the site settings
      currentSiteSettings.value = JSON.parse(localStorage.getItem("currentSiteSettings"));
      console.log(localStorage.getItem("currentSiteSettings"))

      // Change to upload view
      makeFileNamesListForView()
      showUploadView.value = true;

      while (typeof currentSiteSettings.value != 'object' && currentSiteSettings.value.constructor != Object) {
        currentSiteSettings.value = JSON.parse(currentSiteSettings.value);
        // console.log( currentSiteSettings.value)
      }

      for (let i = 0; i < uploadedFiles.value.length; i++) {
        let file = uploadedFiles.value[i];

        let success = Upload(file.path, currentSiteSettings.value.path.main + currentSiteSettings.value.path.media + file.name);
        if(success){
          console.log("file copyed");
          // Add Image info to settings
          console.log(currentSiteSettings.value)

          currentSiteSettings.value.images.splice(0,0, { name: file.name, path: currentSiteSettings.value.path.main + currentSiteSettings.value.path.media + file.name, alt: "", size: file.size, date: file.date, type: file.type, dimensions: file.dimensions});

          console.log("<><><><>" + currentSiteSettings.value.images[0].name);
        }else{
          console.log("file NOT copyed");
        }

      }

      // Save setting to LS
      console.log("SAVE" + currentSiteSettings.value.images[0].name);
      console.log(JSON.stringify(currentSiteSettings.value));
      localStorage.setItem('currentSiteSettings', JSON.stringify(currentSiteSettings.value)); 
      confirmModal({accepted: true });
    } 
  } 

  function makeFileNamesListForView() {
    fileNames.value = '';
    for (let i = 0; i < uploadedFiles.value.length; i++) { 
      fileNames.value = fileNames.value + ` ${uploadedFiles.value[i].name} `;
    }
  }

  async function Upload(one, two) {
    return await steadyAPI.uploadFile(one, two); 
  }

</script>
<template>
  <SimpleModal :title='props.title' size="md" >
    <div class="w-full h-full">

      <!-- Accept view -->
      <div @drop="dropHandler"
           @dragover="dragOverHandler"
           :class="{'hidden': showUploadView}"
           class="flex flex-col border-dashed border-2 border-tint-6 bg-white rounded-sm p-20 content-center grow">
        <UploadIcon class="w-16 h-16 fill-tint-10 mx-auto"/>
        <h1 class="font-medium text-tint-10 mx-auto mt-4 text-lg">Drop file to upload into media library</h1> 
        <span class="tent-sm text-tint-9 mx-auto">or</span>

        <label for="files" 
        class="mt-2 py-2 px-4 cursor-pointer text-white hover:text-white/80 bg-black hover:bg-black text-base font-medium rounded-lg ease-in-out duration-300 w-fit mx-auto">
        Select files
        </label>
        <input type="file"
               id="files"
               multiple="multiple" 
               class="hidden"
               @change="manualSelectHandler"
               /> 
      </div>

      <!-- Uploading view -->
    <div class="" :class="{'hidden': showUploadView, 'hidden': !showUploadView}">

      <h1 class="bold">Uploading...</h1>
      <span class="text-sm">{{ fileNames }}</span>

    </div>

    </div>
  </SimpleModal>
</template>