<script setup>
import { ref, computed } from 'vue';
// import { BuildAndUploadSite } from '../utils/websiteBuilding.js';
import Website from '../models/WebsiteClass';
import { SteadyAPI } from '../utils/api/platform.js';
import { showWarningToast, showSuccessToast, join } from '../utils/utils.js';

const website = new Website();
const steadyAPI = SteadyAPI();

const numberOfFilesUploaded = ref(0);
const totalFileToBeUploaded = ref(0);
const fileUploading = ref("");
const started = ref(false);
const logOutput = ref("");
  
 function BuildAndUploadSite(){
        // Clear public directory
        steadyAPI.deleteFileDirectory(join(Website.path, "public/")).then(() => {
            //**  As noted above, Hugo does not clear the public directory before building your site.
            //** Manually clear the contents of the public directory before each build to remove draft, expired, and future content.
            steadyAPI.buildNewSite(Website.path).then(() => {

                //Upload site
                const srcDirPath = join(Website.path, "/public/");
                const ServerConfig = {
                    host: Website.serverHost,
                    username: Website.serverUsername,
                    password: Website.serverPassword,
                    port:  Website.serverPort || 22
                }; 
                  
                fileUploading.value = "Perparing...";
              steadyAPI.walkDir(srcDirPath).then(filePaths => {
                totalFileToBeUploaded.value = filePaths.length - 1;
                started.value = true;
                const count = ref(0);
                console.log(fileUploading.value)
                fileUploading.value = filePaths[count.value];
                console.log(fileUploading.value)
                for(let file in filePaths){

                    steadyAPI.uploadFileToServer(filePaths[file], ServerConfig).then(result => {
                        numberOfFilesUploaded.value = file;
                        fileUploading.value = filePaths[count.value + 1];
                        count.value = count.value + 1;

                        if(result.successful){ // If upload successful
                            logOutput.value = logOutput.value + "Uploading:" + filePaths[file] + " <p style='color:green'> ✔ </p>";

                            if(file == (filePaths.length - 1)){ // Show after the last file is uploaded
                              showSuccessToast('Your site was published!');
                            }
                        } else { // If upload not successful
                            logOutput.value = logOutput.value + "Uploading: " + filePaths[file] + " <p style='color:red'>" + result.error + "</p>";

                            if(file == (filePaths.length - 1)){ // Show after the last file is uploaded
                                showWarningToast('Site Upload failed');
                            }

                        }

                    console.log("File Uploaded")
                    console.log(result)
                    });
                }
              });

            });
        });
    }


  function publish() {
    website.loadInfo();
    BuildAndUploadSite();
  }

</script>
<template>
    <div class="">
        <div style="margin: 10em;">
            <div>
                <span>Uploading To: </span><span>{{ Website.serverHost }}</span>
            </div> 
            <div>
                <span>{{ numberOfFilesUploaded }}</span>/<span>{{ totalFileToBeUploaded }}</span> <span>Uploading: </span><span>{{ fileUploading }}</span>
            </div>

            <div style="block">
            <span><span v-if="started">{{ Math.round((100/totalFileToBeUploaded)*numberOfFilesUploaded) }}</span> %</span>
            <div class="border border-tint-2" style="width:30%">
            <div v-if="started"
             class="bg-black" style="height:15px;width:0%"  
             :style="{ width: ((100/totalFileToBeUploaded)*numberOfFilesUploaded) + '%' }"
             ></div>
            </div>
            </div> 

            <div style="overflow:scroll; height:16em;display:flex;flex-direction:column-reverse;">
                <span v-html="logOutput"></span>
            </div> 
        
            <button @click="publish">Upload and Publish Site</button>
        </div> 
    </div>
</template>