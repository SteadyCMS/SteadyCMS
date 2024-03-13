//  import { SteadyAPI } from '../utils/api/platform.js'
// const steadyAPI = SteadyAPI();

export default class DesktopApi {

  /**
   * Openings giving URL in the defult browser, in a new tab
   * @param {String} websiteAdress - The url to be opened
   */
    openInNewBrowserTab(websiteAdress) {
          window.electronAPI.openInBrowser(websiteAdress);
    }

   /** 
   * Writes given String to given file. Will overwrite all existing content in file!
   * @param {String} content - The string to be written to file
   * @param {String} filePath - The path to the directory where the file is
   * @param {String} fileName - The name of the file to be written to
   */ 
    async saveToFile(content, filePath, fileName) { 
        return await window.electronAPI.writeToFile(content, filePath, fileName);
    }

  /** 
   * Reads the full contents of a file 
   * @param {String} path - The full path to the file
   * @returns {Object} "{ success: BOOLEAN, data: STRING }" 
   * BOOLEAN: If it was success or not
   * STRING: The full contents of file or the error message
   */ 
    async readFile(path) {
        const exists = await window.electronAPI.doesFileExist(path);
        if(exists){
            const rawData = await window.electronAPI.readFile(path);
            return { success: true, data: rawData };
        }else{
            return { success: false, data: `${path} File does not exist.`};
        }
    }

   /** 
   * Writes given String to given file in app directory. Overwrites all existing content!
   * @param {String} content - The string to be written to file
   * @param {String} path - The path to the directory where the file is starting from the app's directory
   * @param {String} fileName - The name of the file to be written to
   */ 
    async saveToFileToPrivate(content, path, fileName) { 
        return await window.electronAPI.writeToFileInAppDir(content, path, fileName);
    }

   /** 
   * Reads the full contents of a file in the app directory
   * @param {String} path - The path to the file in the app directory
   * @returns {String} The full contents of the file
   */ 
    async readFileInPrivate(path) {
        const exists = await window.electronAPI.doesFileExistInAppDir(path);
        if(exists){
            const rawData = await window.electronAPI.readFileInAppDir(path);
            return { success: true, data: rawData };
        }else{
            return { success: false, data: path + "File does not exists."};
        }
    }

   /**
   * Downloads a file from a given URL to the users storage (Path is scoped to the 'SteadyCMS' directory)
   * See docs for more info ("decompress" library)
   * @param {String} url - The URL of the file that is to be downloaded
   * @param {Object} directory - The full path to the directory the file is to downloaded to (Scoped to '/documents/SteadyCMS/').
   * @returns Unknown (To be added)
   */
    async downloadFile(url, directory) { 
        const data = await window.electronAPI.downloadFile(url, directory);
        return data;
    }

   /**
   * Extract a zip file to given directory
   * @param {String} source - Full path to the zip file to be extracted
   * @param {String} target - Full path to the directory the file is to be extracted to
   * @returns true if successfull, otherwise false
   */
    async extractZipFile(source, target) { 
        const data = await window.electronAPI.extractFile(source, target);
        return data;
    }

   /**
   * Deletes given file at given path  (Path is scoped to the'/documents/SteadyCMS/' directory by defult)
   * @param {String} path - Path to file to be deleted. (Scoped to '/documents/SteadyCMS/' unless scoped is false).
   * @param {Boolean} scoped - If the path should be scoped to '/documents/SteadyCMS/'
   */
    async deleteFile(path, scoped) { 
        await window.electronAPI.deleteFile(path, scoped);
    }

   /**
   * Deletes a file from the app directory
   * @param {String} path - Path to file to be deleted. (Path is scoped to the 'SteadyCMS' directory)
   */
    async deleteFileInPrivate(path) { 
        await window.electronAPI.deleteFileInAppDir(path);
    }

   /**
   * Deletes given file directory at given path (Path is scoped to the'/documents/SteadyCMS/') 
   * @param {String} path - Path to the directory to be deleted. (Scoped to '/documents/SteadyCMS/').
   * @warning Use with care!
   */
    async deleteFileDirectory(path) { 
        await window.electronAPI.deleteDir(path);
    }

   /**
   * Check if file exist at given path
   * @param {String} path - The full path to file
   */
    async doesFileExist(path) {
        const data = await window.electronAPI.doesFileExist(path);
        return data;
    }

   /**
   * Check if file exist at given path in app directory
   * @param {String} path - Path to file starting from the app directory
   */
    async doesFileExistInPrivate(path) {
        const data = await window.electronAPI.doesFileExistInAppDir(path);
        return data;
    }

   /**
   * Request the path to given place
   * @param {String} place - The requested place
   * Availble places: 
   * "documents": Directory for a user's "My Documents" ("/documents/").
   * "appdir": Apps directory 
   * "home": User's home directory.
   * "temp": Temporary directory.
   * "userdata": The directory for storing your app's configuration files, which by default is the appData directory appended with your app's name. By convention files storing user data should be written to this directory, and it is not recommended to write large files here because some environments may backup this directory to cloud storage.
   * "desktop": The current user's Desktop directory.
   * "downloads": Directory for a user's downloads.
   * "music": Directory for a user's music.
   * "pictures": Directory for a user's pictures.
   * "videos": Directory for a user's videos.
   * "SteadyCMS": To Steady CMS's main directory ("/documents/SteadyCMS/").
   */
    async getPathTo(place) {
        const path = await window.electronAPI.getPathTo(place);
        return path;
    }
   /**
   * Copy a file from one given directory to another given directory
   *  @param {String} source - Full path to the file to be copied
   *  @param {String} destination - Full path to the directory the file will be copied to
   * @returns {Boolean} true if successfull, otherwise false
   */
    async uploadFile(source, destination) {
        const success = await window.electronAPI.copyFile(source, destination);
        return success;
    }

   /**
   * Gets a list of directories in given directory
   * @param {String} rootDir - The full path to the directory to be searched
   * @returns {Array} List of directory
   */
    getDirsIn(rootDir) {
        const dirs =  window.electronAPI.getDirsIn(rootDir);
        return dirs;
    }

   /**
   * Gets a list of files in given directory by file type
   * @param {String} directory - The full path to the directory to be searched for files
   * @param {String} fileType - The type of file to be searched for (i.e ".png", ".txt", ".markdown")
   * @returns {Array} List of files
   */
    getListOfFilesIn(directory, fileType) {
        const files =  window.electronAPI.getFilesIn(directory, fileType);
        return files;
    }

    /**
     * Start a Hugo server to perview a Hugo website in the browser
     * @param {Number} port - The port to be opened in localhost
     * @param {String} pathToWebsite - The full path to the directory of the website
     */
    startServer(port, pathToWebsite) {
        window.electronAPI.runHugo(['server', '--source', pathToWebsite, '-b', 'http://localhost/', '--port', port]);
    }

    // /**
    //  * Create a new Hugo site
    //  * @param {String} pathToWebsite - The full path to the directory of the website
    //  */
    // async createNewSite(pathToWebsite) {
    //     await window.electronAPI.runHugo(['new', 'site', pathToWebsite]);
    // }

    /**
     * Create a new Hugo site
     * @param {String} pathToWebsite - The full path to the directory of the website
     */
    async createNewSite(pathToWebsite) {
        await window.electronAPI.runHugo(['new', 'site', pathToWebsite]);
    }

    /**
     * Build a Hugo website into HTML
     * @param {String} pathToWebsite - The full path to the directory of the website
     */
    async buildNewSite(pathToWebsite) {
        await window.electronAPI.runHugo(['--source', pathToWebsite]);
    }


};
