<script setup>
  import { ref } from 'vue';
  import MediaDialog from '../../components/dialogs/MediaDialog.vue';
  import { openModal } from '@kolirt/vue-modal';
  import {showSuccessToast, join } from '../../utils/utils';

  import Website from '../../models/WebsiteClass';
  const website = new Website();

  // Settings
  const websiteDisplayName = ref("");
  const websiteFaviconPath = ref("");
  const websiteDevelopmentMode = ref("");
  // - Server
  const serverHost = ref("");
  const serverUsername = ref("");
  const serverPassword = ref("");
  const serverPort = ref("");
  const serverFilePath = ref("");

  // Other
  const saveServerPassword = ref(true);

    (function () {
      showCurrentSettings();
    })();

  function showCurrentSettings() {
    website.loadInfo();
    websiteDisplayName.value = Website.name;
    websiteFaviconPath.value = Website.favicon;
    websiteDevelopmentMode.value = Website.developmentMode;
    // Server
    serverHost.value = Website.serverHost;
    serverUsername.value = Website.serverUsername;
    serverPassword.value = Website.serverPassword;
    serverPort.value = Website.serverPort;
    serverFilePath.value = Website.serverFilePath;
    saveServerPassword.value = Website.saveServerPassword;

  }

function pickFavicon() {
  // openModal(MediaDialog, {
  //   title: 'Select media',
  //   message: '',
  //   acceptText: 'Select',
  //   declineText: 'x',
  //   cancelText: '_'
  // })
  //   // runs when modal is closed via confirmModal
  //   .then((data) => {
  //     websiteFaviconPath.value = data.selectedPath;
  //    // featuredImage.value.name = data.selected;
  //   })
  //   // runs when modal is closed via closeModal or esc
  //   .catch(() => {
  //     console.log('catch')
  //   });
}

  function saveSettings() {
    // Website   .displayName = websiteDisplayName.value; // TODO: Must change other stuff too
   // Website   .medadata.favicon = websiteFaviconPath.value; //TODO: Copy image
    // Website   .developmentMode = websiteDevelopmentMode.value;

    // Server
    Website.serverHost = serverHost.value;
    Website.serverUsername = serverUsername.value;
    Website.serverPassword = serverPassword.value;
    Website.serverPort = serverPort.value;
    Website.serverFilePath = serverFilePath.value;
    Website.saveServerPassword = saveServerPassword.value;
    website.saveInfo();
    showSuccessToast('Settings Saved');
  }
  function validateServerInfo(params) {
    
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

<!-- Server settings and info -->
<br>Server settings:
<br>Host:
<input v-model="serverHost">
<br>Username:
<input v-model="serverUsername">
<br>Password:
<input type="password" v-model="serverPassword">
<br>Port:
<input type="number" v-model="serverPort">
<br>Path On Server:
<input v-model="serverFilePath">
<br>
<p> 
  <input type="checkbox" v-model="saveServerPassword">
  <span v-if="saveServerPassword">Remember password</span>
  <span v-if="!saveServerPassword">Remember password for this session only</span>
</p>


<br>
<button type="button" @click="saveSettings">Save Settings</button> <!-- Set Icon-->
  
</template>