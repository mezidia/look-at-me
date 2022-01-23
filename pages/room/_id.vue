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
          <UserBlock :id="peerId" name="You" :cameraOn="showVideo" :pageLoading="pageLoading" :image="image" :micClicked="micOn" :width="width" :height="height"/>
          <UserBlock :id="user.peerId" v-for="user in users" :key="user.peerId" :name="user.name" :pageLoading="pageLoading" :image="image" :cameraOn="user.cameraOn" :micClicked="user.micOn" :width="width" :height="height"/>
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
        <BasicButton class="mx-3" text="Data source" :onClick="switchDataSource" color="error"/>
      </v-row>
    </div>
    <AcquaintanceModal />
  </div>
</template>

<script>
import { Vue, namespace, Component } from 'nuxt-property-decorator'
import UserBlock from '../../components/UserBlock.vue'
import OnOffIcon from '../../components/OnOffIcon.vue'
import BasicButton from '../../components/BasicButton.vue'
import { inputEvents } from '../../helpers/inputEvents'
import EVENTS from '../../helpers/events'
import socketIo from '../../helpers/socketIo.js'
import dataSources from '../../helpers/dataSources'

const { State, Mutation } = namespace('room')
const { State: AddRoomState } = namespace('addRoomClick')
const { Mutation: NicknameModalMutation } = namespace('nicknameModal')

@Component({
  components: {UserBlock, OnOffIcon, BasicButton}
})

export default class RoomPage extends Vue {
  @State users;
  @Mutation addUser;
  @Mutation deleteUser;
  @Mutation updateDevicesStatus;

  @AddRoomState clicked
  @AddRoomState generatedRoomId

  @NicknameModalMutation updateNicknameModal

  image="https://picsum.photos/200/150?blur";
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
  rooms = [];
  peerId = '1';
  dcs = [];
  dataSource = 'webCamera';

  beforeCreate() {
    this.roomId = this.$route.path.split('/')[2];
  }

  setDefaultStreamSettings(stream) {
    stream.getVideoTracks().forEach(track => track.enabled = false);
    stream.getAudioTracks().forEach(track => track.enabled = false);
  }

  async mounted() {
    this.isNewRoom = (this.generatedRoomId === this.roomId) && this.clicked;
    this.socket = socketIo();
    this.updateNicknameModal(true);
    const roomId = this.roomId;
    for (const eventName in inputEvents) {
      this.socket.on(eventName, inputEvents[eventName].bind(this));
    }

    const video = document.getElementById('video1');
    this.stream = await dataSources[this.dataSource]() // opts = { video: true, audio: true } : default
      .catch(err => console.log('An error occurred: ' + err));
    this.setDefaultStreamSettings(this.stream)
    video.srcObject = this.stream;
    this.socket.emit(EVENTS.JOIN, { roomId, isNewRoom: this.isNewRoom });
    this.pageLoading = false;
  }

  cameraClick() {
    if (this.dcs.length === 0) return;
    this.cameraOn = !this.cameraOn;
    this.captureMedia();
    this.showVideo = !this.showVideo;
  }

  micClick() {
    if (this.dcs.length === 0) return;
    this.micOn = !this.micOn;
    this.captureMedia();
  }

  changeDataSource(source) {
    this.stream = source
    for (const peer of Object.values(this.peers)) {
      this.stream.getTracks().forEach(track => {
        const sender = peer.getSenders()
          .find((s) => s.track.kind == track.kind);
        sender.replaceTrack(track);
      })
    }

    document.getElementById('video1').srcObject = this.stream;
  }

  captureMedia() {
    if (this.cameraOn) this.stream.getVideoTracks()[0].enabled = true;
    else this.stream.getVideoTracks()[0].enabled = false;

    if (this.micOn && this.stream.getAudioTracks()[0]) this.stream.getAudioTracks()[0].enabled = true;
    else if (this.stream.getAudioTracks()[0]) this.stream.getAudioTracks()[0].enabled = false;
    this.dcs.forEach(dc => dc.send(JSON.stringify({ cameraOn: this.stream.getVideoTracks()[0].enabled}))) //, micOn: this.stream.getAudioTracks()[0].enabled 
  }

  async switchDataSource() {
    console.log(this.dataSource === 'webCamera' ? 'screenCast' : 'webCamera');
    this.dataSource = this.dataSource === 'webCamera' ? 'screenCast' : 'webCamera';
    await this.changeDataSource(await dataSources[this.dataSource]())
  }

  copyLink() {
    window.navigator.clipboard.writeText(window.location.href);
    const copyLinkTooltip = document.getElementById('copy-link-tooltip');
    copyLinkTooltip.innerText = 'Copied!';
    setTimeout(() => copyLinkTooltip.innerText = 'Copy Link', 2000);
  }

  leaveRoom() {
    this.stream.getTracks().forEach(track => track.stop());
    this.socket.disconnect();
    window.location.replace('http://localhost:3000/');
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