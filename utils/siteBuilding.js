import { SteadyAPI } from '../utils/api/platform.js';
import { titleToFileName, getTodaysDate, showWarningToast, showSuccessToast, join } from '../utils/utils.js';
import { ref } from 'vue';
import TurndownService from 'turndown';
import Website from '../models/WebsiteClass';


 
const steadyAPI = SteadyAPI();
const isFirstTimePreviewing = ref(true); // Is this the first time they have previewed this post (hugo preview in browser)

// PUBLISH
export function publishSite(blocks, pageTitle, titleAtpreview, isNotANewPost, featuredImage, isDraft) {
    if (titleToFileName(pageTitle).length > 2) {
      // If they changed the title delete the old files with other title (not when editing a saved post)
      if (titleAtpreview != "") {
        if (titleAtpreview != pageTitle) {
          steadyAPI.deleteFile(join(Website.contentPath, titleToFileName(titleAtpreview), ".json"));
          steadyAPI.deleteFile(join(Website.contentPath, titleToFileName(titleAtpreview), ".markdown"));
          titleAtpreview = pageTitle;
        }
      }
      // TODO: IF they are updating a post skip this step (doesFileExist)
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
          buildAndSavePostAs("published", blocks, featuredImage, pageTitle).then(x => {
  
            // Clear public directory
            steadyAPI.deleteFileDirectory(join(Website.path, "public/")).then(x => {
  
              //**  As noted above, Hugo does not clear the public directory before building your site.
              //** Manually clear the contents of the public directory before each build to remove draft, expired, and future content.
  
              steadyAPI.buildNewSite(Website.path).then(x => {
              isDraft = false;
              console.log("done");
              //steadyAPI.startServer('8080', Website.path);
              //steadyAPI.openInNewBrowserTab('http://localhost:8080/post/' + titleToFileName(pageTitle.value) + '/')
              titleAtpreview = pageTitle;
  
              isFirstTimePreviewing.value = false; // TODO: see if this line should be here
  
              //Upload site
              const srcDirPath = join(Website.path, "/public/");
              const ServerConfig = {
                host: Website.serverHost,
                username: Website.serverUsername,
                password: Website.serverPassword,
                port:  Website.serverPort || 22
              }; 
  
              steadyAPI.walkDir(srcDirPath).then(filePaths => {
                for(let file in filePaths){
                  steadyAPI.uploadFileToServer(filePaths[file], ServerConfig).then(x => {
                    isDraft = false;
                    if(file == (filePaths.length - 1)){ // Show after the last file is uploaded
                        showSuccessToast('Your site was published!');
                    }
                  console.log("File Uploaded")
                  console.log(x)
                });
                }
              });
  
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
  



  // preview
  export function previewPost(blocks, pageTitle, titleAtpreview, isNotANewPost, featuredImage) {
    if (titleToFileName(pageTitle).length > 2) {
      // If they changed the title delete the old files with other title (not when editing a saved post)
      if (titleAtpreview != "") {
        if (titleAtpreview != pageTitle) {
          steadyAPI.deleteFile(join(Website.contentPath, titleToFileName(titleAtpreview), ".json"));
          steadyAPI.deleteFile(join(Website.contentPath, titleToFileName(titleAtpreview), ".markdown"));
          titleAtpreview = pageTitle;
        }
      }
      // TODO: IF they are updating a post skip this step (doesFileExist)
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
            steadyAPI.getPathTo('documents').then(path => {
              // buildNewSite(path + "/steadyCMS/sites/" + websiteName.value);
  
              console.log(Website.path)
              steadyAPI.startServer('8080', Website.path);
              steadyAPI.openInNewBrowserTab('http://localhost:8080/post/' + titleToFileName(pageTitle) + '/')

              titleAtpreview = pageTitle;
              isFirstTimePreviewing.value = false;
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
  
  // DRAFT
  // TODO: combine like in save as draft and save as published
  export function saveAsDraft(blocks, pageTitle, titleAtpreview, isNotANewPost, featuredImage, isDraft) {
    if (titleToFileName(pageTitle).length > 2) {
       // If they changed the title delete the old files with other title (not when editing a saved post)
       if (titleAtpreview != "") {
        if (titleAtpreview != pageTitle) {
          steadyAPI.deleteFile(join(Website.contentPath, titleToFileName(titleAtpreview), ".json"));
          steadyAPI.deleteFile(join(Website.contentPath, titleToFileName(titleAtpreview), ".markdown"));
          titleAtpreview = pageTitle;
        }
      }
      // Make sure they don't already have a post or draft with this name
      steadyAPI.doesFileExist(join(Website.fullContentPath, titleToFileName(pageTitle), ".json")).then(fileExsits => {
  
        // TODO: See if this is needed for draft
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
          buildAndSavePostAs("save-draft", blocks, featuredImage, pageTitle).then(x => {
  
            // Clear public directory
            steadyAPI.deleteFileDirectory(join(Website.path, "/public/")).then(x => {
              //**  As noted above, Hugo does not clear the public directory before building your site.
              //** Manually clear the contents of the public directory before each build to remove draft, expired, and future content.
  
              steadyAPI.buildNewSite(Website.path).then(x => {
              isDraft = true;
              console.log("done");
              titleAtpreview = pageTitle;
              showSuccessToast('Your post was saved as a draft');
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
    const blocksData = blocks//['_rawValue'];
    
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
    let featuredPostImage = featuredImage.name;
    let postTages = '"scene", "fun", "time"';
  
    // TODO: Don't change date on update
    let pageHead = `---\r\ndate: ${getTodaysDate()} \r\ndescription: "${postDescription}"\r\nfeatured_image: "${featuredPostImage}"\r\ntags: [${postTages}]\r\ntitle: "${pageTitle}"\r\ndraft: ${buildTypeSettings.value.isDraft}\r\n_build:\r\n  render: ${buildTypeSettings.value.render}\r\n  list: ${buildTypeSettings.value.render}\r\n---\r\n`;
  
    // Save as Json
    let jsonData = JSON.stringify(blocks/*['_rawValue']*/, null, 4);
    await steadyAPI.saveToFile(
      '{"data": ' + jsonData + ', "metadata": { "featuredImagePath": "' + featuredImage.path + '", "featuredImageName": "' + featuredImage.name + '"} }',
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
  
  