<script setup>
  import { ref } from 'vue';
  import MediaDialog from '../../components/dialogs/MediaDialog.vue';
  import { openModal } from '@kolirt/vue-modal';



  const currentSiteSettings = ref("");

  // Settings
  const websiteDisplayName = ref("");
  const websiteFaviconPath = ref("");
  const websiteDevelopmentMode = ref("");




  (function () {
    loadSettings();
  })();

 function loadSettings() {
  // Load Site settings
  currentSiteSettings.value = JSON.parse(localStorage.getItem("currentSiteSettings"));
    while (typeof currentSiteSettings.value != 'object' && currentSiteSettings.value.constructor != Object) {
      console.log("TRUE");
      currentSiteSettings.value = JSON.parse(currentSiteSettings.value);
      console.log(currentSiteSettings.value);
    }
  console.log(currentSiteSettings.value);
  showCurrentSettings();
 } 

function showCurrentSettings() {
  websiteDisplayName.value = currentSiteSettings.value.path.displayName;
  websiteFaviconPath.value = currentSiteSettings.value.medadata.favicon;
  websiteDevelopmentMode.value = currentSiteSettings.value.developmentMode;

}

function pickFavicon() {
  openModal(MediaDialog, {
    title: 'Select media',
    message: '',
    acceptText: 'Select',
    declineText: 'x',
    cancelText: '_'
  })
    // runs when modal is closed via confirmModal
    .then((data) => {
      websiteFaviconPath.value = data.selectedPath;
     // featuredImage.value.name = data.selected;
    })
    // runs when modal is closed via closeModal or esc
    .catch(() => {
      console.log('catch')
    });
}


  function saveSettings() {
    currentSiteSettings.value.path.displayName = websiteDisplayName.value; // Must change other stuff too
    currentSiteSettings.value.medadata.favicon = websiteFaviconPath.value; // Copy image
    currentSiteSettings.value.developmentMode = websiteDevelopmentMode.value;


    console.log(JSON.stringify(currentSiteSettings.value));
    //localStorage.setItem('currentSiteSettings', JSON.stringify(currentSiteSettings.value)); 
  }


</script>
<template>

<!-- Title -->
<input v-model="websiteDisplayName">
<br>
<!-- Theme -->
<input value="Theme">
<br>

<!-- Favicon  -->
<span v-if="websiteFaviconPath != ''">
<img :src="websiteFaviconPath" alt="Favicon">
</span>
<button @click="pickFavicon">Change Favicon {{ websiteFaviconPath }}</button> <!-- Set Icon-->

<br>

<!-- Mode -->
<form>
  <label for="x">Mode:</label>
  <select name="x" @change="websiteDevelopmentMode = (websiteDevelopmentMode == 'STANDARD_MODE') ? 'ADVANCED_MODE' : 'STANDARD_MODE'">
    <option :selected="(websiteDevelopmentMode == 'STANDARD_MODE') ? true : false" value="STANDARD_MODE">STANDARD_MODE</option>
    <option :selected="(websiteDevelopmentMode == 'ADVANCED_MODE') ? true : false" value="ADVANCED_MODE">ADVANCED_MODE</option>
  </select>
</form>

<button @click="saveSettings">Save settings</button> <!-- Set Icon-->
  
</template>