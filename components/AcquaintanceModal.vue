<template>
  <v-dialog
    width="400"
    v-model="nicknameModal"
    @keydown.enter="onSubmitClick"
    persistent
    :overlay-opacity="0.95"
  >
    <v-card>
      <v-card-text>
        <h3 class="pt-3 headline">Інтродьюс юорселф, галушка:</h3>
        <input
          autocomplete="off"
          class="mt-3 pa-2"
          type="text"
          name="input"
          placeholder="Type here"
          v-model="inputNickname"
          @input="showFormError = false"
          size="30"
        >
        <p
          v-show="showFormError"
          class="form-error"
        >
          Please enter your nickname
        </p>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <BasicButton
          text="Submit"
          :onClick="onSubmitClick"
          color="#40826d"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import BasicButton from './BasicButton.vue'

const { State } = namespace('user')
const { State: RoomState } = namespace('room')
const { Mutation: NicknameModalMutation, State: NicknameModalState } = namespace('nicknameModal');


@Component({BasicButton})
export default class AcquaintanceModal extends Vue {
  inputNickname = null;
  showFormError = false;

  @State nickname
  @RoomState socketId

  @NicknameModalState nicknameModal
  @NicknameModalMutation updateNicknameModal

  onSubmitClick() {
    if (!this.inputNickname) {
      this.showFormError = true;
      return;
    }
    window.localStorage.setItem('myNickname' + this.socketId, this.inputNickname);
    this.$emit('userCreated');
    this.updateNicknameModal(false);
  }

  mounted() {
    this.showFormError = false;
  }
}
</script>

<style>
  input:focus, input {
    color: whitesmoke;
    font-size: 20px;
  }

  .form-error {
    color: red;
    position: absolute;
  }
</style>