import axios from 'axios';

import {proxyGroup, storeGroup} from "@/store/modules/auth";

export default {
    getPort(api) {
        return axios.get(api + '/apiPort')
    },
    observe(api) {
        return axios.post(api + `/group/observe/` + proxyGroup, {
            nodes: [
                "274ff78de475041fb378ab370c8a87f9a226af4046ae6f152a40633e18c6e653",
                "d90bff7d41323a654ccc777086f4bbf4e0ace467b019a306994ad253bacd6289"
            ],
            "keep-connected-peers": 2
        })
    },
    observeStorage(api) {
        return axios.post(api + `/group/observe/` + storeGroup, {
            nodes: [
                "46ab9afede0c7726f8801f978cfcdfa1aea15da66340755aca71298576fb2e67",
                "2f7b94de16e019ba8f24410879ecd410b0e1d1c2019d5efd350ee2a1b3264cf8",
                "cdb1e5370c2ede8448733cb683ad0fe12e2aaf998e643f720e386b54900681ec",
                "3f048aefe37886a6f0b24d547dd80449accb8b99e690e55b9d83272b3eeab8b1",
            ],
            "keep-connected-peers": 4
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

