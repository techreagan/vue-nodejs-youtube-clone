import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {
        isMobile:!!(!/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i.test(window.navigator.userAgent) && /Chrome/img.test(window.navigator.userAgent)),
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
