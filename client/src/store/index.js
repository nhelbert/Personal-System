import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sObjuserInfo: {},
    sBlnDrawer: true,
    sIntDrawerNav: 1,
    sStrSubNav: "",
  },
  mutations: {
    CHANGE_sObjuserInfo: (state, data) => {
      state.sObjuserInfo = data
    },
    CHANGE_sBlnDrawer: (state, data) => {
      state.sBlnDrawer = data
    },
    CHANGE_sIntDrawerNav: (state, data) => {
      state.sIntDrawerNav = data
    },
    CHANGE_sStrSubNav: (state, data) => {
      state.sStrSubNav = data
    },
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})

