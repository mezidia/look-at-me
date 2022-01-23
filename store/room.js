import { Vue } from 'nuxt-property-decorator'

export const state = () => ({
  users: {},
  roomId: null,
  peerId: null
})

export const mutations = {
  addUser (state, { peerId, stream }) {
    Vue.set(state.users, peerId, { peerId, stream, cameraOn: false, micOn: false, name: 'User', isAdmin: false })
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
  },
  updateNameStatus (state, { clientId, nickName, isAdmin }) {
    Vue.set(state.users[clientId], 'name', nickName)
    Vue.set(state.users[clientId], 'isAdmin', isAdmin)
  }
}
