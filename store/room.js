import { Vue } from 'nuxt-property-decorator'

export const state = () => ({
  users: {},
  roomId: null
})

export const mutations = {
  addUser (state, peerId, stream) {
    Vue.set(state.users, peerId, { peerId, stream, name: peerId, cameraOn: false, micOn: false })
  },
  setRoomId (state, roomId) {
    state.roomId = roomId
  },
  deleteUser (state, peerId) {
    Vue.delete(state.users, peerId)
  },
  updateDevicesStatus (state, { peerId, devices }) {
    Vue.set(state.users[peerId], 'cameraOn', devices.cameraOn)
    Vue.set(state.users[peerId], 'micOn', devices.micOn)
  }
}
