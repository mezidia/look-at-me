import { Vue } from 'nuxt-property-decorator'

export const state = () => ({
  users: {},
  roomId: null,
  peerId: null
})

export const mutations = {
  addUser (state, { peerId, stream }) {
    if (!Object.keys(state.users).includes(peerId)) {
      Vue.set(state.users, peerId, { peerId, stream, cameraOn: false, micOn: false, name: peerId, isAdmin: false })
    } else {
      Vue.set(state.users[peerId], 'stream', stream)
      Vue.set(state.users[peerId], 'peerId', peerId)
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
    console.log('id', this.socket.id)
    if (!Object.keys(state.users).includes(clientId)) {
      Vue.set(state.users, clientId, { name: nickName, isAdmin, peerId: clientId, stream: null, cameraOn: false, micOn: false })
    } else {
      Vue.set(state.users[clientId], 'name', nickName)
      Vue.set(state.users[clientId], 'isAdmin', isAdmin)
    }
  },
  setPeerId (state, peerId) {
    this.peerId = peerId
  }
}
