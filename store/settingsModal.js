export const state = () => ({
  settingsModal: false
})

export const mutations = {
  updateSettingsModal (state, settingsModal) {
    state.settingsModal = settingsModal
  }
}
