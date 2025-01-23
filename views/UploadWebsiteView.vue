<script setup>
import { ref, watch } from 'vue';
import Website from '../models/WebsiteClass';
import { SteadyAPI } from '../utils/api/platform.js';
import { showWarningToast, showSuccessToast, join, isNotEmpty } from '../utils/utils.js';
import { openModal } from '@kolirt/vue-modal';
import { useRouter} from 'vue-router';
import ServerInfoDialog from '../components/dialogs/ServerInfoDialog.vue';

const website = new Website();
const steadyAPI = SteadyAPI();
const router = useRouter();

const numberOfFilesUploaded = ref(0);
const totalFileToBeUploaded = ref(0);
const fileUploading = ref("");
const started = ref(false);
const logOutput = ref("");
const uploadStatus = ref("");
const buttonIsDisabled = ref(false);
const progressPercentage = ref(0);
const displayProgress = ref(0);
  

watch(progressPercentage, (newValue) => {
    if (newValue == 99 && uploadStatus.value == "Done") {
        displayProgress.value = 100;
    } else if (newValue < 100) {
        displayProgress.value = progressPercentage.value;
    } 
    });

 function BuildAndUploadSite(){
    buttonIsDisabled.value = true;
    website.loadInfo();
    uploadStatus.value = "Perparing...";
    updateprogressBar(false);
    // Clear public directory
    steadyAPI.deleteFileDirectory(join(Website.path, "public/")).then(() => {
        //**  As noted above, Hugo does not clear the public directory before building your site.
        //** Manually clear the contents of the public directory before each build to remove draft, expired, and future content.
        steadyAPI.buildNewSite(Website.path).then(() => {
            uploadStatus.value = "Building Site...";

            //Upload site
            const srcDirPath = join(Website.path, "/public/");
            const ServerConfig = {
                host: Website.serverHost,
                username: Website.serverUsername,
                password: Website.serverPassword,
                port:  Website.serverPort || 22
            }; 
            if(isServerInfoValid(ServerConfig)){ // Check that all server info is there
                fileUploading.value = "Perparing...";
                steadyAPI.walkDir(srcDirPath).then(filePaths => {
                totalFileToBeUploaded.value = filePaths.length - 1;
                const count = ref(0);
                fileUploading.value = filePaths[count.value];
                uploadStatus.value = "Perparing server...";

                steadyAPI.deleteServerDir("", ServerConfig).then(x =>{
                    uploadStatus.value = "Uploading files...";
                    started.value = true;

                    for(let file in filePaths){
                        steadyAPI.uploadFileToServer(filePaths[file], ServerConfig, Website.serverFilePath).then(result => {
                            fileUploading.value = filePaths[count.value + 1];
                            count.value = count.value + 1;
                            if(count.value != 1){
                                numberOfFilesUploaded.value = ++numberOfFilesUploaded.value;
                            }
                            console.log("progressPercentage A " + progressPercentage.value)
                            updateprogressBar(false);
                            console.log("progressPercentage B " + progressPercentage.value)
                            if(result.successful){ // If upload successful
                                logOutput.value = logOutput.value + " Uploading: " + filePaths[file] + " <p style='color:green'> ✔ </p>";
                                if(file == (filePaths.length - 1)){ // Show after the last file is uploaded
                                    uploadStatus.value = "Finishing Up...";

                                    // Change all post status to published
                                    steadyAPI.getListOfFilesIn(Website.fullContentPath, '.json').then(dirs => {
                                        if (dirs.length >= 1 && dirs != "error") {
                                            for (let i = 0; i < dirs.length; i++) {
                                                console.log(join(Website.fullContentPath, dirs[i]))
                                    steadyAPI.readFile(join(Website.fullContentPath, dirs[i])).then(fileData =>{

                                          let data = JSON.parse(fileData.data);
                                          console.log(data.metadata.postStatus)
                                          if(data.metadata.postStatus == "tobepublished"){
                                            data.metadata.postStatus = "published";
                                            steadyAPI.saveToFile(JSON.stringify(data), Website.fullContentPath, dirs[i]).then(x => {
                                                if ((dirs.length - 1) == i) {
                                                    uploadStatus.value = "Done";
                                                    buttonIsDisabled.value = false;
                                                    updateprogressBar(true);
                                                    showSuccessToast('Your site was published!');
                                                }
                                            });
                                          } else {
                                                if ((dirs.length - 1) == i) {
                                                    uploadStatus.value = "Done";
                                                     updateprogressBar(true);
                                                    buttonIsDisabled.value = false;
                                                    showSuccessToast('Your site was published!');
                                                }
                                          }
                                    });

                                }
                                }
                                });
                                }
                            } else { // If upload not successful
                                logOutput.value = logOutput.value + file + " Uploading: " + filePaths[file] + " <p style='color:red'>" + result.error + "</p>";

                                if(file == (filePaths.length - 1)){ // Show after the last file is uploaded
                                    showWarningToast('Site Upload failed');

                                    // Error Help
                                    if(result.error == "connect: getConnection: All configured authentication methods failed"){
                                        logOutput.value = logOutput.value + "<p>=======================</p><p>Quick Fix Tips: Check Username and/or password are correct</p>";
                                    } else if (result.error == "connect: Remote host refused connection") {
                                        logOutput.value = logOutput.value + "<p>=======================</p><p>Quick Fix Tips: Check you have the correct port</p>"
                                    } else if(result.error == "connect: Address lookup failed for host"){
                                        logOutput.value = logOutput.value + "<p>=======================</p><p>Quick Fix Tips: Check host name is correct and you are conected to wifi</p>"
                                    }
                                    
                                }
                            }

                        console.log("File Uploaded")
                      //  console.log(result)
                    });
                  }
                });
              });
            } else {
                uploadStatus.value = "Stopped on Error...";
            }
        });
    });
 }
 
 function updateprogressBar(done) {
    if(done) {
        progressPercentage.value = 100;
    } else {
        progressPercentage.value = Math.round(((99/totalFileToBeUploaded.value)*numberOfFilesUploaded.value));
    }
 }

 function isServerInfoValid(serverInfo) {
    const host = isNotEmpty(serverInfo.host);
    const username = isNotEmpty(serverInfo.username);
    const password = isNotEmpty(serverInfo.password);
    const port = (serverInfo.port.length != 0) ? true : false;
    const path = isNotEmpty(Website.serverFilePath);

    if(host == true && username == true && password == false && port == true && path == true) { // If only the password is missing
        showWaringDialog(true, {host: host, username: username, password:password, port: port, path: path});  
        buttonIsDisabled.value = false;
        return false;
    } else if (host == true && username == true && password == true && port == true && path == true) { // if all info is there
        return true; 
    } else {
        showWaringDialog(false, {host: host, username: username, password:password, port: port, path: path});
        buttonIsDisabled.value = false;
        return false;
    }
 }


 function showWaringDialog(enterPasswordDialog, serverInfoList) {
  openModal(ServerInfoDialog, {
    title: '',
    acceptText: "Enter",
    declineText: "Go to settings",
    cancelText: "Cancel",
    enterPasswordDialog: enterPasswordDialog,
    serverInfoList: serverInfoList
  })
    // runs when modal is closed via confirmModal
    .then((data) => {
        if(data.accepted){ // Enter (rerun publish)
            Website.serverPassword = data.serverPassword;   
            website.saveInfo();
            BuildAndUploadSite();
        } else if(data.cancel == false){ // Go to setting
            Website.isRedirect = true;
            router.push({path: '/settings'});
        }
    })
    // runs when modal is closed via closeModal or esc
    .catch(() => {
    });
}

</script>
<template>
    <div class="">
        <button @click="router.push({path: '/'});">BACK</button>
        <div style="margin: 10em;">
            <p>Upload status: <span> {{ uploadStatus }}</span></p>
            <div>
                <span>Uploading To: </span><span>{{ Website.serverHost }}</span>
            </div> 
            <div v-if="started">
                <span>{{ numberOfFilesUploaded }}</span>/<span>{{ totalFileToBeUploaded }}</span> <span>Uploading: </span><span>{{ fileUploading }}</span>
            </div>

            <div style="block">
            <span><span v-if="started">{{ displayProgress }}</span>%</span>
            <div class="border border-tint-2" style="width:30%;">
            <div v-if="started"
             class="bg-black" style="height:15px;width:0%;"  
             :style="{ width: displayProgress + '%' }"
             ></div>
            </div>
            </div> 

            <div style="overflow:scroll; height:16em;display:flex;flex-direction:column-reverse;">
                <span v-html="logOutput"></span>
            </div> 
        
            <button @click="BuildAndUploadSite" :disabled="buttonIsDisabled">Upload and Publish Site</button>
        </div> 
    </div>
</template>