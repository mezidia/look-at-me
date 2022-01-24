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
          text="Our Emotions"
          :onClick="onOurEmotionsClick"/>
        </v-row>
        
      </v-col>
      
    </v-row>
  </v-container>
</template>

<script>
import { Vue, namespace } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import BasicButton from '../components/BasicButton.vue'
import AcquaintanceModal from '../components/AcquaintanceModal.vue'
import { v4 as uuidv4 } from 'uuid'


const { Action, State } = namespace('modal');
const { State: UserState } = namespace('user');
const { Mutation: AddRoomMutation, State: AddRoomClickState } = namespace('addRoomClick');
const { Mutation: RoomMutation } = namespace('room');

@Component({
  components: {BasicButton, AcquaintanceModal}
})
export default class IndexPage extends Vue {
  @Action setModal
  @State modal

  @UserState nickname

  @AddRoomMutation updateClicked
  @AddRoomMutation updateGeneratedRoomId

  @RoomMutation setRoomId

  mounted() {
    this.updateClicked(false);
  }

  onCreateRoomClick() {
    const roomId = uuidv4();
    this.setRoomId(roomId);
    this.updateClicked(true);
    this.updateGeneratedRoomId(roomId);
    this.$router.replace({ path: '/room/' + roomId });
  }

  onOurEmotionsClick() {
    window.location.href = 'https://www.meme-arsenal.com/memes/575ce4e347f08e123aaac0a212ca749c.jpg'
  }
}
</script>

<style scoped>
</style>