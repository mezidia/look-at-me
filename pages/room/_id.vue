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
      </v-row>
    </div>
    <SettingsModal
      @nicknameUpdated="onNicknameUpdated(); setNotification();"
    />
    <AcquaintanceModal
      @userCreated="onNicknameUpdated"
    />
    <div
      class="settings-wrapper"
      @click="updateSettingsModal(true)"
    >
      <VuetifyIcon
        iconName="mdi-cog"
        class="settings-button"
      />
    </div>
    {{ nickname }}
    <NotificationSnackbar
      :text="snackbarText"
      :snackbar="snackbar"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
    />
  </div>
</template>

<script>
import { Vue, namespace, Component } from 'nuxt-property-decorator'
import UserBlock from '../../components/UserBlock.vue'
import OnOffIcon from '../../components/OnOffIcon.vue'
import BasicButton from '../../components/BasicButton.vue'
import VuetifyIcon from '../../components/VuetifyIcon.vue'
import SettingsModal from '../../components/SettingsModal.vue'
import NotificationSnackbar from '../../components/NotificationSnackbar.vue'

import { inputEvents } from '../../helpers/inputEvents'
import EVENTS from '../../helpers/events'
import socketIo from '../../helpers/socketIo.js'

const { State, Mutation } = namespace('room')
const { State: AddRoomState } = namespace('addRoomClick')
const { Mutation: NicknameModalMutation } = namespace('nicknameModal')
const { Mutation: SettingsModalMutation } = namespace('settingsModal')
const { Mutation: UserMutation, State: UserState } = namespace('user')

@Component({
  components: {
    UserBlock,
    OnOffIcon,
    BasicButton,
    VuetifyIcon,
    SettingsModal,
    NotificationSnackbar
  }
})

export default class RoomPage extends Vue {
  @State users;
  @State userStatus;
  @Mutation addUser;
  @Mutation deleteUser;
  @Mutation updateDevicesStatus;
  @Mutation updateNameStatus;

  @AddRoomState clicked
  @AddRoomState generatedRoomId

  @UserMutation updateNickname
  @UserState nickname

  @NicknameModalMutation updateNicknameModal

  @SettingsModalMutation updateSettingsModal

  image="https://picsum.photos/200/150?blur";
  cameraOn = false;
  showVideo = false;
  micOn = false;
  width = 200;
  height = 150;
  stream = null;
  pageLoading = true;

  snackbar = false;
  snackbarTimeout = 3000;
  snackbarColor = '#40826d';
  snackbarText = 'Your nickname has been updated';

  socket = null;
  peers = {};
  clients = [];
  rooms = [];
  peerId = '1';
  dcs = [];

  beforeCreate() {
    console.log('before create')
    this.roomId = this.$route.path.split('/')[2];
  }

  async mounted() {
    this.roomId = this.$route.path.split('/')[2]
    this.isNewRoom = (this.generatedRoomId === this.roomId) && this.clicked;
    console.log('mounted')
    this.socket = socketIo();
    // this.socket.onconnect = () => {
    //   console.log()
    //   this.peerId = this.socket.id
    // }
    this.updateNicknameModal(true);
    const roomId = this.roomId;
    for (const eventName in inputEvents) {
      this.socket.on(eventName, inputEvents[eventName].bind(this));
    }

    const video = document.getElementById('video1');
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      this.stream = stream;
      video.srcObject = stream;
      this.stream.getVideoTracks()[0].enabled = false;
      this.stream.getAudioTracks()[0].enabled = false;
      this.socket.emit(EVENTS.JOIN, { roomId, isNewRoom: this.isNewRoom });
    })
    .catch(err => console.log('An error occurred: ' + err));
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

  captureMedia() {
    if (this.cameraOn) this.stream.getVideoTracks()[0].enabled = true;
    else this.stream.getVideoTracks()[0].enabled = false;

    if (this.micOn) this.stream.getAudioTracks()[0].enabled = true;
    else this.stream.getAudioTracks()[0].enabled = false;
    this.dcs.forEach(dc => dc.send(JSON.stringify({ cameraOn: this.stream.getVideoTracks()[0].enabled, micOn: this.stream.getAudioTracks()[0].enabled })))
  }

  copyLink() {
    window.navigator.clipboard.writeText($nuxt.$route.fullPath);
    const copyLinkTooltip = document.getElementById('copy-link-tooltip');
    copyLinkTooltip.innerText = 'Copied!';
    setTimeout(() => copyLinkTooltip.innerText = 'Copy Link', 2000);
  }

  leaveRoom() {
    this.stream.getTracks().forEach(track => track.stop());
    this.socket.disconnect();
    this.$router.push({path: '/'})
  }

  onNicknameUpdated() {
    this.updateNickname(window.localStorage.getItem('myNickname'));
    this.socket.emit(EVENTS.SHARE_USER_INFO, { roomId: this.roomId, nickName: this.nickname, isAdmin: this.isNewRoom })
  }

  setNotification() {
    this.snackbar = true;
    setTimeout(() => this.snackbar = false, this.snackbarTimeout);
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

.settings-button {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>