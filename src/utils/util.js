
export const isElectron =
    window.navigator.userAgent.toLowerCase().indexOf('electron') !== -1;

export const ipc = ()=>{
    if(isElectron){
        return window.require('electron').ipcRenderer;
    }
    return null;
}
