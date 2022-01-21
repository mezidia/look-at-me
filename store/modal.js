export const state = () => ({
  modal: false
})

export const actions = {
  setModal (ctx, modal) {
    ctx.commit('updateModal', modal)
  }
}

export const mutations = {
  updateModal (state, modal) {
    state.modal = modal
  }
}

export const getters = {
  getModal (state) {
    return state.modal
  }
}
