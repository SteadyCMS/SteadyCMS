<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { createToast, clearToasts } from 'mosha-vue-toastify';
import { SteadyAPI } from '../utils/api/platform.js';
import Website from '../models/WebsiteClass';
import {join} from '../utils/utils.js';

import StepOne from '../components/createNewWebsite/StepOne.vue';
import StepTwo from '../components/createNewWebsite/StepTwo.vue';
import StepThree from '../components/createNewWebsite/StepThree.vue';
import StepFour from '../components/createNewWebsite/StepFour.vue';
import LoadingScreen from "../components/LoadingScreen.vue";
import SpecialSiteConfigDialog from '../components/dialogs/SpecialSiteConfigDialog.vue';
import { openModal } from '@kolirt/vue-modal';

import AccentButton from '../components/buttons/AccentButton.vue';
import SecondaryButton from '../components/buttons/SecondaryButton.vue';

// Icons
import LogoLight from '../components/logos/LogoLight.vue';
import LogoDark from '../components/logos/LogoDark.vue';
import XIcon from '../components/icons/XIcon.vue';

const router = useRouter();
const steadyAPI = SteadyAPI();
const website = new Website();

// For Component Step Switching
const num = ref("1");
const showLoadingScreen = ref(false);
const loadingScreenText = ref('Preparing...');
const isUsingInternet = ref(false);
const isCancelAndCleanUp = ref(false);
// Step 1
const CMSDevelopmentMode = ref("STANDARD_MODE");
// Step 2
const websiteName = ref("");
const nameInputError = ref("");
const nameInputIsValid = ref(true);
// Step 3
const templateName = ref("");
const templatePath = ref("");
const isFromHarddrive = ref(false);
const templateSelected = ref(true);
const templateNeedsConfig = ref(false);

const currentStepComponent = computed(() => {
  if (num.value == "1") {
    return StepOne;
  } else if (num.value == "2") {
    return StepTwo;
  } else if (num.value == "3") {
    return StepThree;
  } else {
    // Done: set to done
    return StepFour;
  }
});

function backToDashboard() {
  router.go(-1);
}

function changeCurrentStep(type) {
  if (type == "next") {
    if (num.value == "1") {
      num.value = "2";
      stepCount.value[1].done = true;
    } else if (num.value == "2") {
      // validate user name input
      if (validateUserInput()) {
        // Go on to next step
        nameInputIsValid.value = true;
        num.value = "3";
        stepCount.value[2].done = true;
      } else {
        // Show error
        nameInputIsValid.value = false;
      }
    } else if (num.value == "3") {
      // Make sure the user picks a template
      if (templateName.value != "") {
        num.value = "4";
        stepCount.value[3].done = true;
        templateSelected.value = true;
      } else {
        templateSelected.value = false;
      }
    }
  } else {
    if (num.value == "1") {
      num.value = "1";
      stepCount.value[1].done = false;
    } else if (num.value == "2") {
      num.value = "1";
      stepCount.value[1].done = false;
    } else if (num.value == "3") {
      num.value = "2";
      stepCount.value[2].done = false;
    } else if (num.value == "4") {
      num.value = "3";
      stepCount.value[3].done = false;
    }
  }
}

const stepCount = ref([
  {
    number: 1,
    done: true,
  },
  {
    number: 2,
    done: false,
  },
  {
    number: 3,
    done: false,
  },
  {
    number: 4,
    done: false,
  },
]);

function validateUserInput() {
  // Check if is input empty
  if (websiteName.value.trim() == "" || websiteName.value == null || websiteName.value.trim().length < 2) {
    nameInputError.value = "Name must be at least 2 characters.";
    return false;
  } else {
    var format = /[`!@#$%^&*()+\=\[\]{};':"/|,<>\/?~]/;
    // Check if input has any special characters except "." or "_"
    if (!format.test(websiteName.value)) {
      return true;
    } else {
      nameInputError.value = 'Name cannot contain any special characters except "-" or "_"';
      return false;
    }
  }
}

function cancelAndCleanUp() {
  loadingScreenText.value = "Canceling...";
  setTimeout(deleteOldFiles, 5000);
}

// function deleteOldFiles() {
//     const name = websiteName.value.replaceAll(' ', '_').toLowerCase();
//     steadyAPI.deleteDir('sites/' + name).then(x => {
//     showLoadingScreen.value = false;
//     loadingScreenText.value = 'Preparing...';
//     isCancelAndCleanUp.value = false;
//   });
// }

function buildWebsite() {
  if (isFromHarddrive.value) {
    BuildFromCustomTemplate();
  } else {
    BuildFromOnlineTemplate();
  }
}

function BuildFromCustomTemplate() {
  showLoadingScreen.value = true;
  let name = toFolderName(websiteName.value);
  console.log(name)

  // Create New Hugo Site
  loadingScreenText.value = "Setting up...";
  steadyAPI.getPathTo('documents').then(path => {

    var creatingNewSite = steadyAPI.createNewSite(join(path,"/SteadyCMS/sites/", name));
    creatingNewSite.then(x => {

      console.log("log New Site")
      loadingScreenText.value = "Retrieving template...";
      // Copy template
      steadyAPI.doesFileExist(templatePath.value).then(FileExists => {
        if (FileExists) {
          let destDir = join(path, "/SteadyCMS/sites/", name, "/themes/", templatePath.value.replace(/^.*[\\/]/, ''));
          steadyAPI.copyFile(templatePath.value, destDir).then(x => {
            loadingScreenText.value = "Processing template...";
            let tempZipName = templatePath.value.replace(/^.*[\\/]/, '');
            console.log(`${path}/SteadyCMS/sites/${name}/themes/${tempZipName}`)
            steadyAPI.extractZipFile(`${path}/SteadyCMS/sites/${name}/themes/${tempZipName}`, `${path}/SteadyCMS/sites/${name}/themes/`).then(x => {
              steadyAPI.deleteFile(`/sites/${name}/themes/${tempZipName}`).then(x => {
                finishedBuildingSite(path, name, tempZipName);
              });
            });
            console.log("log 1")
            console.log(templatePath.value)
            console.log(`${path}/SteadyCMS/sites/${name}/themes/${templatePath.value.replace(/^.*[\\/]/, '')}`)
          });
        } else { console.log("no file") }
      });
    });
  });
}


function BuildFromOnlineTemplate() {
  if (isOnline()) {
    showLoadingScreen.value = true;
    let name = toFolderName(websiteName.value);
    console.log(name)

    // Create New Hugo Site
    loadingScreenText.value = "Setting up...";
    steadyAPI.getPathTo('documents').then(path => {
      steadyAPI.createNewSite(`${path}/SteadyCMS/sites/${name}/`).then(x => {

        // Download Hugo Template, extract zip and delete .zip file
        isUsingInternet.value = true;
        loadingScreenText.value = "Downloading template...";
        console.log(templatePath)
        steadyAPI.downloadFile(templatePath.value, `/sites/${name}/themes/`).then(x => {
          loadingScreenText.value = "Processing template...";
          isUsingInternet.value = false;
          let tempZipName = templatePath.value.split("/")[4] + "-main.zip";
          steadyAPI.extractZipFile(`${path}/SteadyCMS/sites/${name}/themes/${tempZipName}`, `${path}/SteadyCMS/sites/${name}/themes/`).then(x => {
            steadyAPI.deleteFile(`/sites/${name}/themes/${tempZipName}`).then(x => {
              finishedBuildingSite(path, name, tempZipName);
            });
          });
        });
      });
    });
  } else {
    // They are offline
    changeWarningToast({ title: 'Internet Connection Needed', description: 'Please check your internet connection and try again.' });
  }
}

function finishedBuildingSite(path, name, tempZipName) {
  // Set up hugo.toml
  loadingScreenText.value = "Configuring your site..."; // TODO: SET theme name in .toml

  let hugoToml = "baseURL = 'http://example.org/'\r\nlanguageCode = 'en-us'\r\ntitle = '" + name.replaceAll("_", " ") + "'\r\ntheme='" + tempZipName.replace(".zip", '') + "'";
  steadyAPI.saveToFile(hugoToml, `${path}/SteadyCMS/sites/${name}`, "hugo.toml").then(x => {

    // Saving info to steady.config.json
    loadingScreenText.value = "Finishing up...";
    steadyAPI.doesFileExistInPrivate('steady.config.json').then(fileExsits => {
      // If the file exsists add too
      if (fileExsits) {
        steadyAPI.readFileInPrivate("steady.config.json").then(fileData => {
          let fileObj = JSON.parse(fileData.data);
          fileObj.currentWebsite = name;
          fileObj.CMSDevelopmentMode = CMSDevelopmentMode.value;
          steadyAPI.saveToFileToPrivate(JSON.stringify(fileObj), "/", "steady.config.json").then(x => {
            setupSettingsFile(websiteName.value, name, path, tempZipName);
          });
        });
      } else {
        // Else make the file and write info
        const obj = { "currentWebsite": name, "CMSDevelopmentMode": CMSDevelopmentMode.value };
        steadyAPI.saveToFileToPrivate(JSON.stringify(obj), "/", "steady.config.json").then(x => {
          setupSettingsFile(websiteName.value, name, path, tempZipName);
        });
      }
    });
  });
}

// Saving info to site.settings.json (make file)
function setupSettingsFile(websiteDisplayName, websiteFolderName, path, tempZipName) {
  console.log(websiteDisplayName)
  console.log(path)
  let data = {
          "name": websiteDisplayName,
          "folder": websiteFolderName,
          "appPath": join(path, "/SteadyCMS/"),
          "path":  join(path, "/SteadyCMS/", "/sites/", websiteFolderName, "/"), // Full path to site folder
          "fullContentPath": join(path, "/SteadyCMS/", "/sites/", websiteFolderName, "/content/post/"), // TODO: change "post" with var of folder name
          "contentPath": join("/sites/", websiteFolderName, "/content/post/"), // TODO: change "post" with var of folder name
          "mediaPath": join(path, "/SteadyCMS/", "/sites/", websiteFolderName, "/static/"),
          "favicon": "",
          "logo": "",
          "serverHost": "",
          "serverUsername": "", 
          "serverPassword": "",
          "saveServerPassword": false,
          "serverPort": 22,
          "developmentMode": CMSDevelopmentMode.value,
          "images": [
          ]
        };


  // Save to web storage
  website.setup(data);
  website.saveInfo();
  // Save to file
  let siteSettingsJSON = JSON.stringify(data);
  steadyAPI.saveToFile(siteSettingsJSON, data.path, 'site.settings.json').then(x => {
    // Save a back up copy of the settings to app dir incase something happens to the one in doc dir
    // TODO: Rethink this and how this works
    steadyAPI.saveToFileToPrivate(siteSettingsJSON, `/siteSettings/${websiteFolderName}`, 'site.settings.json').then(x => {

      if (templateNeedsConfig.value == false) {
        // All done
        backToDashboard();
      } else {
        // Show Special config
        console.log(">>>> Show Special config");
        showSpecialConfig(websiteFolderName, tempZipName);
      }

    });
  });
}

function showSpecialConfig(websiteFolderName, tempZipName) {
  showLoadingScreen.value = false;
  openModal(SpecialSiteConfigDialog, {
    title: '..',
    message: '',
    acceptText: 'Done', 
    declineText: 'x',
    websiteFolderName: websiteFolderName,
    themeName: tempZipName.replace(".zip", "")
  })
    // runs when modal is closed via confirmModal
    .then((data) => {
      ;
      backToDashboard();
    })
    // runs when modal is closed via closeModal or esc
    .catch(() => {
      backToDashboard();
      console.log('catch')
    });
}

const changeWarningToast = (message) => { ///TODO: load from utils.js
  createToast(message, {
    type: 'warning', /* toastBackgroundColor: 'color',*/
    showCloseButton: true,
    swipeClose: true,
    transition: 'slide',
    showIcon: false,
    position: 'top-right'
  });
}

// Check if uses is connected to the internet
function isOnline() {
  return navigator.onLine;
}

// If they user gose offline when the app is using it cancel can clean up
window.addEventListener("offline", (e) => {
  if (isUsingInternet.value) {
    if (isCancelAndCleanUp.value == false) {
      isCancelAndCleanUp.value = true;
      //console.log('called');
      changeWarningToast({ title: 'Internet Connection Was Lost', description: 'Please check your internet connection and try again.' });
      cancelAndCleanUp(); // TODO: Fix: Doesn't work sometimes because the downloading progress is not stopped
    }
  }
}); /// TODO: Add a timer that says "this is taking longer then it should, chack your wifi"



function toFolderName(name) {
  return name.replace(/[`!@#$%^&*()+\=\[\]{};':"/|,<>\/?~]/g, "_").replaceAll(" ", "_");
}

</script>

<template>
  <Transition name="fade" mode="out-in">
    <LoadingScreen class="h-full w-full" v-if="showLoadingScreen" :title="'Creating website'" :text="loadingScreenText">
    </LoadingScreen>
  </Transition>
  <div class="relative max-w-6xl mx-auto px-8">
    <div class="flex flex-row w-full h-screen py-8">
      <div class="w-full flex flex-col justify-between">
        <div>
          <!-- Steps -->
          <div class="flex flex-col w-full mt-6">
            <div>
              <LogoDark class="h-9 w-auto" />
            </div>
            <div class="flex flex-row space-x-2 mt-4 mb-2">
              <div v-for="item in stepCount" :key="item" class="flex rounded-md h-2 w-8"
                :class="{ 'bg-accent': item.done, 'bg-tint-2': !item.done }"></div>
            </div>
            <h6 class="text-xs font-medium text-tint-7">Step {{ num }} of 4</h6>
          </div>
          <!-- Views -->
          <div>
            <Transition name="fade" mode="out-in">
              <component :is="currentStepComponent" :name="websiteName" :isValid="nameInputIsValid"
                :templateSelected="templateSelected" :errorText="nameInputError"
                :currentCMSDevelopmentMode="CMSDevelopmentMode"
                :websiteInfo="{ website: websiteName, template: templateName, path: templatePath }"
                :templateNeedsConfig="templateNeedsConfig" @on-change="(name) => websiteName = name"
                @setCMSDevelopmentMode="(mode) => CMSDevelopmentMode = mode"
                @choose-template="(template, path, fromHarddrive, specialConfig) => { templateName = template; templatePath = path; isFromHarddrive = fromHarddrive; templateNeedsConfig = specialConfig; }">
              </component>
            </Transition>
          </div>
        </div>
        <div class="flex flex-row space-x-1 mb-2">
          <span v-if="(this.$route.query.hasProjects == 'true')">
            <SecondaryButton text="Cancel" v-if="(num == '1')" @click="backToDashboard" />
          </span>
          <SecondaryButton text="Back" v-if="!(num == '1')" @click="changeCurrentStep('previous')" />
          <button
            class="flex flex-row space-x-2 items-center py-2 px-4 text-white hover:text-white/80 fill-white hover:fill-black bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300"
            v-if="!(num == '4')" @click="changeCurrentStep('next')">Continue</button>
          <button
            class="flex flex-row space-x-2 items-center py-2 px-4 text-white hover:text-white/80 fill-white hover:fill-black bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300"
            v-if="(num == '4')" @click="buildWebsite">Create website</button>
        </div>
      </div>
      <div class="w-1/6 md:w-1/3 flex flex-row justify-end mt-4">
        <div v-if="(this.$route.query.hasProjects == 'true')">
          <button class="py-3 px-6 bg-white" @click="backToDashboard">
            <XIcon class="fill-tint-6 w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>