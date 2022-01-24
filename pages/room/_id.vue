<template>
  <div id="room-holder">
    <v-row
    v-show="pageLoading"
    justify="center">
      <v-progress-circular
      :width="3"
      color="red"
      indeterminate />
    </v-row>
    
    <div :style="{'visibility': pageLoading ? 'hidden' : 'visible'}">
      
      <v-container justify="start" align="start">
        <v-row v-show="focusedId" id="selectedPanel" class="fill-height" justify="center">
          <div
            class="hover-pointer"
            @dblclick="unselectUser()"
          >
            <UserBlock
              :id="'focusedId'"
              :name="focusedName"
              :cameraOn="focusedUser ? focusedUser.cameraOn : showVideo"
              :pageLoading="pageLoading"
              :image="image"
              :micClicked="focusedUser ? focusedUser.micOn : micOn"
              :width="720"
              :height="405"
            />
          </div>
        </v-row>
        <v-row id="users-panel" class="fill-height" justify="center">
          <div
            class="hover-pointer"
            @dblclick="selectUser(peerId, 'You')"
            v-show="focusedId !== peerId"
          >
            <UserBlock
              :id="peerId"
              muted
              name="You"
              :cameraOn="showVideo"
              :pageLoading="pageLoading"
              :image="image"
              :micClicked="micOn"
              :width="width"
              :height="height"
            />
          </div>
          <div
            class="hover-pointer"
            @dblclick="selectUser(user.peerId, user.name, user)"
            v-for="user in users"
            :key="user.peerId"
            :id="user.peerId"
            :name="user.name"
          >
            <UserBlock
              v-show="user.peerId !== focusedId"
              :id="user.peerId"
              :name="user.name"
              :pageLoading="pageLoading"
              :image="image"
              :admin="admin"
              @removePersonFromRoom="removePersonFromRoom"
              :cameraOn="user.cameraOn"
              :micClicked="user.micOn"
              :width="width"
              :height="height"
            />
          </div>
        </v-row>
      </v-container>
      <v-row class="play-icon-row">
        <OnOffIcon
          :disabled="!mediaAvailable"
          class="mx-3"
          big
          iconName="mdi-microphone"
          :onClick="micClick"
          :clicked="micOn"
        />
        <OnOffIcon
          :disabled="!mediaAvailable"
          class="mx-3"
          big
          iconName="mdi-video"
          :onClick="cameraClick"
          :clicked="showVideo && !screenSharing"
        />
        <OnOffIcon
          :disabled="!mediaAvailable"
          class="mx-3"
          big
          iconName="mdi-monitor-screenshot"
          :onClick="screenSharingClick"
          :clicked="screenSharing"
        />
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
        <p v-show="!mediaAvailable">Wait for the pelmens to stream 	🥟&#127909;</p>
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
import dataSources from '../../helpers/dataSources'
import events from '../../helpers/events'

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

  image="https://picsum.photos/320/180?blur";
  cameraOn = false;
  showVideo = false;
  screenSharing = false;
  micOn = false;
  width = 320;
  height = 180;
  stream = null;
  pageLoading = true;
  admin = false;

  snackbar = false;
  snackbarTimeout = 3000;
  snackbarColor = '#40826d';
  snackbarText = 'Your nickname has been updated';

  focusedName = '';
  focusedId = null;
  focusedUser = null;
  
  isNewRoom = false;
  socket = null;
  peers = {};
  clients = [];
  rooms = [];
  peerId = '1';
  dcs = new Map();
  dataSource = 'webCamera';

  get mediaAvailable() {
    return this.dcs.size > 0;
  }

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

  async cameraClick() {
    console.log('cameraClick', this.dcs, this.dcs.size);
    if (this.dcs.size === 0) return;
    if(this.dataSource === 'screenCast') {
      this.stream.getVideoTracks()[0].stop();
      const ans = await this.switchDataSource();
      if (!ans) return;
      this.cameraOn = true;
      this.showVideo = true;
      this.screenSharing = false;
    } else {
      this.cameraOn = !this.cameraOn;
      this.showVideo = !this.showVideo;
    }
    this.captureMedia();
  }

  micClick() {
    if (this.dcs.size === 0) return;
    this.micOn = !this.micOn;
    this.captureMedia();
  }

  async screenSharingClick() {
    if (this.dcs.size === 0) return;
    if(this.dataSource !== 'screenCast') {
      const ans = await this.switchDataSource();
      if (!ans) return;
      this.screenSharing = true;
      this.cameraOn = true;
      this.showVideo = true;
    } else if (this.cameraOn) {
      this.stream.getVideoTracks()[0].stop();
      this.screenSharing = false;
      this.cameraOn = false;
      this.showVideo = false;
    } else if (!this.cameraOn) {
      try {
        await dataSources[this.dataSource]();
        await this.changeDataSource(ans);
      } catch (err) {
        console.log(err);
        return;
      }
      this.screenSharing = true;
      this.cameraOn = true;
      this.showVideo = true;
    }
    this.captureMedia();
  }

  async changeDataSource(source) {
    const audioTrack = this.stream.getAudioTracks()[0];
    this.stream = source;
    if (this.dataSource === 'screenCast') {
      this.stream.getVideoTracks()[0].onended = async () => {
        this.screenSharing = false;
        this.cameraOn = false;
        this.showVideo = false;
        this.captureMedia();
      };
    };
    for (const peer of Object.values(this.peers)) {
      this.stream.getTracks().forEach(track => {
        peer.addTrack(track, this.stream);
        const sender = peer.getSenders()
          .find((s) => s.track.kind == track.kind);
        sender.replaceTrack(track);
      })
    }
    this.stream.addTrack(audioTrack);
    document.getElementById('video1').srcObject = this.stream;
  }

  captureMedia() {
    if (this.cameraOn) this.stream.getVideoTracks()[0].enabled = true;
    else this.stream.getVideoTracks()[0].enabled = false;

    if (this.micOn) this.stream.getAudioTracks()[0].enabled = true;
    else if (this.stream.getAudioTracks()[0]) this.stream.getAudioTracks()[0].enabled = false;
    const msg = {
      peerId: this.socket.id,
      cameraOn: this.stream.getVideoTracks()[0]?.enabled,
      micOn: this.stream.getAudioTracks()[0]?.enabled 
    }
    this.dcs.forEach(dc => dc.send(JSON.stringify(msg)));
  }

  async switchDataSource() {
    this.dataSource = this.dataSource === 'webCamera' ? 'screenCast' : 'webCamera';
    let ans = null;
    try {
      ans = await dataSources[this.dataSource]();
      await this.changeDataSource(ans);
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  copyLink() {
    window.navigator.clipboard.writeText(window.location.href);
    const copyLinkTooltip = document.getElementById('copy-link-tooltip');
    copyLinkTooltip.innerText = 'Copied!';
    setTimeout(() => copyLinkTooltip.innerText = 'Copy Link', 2000);
  }

  removePersonFromRoom(kikId) {
    this.kikDcs[kikId].send(JSON.stringify({ status: 'go away' }))
  }

  async leaveRoom() {
    this.stream.getTracks().forEach(track => track.stop());
    this.socket.emit(events.LEAVE, { roomId: this.roomId });
    await this.awaitResponse(events.REMOVE_PEER, Object.values(this.peers).length)
    this.dcs.forEach(dc => dc.close());
    this.socket.disconnect();
    this.$router.replace({ path: '/'});
  }

  onNicknameUpdated() {
    this.updateNickname(window.localStorage.getItem('myNickname'));
    this.socket.emit(EVENTS.SHARE_USER_INFO, { roomId: this.roomId, nickName: this.nickname, isAdmin: this.isNewRoom })
  }

  setNotification() {
    this.snackbar = true;
    setTimeout(() => this.snackbar = false, this.snackbarTimeout);
  }

  selectUser(peerId, userName, user) {
    this.unselectUser();
    this.focusedId = peerId;
    this.focusedName = userName;
    
    const selectedSlot = document.getElementById('videofocusedId');
    const selectedId = 'video' + peerId;
    const video = document.getElementById(selectedId);
    const stream = video.srcObject;
    selectedSlot.srcObject = stream;

    if (user) {
      this.focusedUser = user;
    }
  }

  unselectUser() {
    this.focusedId = null;
    this.focusedName = '';
    this.focusedUser = null;
  }

  awaitResponse(type, n) {
    if (n === 0) return
    return new Promise((resolve) => {
      let received = 0;
      this.socket.on(type, () => {
        received++;
        if (n === received) {
          resolve()
        }
      })
    })
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

.hover-pointer:hover {
  cursor: pointer;
}
</style>