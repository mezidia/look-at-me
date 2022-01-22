import { Vue } from 'nuxt-property-decorator'

export const state = () => ({
  users: {},
  roomId: null
})

export const mutations = {
  addUser (state, peerId, stream) {
    Vue.set(state.users, peerId, { peerId, stream, name: peerId, cameraOn: true, micOn: true })
    // stream.getVideoTracks()[0].onmute = () => console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
  },
  setRoomId (state, roomId) {
    state.roomId = roomId
  },
  deleteUser (state, peerId) {
    Vue.delete(state.users, peerId)
  }
}
