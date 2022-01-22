export const state = () => ({
  users: [],
  roomId: null
})

export const mutations = {
  addUser (state, peerId, stream) {
    const ans = state.users.reduce((prev, user) => prev || (peerId === user.peerId), false)
    if (!ans) {
      state.users.push({ peerId, stream, name: peerId, cameraOn: true, micOn: true })
    }
  },
  setRoomId (state, roomId) {
    state.roomId = roomId
  }
}
