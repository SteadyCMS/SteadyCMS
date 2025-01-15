<script setup>
import { ref, computed } from 'vue';
// import { BuildAndUploadSite } from '../utils/websiteBuilding.js';
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
  
 function BuildAndUploadSite(){
    website.loadInfo();
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
            if(isServerInfoValid(ServerConfig)){ // Check that all server info is there
                fileUploading.value = "Perparing...";
                steadyAPI.walkDir(srcDirPath).then(filePaths => {
                totalFileToBeUploaded.value = filePaths.length - 1;
                const count = ref(0);
                fileUploading.value = filePaths[count.value];
                started.value = true;
                for(let file in filePaths){

                    // TODO: delete server files and server error handling
                    steadyAPI.uploadFileToServer(filePaths[file], ServerConfig).then(result => {
                        fileUploading.value = filePaths[count.value + 1];
                        count.value = count.value + 1;
                        if(count.value != 1){
                            numberOfFilesUploaded.value = ++numberOfFilesUploaded.value;
                        }


                        console.log(count.value)
                        console.log(numberOfFilesUploaded.value)

                        if(result.successful){ // If upload successful
                            logOutput.value = logOutput.value + file + " Uploading: " + filePaths[file] + " <p style='color:green'> ✔ </p>";

                            if(file == (filePaths.length - 1)){ // Show after the last file is uploaded
                                showSuccessToast('Your site was published!');
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
                    console.log(result)
                    });
                }
                });
            }
        });
    });
 }


 function isServerInfoValid(serverInfo) {
    const host = isNotEmpty(serverInfo.host);
    const username = isNotEmpty(serverInfo.username);
    const password = isNotEmpty(serverInfo.password);
    const port = (serverInfo.port.length != 0) ? true : false;

    if(host == true && username == true && password == false && port == true) { // If only the password is missing
        showWaringDialog(true, {host: host, username: username, password:password, port: port});  
        return false;
    } else if (host == true && username == true && password == true && port == true) { // if all info is  there
        return true; 
    } else {
        showWaringDialog(false, {host: host, username: username, password:password, port: port});
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
        <div style="margin: 10em;">
            <div>
                <span>Uploading To: </span><span>{{ Website.serverHost }}</span>
            </div> 
            <div v-if="started">
                <span>{{ numberOfFilesUploaded }}</span>/<span>{{ totalFileToBeUploaded }}</span> <span>Uploading: </span><span>{{ fileUploading }}</span>
            </div>

            <div style="block">
            <span><span v-if="started">{{ Math.round((100/totalFileToBeUploaded)*numberOfFilesUploaded) }}</span>%</span>
            <div class="border border-tint-2" style="width:30%;">
            <div v-if="started"
             class="bg-black" style="height:15px;width:0%;"  
             :style="{ width: ((100/totalFileToBeUploaded)*numberOfFilesUploaded) + '%' }"
             ></div>
            </div>
            </div> 

            <div style="overflow:scroll; height:16em;display:flex;flex-direction:column-reverse;">
                <span v-html="logOutput"></span>
            </div> 
        
            <button @click="BuildAndUploadSite">Upload and Publish Site</button>
        </div> 
    </div>
</template>