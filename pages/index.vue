<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col 
      align-self="center"
      justify="center"
      cols=2>
        <v-row justify="center">
          <BasicButton
          text="Create Room"
          :onClick="onCreateRoomClick"/> 
        </v-row>
        <v-row justify="center">
          <BasicButton 
          text="Find Room"
          :onClick="onFindRoomClick"/>
        </v-row>
        
      </v-col>
      
    </v-row>
    <AcquaintanceModal />
  </v-container>
</template>

<script>
import { Vue, namespace } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import BasicButton from '../components/BasicButton.vue'
import AcquaintanceModal from '../components/AcquaintanceModal.vue'


const { Action, State } = namespace('modal');
const { State: UserState } = namespace('user');

@Component({
  components: {BasicButton, AcquaintanceModal}
})
export default class IndexPage extends Vue {
  @Action setModal
  @State modal

  @UserState nickname

  onCreateRoomClick() {
    this.setModal(true);
    console.log('createRoom');
  }

  onFindRoomClick() {
    console.log('findRoom');
  }

}
</script>

<style scoped>
</style>