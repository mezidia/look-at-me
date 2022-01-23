import { Vue } from 'nuxt-property-decorator'

export const state = () => ({
  users: {},
  roomId: null,
  peerId: null
})

export const mutations = {
  addUser (state, { peerId, stream }) {
    // if (!Object.keys(state.users).includes(peerId)) {
    // } else {
    //   Vue.set(state.users[peerId], 'stream', stream)
    //   Vue.set(state.users[peerId], 'peerId', peerId)
    // }
    Vue.set(state.users, peerId, { peerId, stream, cameraOn: false, micOn: false, name: peerId, isAdmin: false })
    console.log('users', state.users)
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
    // if (!Object.keys(state.users).includes(clientId)) {
    //   Vue.set(state.users, clientId, { name: nickName, isAdmin, peerId: clientId, stream: null, cameraOn: false, micOn: false })
    // } else {
    // }
    console.log(nickName, isAdmin)
    Vue.set(state.users[clientId], 'name', nickName)
    Vue.set(state.users[clientId], 'isAdmin', isAdmin)
  }
}
