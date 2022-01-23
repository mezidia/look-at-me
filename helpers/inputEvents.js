import freeice from 'freeice'
import EVENTS from './events'

export const inputEvents = {
  [EVENTS.ADD_PEER]: async function ({ peerId, createOffer }) {
    if (this.peers.hasOwnProperty(peerId)) {
      console.log('peer already exist'); 
      return;
    }

    this.peers[peerId] = new RTCPeerConnection({ iceServers: freeice() })
    this.peers[peerId].ondatachannel = e => {
      e.channel.onopen = () => {};
      e.channel.onmessage = e => {
        const data = JSON.parse(e.data);
        this.updateDevicesStatus({ peerId, devices: data });
      };
    } 
    const dc = this.peers[peerId].createDataChannel('devicesStatus');
    this.dcs.push(dc);
    dc.onopen = () => dc.send(JSON.stringify({cameraOn: this.stream.getVideoTracks()[0].enabled, micOn: this.stream.getAudioTracks()[0].enabled}));
    dc.onmessage = e => console.log('Message: ', e.data);
    this.peers[peerId].onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit(EVENTS.ACCEPT_ICE, { peerId, iceCandidate: event.candidate})
      }
    }
    let tracksNumber = 0;
    this.peers[peerId].ontrack = ({ streams: [remoteStream] }) => {
      tracksNumber++;
      this.addUser({ peerId, remoteStream });
      const peerVideo = document.getElementById('video' + peerId);
      if (tracksNumber === 2) {
        tracksNumber = 0
        if (this.clients.includes(peerId)) return;
        let settled = false;
        const interval = setInterval(() => {
          if (peerVideo) {
            peerVideo.srcObject = remoteStream;
            peerVideo.play()
            settled = true;
          }
          if (settled) {
            clearInterval(interval);
          }
        }, 1000);
      }
    }

    this.stream.getTracks().forEach(track => {
      this.peers[peerId].addTrack(track, this.stream);
    })

    if (createOffer) {
      const offer = await this.peers[peerId].createOffer()
      await this.peers[peerId].setLocalDescription(offer)
      this.socket.emit(EVENTS.ACCEPT_SDP, { peerId, from: this.socket.id, sessionDescription: offer })
    }
  },
  [EVENTS.SESSION_DESCRIPTION]: async function ({ peerId, from, sessionDescription: remoteDescription }) {
    await this.peers[from]?.setRemoteDescription(
      new RTCSessionDescription(remoteDescription)
    )
    if (remoteDescription.type === 'offer') {
      const answer = await this.peers[peerId].createAnswer();
      await this.peers[peerId].setLocalDescription(answer);
      this.socket.emit(EVENTS.ACCEPT_SDP, {
        peerId,
        from: this.socket.id,
        sessionDescription: answer,
      });
    }
  },
  [EVENTS.ICE_CANDIDATE]: async function ({ peerId, iceCandidate }) {
    this.peers[peerId]?.addIceCandidate(
      new RTCIceCandidate(iceCandidate)
    );
  },
  [EVENTS.REMOVE_PEER]: async function ({ peerId }) {
    console.log('leave', peerId)
    this.deleteUser(peerId);
    console.log(this.users)

    if (this.peers[peerId]) {
      this.peers[peerId].close();
    }
    
    delete this.peers[peerId];
  },
  [EVENTS.SHARE_ROOMS_INFO]: async function ({ rooms }) {
    this.socket.rooms = rooms
  },
  [EVENTS.ERROR]: async function ({ msg }) {
    this.$router.push({path: '/error'})
  },
  [EVENTS.ACCEPT_USER_INFO]: async function ({ clientId, nickName, isAdmin }) {
    console.log(this.socket.id, clientId, nickName, isAdmin)
    if (this.socket.id !== clientId) this.updateNameStatus({ clientId, nickName, isAdmin });
  }
}
