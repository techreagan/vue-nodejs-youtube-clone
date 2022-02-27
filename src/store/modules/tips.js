import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {
        list: [],
    },
    getters: {
        getList: (state) => {
            return state.list;
        }
    },
    mutations: {
        push(state, payload) {
            state.list.push(payload);
        },
        shift(state) {
            state.list.shift();
        },
    },
    actions: {
        showTips({commit}, payload) {
            commit("push", payload);
            setTimeout(() => {
                commit("shift");
            }, 2000)
        }
    }
}
