<template>
  <v-dialog
    width="400"
    v-model="modal"
  >
    <v-card>
      <v-card-text>
        <h3 class="pt-3 headline">Write down your nickname:</h3>
        <input
          class="mt-3 pa-2"
          type="text"
          name="input"
          placeholder="Type here"
          size="40"
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
import { BasicButton } from './BasicButton.vue'

const { State, Action } = namespace('user')

@Component({BasicButton})
export default class AcquaintanceModal extends Vue {
  modal = true;
  inputNickname = null;

  @Action setNickname
  @State nickname

  onSubmitClick() {
    if (!this.inputNickname) return;
    this.setNickname(this.inputNickname);
    this.modal = false;
  }
}
</script>

<style>
</style>