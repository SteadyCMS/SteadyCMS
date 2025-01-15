import { createToast } from 'mosha-vue-toastify';


export function titleToFileName(postTitle) {
    return postTitle.trim().replaceAll(" ", "_").replace(/[`_!@#$%^&*()+.=\[\]{};':"/|,<>\/?~]/g, "_").toLowerCase();
  } 

  export function fileNameToTitle(fileName) {
    const rawName = fileName[0].toUpperCase() + fileName.slice(1);
    return rawName.replaceAll('_', ' ').replaceAll('-', ' ');
  } 

  export function siteToFolderName(name) {
    return name.trim().replaceAll(" ", "_").replace(/[`_!@#$%^&*()+.=\[\]{};':"/|,<>\/?~]/g, "_").toLowerCase();
  }

  export function getTodaysDate() {
    Date.prototype.yyyymmdd = function() {
      let mm = this.getMonth() + 1; // getMonth() is zero-based
      let dd = this.getDate();
      return [this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
            ].join('-');
    };
    Date.prototype.hhmmss = function() {
      let hh = this.getHours();
      let mm = this.getMinutes();
      let ss = this.getSeconds();
      return [(hh>9 ? '' : '0') + hh,
              (mm>9 ? '' : '0') + mm,
              (ss>9 ? '' : '0') + ss
            ].join(':');
    };
    let date = new Date();
    return date.yyyymmdd() + "T" + date.hhmmss();
  }
  
  export function encodePath(path) {
    return encodeURIComponent(path)
         // .replace(/ /g, '%20')
          .replace(/[)]/g, '%29')
          .replace(/[(]/g, '%28')
          .replace(/'/g, '%27')
          .replace(/!/g, '%21')
          .replace(/~/g, '%7E');
  }
  
  export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
  }
  //function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

  export function formateDate(date) {
    return new Date(date).toLocaleDateString("en-US");
  }

  // Join file paths
  export function join(...input) {      
    let paths = input
      .filter((path) => !!path) // Remove undefined | null | empty
      .join("/") //Join to string
      .replaceAll("\\", "/") // Replace from \ to /
      .split("/") 
      .filter((path) => !!path && path !== ".") // Remove empty in case a//b///c or ./a ./b
      .reduce(
        (items, item) =>{
          item === ".." ? items.pop() : items.push(item);
          return items
        }, []); // Jump one levep if ../  
    if(input[0] && input[0].startsWith('/')) paths.unshift("")
    return paths.join("/") || (paths.length ? "/" : ".");
  }

  export const showWarningToast = (message) => {
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
  
  export const showSuccessToast = (message) => {
    createToast(message, {
      type: 'success',
      toastBackgroundColor: '#2eb82e',
      showCloseButton: false,
      swipeClose: true,
      transition: 'slide',
      showIcon: false,
      position: 'top-right'
    });
  }

  export function isNotEmpty(str) {
    // Check if the string is not null, undefined, and has a length greater than 0
    return str !== null && str !== undefined && str.trim().length > 0;
 }