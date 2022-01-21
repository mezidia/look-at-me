<template>
  <div id="room-holder">
    <v-row
    v-if="pageLoading"
    justify="center">
      <v-progress-circular
      :width="3"
      color="red"
      indeterminate />
    </v-row>
    
    <div :style="{'visibility': pageLoading ? 'hidden' : 'visible'}">
      
      <v-row justify="start" align="start">
        <v-row id="users-panel" class="fill-height" justify="center">
          <UserBlock name="You" :cameraOn="showVideo" :pageLoading="pageLoading" :image="image" :micClicked="micOn" :width="width" :height="height"/>
          <UserBlock v-for="(user, index) in users" :key="index" :name="user.name" :pageLoading="pageLoading" :image="image" :micClicked="user.mic" :width="width" :height="height"/>
        </v-row>
      </v-row>
      <v-row class="play-icon-row">
        <OnOffIcon class="mx-3" big iconName="mdi-video" :onClick="cameraClick" :clicked="showVideo"/>
        <OnOffIcon class="mx-3" big iconName="mdi-microphone" :onClick="micClick" :clicked="micOn"/>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon 
            class="link-to-copy mx-3"
            x-large 
            @click="copyLink"
            v-bind="attrs"
            v-on="on">mdi-link</v-icon>
          </template>
          <span id="copy-link-tooltip">Copy Link</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <BasicButton class="mx-3" text="Leave Room" :onClick="leaveRoom" color="error"/>
      </v-row>
    </div>
    
  </div>
</template>

<script>
import { Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import UserBlock from '../../components/UserBlock.vue'
import OnOffIcon from '../../components/OnOffIcon.vue'
import BasicButton from '../../components/BasicButton.vue'
import { io } from 'socket.io-client'
import { inputEvents } from '../../helpers/inputEvents'
import EVENTS from '../../helpers/events'
import { v4 as uuidv4 } from 'uuid';

@Component({
  components: {UserBlock, OnOffIcon, BasicButton}
})

export default class RoomPage extends Vue {
  image="https://picsum.photos/200/150?blur";
  users = [{name: '1', mic: false}, {name: '2', mic: true}]; //, {name: '3', mic: false}, {name: '4', mic: true}, {name: '5', mic: false}, {name:'6', mic: true}, {name: '7', mic: false}]
  cameraOn = false;
  showVideo = false;
  micOn = false;
  width = 200;
  height = 150;
  stream = null;
  pageLoading = true;

  socket = null;
  peers = {};
  clients = [];

  async mounted() {
    this.socket = io('http://localhost:8000/');
    this.socket.on(EVENTS.ADD_PEER, (data) => {
      const { peerId, createOffer } = data;

      console.log(peerId, createOffer);
    });

    //const roomId = uuidv4();
    const roomId = 1;
    for (const eventName in inputEvents) {
      console.log(this);
      this.socket.on(eventName, inputEvents[eventName].bind(this));
    }

    const video = document.getElementById('videoYou');
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      video.srcObject = stream;
      this.stream = stream;
      document.getElementById('videoYou').srcObject = stream;
      this.captureMedia();
      this.socket.emit(EVENTS.JOIN, { roomId });
    })
    .catch(err => console.log('An error occurred: ' + err));
    this.pageLoading = false;
  }

  cameraClick() {
    this.cameraOn = !this.cameraOn;
    this.captureMedia();
    this.showVideo = !this.showVideo;
  }

  micClick() {
    this.micOn = !this.micOn;
    this.captureMedia();
  }

  captureMedia() {
    if (this.cameraOn) this.stream.getVideoTracks()[0].enabled = true;
    else this.stream.getVideoTracks()[0].enabled = false;

    if (this.micOn) this.stream.getAudioTracks()[0].enabled = true;
    else this.stream.getAudioTracks()[0].enabled = false;
  }

  copyLink() {
    window.navigator.clipboard.writeText(window.location.href);
    const copyLinkTooltip = document.getElementById('copy-link-tooltip');
    copyLinkTooltip.innerText = 'Copied!';
    setTimeout(() => copyLinkTooltip.innerText = 'Copy Link', 2000);
  }

  leaveRoom() {
    const audioTracks = this.stream.getAudioTracks();
    const videoTracks = this.stream.getVideoTracks();
    audioTracks.forEach(track => track.stop());
    videoTracks.forEach(track => track.stop());
    // leave room
  }
}
</script>

<style>
.play-icon-row {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 100%;
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 0;
  display: flex;
  justify-content:left;
}

div#room-holder {
  padding: 80px;
}

.link-to-copy {
  cursor: pointer;
}

.v-icon.v-icon::after {
  height: 0%;
}
</style>