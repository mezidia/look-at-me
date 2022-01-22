<template>
  <v-dialog
    width="400"
    v-model="modal"
    @keydown.enter="onSubmitClick"
    persistent
  >
    <v-card>
      <v-card-text>
        <h3 class="pt-3 headline">Write down your nickname:</h3>
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
  showFormError = false;

  @Action setNickname
  @State nickname

  @ModalState modal
  @ModalAction setModal

  onSubmitClick() {
    if (!this.inputNickname) {
      this.showFormError = true;
      return;
    }
    console.log(this.nickname);
    this.setNickname(this.inputNickname);
    this.setModal(false);
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