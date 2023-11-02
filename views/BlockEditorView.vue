<script setup> 
  import { useRouter } from 'vue-router';
  import {Drag, DropList} from 'vue-easy-dnd';
  import { ref, computed, h } from 'vue';
  import TurndownService from 'turndown';
  import { createToast } from 'mosha-vue-toastify';
  import { useGeneralStore } from '../stores/general.js';
  //import Showdown from 'showdown';
  import { openModal } from '@kolirt/vue-modal';
  import Dialog from '../components/Dialog.vue';
  import mediaDialog from '../components/MediaDialog.vue';
  import { storeToRefs } from "pinia";

  import { SteadyAPI } from '../utils/api/platform.js';
  import { titleToFileName, fileNameToTitle, siteToFolderName, getTodaysDate } from '../utils/utils.js';
  import { blockTypes, currentblockproperties, currentblockBarproperties } from '../utils/blockEditorData.js';

  import header from '../components/blockTopbar/HeaderBlockTopbar.vue';
  import paragraph from '../components/blockTopbar/ParagraphBlockTopbar.vue';
  import image from '../components/blockTopbar/ImageBlockTopbar.vue';
  import list from '../components/blockTopbar/ListBlockTopbar.vue';

  // Blocks
  import ParagraphBlock from '../components/blocks/ParagraphBlock.vue';
  import HeadingBlock from '../components/blocks/HeadingBlock.vue';
  import ImageBlock from '../components/blocks/ImageBlock.vue';
  import ListBlock from '../components/blocks/ListBlock.vue';
  import QuoteBlock from '../components/blocks/QuoteBlock.vue';

  // Icons
  import DragHandleIcon from '../components/icons/DragHandleIcon.vue';
  import PlusIcon from '../components/icons/PlusIcon.vue';
  import XIcon from '../components/icons/XIcon.vue';
  import ArrowLeftIcon from '../components/icons/ArrowLeftIcon.vue';
  import ArrowDownIcon from '../components/icons/ArrowDownIcon.vue';
  import ImageSquareIcon from '../components/icons/ImageSquareIcon.vue';
  import ArrowSquareOutIcon from '../components/icons/ArrowSquareOutIcon.vue';
  import SidebarIcon from '../components/icons/SidebarIcon.vue';


  const router = useRouter();
  const steadyAPI = SteadyAPI();

  const generalStore = useGeneralStore();
  const { isCurrentPostDraft } = storeToRefs(generalStore);
  const { updateCurrentDaftStatus } = generalStore; 

 
  // Var
  let overTopbar = false;
  let blockButton = false;
  const filterText = ref('');
  const pageTitle = ref('');
  const featuredImage = ref({ path: '', name: ''});
  const titleAtPerview = ref('');
  const isFirstTime = ref(true);
  const websiteName = ref('');
  const isNotANewPost = ref(false);
  const isDraft = ref(true);
  const showSidebar = ref(false);

  let blocks = ref([
  {
        "type": "heading",
        "content": "All about our work",
        "id": "32369332045",
        "active": false,
        "menu": false,
        "focus": false,
        "headingType": "h3"
    },
    {
        "type": "paragraph",
        "content": "<p>This is test text. <strong>So much testing is needed to make this...</strong> Days and weeks of work... It is a big job.</p>",
        "id": "91466924419",
        "active": false,
        "menu": false,
        "focus": false
    },
    {
        "type": "list",
        "content": "<ul><li><p>There is the setup</p></li><li><p>All the learning</p></li><li><p>building each thing</p></li><li><p>Fixing bugs (and there are always bugs)</p></li></ul><p></p>",
        "id": "08249939654",
        "active": false,
        "menu": false,
        "focus": false,
        "listType": "UL"
    },
    {
        "type": "paragraph",
        "content": "<p>But over all, it's really cool what you can do!</p>",
        "id": "98016553865",
        "active": false,
        "menu": false,
        "focus": false
    },
    {
        "type": "paragraph",
        "content": "<p>I would say to leave comments below, but we are still working  on that:)</p>",
        "id": "33169299101",
        "active": false,
        "menu": false,
        "focus": true
    },
    {
       "type": "image", 
       "caption": "", 
       "src": "", 
       "id": "39139299103", 
       "alt": "",
       "active": false, 
       "menu": false, 
       "focus": false 
    },
    {
        "type": "paragraph",
        "content": "<p>Nut-bearing trees, like black walnuts, beeches and those acorn-producing oaks, have “on” and “off” years. “On” years, called mast years, see vigorous production of nuts across an entire species throughout a region.</p>",
        "id": "70610341484",
        "active": false,
        "menu": false,
        "focus": false
    },
    {
        "type": "quote",
        "content": "During mast years, a single oak can drop thousands of acorns, forcing you to rake your lawn even before any leaves drop, or sweep your driveway to avoid twisting your ankle while navigating a blanket of marbles.",
        "author": "- El de Lasovain",
        "id": "70610341414",
        "active": false,
        "menu": false,
        "focus": false
    },
    
  ]);

  const mainBlockTypes = {
    "paragraph": ParagraphBlock,
    "heading": HeadingBlock,
    "list": ListBlock,
    "image": ImageBlock,
    "quote": QuoteBlock,
  };

  const blockBarTypes = {
    "paragraph": paragraph,
    "heading": header,
    "list": list,
    "image": image,
  };
    
  (async () => {
    // Check if they are opening a post or creating a new one
    const currentPost = localStorage.getItem("activeSiteData_currentPost");
    websiteName.value = siteToFolderName(localStorage.getItem("activeSiteData_currentSite"));
    isDraft.value = localStorage.getItem("activeSiteData_iscurrentPostADraft");
    // If there editing load it else don't
   // console.log(currentPost);
    if (currentPost != "newsteadycmspost") {
      isNotANewPost.value = true;
      pageTitle.value = fileNameToTitle(currentPost.replace('.markdown', ''));
      //Load in blocks and data to post from json on start if they exist
      steadyAPI.readFile("sites/" + websiteName.value.toLocaleLowerCase() + "/content/post/" + currentPost.replace('.markdown', '.json')).then(fileData => {
        if (fileData.success) {
          const data = JSON.parse(fileData.data);
          blocks.value = data['data'];
          const postMetadata = data['metadata'];
          featuredImage.value = {
            path: postMetadata.featuredImagePath,
            name: postMetadata.featuredImageName,
          };

        } else {
          console.log(fileData.data);
        }
      });
    }
  })();

  function remove(array, value) {
    let index = array.indexOf(value);
    array.splice(index, 1);
  }

  // Cancel the close event when mouse is over the top bar
  function cancelCloseEvent(over) {
    overTopbar = over;
  }
  // Block the add button when add block box is open
  function blockAddButton(block) {
    blockButton = block;
  }

  // FOR ACTIVE NOT FOCUS
  function focusEditor(array, value, activeType) {
    if (!overTopbar) { // Only if the corser is not over the top bar
      if (activeType == "click") { // Focus the block they clicked on 
        for (let i = 0; i < array.length; i++) { // First blur them all (so we don't end up with two focused blocks)
          array[i].active = false;
        } 
          let index = array.indexOf(value);
          if(index >= 0){ // Focus block
            array[index].active = true;
          }
      } else if (activeType == "out") { // Blur all blocks
        for (let i = 0; i < array.length; i++) {
          array[i].active = false;
        } 
      }
    }
  }

  function htmlToMarkdown(html) {
    const turndownService = new TurndownService({emDelimiter: '*'});
    turndownService.addRule('strikethrough', {
      filter: ['del', 's', 'strike'],
      replacement: function (content) {
        return '~~' + content + '~~'
      }
    });
    const markdown = turndownService.turndown(html);
    return markdown;
  }

  // function markdownToHtml(markdown) {
  //   const converter = new Showdown.Converter();
  //   const html = converter.makeHtml(markdown);
  //   return html;
  // }

  // For Block Topbars (Header)
  function changeHeaderSize(size, value) {
    value.headingType = size;
  }

  // For Block Topbars (List)
  function changeListStyle(type, value) {
    value.listType = type;
  }

  // Open/Close the add new block box
  function openBlockBox(array, value, activeType) {
    if (activeType == "click") {
      if (!blockButton) {
        let index = array.indexOf(value);
        array[index].menu = true;
        // An event to tell if they click outside the dialog so we can close it
        var doClick = (event) => closeBoxOnOut(event, array, value); 
        document.addEventListener("mouseup", doClick);
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i].menu = false;
      } 
      document.removeEventListener("mouseup", closeBoxOnOut);
      filterText.value = "";
    }
  }

  // Close the add new block box (with above)
  function closeBoxOnOut(e, array, value) {
    if (!blockButton) {
      for (let i = 0; i < array.length; i++) {
        array[i].menu = false;
      } 
      document.removeEventListener("mouseup", closeBoxOnOut);
      focusEditor(array, value, 'out');
      filterText.value = "";
    }   
  }

  // Search function for the add blocks box
  const filteredBlocks = computed( () => {
    let filter = filterText.value
    if (!filter.length) return blockTypes.value
    return blockTypes.value.filter( x => 
        x.name.toLowerCase().includes(filter.toLowerCase())
    )
  });

  // When the uses trys to go back to dashboard
  function goToDashboard() {
    if(isNotANewPost.value){ // i.e Are they editing the post or is this a new one
      // TODO: If they are editing a published post ask if they want to publish their changes
      if(isDraft.value){// i.e Is it a draft or published post
      buildAndSavePostAs("save-draft").then(x => { 
        // TODO: show loading screen
        router.push({path: '/'});
      });
    }else{

          openModal(Dialog, {
            title: 'Unpublished changes!',
            message: 'Would you like to publish your changes? All unpublished changes will be lost.',
            acceptText: 'Publish',
            declineText: 'Discard',
            cancelText: 'Cancel'
              }).then((data) => {
                console.log('success', data);
                // To tell between accept and decline
                if(data.accepted) { // accepted
                  console.log('accepted');
                  router.push({path: '/'});
                } else { // declined
                  console.log('declined');
                  router.push({path: '/'});
                }
              }).catch(() => { // canceled
                console.log('cancel')
              });

    }
    } else { // If it's a new post

    openModal(Dialog, {
      title: 'Unsaved changes',
      message: 'Would you like to publish the changes you made in this post? Any unpublished changes will be lost.',
      acceptText: 'Publish changes',
      declineText: 'Discard changes',
      cancelText: 'Cancel'
        }).then((data) => {
          console.log('success', data);
          // To tell between accept and decline
          if(data.accepted) { // accepted
            console.log('accepted');
            router.push({path: '/'});
          } else { // declined
            console.log('declined');
            router.push({path: '/'});
          }
        }).catch(() => { // canceled
          console.log('cancel')
        });

    }
  }

  function publishSite() {
        //console.log(websiteName.value)
        if (titleToFileName(pageTitle.value).length > 2) {
        // If they changed the title delete the old files with other title (not when editing a saved post)
        if(titleAtPerview.value != ""){
          if (titleAtPerview.value != pageTitle.value) {
            steadyAPI.deleteFile("sites/" + websiteName.value + "/content/post/" + titleToFileName(titleAtPerview.value) + ".json");
            steadyAPI.deleteFile("sites/" + websiteName.value + "/content/post/" + titleToFileName(titleAtPerview.value) + ".markdown");
            titleAtPerview.value = pageTitle.value;
          }
        }
        // TODO: IF they are updating a post skip this step (doesFileExist)
        // Make sure they don't already have a post with this name
        steadyAPI.doesFileExist("sites/" + websiteName.value + "/content/post/" + titleToFileName(pageTitle.value) + ".json").then(fileExsits => {

        // TODO: Improve this
        const runbuild = ref(true);
        if (fileExsits) { // If there is a file with the same name
          if (isFirstTime.value == true) { // if this is the first time runinng perview 
            if(isNotANewPost.value){ // i.e Are editing a post or creating a new one
              runbuild.value = true;
            }else{
              runbuild.value = false;
            }
          }else{ // if this is NOT the first time runinng perview 
            runbuild.value = true;
          }
        }else{ // If there is NOT a file with the same name
          runbuild.value = true;
        }

        if(runbuild.value){ // If this is the first time pervining they can't use a name of a post
          buildAndSavePostAs("published").then(x => { 
            steadyAPI.getPathTo('documents').then(path => { 
              steadyAPI.buildNewSite(path + "/steadyCMS/sites/" + websiteName.value);
              isDraft.value = false;
              console.log("done");
              //startServer('8080', path + "/steadyCMS/sites/" + websiteName.value);
              //openInBrowser('http://localhost:8080/post/' + titleToFileName(pageTitle.value) + '/');
              titleAtPerview.value = pageTitle.value;
              isFirstTime.value = false;
            });
          });
        }else{
          // The title is not unique
          showWarningToast({ title: 'Post title must be unique', description: 'You already have a post with this title.'});
        }
      });
    }else{
      // The title is too short
      showWarningToast({ title: 'Post title too short', description: 'Title should be at least 2 characters long.'});
    }
  }

  function previewPost() {
    //console.log(websiteName.value)
    if (titleToFileName(pageTitle.value).length > 2) {
        // If they changed the title delete the old files with other title (not when editing a saved post)
        if(titleAtPerview.value != ""){
          if (titleAtPerview.value != pageTitle.value) {
            steadyAPI.deleteFile("sites/" + websiteName.value + "/content/post/" + titleToFileName(titleAtPerview.value) + ".json");
            steadyAPI.deleteFile("sites/" + websiteName.value + "/content/post/" + titleToFileName(titleAtPerview.value) + ".markdown");
            titleAtPerview.value = pageTitle.value;
          }
        }
        // TODO: IF they are updating a post skip this step (doesFileExist)
        // Make sure they don't already have a post with this name
        steadyAPI.doesFileExist("sites/" + websiteName.value + "/content/post/" + titleToFileName(pageTitle.value) + ".json").then(fileExsits => {

        // TODO: Improve this
        const runbuild = ref(true);
        if (fileExsits) { // If there is a file with the same name
          if (isFirstTime.value == true) { // if this is the first time runinng perview 
            if(isNotANewPost.value){ // i.e Are editing a post or creating a new one
              runbuild.value = true;
            }else{
              runbuild.value = false;
            }
          }else{ // if this is NOT the first time runinng perview 
            runbuild.value = true;
          }
        }else{ // If there is NOT a file with the same name
          runbuild.value = true;
        }

        if(runbuild.value){ // If this is the first time pervining they can't use a name of a post
          buildAndSavePostAs("preview-draft").then(x => { 
            steadyAPI.getPathTo('documents').then(path => { 
             // buildNewSite(path + "/steadyCMS/sites/" + websiteName.value);

             steadyAPI.startServer('8080', path + "/steadyCMS/sites/" + websiteName.value);
             // openInBrowser('http://localhost:8080/post/' + titleToFileName(pageTitle.value) + '/');
             steadyAPI.previewInNewBrowserTab('http://localhost:8080/post/' + titleToFileName(pageTitle.value) + '/')
             

              titleAtPerview.value = pageTitle.value;
              isFirstTime.value = false;
            });
          });
        }else{
          // The title is not unique
          showWarningToast({ title: 'Post title must be unique', description: 'You already have a post with this title.'});
        }
      });
    }else{
      // The title is too short
      showWarningToast({ title: 'Post title too short', description: 'Title should be at least 2 characters long.'});
    }
  }

  const showWarningToast = (message) => {
    createToast(message, {
      type: 'warning', 
      toastBackgroundColor: '#AF3737',
      showCloseButton: false, 
      swipeClose: true, 
      transition: 'slide', 
      showIcon: false, 
      position: 'top-right'
    });
  }

  // Get 150 characters of the first paragraph for a post description
  function getPostDescription(blocksData) {
    let found;
    let i = 0;
    if(blocksData.length > 0){
    do {
      if(blocksData[i].type == "paragraph"){
        found = true;
        return blocksData[i].content.substr(0, 150).replace(/<[^>]+>/g, '').trim();
      }else{
        found = false;
      }
      i++;
    } while (found == false);  
  }else{
    return '';
  }
  }

  // Convert blocks to markdown and json
  async function buildAndSavePostAs(buildType){
    const blocksData = blocks['_rawValue'];
    const buildTypeSettings = ref({})

    switch (buildType) {
      case 'published': // Build as pubished post (render = "always" & draft = "false")
      buildTypeSettings.value = {
      'isDraft': false,
      'render': 'always',
      }
        break;
      case 'preview-draft': // Build as a draft for previewing (render = "always" & draft = "false")
      buildTypeSettings.value = {
      'isDraft': false,
      'render': 'always',
      }
        break;
      case 'save-draft': // Build as a draft for saving (render = "never" & draft = "true")
      buildTypeSettings.value = {
      'isDraft': true,
      'render': 'never',
      }
        break;
      default:
      buildTypeSettings.value = {
      'isDraft': false,
      'render': 'always',
      }
      console.log("Error: Using default [buildAndSavePost: BlockEditorVue.vue]")
        break;
    }

    let postDescription = getPostDescription(blocksData);
    let featuredPostImage = featuredImage.value.name;
    let postTages = '"scene", "fun", "time"';
  
    // TODO: Don't change date on update
    let pageHead = `---\r\ndate: ${getTodaysDate()} \r\ndescription: "${postDescription}"\r\nfeatured_image: "${featuredPostImage}"\r\ntags: [${postTages}]\r\ntitle: "${pageTitle.value}"\r\ndraft: ${buildTypeSettings.value.isDraft}\r\n_build:\r\n  render: ${buildTypeSettings.value.render}\r\n  list: ${buildTypeSettings.value.render}\r\n---\r\n`;

    // Save as Json
    let jsonData = JSON.stringify(blocks['_rawValue'], null, 4);
    await steadyAPI.saveToFile(
                              '{"data": ' + jsonData + ', "metadata": { "featuredImagePath": "' + featuredImage.value.path + '", "featuredImageName": "' +  featuredImage.value.name + '"} }',
                              "sites/" + websiteName.value + "/content/post", titleToFileName(pageTitle.value) + ".json"
                              );

    // Save as markdown
    var data = pageHead;
    for (let i = 0; i < blocksData.length; i++) {
      switch(blocksData[i].type) {
        case "paragraph":
        data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
          break;
        case "heading":
          let ht =  blocksData[i].headingType + ">";
          data = data + "\n\n" + htmlToMarkdown( `<${ht}${blocksData[i].content}</${ht}`);
          break;
        case "list":
          data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
          break;
        case "image":
          let src = blocksData[i].src.substr(blocksData[i].src.lastIndexOf('/') + 1);
          data = data + "\n\n" + `{{< figure src="/${src}" alt="" caption="${blocksData[i].caption}">}}`
          break;
        case "quote":
          data = data + "\n\n" + htmlToMarkdown(`<blockquote>${blocksData[i].content}</br>${blocksData[i].author}</blockquote>`);
          break;
        default:
          data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
      }
    } 
    await steadyAPI.saveToFile(data, "sites/" + websiteName.value + "/content/post", titleToFileName(pageTitle.value) + ".markdown");
  }

  function addNewBlock(array, value, name) {
    let idNum =  Math.random().toString().slice(2,9).concat( Math.random().toString().slice(5,7)).concat(Math.random().toString().slice(4,6));
    if (value != 0) {
      let index = array.indexOf(value);
      switch(name) {
        case "paragraph":
          array.splice(index + 1, 0,  { type: "paragraph", content: "", id: idNum, active: false, menu: false, focus: false });
          break;
        case "heading":
          array.splice(index + 1, 0,  { type: "heading", content: "", id: idNum, active: false, menu: false, focus: false, headingType: "h3" });
          break;
        case "list":
          array.splice(index + 1, 0,  { type: "list", content: "", id: idNum, active: false, menu: false, focus: false, listType: "UL" });
          break;
        case "image":
          array.splice(index + 1, 0,  { type: "image", caption: "", src: "", id: idNum, alt: "", active: false, menu: false, focus: false });
          break;
        case "quote":
          array.splice(index + 1, 0,  { type: "quote", content: "", author: "", id: idNum, active: false, menu: false, focus: false });
          break;
          
        default:
          
      }
      openBlockBox(array, value, 'out');
      setBlockFocus(array, index + 1);
    } else {
      array.splice(0, 0, { type: "paragraph", content: "", id: idNum, active: false, menu: false, focus: false, });
    }
    console.log(blocks.value);
    focusEditor(array, value, 'click');
   
  }

  // Delete a block By it's item
  function deleteBlockByItem(blocksArray, blockItem, focusPerviousBlock) {
    let index = blocksArray.indexOf(blockItem);
    blocksArray.splice(index, 1);
    overTopbar = false;
    if(focusPerviousBlock){
      setBlockFocus(blocksArray, index - 1);
    }
  }

  // Delete a block By it's index
  function deleteBlockByIndex(blocksArray, blockIndex, focusPerviousBlock) {
    blocksArray.splice(blockIndex, 1);
    overTopbar = false;
    if(focusPerviousBlock){
      setBlockFocus(blocksArray, blockIndex - 1);
    }
  }

  function setBlockFocus(blocksArray, BlockIndex){
    for (let i = 0; i < blocksArray.length; i++) { // Clear all focus
      blocksArray[i].focus = false;
    } 
    if(BlockIndex >= 0){ // Focus the block
      blocksArray[BlockIndex].focus = true;
    }
  }

  // function joinBlockWithPervious(blocksArray, content, blockIndex){
  //   console.log( blocksArray[blockIndex - 1].content)
  //   deleteBlockByIndex(blocksArray, blockIndex, true);
  // }

  // On enter create new block with setup config
  function addNewBlockWithSetup(blocksArray, blockItem, blockType, passedContent){
    if(blockType == "paragraph" || blockType == "heading" || blockType == "list" || blockType == "quote"){
      addNewBlock(blocksArray, blockItem, "paragraph");
      let index;
      if(blockItem == 0){ // For the title
        index = 0;
      }else{
        index = blocksArray.indexOf(blockItem);
      }
      // If there is content to be passed in pass it
      if (passedContent != "") {
        blocksArray[index + 1].content = passedContent;
      }
      // Focus new block and blur old 
      if(index > 0){
        blocksArray[index].focus = false;
        blocksArray[index + 1].focus = true;
      }
    }
  }


  function setFeaturedImage() {
    openModal(mediaDialog, {
        title: 'Select media',
        message: '',
        acceptText: 'Select',
        declineText: 'x',
        cancelText: '_'
    })
        // runs when modal is closed via confirmModal
        .then((data) => {;
          featuredImage.value.path = data.selectedPath;
          featuredImage.value.name = data.selected;
        })
        // runs when modal is closed via closeModal or esc
        .catch(() => {
          console.log('catch')
        });
  }
</script>

<template>
  <div class="relative">
    <div class="border-b border-tint-1 px-6 py-4">
      <div class="max-w-7xl mx-auto flex flex-row items-center justify-between ">
        <div class="flex flex-row items-center space-x-6">
          <button @click="goToDashboard" class="flex items-center py-2 text-sm font-medium text-tint-9 hover:text-tint-10 duration-300">
            <ArrowLeftIcon class="w-3 h-3 mr-1 fill-tint-9" />Posts
          </button>
          <p class="text-tint-7 text-sm font-medium">Draft</p>
        </div>
        <div class="flex flex-row items-center">
          <button @click="previewPost" class="flex flex-row space-x-2 items-center py-2 px-4 text-tint-10 hover:text-tint-8 fill-tint-10 hover:fill-tint-8 bg-white text-sm font-medium rounded-lg ease-in-out duration-300">
            Preview <ArrowSquareOutIcon class="w-4 h-4 ml-1" />
          </button>
          <button @click="publishSite" class="flex flex-row space-x-2 items-center py-2 px-4 text-white hover:text-white/80 fill-white hover:fill-black bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300">
            Publish <ArrowDownIcon class=" w-3 h-3 my-auto ml-2"/>
          </button>
          <!-- <button @click="showSidebar = !showSidebar" class="border border-tint-1 p-2 rotate-180 rounded-lg ease-in-out duration-300 ml-2" :class="[showSidebar ? 'bg-tint-3' : 'bg-white']">
            <SidebarIcon class="fill-tint-8 w-5 h-5" :class="{'fill-tint-10' : showSidebar}"/>
          </button> -->
        </div>
      </div>
    </div>

    <div class="absolute top-0 right-0 bg-white h-full max-w-md border border-tint-1" :class="{'hidden': !showSidebar}">

    </div>

    <div class="flex flex-row mt-8">
      <!-- TODO: allow editing title -->
      <textarea
        :disabled="isNotANewPost ? true : null"
        @keydown.enter.exact.prevent
        @keydown.enter.exact="addNewBlockWithSetup(blocks, 0, 'heading', '')"
        type="text" 
        placeholder="Add title" 
        v-model="pageTitle" 
        maxlength="72"
        class="h-auto resize-none 
        px-3 block w-full mx-8 
        bg-white outline-none border-0
        border-none text-5xl 
        placeholder-tint-6 
        focus:placeholder-transparent 
        font-medium 
        text-tint-10 break-words 
        text-center">
      </textarea>
    </div>
    <div class="max-w-2xl mx-auto flex flex-col">
      <img class="rounded-md" :src="featuredImage.path"> 
      <button @click="setFeaturedImage" class="inline-flex items-center text-tint-6 bg-tint-1 py-1 px-2 mt-1 text-sm rounded-md w-fit" :class="{'hidden': featuredImage.path != ''}">
        <ImageSquareIcon class="w-5 h-5 fill-tint-6 mr-1" /> Add featured image
      </button>
      <button class="inline-flex items-center text-tint-6 bg-tint-1 py-1 px-2 mt-1 text-sm rounded-md w-fit" :class="{'hidden': featuredImage.path == ''}">
        <span @click="setFeaturedImage" class="inline-flex"> 
          <ImageSquareIcon class="w-5 h-5 fill-tint-6 mr-1" /> 
        </span> {{ featuredImage.name }}
        <XIcon @click="featuredImage.path = ''" class="w-5 h-5 ml-1"/>
      </button>
    </div>
    <div class="flex flex-row mt-5 w-full">
      <drop-list class="max-w-2xl mx-auto" :items="blocks" @reorder="$event.apply(blocks)" mode="cut">
        <template v-slot:item="{item}">
          <drag @click="focusEditor(blocks, item, 'click')" 
            @focusout="focusEditor(blocks, item, 'out')" 
            @dragstart="focusEditor(blocks, item, 'out')"
            @cut="remove(blocks, item)" 
            :class="{ 'border-opacity-100': item.active }" 
            class="group relative flex flex-row border-slate-100 px-2 pb-6" 
            :key="item.id" 
            :data="item" 
            handle=".drag-handle">
            
            <!-- Block Topbar -->
            <div @mouseover="cancelCloseEvent(true)" 
              @mouseleave="cancelCloseEvent(false)" 
              class="flex flex-row bg-white -top-10 left-0 right-0 rounded-lg px-1 shadow-md" 
              :class="{ 'absolute': item.active, 'hidden':!item.active }">
              <div class="ml-1.5 flex grow justify-between">
                <!-- Topbar Buttons -->
                <div class="flex space-x-1 items-center w-full">
                  <span class="text-sm font-medium text-tint-9 mr-3 py-2 capitalize">{{ item.type }}</span> 
                  <component :is="blockBarTypes[item.type]" 
                    v-bind="currentblockBarproperties(item)" 
                    @size-changed="changeHeaderSize"
                    @list-style-changed="changeListStyle"
                    :ref="'block_'+item.id" />
                </div>
                <!-- Delete (Right Side)-->
                <div class="flex items-center"> 
                  <button @click="deleteBlockByItem(blocks, item, false)" class="hover:bg-tint-1 px-1 py-1 rounded-md duration-300">
                    <XIcon class="fill-tint-8 w-5 h-5" />     
                  </button> 
                </div>
              </div>
            </div> 
    
            <!-- Block Icons -->
            <div class="flex flex-row" :class="{ 'visible':item.active, 'invisible':!item.active, 'group-hover:visible':!item.active }">
              <span @click="openBlockBox(blocks, item, 'click')" class="add-button">
                <span class="cursor-pointer">
                  <PlusIcon class="w-6 fill-tint-7"/>
                </span>
                <!-- Add blocks menu -->
                <div class="relative flex">
                  <div class="absolute w-44 max-h-44 bg-white z-30 -bottom-62 left-0 
                    flex flex-col visible rounded-lg shadow-lg" 
                    @mouseover="cancelCloseEvent(true), blockAddButton(true)" 
                    @mouseleave="cancelCloseEvent(false), blockAddButton(false)"
                    :class="{'hidden':!item.menu }">
                    <input v-model="filterText" type="text" placeholder="Filter blocks" 
                      class="text-tint-10 m-2 text-base outline-1 outline-tint-2 border border-tint-2 px-2 py-1 rounded-md bg-tint-0 placeholder:text-tint-6" />
                    <div class="relative flex flex-col m-2 overflow-y-scroll">
                      <div v-for="(blockItems, i) in filteredBlocks" :key="i">
                        <span class="w-full flex flex-row py-1 px-2 cursor-pointer hover:bg-tint-1 duration-500 rounded-md" @click="addNewBlock(blocks, item, blockItems.name)">
                          <span class="text-base text-tint-10 capitalize">
                            {{ blockItems.name }}
                          </span>
                        </span> 
                      </div>
                      <span v-if="!filteredBlocks.length" class="text-base text-slate-600 ml-1">No Blocks Found</span>
                    </div>
                  </div>
                </div>
              </span>
              <span class="drag-handle mr-1 hover:cursor-grab">
                <DragHandleIcon class="w-6 fill-tint-7"/>
              </span>
            </div>
          
            <!-- Main Block getBlockType(item.type) -->
            <div class="flex flex-auto">
              <component :is="mainBlockTypes[item.type]" 
              v-bind="currentblockproperties(item, blocks)" 
              :ref="item.id" 
              @on-press-enter="(content) => {addNewBlockWithSetup(blocks, item, item.type, content);}"
              @on-backspace-when-empty="deleteBlockByItem(blocks, item, true)"
              @on-backspace-join="(blockIndex) => {deleteBlockByIndex(blocks, blockIndex, true);}"/>
            </div>
          </drag>
        </template>
        <template v-slot:feedback="{item}"></template>
      </drop-list>
    </div>
  </div>
</template>


<!-- 
  TODO:
WITH BLOCKS:
- On list . doesn't show always (has <p> instead of list)

With Block Editor:
Fix dialog
Make Image block + Media library

Other:
Add template chooser
Fix downloder
Add Site publishing
If website is deleted and is the current don't show it
-->



