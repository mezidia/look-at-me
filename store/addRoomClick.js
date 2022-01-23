export const state = () => ({
  clicked: false,
  generatedRoomId: null
})

export const mutations = {
  updateClicked (state, clicked) {
    state.clicked = clicked
  },

  updateGeneratedRoomId (state, generatedRoomId) {
    state.generatedRoomId = generatedRoomId
  }
}
