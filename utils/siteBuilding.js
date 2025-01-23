import { SteadyAPI } from '../utils/api/platform.js';
import { titleToFileName, getTodaysDate, showWarningToast, showSuccessToast, join } from '../utils/utils.js';
import { ref } from 'vue';
import TurndownService from 'turndown';
import Website from '../models/WebsiteClass';


const steadyAPI = SteadyAPI();
const isFirstTimePreviewing = ref(true); // Is this the first time they have previewed this post (hugo preview in browser)


  // Preview
  export function previewPost(blocks, pageTitle, titleAtpreview, isNotANewPost, featuredImage) {
    if (titleToFileName(pageTitle).length > 2) {
      // If they changed the title delete the old files with other title (not when editing a saved post)
      if (titleAtpreview != "") {
        if (titleAtpreview != pageTitle) {
          steadyAPI.deleteFile(join(Website.fullContentPath, titleToFileName(titleAtpreview) + ".json"));
          steadyAPI.deleteFile(join(Website.fullContentPath, titleToFileName(titleAtpreview) + ".markdown"));
          titleAtpreview = pageTitle;
        }
      }

      // Make sure they don't already have a post with this name
      steadyAPI.doesFileExist(join(Website.fullContentPath, titleToFileName(pageTitle), ".json")).then(fileExsits => {
        // TODO: Improve this
        const runbuild = ref(true);
        if (fileExsits) { // If there is a file with the same name
          if (isFirstTimePreviewing.value == true) { // if this is the first time runinng preview 
            if (isNotANewPost) { // i.e Are editing a post or creating a new one
              runbuild.value = true;
            } else {
              runbuild.value = false;
            }
          } else { // if this is NOT the first time runinng preview 
            runbuild.value = true;
          }
        } else { // If there is NOT a file with the same name
          runbuild.value = true;
        }
  
        if (runbuild.value) { // If this is the first time pervining they can't use a name of a post
          buildAndSavePostAs("preview-draft", blocks, featuredImage, pageTitle).then(x => {
             // console.log(Website.path)
              steadyAPI.startServer('8080', Website.path);
              steadyAPI.openInNewBrowserTab('http://localhost:8080/post/' + titleToFileName(pageTitle) + '/')

              titleAtpreview = pageTitle;
              isFirstTimePreviewing.value = false;
          });
        } else {
          // The title is not unique
          showWarningToast({ title: 'Post title must be unique', description: 'You already have a post with this title.' });
        }
      });
    } else {
      // The title is too short
      showWarningToast({ title: 'Post title too short', description: 'Title should be at least 2 characters long.' });
    }
  }
  
  // Save post as a draft or as published post
  export function savePost(saveAs, blocks, pageTitle, titleAtpreview, isNotANewPost, featuredImage, isDraft) {
    console.log(titleAtpreview)
    if (titleToFileName(pageTitle).length > 2) {
       // If they changed the title delete the old files with other title (not when editing a saved post)
       if (titleAtpreview != "") {
        if (titleAtpreview != pageTitle) {
          steadyAPI.deleteFile(join(Website.fullContentPath, titleToFileName(titleAtpreview) + ".json"));
          steadyAPI.deleteFile(join(Website.fullContentPath, titleToFileName(titleAtpreview) + ".markdown"));
          titleAtpreview = pageTitle;
        }
      }
      
      // Make sure they don't already have a post or draft with this name
      steadyAPI.doesFileExist(join(Website.fullContentPath, titleToFileName(pageTitle), ".json")).then(fileExsits => {
        const runbuild = ref(true);
        if (fileExsits) { // If there is a file with the same name
          if (isFirstTimePreviewing.value == true) { // if this is the first time runinng preview 
            if (isNotANewPost) { // i.e Are editing a post or creating a new one
              runbuild.value = true;
            } else {
              runbuild.value = false;
            }
          } else { // if this is NOT the first time runinng preview 
            runbuild.value = true;
          }
        } else { // If there is NOT a file with the same name
          runbuild.value = true;
        }
  
        if (runbuild.value) { // If this is the first time pervining they can't use a name of a post
          buildAndSavePostAs(saveAs, blocks, featuredImage, pageTitle).then(x => {
            // Clear public directory
            steadyAPI.deleteFileDirectory(join(Website.path, "/public/")).then(x => {
              //**  As noted above, Hugo does not clear the public directory before building your site.
              //** Manually clear the contents of the public directory before each build to remove draft, expired, and future content.
              steadyAPI.buildNewSite(Website.path).then(x => {
              isDraft = true;
              console.log("done");
              titleAtpreview = pageTitle;
              if(saveAs == 'save-draft'){
                showSuccessToast('Your post was saved as a draft');
              }else{
                showSuccessToast('Your post was saved');
              }
            });
            });
          });
        } else {
          // The title is not unique
          showWarningToast({ title: 'Post title must be unique', description: 'You already have a post with this title.' });
        }
      });
    } else {
      // The title is too short
      showWarningToast({ title: 'Post title too short', description: 'Title should be at least 2 characters long.' });
    }
  }
  
// BUILD METHODS

// Get 150 characters of the first paragraph for a post description
function getPostDescription(blocksData) {
    let found;
    let i = 0;
    if (blocksData.length > 0) {
      do {
        if (blocksData[i].type == "paragraph" || blocksData[i].type == "heading" || blocksData[i].type == "quote") {
          found = true;
          return blocksData[i].content.substr(0, 150).replace(/<[^>]+>/g, '').trim();
        } else {
          if (blocksData.length == i) {
            found = true;
            return '';
          } else {
            found = false;
          }
        }
        i++;
      } while (found == false);
    } else {
      return '';
    }
  }

  function htmlToMarkdown(html) {
    const turndownService = new TurndownService({ emDelimiter: '*' });
    turndownService.addRule('strikethrough', {
      filter: ['del', 's', 'strike'],
      replacement: function (content) {
        return '~~' + content + '~~';
      }
    });
    const markdown = turndownService.turndown(html);
    return markdown;
  }
  

// Convert blocks to markdown and json
async function buildAndSavePostAs(buildType, blocks, featuredImage, pageTitle) {
    console.log(blocks)
    const blocksData = blocks;
    
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
        console.log("Error: Using default [buildAndSavePost: siteBuilding.js]")
        break;
    }
  
    let postDescription = getPostDescription(blocksData);
    let featuredPostImage = featuredImage.name;
    let postTages = '"postTag", "postTag", "postTag"';
    let postStatus = ""; 

    if (buildType == 'save-draft') {
      postStatus = "draft"
      // clear Status
      localStorage.setItem('activeSiteData_currentPost_status', ""); 
    } else if(buildType == 'published'){
      postStatus = "tobepublished"
      // clear Status
      localStorage.setItem('activeSiteData_currentPost_status', "");
    } else {
      const data = localStorage.getItem("activeSiteData_currentPost_status");
      if (data == "draft" || data == "published" || data == "tobepublished") {
        postStatus = data;
      }
    }
  
    // TODO: Don't change date on update
    let pageHead = `---\r\ndate: ${getTodaysDate()} \r\ndescription: "${postDescription}"\r\nfeatured_image: "${featuredPostImage}"\r\ntags: [${postTages}]\r\ntitle: "${pageTitle}"\r\ndraft: ${buildTypeSettings.value.isDraft}\r\n_build:\r\n  render: ${buildTypeSettings.value.render}\r\n  list: ${buildTypeSettings.value.render}\r\n---\r\n`;
  
    // Save as Json
    let jsonData = JSON.stringify(blocks, null, 4);
    await steadyAPI.saveToFile(
      '{"data": ' + jsonData + ', "metadata": { "featuredImagePath": "' + featuredImage.path + '", "postStatus": "' + postStatus + '", "featuredImageName": "' + featuredImage.name + '"} }',
      Website.fullContentPath, titleToFileName(pageTitle) + ".json"
    );
  
    // Save as markdown
    var data = pageHead;
    for (let i = 0; i < blocksData.length; i++) {
      switch (blocksData[i].type) {
        case "paragraph":
          data = data + "\n\n" + htmlToMarkdown(blocksData[i].content);
          break;
        case "heading":
          let ht = blocksData[i].headingType + ">";
          data = data + "\n\n" + htmlToMarkdown(`<${ht}${blocksData[i].content}</${ht}`);
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
    await steadyAPI.saveToFile(data, Website.fullContentPath, titleToFileName(pageTitle) + ".markdown");
  }
  
  