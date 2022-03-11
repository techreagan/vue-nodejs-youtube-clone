import axios from 'axios';

import {proxyGroup, storeGroup} from "@/store/modules/auth";

export const encodeUnicode = (str) => {
    let res = [];
    for (let i = 0; i < str.length; i++) {
        res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return '\\u' + res.join('\\u');
};

export default {
    getPort(api) {
        return axios.get(api + '/apiPort')
    },
    observe(api) {
        return axios.post(api + `/group/observe/` + proxyGroup, {
            nodes: ["d90bff7d41323a654ccc777086f4bbf4e0ace467b019a306994ad253bacd6289"],
            "keep-connected-peers": 3
        })
    },
    observeStorage(api) {
        return axios.post(api + `/group/observe/` + storeGroup, {
            nodes: ["3f048aefe37886a6f0b24d547dd80449accb8b99e690e55b9d83272b3eeab8b1"],
            "keep-connected-peers": 3
        })
    },
    uploadFile(url, file) {
        let fileName = file.name;
        let headers = {};
        headers['Content-Type'] = file.type || 'application/x-www-form-urlencoded';
        return axios({
            url: url + '/aurora',
            method: 'post',
            data: file,
            params: {name: fileName},
            headers,
            timeout: 0,
        });
    },
    async sendMessage(api, overlay, hash) {
        const debugApi = sessionStorage.getItem("debugApi");
        const data = await axios.get(debugApi + "/addresses");
        return axios.post(api + `/group/send/${storeGroup}/` + overlay, {
            source: data.data.overlay,
            hash,
        }, {timeout: 10 * 1000})
    },
    async sourceInfo(hash) {
        const debugApi = sessionStorage.getItem("debugApi");
        return axios.get(debugApi + "/chunk/server/" + hash);
    }
}

