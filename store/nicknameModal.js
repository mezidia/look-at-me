export const state = () => ({
  nicknameModal: false
})

export const mutations = {
  updateNicknameModal (state, nicknameModal) {
    state.nicknameModal = nicknameModal
  }
}
