  import { ref, computed } from 'vue'
  import { defineStore } from 'pinia'

  export const useGeneralStore = defineStore('general', () => {
    const currentSite = ref('');
    const currentSiteSettings = ref({});

    const isCurrentPostDraft = ref('');
    const theCurrentPost = ref('');

    // Website scope
    function changeCurrentSite(name) {
      currentSite.value = name;
    }

    function setCurrentSiteSettings(settings) {
      currentSiteSettings.value = settings;
    }

    // Post scope
    function updateCurrentPostDaftStatus(isDraft) {
      isCurrentPostDraft.value = isDraft;
    }

    function updateCurrentPostName(post) {
      theCurrentPost.value = post;
    }




    return { 
      currentSite, changeCurrentSite,
      isCurrentPostDraft, updateCurrentPostDaftStatus,
      currentSiteSettings, setCurrentSiteSettings,
      theCurrentPost, updateCurrentPostName
      };
  });
