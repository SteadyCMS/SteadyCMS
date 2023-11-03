<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGeneralStore } from '../../stores/general.js'
  import { storeToRefs } from "pinia";

  import { SteadyAPI } from '../../utils/api/platform.js'
  import { siteToFolderName, fileNameToTitle } from '../../utils/utils.js'

  // Icons
  import PlusIcon from '../../components/icons/PlusIcon.vue';
  import TextOutdentIcon from '../../components/icons/TextOutdentIcon.vue';
  
  const router = useRouter();
  const steadyAPI = SteadyAPI();

  const website = ref([]);
  const currentWebsite = ref('');
  const isPosts = ref(false);
  const postList = ref({});
  const showPostExcerpt = ref(false);
  const pathToImages = ref('')

  const generalStore = useGeneralStore();
  const { isCurrentPostDraft } = storeToRefs(generalStore);
  const { updateCurrentDaftStatus } = generalStore; 

  (function() {
    updatePostList();
  })();

  // Event
  generalStore.$onAction(
    ({name}) => {
      if (name === 'changeCurrentSite') {
        website.value = [];
        updatePostList();
      }
    }
  );

  function goToBlockEditor(name) {
    if (name == "newsteadycmspost") {
      localStorage.setItem('activeSiteData_currentPost', "newsteadycmspost"); 
    } else {
      localStorage.setItem('activeSiteData_currentPost', name); 
    }
    localStorage.setItem('activeSiteData_currentSite', currentWebsite.value);
    localStorage.setItem('activeSiteData_iscurrentPostADraft', postList.value[name]); 
    router.push({name: 'editor'});
  }

  function updatePostList() {
    steadyAPI.doesFileExistInPrivate('steady.config.json').then(fileExsits => {
      if (fileExsits) {
        // Get the Current website
        steadyAPI.readFileInPrivate("steady.config.json").then(fileData => {
          currentWebsite.value = siteToFolderName(JSON.parse(fileData.data).currentWebsite);
          steadyAPI.getPathTo('documents').then(path => {
            console.log(currentWebsite.value);
            const pathToPosts =  "sites/" + currentWebsite.value+ "/content/post/";
             pathToImages.value = path.replace(/[/\\*]/g, "/") + "/SteadyCMS/" + "sites/" + currentWebsite.value + "/static/"; // For featured Image
            steadyAPI.getListOfFilesIn(path + "/SteadyCMS/" + pathToPosts, '.markdown').then( dirs => {
              if (dirs.length >= 1 && dirs != "error") {
                for (let i = 0; i < dirs.length; i++) {
                  parseFile(pathToPosts, dirs[i]).then(fileData => {
                  website.value.splice(0,0, { "title": fileNameToTitle(dirs[i]).replace(".markdown", ""), "name": dirs[i], "date":  fileData.date, "text": fileData.description, "isDraft": fileData.isDraft, "featuredImage": fileData.featuredImage });
                  postList.value[dirs[i]] = fileData.isDraft;
                  });
                }
                isPosts.value = true;
              }else{
                // No posts  
                isPosts.value = false;
              }
            });
          });
        });
      }else{
        // No posts (no websites)
        isPosts.value = false;
      }
    });
  }

  async function parseFile(path, fileName) {
   let fileData = await steadyAPI.readFile(path + fileName);
      if (fileData.success) {
        // Parse and get description and data
        let frontMatter = /---([^;]*)---/.exec(fileData.data); // Get the front matter
        let description = /(?<=description: )"(?:[^\\"]+|\\.)*"/.exec(frontMatter)[0].slice(1,-1);
        let date = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?([Zz]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?/.exec(frontMatter)[0];
        let isDraft = /(?<=draft: )(?:[^\\"\n]+|\\.)*/.exec(frontMatter)[0];
        let featuredImage = /(?<=featured_image: )"(?:[^\\"]+|\\.)*"/.exec(frontMatter)[0].slice(1,-1);

        console.log(featuredImage)
        let returnData = {
          "description": description, 
          "date": formatDate(date),
          "isDraft": isDraft,
          "featuredImage": featuredImage,
        };
        return returnData;
      }else{
        console.log(fileData.data);
        return "error";
      }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
</script>

<template>
  <div class="relative">
    <div class="flex flex-grow align-center items-center justify-between">
      <h1 class="text-4xl text-tint-10 font-semibold">Posts</h1>
      <div class="flex flex-row space-x-3">
        <button @click="showPostExcerpt = !showPostExcerpt" class="border border-tint-1 px-2.5 rounded-lg ease-in-out duration-300" :class="[showPostExcerpt ? 'bg-tint-1' : 'bg-white']">
          <TextOutdentIcon class="w-4 h-4" :class="[showPostExcerpt ? 'fill-tint-9' : 'fill-tint-8']"/>
        </button>
        <button @click="goToBlockEditor('newsteadycmspost')" class="flex flex-row space-x-2 items-center py-2 px-4 text-white hover:text-white/80 fill-white hover:fill-black bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300">
          <PlusIcon class="w-5 h-5" /> New Post
        </button>
      </div>
    </div>
    <div class="flex flex-col mt-10">
      <div v-for="post in website" :key="post.name" @click="goToBlockEditor(post.name)" class="rounded-lg cursor-pointer border-b border-tint-1 pb-4 pt-4">
        <div class="group flex flex-row justify-between items-center duration-300 ease-in-out">
          <div class="flex flex-row items-center">
            <div class="bg-cover bg-center bg-tint-1 w-28 h-20 rounded-lg " :style="'background-image: url(' + pathToImages + post.featuredImage + ')'"></div>
            <div class="flex flex-col ml-5">
              <h4 class="flex items-center text-xl text-tint-10 font-medium">
                <span class="group-hover:underline duration-300 ease-in-out">{{ post.title }}</span>
                <span class="text-base text-tint-8 ml-1 font-medium">&mdash; 
                  <span v-if="post.isDraft">Draft</span> 
                  <span v-if="!post.isDraft">Published</span>
                </span>
              </h4>
              <p class="text-xs text-tint-7 mt-1">{{ post.date }}</p>
              <p class="text-tint-8 mt-1.5 max-w-2xl truncate text-sm" :class="{'hidden': !showPostExcerpt}">{{ post.text }}</p>
            </div>
          </div> 
        </div>
      </div>
      <div v-if="!isPosts" class="flex h-full justify-center mt-12">
        <div class="flex flex-col items-center text-center justify-center">
          <h4 class="flex items-center text-2xl text-tint-10 font-medium"> {{ generalStore.currentSite }} doesn't have any posts yet.</h4>
          <p class="text-tint-7 mt-1">Create one by clicking the New Post button.</p>
        </div>
      </div>
    </div>
  </div>
</template>