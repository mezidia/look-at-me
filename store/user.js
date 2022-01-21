export const state = () => ({
  nickname: null
})

export const actions = {
  setNickname (ctx, nickname) {
    console.log(arguments)
    ctx.commit('updateNickname', nickname)
    console.log(nickname)
  }
}

export const mutations = {
  updateNickname (state, nickname) {
    state.nickname = nickname
  }
}
