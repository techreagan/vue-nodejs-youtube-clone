import AuthenticationService from '@/services/AuthenticationService'


export const group = "/group/http/web3youtube/web3.com";
const state = {
    api: "",
    url: "",
    imgUrl: "",
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isUserLoggedIn: localStorage.getItem('token') || false
}

const getters = {
    getApi: () => {
        return state.api || sessionStorage.getItem("api");
    },
    getUrl: () => {
        return state.url || sessionStorage.getItem("api") + group + "/api/v1";
    },
    getImgUrl: () => {
        return state.imgUrl || sessionStorage.getItem("api") + group
    },
    isAuthenticated: (state) => {
        return state.isUserLoggedIn
    },
    getToken: (state) => {
        return state.token
    },
    currentUser: (state) => {
        return state.user
    }
}

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token
        if (token) {
            state.isUserLoggedIn = true
        } else {
            state.isUserLoggedIn = false
        }
    },
    SET_USER_DATA(state, data) {
        state.user = data
    },
    CLEAR_AUTH(state) {
        state.token = null
        state.user = null
        state.isUserLoggedIn = false
    },
    SET_URL(state, api) {
        state.api = api;
        state.url = api + group + "/api/v1";
        state.imgUrl = api + group;
    }
}

const actions = {
    signUp({commit}, credentials) {
        return new Promise((resolve, reject) => {
            AuthenticationService.signUp(credentials)
                .then(({data}) => {
                    commit('SET_TOKEN', data.token)
                    localStorage.setItem('token', data.token)
                    resolve(data)
                })
                .catch((err) => reject(err))
        })
    },
    signIn({commit}, credentials) {
        return new Promise((resolve, reject) => {
            AuthenticationService.signIn(credentials)
                .then(({data}) => {
                    localStorage.setItem('token', data.token)
                    commit('SET_TOKEN', data.token)

                    resolve(data)
                })
                .catch((err) => reject(err))
        })
    },
    getCurrentUser({commit}, token) {
        return new Promise((resolve, reject) => {
            AuthenticationService.me(token)
                .then(({data}) => {
                    localStorage.setItem('user', JSON.stringify(data.data))
                    commit('SET_USER_DATA', data.data)
                    resolve(data)
                })
                .catch((err) => reject(err))
        })
    },
    signOut({commit}) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        commit('CLEAR_AUTH')
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
