import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dlxx: {
      dlzh: '',
      dlmm: ''
    }
  },
  mutations,
  actions: {
  },
  modules: {
  },
  plugins: [
    persistedState({
      storage: window.localStorage,
      paths: ['context','dlxx']
    })
  ]
})
