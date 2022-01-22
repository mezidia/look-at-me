<template>
  <div id="room-holder">
    <!--<v-row
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
    </div> -->
      <video autoplay id="video1Test" playsinline></video>
      <video autoplay id="video2Test" playsinline></video>
      <button @click="webCUMclick">webCUMvideo</button>
      <button @click="onCallClick">callButton</button>
      <button @click="onAnswer">AnswerButton</button>
      <input type="text" id="callInput">
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

  myMediaStreams = {};

  //////

  servers = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302'
        ]
      }
    ],
    iceCandidatePoolSize: 10,
  }
////

  pc = null;
  localStream = null;
  remoteStream = null;


  /////

  async mounted() {
    // this.socket = io('http://localhost:8000/');
    // this.socket.on(EVENTS.ADD_PEER, (data) => {
    //   const { peerId, createOffer } = data;

    //   console.log(peerId, createOffer);
    // });

    // //const roomId = uuidv4();
    // const roomId = 1;
    // for (const eventName in inputEvents) {
    //   console.log(this);
    //   this.socket.on(eventName, inputEvents[eventName].bind(this));
    // }
    // this.socket.emit(EVENTS.JOIN, { roomId });

    // const video = document.getElementById('videoYou');
    // await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    // .then(stream => {
    //   console.log(stream.getAudioTracks());
    //   video.srcObject = stream;
    //   this.stream = stream;
    //   this.captureMedia();
    // })
    // .catch(err => console.log('An error occurred: ' + err));
    // this.pageLoading = false;

// hiiiiiiiiiiiiiiiii
    this.pc = new RTCPeerConnection(this.servers);
    if(process.browser){
    this.$fire.firestore.enablePersistence()
      .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
          console.log(err.code);
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
          console.log(err.code);
      }
  });
}


  }

  async webCUMclick() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.remoteStream = new MediaStream();

    this.localStream.getTracks().forEach(track => {
      this.pc.addTrack(track, this.localStream);
    });

    this.pc.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream.addTrack(track);
      });
    };

    const webCUMvideo = document.getElementById('video1Test');
    const remoteVideo = document.getElementById('video2Test');

    webCUMvideo.srcObject = this.localStream;
    remoteVideo.srcObject = this.remoteStream;
  }

  async onCallClick() {
    console.log(this.$fire);
    const callDoc = this.$fire.firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');

    const callInput = document.getElementById('callInput');
    callInput.value = callDoc.id;

    this.pc.onicecandidate = event => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    }

    const offerDescription = await this.pc.createOffer();
    await this.pc.setLocalDescription();

    const offer  = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });

    callDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (!this.pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc.setRemoteDescription(answerDescription);
      }
    });

    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.pc.addIceCandidate(candidate);
        }
      })
    });
  }

  async onAnswer() {
    const callInput = document.getElementById('callInput');
    const callId = callInput.value;
    const callDoc = this.$fire.firestore.collection('calls').doc(callId);
    const answerCandidates = callDoc.collection('answerCandidates');

    this.pc.onicecandidate = event => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    }

    const callData = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    await this.pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        console.log(change);
        if (change.type === 'added') {
          let data = change.doc.data();
          this.pc.addIceCandidate(new RTCIceCandidate(data));
        }
      })
    });
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