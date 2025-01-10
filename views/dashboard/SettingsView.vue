<script setup>
  import { ref } from 'vue';
  import MediaDialog from '../../components/dialogs/MediaDialog.vue';
  import { openModal } from '@kolirt/vue-modal';

  import Website from '../../models/WebsiteClass';
  const website = new Website();

  // Settings
  const websiteDisplayName = ref("");
  const websiteFaviconPath = ref("");
  const websiteDevelopmentMode = ref("");
  // - Server
  const serverHOST = ref("");
  const serverUSERNAME = ref("");
  const serverPASSWORD = ref("");
  const serverPORT = ref("");

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
    serverHOST.value = Website.serverHost;
    serverUSERNAME.value = Website.serverUsername;
    serverPASSWORD.value = Website.serverPassword;
    serverPORT.value = Website.serverPort;
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
    //currentSiteSettings.value.path.displayName = websiteDisplayName.value; // TODO: Must change other stuff too
   // currentSiteSettings.value.medadata.favicon = websiteFaviconPath.value; //TODO: Copy image
    //currentSiteSettings.value.developmentMode = websiteDevelopmentMode.value;

    // Server
    Website.serverHost = serverHOST.value;
    Website.serverUsername = serverUSERNAME.value;
    Website.serverPassword = serverPASSWORD.value;
    Website.serverPort = serverPORT.value;
    Website.saveServerPassword = saveServerPassword.value;
    website.saveInfo();
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
<br> host:
<input v-model="serverHOST">
<br>username:
<input v-model="serverUSERNAME">
<br>password:
<input type="password" v-model="serverPASSWORD">
<br>port:
<input type="number" v-model="serverPORT">
<br>
<p> 
  <input type="checkbox" v-model="saveServerPassword">
  <span v-if="saveServerPassword">Remember password</span>
  <span v-if="!saveServerPassword">Remember password for this session only</span>
</p>


<br>
<button type="button" @click="saveSettings">Save Settings</button> <!-- Set Icon-->
  
</template>