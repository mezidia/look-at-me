<template>
  <div id="room-holder">
    <v-row justify="start" align="start">
      <v-row id="users-panel" class="fill-height">
        <UserBlock name="You" :cameraOn="cameraOn" :image="image"/>
        <UserBlock v-for="(user, index) in users" :key="index" :name="user.name" :image="image" :micClicked="user.mic"/>
      </v-row>
    </v-row>
    <v-row class="play-icon-row">
      <OnOffIcon :big="true" iconName="mdi-video" :onClick="cameraClick" :clicked="cameraOn"/>
      <OnOffIcon :big="true" iconName="mdi-microphone" :onClick="() => console.log('click')" :clicked="false"/>
    </v-row>
  </div>
</template>

<script>
import { Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import UserBlock from '../../components/UserBlock.vue'
import OnOffIcon from '../../components/OnOffIcon.vue'

@Component({
  components: {UserBlock, OnOffIcon}
})

export default class RoomPage extends Vue {
  image="https://picsum.photos/200/150?blur";
  users = [{name: '1', mic: false}, {name: '2', mic: true}, {name: '3', mic: false}, {name: '4', mic: true}, {name: '5', mic: false}, {name:'6', mic: true}, {name: '7', mic: false}]
  cameraOn = false;
  micOn = false;

  cameraClick() {
    const video = document.getElementById('videoYou');
    navigator.mediaDevices.getUserMedia({ video: true, audio: this.micOn })
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

<style scoped>
.play-icon-row {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 15%;
  padding-left: 40px;
  margin-bottom: 0;
  display: flex;
  justify-content: space-around;
}

div#room-holder {
  padding: 80px;
}
</style>