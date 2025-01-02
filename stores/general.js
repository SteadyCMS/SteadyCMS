  import { ref, computed } from 'vue'
  import { defineStore } from 'pinia'

  export const useGeneralStore = defineStore('general', () => {
    const currentSite = ref('');

    //const isCurrentPostUnsaved = ref(true);
    const theCurrentPost = ref('');

    // Website scope
    function changeCurrentSite(name) {
      currentSite.value = name;
    }

    // Post scope
    // function updateCurrentPostUnsavedStatus(isDraft) {
    //   isCurrentPostUnsaved.value = isDraft;
    // }

    function updateCurrentPostName(post) {
      theCurrentPost.value = post;
    }




    return { 
       changeCurrentSite, 
      //  isCurrentPostUnsaved, 
      //  updateCurrentPostDraftStatus, 
       theCurrentPost, updateCurrentPostName
      };
  });
