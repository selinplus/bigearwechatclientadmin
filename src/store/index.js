import Vue from 'vue'
import Vuex from 'vuex'

import dataInput from './modules/dataInput'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    dataInput
  }
})

export default store
