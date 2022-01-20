<template>
  <v-container>
    <v-row justify="start" align="start">
      <v-container id="users-panel" class="fill-height">
      <UserBlock/>
      </v-container>
    </v-row>
    <v-row class="play-icon-row">
      <v-icon @click="cameraClick">mdi-video</v-icon>
      <v-icon>mdi-microphone</v-icon>
    </v-row>
  </v-container>
</template>

<script>
import { Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import UserBlock from '../../components/UserBlock.vue'

@Component({
  components: {UserBlock}
})

export default class RoomPage extends Vue {
  cameraOn = false;
  streamOptions = { video: true, audio: true };

  cameraClick() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia(this.streamOptions)
    .then(stream => {
      video.srcObject = stream;
      if (!this.cameraOn) video.play();
      else video.pause();
      this.cameraOn = !this.cameraOn;
    })
    .catch(err => console.log('An error occurred: ' + err));
  }
}
</script>