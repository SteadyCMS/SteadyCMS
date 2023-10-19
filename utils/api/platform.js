
    import DesktopApi from "./desktopapi.js";
    import WebApi from "./webapi.js";

    export function SteadyAPI(){
        var isElectron = false;
        let steadyCmsApi;
        if (typeof 'process' !== 'undefined') {
            isElectron = true;
        }

        if (isElectron) {
            steadyCmsApi = new DesktopApi();
        } else {
            steadyCmsApi = new WebApi(); 
        }

        return steadyCmsApi;  
    }











