import Vue from 'vue'
import Vuex from 'vuex'
import CommentService from '@/services/CommentService'

Vue.use(Vuex)

export default {
  state: {
    comments: []
  },
  getters: {
    getComments: (state) => {
      return state.comments
    }
  },
  mutations: {
    setComments(state, comments) {
      state.comments = comments
    },
    addComment(state, comment) {
      state.comments.data.unshift(comment)
    }
  },
  actions: {
    setComments({ commit }, videoId) {
      return new Promise((resolve, reject) => {
        CommentService.getCommentByVideoId(videoId)
          .then((comments) => {
            commit('setComments', comments.data)
            resolve(comments)
          })
          .catch((err) => reject(err))
      })
    },
    addComment({ commit }, comment) {
      commit('addComment', comment)
    }
  }
}
