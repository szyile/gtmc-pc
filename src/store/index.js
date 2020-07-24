import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
 
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
      power:[]
  },
  
  mutations: {
    setPower(state,all) {
      state.power = all;
    }
  },
  actions: {
    setPowerFun(context,info) {
      context.commit("setPower",info)
    }
  },
  plugins: [persistedState()]
})

export default store;