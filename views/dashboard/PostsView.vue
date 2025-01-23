<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGeneralStore } from '../../stores/general.js'
  import { SteadyAPI } from '../../utils/api/platform.js'
  import { fileNameToTitle, encodePath, join } from '../../utils/utils.js'

  import PostItem from '../../components/PostItem.vue';

  // Icons
  import PlusIcon from '../../components/icons/PlusIcon.vue';
  import TextOutdentIcon from '../../components/icons/TextOutdentIcon.vue';
  import ThreeDotsIcon from '../../components/icons/ThreeDotsIcon.vue';
  
  const router = useRouter();
  const steadyAPI = SteadyAPI();
  const generalStore = useGeneralStore();

  const website = ref([]);
  const currentWebsite = ref('');
  const isPosts = ref(false);
  const postList = ref({});
  const showPostExcerpt = ref(false);
  const pathToImages = ref('');
  const numOfToBePublishedPosts = ref(0);

  (function() {
    onLoadSetUp();
  })();

  // Event
  generalStore.$onAction(
    ({name}) => {
      if (name === 'changeCurrentSite') {
        website.value = [];
        onLoadSetUp();
      }
    }
  );

  function goToBlockEditor(name) {
    if (name == "newsteadycmspost") {
      localStorage.setItem('activeSiteData_currentPost', "newsteadycmspost"); 
      localStorage.setItem('activeSiteData_iscurrentPostADraft', true); 
    } else {
      localStorage.setItem('activeSiteData_currentPost', name); 
      localStorage.setItem('activeSiteData_iscurrentPostADraft', postList.value[name]); // TODO: fix this
    }
    localStorage.setItem('activeSiteData_currentSite', currentWebsite.value);
     
    router.push({name: 'editor'});
  }

  function onLoadSetUp(){ 
    // Because of loading times we have to read steady.config.json again here to get the current site
    steadyAPI.doesFileExistInPrivate('steady.config.json').then(fileExsits => {
      if (fileExsits) {
        steadyAPI.readFileInPrivate("steady.config.json").then(fileData => {
          currentWebsite.value = JSON.parse(fileData.data).currentWebsite;
          //console.log(JSON.parse(fileData.data).currentWebsite) // TEST
          updatePostList()
        });
      }else{
        // No posts (no websites)
        isPosts.value = false;
      }
    });
  }

  function updatePostList() {
    steadyAPI.getPathTo('SteadyCMS').then(path => {
      const pathToPosts = `sites/${currentWebsite.value}/content/post/`;
      pathToImages.value = path.replace(/[/\\*]/g, "/") + `sites/${currentWebsite.value}/static/`; // For featured Image
      // Return all the .markdown files in website dir (they are the posts)
      steadyAPI.getListOfFilesIn(path + pathToPosts, '.markdown').then( dirs => {
        if (dirs.length >= 1 && dirs != "error") {
          for (let i = 0; i < dirs.length; i++) {
            steadyAPI.readFile(path + pathToPosts + dirs[i]).then(fileData =>{
              if (fileData.success) {
                // Parse and get description, data, isDraft and featuredImage path
                let frontMatter = /---([^;]*)---/.exec(fileData.data); // Get the front matter
                let description = /(?<=description: )"(?:[^\\"]+|\\.)*"/.exec(frontMatter)[0].slice(1,-1);
                let date = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?([Zz]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?/.exec(frontMatter)[0];
                //let isDraft = /(?<=draft: )(?:[^\\"\n]+|\\.)*/.exec(frontMatter)[0];
                let featuredImage = /(?<=featured_image: )"(?:[^\\"]+|\\.)*"/.exec(frontMatter)[0].slice(1,-1);

                // If this is not a draft see if its a to be published post 
              //  if (isDraft == false) { console.log(isDraft)
                  steadyAPI.readFile(path + pathToPosts + dirs[i].replace(".markdown", ".json")).then(fileData =>{
                    let postStatus = JSON.parse(fileData.data).metadata.postStatus;
                   // console.log(postStatus)
                      let returnData = {
                        "description": description, 
                        "date": formatDate(date),
                        "postStatus": postStatus,
                        "featuredImage": encodePath(featuredImage),
                      }; 
                      // Get to be published post count
                      if (postStatus == "tobepublished") {
                        ++numOfToBePublishedPosts.value;
                      }
                      // console.log("LOG 1")
                      // console.log(returnData.postStatus)
                    website.value.splice(0,0, { "title": fileNameToTitle(dirs[i]).replace(".markdown", ""), "name": dirs[i], "date":  returnData.date, "text": returnData.description, "postStatus": returnData.postStatus, "featuredImage": returnData.featuredImage });
                   // postList.value[dirs[i]] = returnData.postStatus; // for above
                  });
                // } else {
                //     let returnData = {
                //       "description": description, 
                //       "date": formatDate(date),
                //       "postStatus": "draft",
                //       "featuredImage": encodePath(featuredImage),
                //     }; 
                //     console.log("LOG 2")
                //     console.log(returnData.postStatus)
                //   website.value.splice(0,0, { "title": fileNameToTitle(dirs[i]).replace(".markdown", ""), "name": dirs[i], "date":  returnData.date, "text": returnData.description, "postStatus": returnData.postStatus, "featuredImage": returnData.featuredImage });
                //  // postList.value[dirs[i]] = returnData.postStatus;
                // }
              }else{
                console.log(fileData.data);
              }
            });
          }
          isPosts.value = true;
        }else{
          // There are no posts  
          isPosts.value = false;
        }
      });
    });
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function deletePost(postFileName, postsArray, postItem) {
    steadyAPI.deleteFile(`sites/${currentWebsite.value}/content/post/` + postFileName.replace(".markdown", ".json"));
    steadyAPI.deleteFile(`sites/${currentWebsite.value}/content/post/${postFileName}`);
    let index =  postsArray.indexOf(postItem);
    // Update "to be published" post count
    console.log(postsArray[index])
    if (postsArray[index].postStatus == "tobepublished") {
      --numOfToBePublishedPosts.value;
    }
    website.value.splice(index, 1);
    //isPosts.value = false;
  }

</script>
<template>
  <div class="relative flex flex-col">
    <div class="flex flex-grow align-center items-center justify-between">
      <h1 class="text-4xl text-tint-10 font-semibold">Posts</h1>
      <div class="flex flex-row space-x-3">
      <div>
        <span>Posts ready to be published: </span><span> {{ numOfToBePublishedPosts }}</span>
      </div>
        <button @click="showPostExcerpt = !showPostExcerpt" class="border border-tint-1 px-2.5 rounded-lg ease-in-out duration-300" :class="[showPostExcerpt ? 'bg-tint-1' : 'bg-white']">
          <TextOutdentIcon class="w-4 h-4" :class="[showPostExcerpt ? 'fill-tint-9' : 'fill-tint-8']"/>
        </button>
        <button @click="goToBlockEditor('newsteadycmspost')" class="flex flex-row space-x-2 items-center py-2 px-4 text-white hover:text-white/80 fill-white hover:fill-black bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300">
          <PlusIcon class="w-5 h-5" /> New Post
        </button>
      </div>
    </div>
    <div class="flex flex-col mt-10">
      <div v-for="post in website" :key="post.name" class="relative flex flex-shrink-0 flex-grow flex-row rounded-lg cursor-pointer border-b border-tint-1 pb-4 pt-4">
        <PostItem :posts="website" :item="post" :pathToImages="pathToImages" :showPostExcerpt="showPostExcerpt" @go-to-block-editor="goToBlockEditor" @delete-post="deletePost"/>
      </div>
      <div v-if="!isPosts || website == []" class="flex h-full justify-center mt-12">
        <div class="flex flex-col items-center text-center justify-center">
          <h4 class="flex items-center text-2xl text-tint-10 font-medium"> {{ currentWebsite }} doesn't have any posts yet.</h4>
          <p class="text-tint-7 mt-1">Create one by clicking the New Post button.</p>
        </div>
      </div>
    </div>
  </div>
</template>