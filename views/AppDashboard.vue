<script setup>
  import { ref } from 'vue';
  import { RouterLink, RouterView, useRouter} from 'vue-router';
  import { storeToRefs } from 'pinia'
  import { useGeneralStore } from '../stores/general.js'
  import { SteadyAPI } from '../utils/api/platform.js'
  import { fileNameToTitle } from '../utils/utils.js'

  import LogoLight from '../components/logos/LogoLight.vue';
  import LogoMark from '../components/logos/LogoMark.vue';
  import IconThreeDots from '../components/icons/IconThreeDots.vue';
  import IconPosts from '../components/icons/IconPosts.vue';
  import IconPages from '../components/icons/IconPages.vue';
  import IconTags from '../components/icons/IconTags.vue';
  import IconArrowDown from '../components/icons/IconArrowDown.vue';
  import IconPlus from '../components/icons/IconPlus.vue';

  const generalStore = useGeneralStore();
  const steadyAPI = SteadyAPI();
  const { currentSite } = storeToRefs(generalStore);
  const { changeCurrentSite } = generalStore; 


  const router = useRouter();
  const dropdownState = ref(false);
  const websites = ref([]);
  const currentWebsite = ref('');

  (function() {
    // On load, set view to posts
    router.push({path: '/posts'});
    // And load content
    loadSiteContent();
  })();

  function loadSiteContent() {
    // TODO: make sure the current site is there
    steadyAPI.doesFileExistInPrivate('steady.config.json').then(fileExsits => {
      if (fileExsits) {
          // Get the Current website
          steadyAPI.readFileInPrivate("steady.config.json").then(fileData => {
          currentWebsite.value = fileNameToTitle(JSON.parse(fileData.data).currentWebsite);
          currentSite.value = currentWebsite.value;
          // Get a list of all websites by looping over the dirs and add them to array for the dropdown
          steadyAPI.getPathTo('documents').then(path => {
            steadyAPI.getDirsIn(path + "/SteadyCMS/sites/").then( dirs => {
             // console.log(dirs)
              if (dirs != "error" && dirs.length != 0) {

                for (let i = 0; i < dirs.length; i++) {
                  steadyAPI.doesFileExist("/sites/" + dirs[i] + '/hugo.toml').then(fileExsits => {
                    if (fileExsits && dirs[i] != currentWebsite.value.toLowerCase()) {
                      websites.value.splice(0,0, { "name": fileNameToTitle(dirs[i]), "path": dirs[i], });
                    }
                  });
                }
              } else {
                  // Delete steady.config.json
                  StesteadyAPIadyAPI.deleteFileInPrivate("steady.config.json").then(x => {
                  // They have no websites (have them make one)
                  createNewWebsite(false);
                });
              }
            });
          });
        });
      } else { 
        // They have no websites (have them make one)
        createNewWebsite(false);
      }
    });
  }

  function changeCurrentWebsite(websiteName) { // TODO: when changing site the server must be stop before changed
    console.log(websiteName);
     const obj = {"currentWebsite": websiteName};
     steadyAPI.saveToFileToPrivate(JSON.stringify(obj), "/", "steady.config.json").then(x => {
        websites.value = [];
        router.push({path: '/posts'});
        dropdownState.value = false;
        loadSiteContent();
        changeCurrentSite(websiteName);
    });
  }

  function createNewWebsite(projects) {
    router.push({path: '/new-website', 
      query: {
        hasProjects: projects
      }
    });
  }

</script>

<template>
  <div class="flex flex-row"> 

    <aside class="relative h-screen max-w-xs w-2/5 bg-black lg:w-1/4">
      <div class="flex flex-row items-center justify-between border-b border-tint-10 px-6 py-2">
        <div class="flex h-12 w-12 items-center justify-center rounded-full border border-accent-glow/50">
          <LogoMark class="w-5 h-5" />
        </div>
        <button class="rounded-lg border border-transparent p-1 ease-in-out duration-300 hover:border-tint-10">
          <svg class="h-6 w-6 fill-white/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z"></path></svg>
        </button>
      </div>
      <div class="px-6">
        <div class="flex flex-row space-x-2 mt-5">
          <div class="relative w-full min-w-0">
            <!-- Website selector -->
            <button @click="dropdownState =! dropdownState" class="flex w-full flex-grow items-center justify-between rounded-lg border border-tint-10 px-3 py-2 ease-in-out duration-300 hover:bg-accent-glow">
              <div class="flex max-w-xs items-center space-x-3 overflow-hidden">
                <img class="h-5 w-5 rounded-sm" src="https://picsum.photos/200" alt="" />
                <p class="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-white">
                  {{ currentWebsite }}
                </p>
              </div>
              <IconArrowDown class="fill-white w-3 h-3 ml-1" :class="{'rotate-180 duration-300': dropdownState, 'duration-300' : !dropdownState}"/>
            </button>
            <div class="absolute left-0 top-7 z-50 my-4 w-full list-none rounded-lg border border-tint-10 bg-black text-base" id="dropdown" :class="{'opacity-100': dropdownState, 'visible': dropdownState, 'opacity-0': !dropdownState, 'hidden': !dropdownState}">
              <ul class="space-y-1 py-1 w-full" aria-labelledby="dropdown">
                <li v-for="site in websites" :key="site.path" @click="changeCurrentWebsite(site.path)" class="w-full cursor-pointer rounded-md px-3 py-2 ease-in-out duration-300 hover:bg-accent-glow">
                  <div class="flex max-w-xs items-center space-x-3 overflow-hidden">
                    <img class="h-5 w-5 rounded-sm" src="https://picsum.photos/200?seed=32" alt="" />
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-white">
                      {{ site.name }}
                    </p>
                  </div>
                </li>
                <!-- New website btn -->
                <li @click="createNewWebsite(true)" class="cursor-pointer rounded-md px-3 py-2 ease-in-out duration-300 hover:bg-accent-glow">
                  <button class="flex items-center space-x-3">
                    <svg class="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                      <path d="M128,80,98.13,102.4a8,8,0,0,1-4.8,1.6H32V64a8,8,0,0,1,8-8H93.33a8,8,0,0,1,4.8,1.6Z" opacity="0.2"></path>
                      <path d="M216,72H130.67L102.93,51.2a16.12,16.12,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM40,64H93.33l21.34,16L93.33,96H40ZM216,200H40V112H93.33a16.12,16.12,0,0,0,9.6-3.2L130.67,88H216Zm-80-72v16h16a8,8,0,0,1,0,16H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0Z"></path>
                    </svg>
                    <p class="text-sm font-semibold text-white">New website</p>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <!-- Preview website btn -->
          <button class="relative py-1.5 px-2.5 border border-tint-10 rounded-lg hover:bg-accent-glow ease-in-out duration-300">
            <svg class="relative w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"></path></svg>
          </button>
        </div>
        <div class="flex flex-col space-y-1 mt-5">
          <RouterLink class="flex items-center rounded-lg px-3 py-2 text-tint-2 fill-tint-3 text-sm font-semibold hover:text-tint-2/90 ease-in-out duration-300"
            active-class="active-rl"
            to="/posts">
            <IconPosts class="w-4 h-4 mr-2" /> Posts
          </RouterLink>
          <RouterLink class="flex items-center rounded-lg px-3 py-2 text-tint-2 fill-tint-3 text-sm font-semibold hover:text-tint-2/90 ease-in-out duration-300"
            active-class="active-rl" 
            to="/pages">
            <IconPages class="w-4 h-4 mr-2" /> Pages
          </RouterLink>
          <RouterLink class="flex items-center rounded-lg px-3 py-2 text-tint-2 fill-tint-3 text-sm font-semibold hover:text-tint-2/90 ease-in-out duration-300" 
            active-class="active-rl"
            to="/tags">
            <IconTags class="w-4 h-4 mr-2" /> Tags
          </RouterLink>
          <RouterLink class="flex items-center rounded-lg px-3 py-2 text-tint-2 fill-tint-3 text-sm font-semibold hover:text-tint-2/90 ease-in-out duration-300" 
            active-class="active-rl"
            to="/media">
            <IconTags class="w-4 h-4 mr-2" /> Media
          </RouterLink>
        </div>
      </div>
    </aside>

    <main class="flex h-screen w-3/5 lg:w-3/4">
      <RouterView />
    </main>

  </div>
</template>