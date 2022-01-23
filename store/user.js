export const state = () => ({
  nickname: null
})

export const actions = {
  setNickname (ctx, nickname) {
    ctx.commit('updateNickname', nickname)
  }
}

export const mutations = {
  updateNickname (state, nickname) {
    state.nickname = nickname
  }
}
