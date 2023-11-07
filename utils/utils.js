
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
  
