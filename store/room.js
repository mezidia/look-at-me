import { Vue } from 'nuxt-property-decorator'

export const state = () => ({
  users: {},
  roomId: null,
  peerId: null
})

export const mutations = {
  addUser (state, { peerId, stream }) {
    if (!state.users[peerId]) {
      Vue.set(state.users, peerId, { peerId, stream, cameraOn: false, micOn: false, name: 'названий пельмень', isAdmin: false })
    } else {
      Vue.set(state.users[peerId], 'peerId', peerId)
      Vue.set(state.users[peerId], 'stream', stream)
    }
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
    if (!state.users[clientId]) {
      Vue.set(state.users, clientId, { peerId: clientId, stream: null, cameraOn: false, micOn: false, name: nickName, isAdmin })
    } else {
      Vue.set(state.users[clientId], 'name', nickName || 'неназваний пельмень')
      Vue.set(state.users[clientId], 'isAdmin', isAdmin)
    }
  }
}
