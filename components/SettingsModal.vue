<template>
  <v-dialog
    v-model="settingsModal"
    width="400px"
    @click:outside="updateSettingsModal(false)"
    @keydown.esc="updateSettingsModal(false)"
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
        >
        <p
          v-if="showFormError"
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
          Cansel
        </v-btn>
        <v-btn
          @click="onConfirm"
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

@Component({BasicButton})
export default class AcquaintanceModal extends Vue {

  @State settingsModal
  @Mutation updateSettingsModal

  showFormError = false;
  inputNickname = '';

  onConfirm() {
    if (!this.inputNickname) {
      this.showFormError = true;
      return;
    }
    window.localStorage.setItem('myNickname', this.inputNickname);
    this.$emit('nicknameUpdated');
    this.updateSettingsModal(false);
    
    console.log('Nick from storage:', window.localStorage.getItem('myNickname'));
  }

}
</script>

<style>
.form-error {
  color: red;
}
</style>
