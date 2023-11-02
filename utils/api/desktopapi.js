//  import { SteadyAPI } from '../utils/api/platform.js'
// const steadyAPI = SteadyAPI();

export default class DesktopApi {

    previewInNewBrowserTab(websiteAdress) {
          window.electronAPI.openInBrowser(websiteAdress);
    }

    async saveToFile(content, path, fileName) { 
        return await window.electronAPI.writeToFile(content, path, fileName);
    }

    async readFile(path) {
        const exists = await window.electronAPI.doesFileExist(path);
        if(exists){
            const rawData = await window.electronAPI.readFile(path);
            return { success: true, data: rawData };
        }else{
            return { success: false, data: path + " File does not exists."};
        }
    }

    async saveToFileToPrivate(content, path, fileName) { 
        return await window.electronAPI.writeToFileInAppDir(content, path, fileName);
    }

    async readFileInPrivate(path) {
        const exists = await window.electronAPI.doesFileExistInAppDir(path);
        if(exists){
            const rawData = await window.electronAPI.readFileInAppDir(path);
            return { success: true, data: rawData };
        }else{
            return { success: false, data: path + "File does not exists."};
        }
    }

    async downloadFile(url, directory) { //?
        const data = await window.electronAPI.downloadFile(url, directory);
        return data;
    }

    async extractZipFile(source, target) { //?
        const data = await window.electronAPI.extractFile(source, target);
        return data;
    }

    async deleteFile(path, scoped) { 
        await window.electronAPI.deleteFile(path, scoped);
    }

    async deleteFileInPrivate(path) { 
        await window.electronAPI.deleteFileInAppDir(path);
    }

    async deleteFileDirectory(path) { 
        await window.electronAPI.deleteDir(path);
    }

    async doesFileExist(path) {
        const data = await window.electronAPI.doesFileExist(path);
        return data;
    }

    async doesFileExistInPrivate(path) {
        const data = await window.electronAPI.doesFileExistInAppDir(path);
        return data;
    }

    async getPathTo(place) {
        const path = await window.electronAPI.getPathTo(place);
        return path;
    }

    getDirsIn(rootDir) {
        const dirs =  window.electronAPI.getDirsIn(rootDir);
        return dirs;
    }

    getListOfFilesIn(dir, fileType) {
        const files =  window.electronAPI.getFilesIn(dir, fileType);
        return files;
    }

    startServer(port, pathToWebsite) {
        window.electronAPI.runHugo(['server', '--source', pathToWebsite, '-b', 'http://localhost/', '--port', port]);
    }

    async createNewSite(pathToWebsite) {
        await window.electronAPI.runHugo(['new', 'site', pathToWebsite]);
    }

    async buildNewSite(pathToWebsite) {
        await window.electronAPI.runHugo(['--source', pathToWebsite]);
    }



    };
