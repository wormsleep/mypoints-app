import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as CommonUtil from './assets/script/yifantiger-common-util'

Vue.config.productionTip = false

Vue.prototype.$util = CommonUtil
Vue.prototype.$http = CommonUtil.$http
Vue.prototype.$post = CommonUtil.$post

const initVue = () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

const onDeviceready = () => {
  // console.log("触发 deviceready 事件")

  initVue()

  setTimeout(function () {
    try {
      navigator.splashscreen.hide()
    } catch (e) {
    }
  }, 2000)


}

/* deviceready */
if (process.env.NODE_ENV === 'production') {
  // console.log("启动deviceready监听")
  document.addEventListener('deviceready', onDeviceready, false)
} else {
  initVue()
}
