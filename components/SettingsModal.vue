<template>
  <v-dialog
    v-model="settingsModal"
    width="400px"
    @click:outside="updateSettingsModal(false)"
    @keydown.esc="updateSettingsModal(false)"
    @keydown.enter="onConfirm"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">User Profile</span>
      </v-card-title>
      <v-card-text>
        <h3>Nickname:</h3>
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
      <v-card-actions
        class="d-flex justify-space-between"
      >
        <v-btn
          @click="updateSettingsModal(false)"
        >
          Cancel
        </v-btn>
        <v-btn
          @click="onConfirm"
          color="#40826d"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Component, Vue, namespace, Prop } from 'nuxt-property-decorator'
import BasicButton from './BasicButton.vue'

const { State, Mutation } = namespace('settingsModal')
const { State: RoomState } = namespace('room')

@Component({BasicButton})
export default class AcquaintanceModal extends Vue {

  @State settingsModal
  @RoomState socketId
  @Mutation updateSettingsModal

  showFormError = false;
  inputNickname = '';

  onConfirm() {
    if (!this.inputNickname) {
      this.showFormError = true;
      return;
    }
    window.localStorage.setItem('myNickname' + this.socketId, this.inputNickname);
    this.$emit('nicknameUpdated');
    this.updateSettingsModal(false);
  }

}
</script>

<style>
.form-error {
  color: red;
}
</style>
