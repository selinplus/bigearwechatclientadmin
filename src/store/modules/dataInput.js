const state = {
  dataInput: {
    // moduleInfo: {},
    // carousels: []
  }
}

const getters = {
  dataInput: state => state.dataInput
}

const actions = {
  editModuleInfo({ commit }, editedItem) {
    commit('editModuleInfo', editedItem);
  },
  clear({ commit } ) {
    commit('clear');
  }
}

const mutations = {
  editModuleInfo(state, editedItem) {
    state.dataInput.moduleInfo = editedItem;
  },
  clear(state) {
    state.dataInput = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}