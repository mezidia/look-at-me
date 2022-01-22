<template>
  <v-dialog
    width="400"
    v-model="modal"
    @click:outside="setModal(false)"
    @keydown.esc="setModal(false)"
    @keydown.enter="onSubmitClick"
  >
    <v-card>
      <v-card-text>
        <h3 class="pt-3 headline">Write down your nickname:</h3>
        <input
          class="mt-3 pa-2"
          type="text"
          name="input"
          placeholder="Type here"
          v-model="inputNickname"
        >
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <BasicButton
          text="Submit"
          :onClick="onSubmitClick"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import BasicButton from './BasicButton.vue'

const { State, Action } = namespace('user')
const { State: ModalState, Action: ModalAction } = namespace('modal');


@Component({BasicButton})
export default class AcquaintanceModal extends Vue {
  inputNickname = null;

  @Action setNickname
  @State nickname

  @ModalState modal
  @ModalAction setModal

  onSubmitClick() {
    if (!this.inputNickname) return;
    console.log(this.nickname);
    this.setNickname(this.inputNickname);
    this.setModal(false);
  }
}
</script>

<style>
  input:focus, input {
    color: whitesmoke;
    font-size: 20px;
  }
</style>