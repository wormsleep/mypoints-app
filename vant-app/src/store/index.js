import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    context: {},
    lastDlzh: ''
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    persistedState({
      storage: window.localStorage,
      paths: ['context','lastDlzh']
    })
  ]
})
