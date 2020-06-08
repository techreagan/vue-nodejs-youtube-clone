import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import comments from './modules/comment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // url: process.env.VUE_APP_URL,
    // token: localStorage.getItem('token') || null,
    // user: JSON.parse(localStorage.getItem('user')) || null,
    // isUserLoggedIn: localStorage.getItem('token') || false
  },
  getters: {
    // getUrl: (state) => {
    //   return state.url
    // },
    // isAuthenticated: (state) => {
    //   return state.isUserLoggedIn
    // },
    // getToken: (state) => {
    //   return state.token
    // },
    // currentUser: (state) => {
    //   return state.user
    // }
  },
  mutations: {
    // setToken(state, token) {
    //   state.token = token
    //   if (token) {
    //     state.isUserLoggedIn = true
    //   } else {
    //     state.isUserLoggedIn = false
    //   }
    // },
    // setUser(state, user) {
    //   state.user = user
    // },
    // clearAuthData(state) {
    //   state.token = null
    //   state.user = null
    //   state.isUserLoggedIn = false
    // }
  },
  actions: {
    // setToken({ commit }, token) {
    //   commit('setToken', token)
    //   localStorage.setItem('token', token)
    // },
    // signin({ commit }, user) {
    //   commit('setUser', user)
    //   localStorage.setItem('user', JSON.stringify(user))
    // },
    // signOut({ commit }) {
    //   commit('clearAuthData')
    //   localStorage.removeItem('token')
    //   localStorage.removeItem('user')
    // }
  },
  modules: { auth, comments }
})
