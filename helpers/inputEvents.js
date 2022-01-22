import freeice from 'freeice'
import EVENTS from './events'

export const inputEvents = {
  [EVENTS.ADD_PEER]: async function ({ peerId, createOffer }) {
    if (this.peers.hasOwnProperty(peerId)) {
      console.log('peer already exist'); 
      return;
    }
    console.log('add peer');
    this.peers[peerId] = new RTCPeerConnection({ iceServers: freeice() })
    this.peers[peerId].onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit(EVENTS.ACCEPT_ICE, { peerId, iceCandidate: event.candidate})
      }
    }
    let tracksNumber = 0;
    this.peers[peerId].ontrack = ({ streams: [ remoteStream ] }) => {
      tracksNumber++;
      const peerVideo = document.getElementById('video1');
      if (tracksNumber === 2) {
        tracksNumber = 0
        //if (this.clients.includes(peerId)) return // error
        // assign stream
        let settled = false;
        const interval = setInterval(() => {
          if (peerVideo) {
            console.log('stream sed goood');
            peerVideo.srcObject = remoteStream;
            peerVideo.play()
            settled = true;
          }
          if (settled) {
            clearInterval(interval);
          }
        }, 1000);
        setTimeout(() => console.log(peerVideo.srcObject), 3000)
        //
      }
    }
    this.stream.getTracks().forEach(track => {
      console.log('send tracks');
      this.peers[peerId].addTrack(track, this.stream);
    })
    if (createOffer) {
      console.log('createOffer = true');
      const offer = await this.peers[peerId].createOffer()
      await this.peers[peerId].setLocalDescription(offer)
      this.socket.emit(EVENTS.ACCEPT_SDP, { peerId, sessionDescription: offer })
    }
    return;
  },
  [EVENTS.SESSION_DESCRIPTION]: async function ({ peerId, sessionDescription: remoteDescription }) {
    console.log('got desc');
    await this.peers[peerId]?.setRemoteDescription(
      new RTCSessionDescription(remoteDescription)
    );

    if (remoteDescription.type === 'offer') {
      const answer = await this.peers[peerId].createAnswer();
      await this.peers[peerId].setLocalDescription(answer);
      console.log('createAnswer');
      this.socket.emit(EVENTS.ACCEPT_SDP, {
        peerId,
        sessionDescription: answer,
      });
    }
    return;
  },
  [EVENTS.ICE_CANDIDATE]: async function ({ peerId, iceCandidate }) {
    this.peers[peerId]?.addIceCandidate(
      new RTCIceCandidate(iceCandidate)
    );
    return;
  },
  [EVENTS.REMOVE_PEER]: async function ({ peerId }) {
    if (this.peers[peerId]) {
      this.peers[peerId].close();
    }

    delete this.peers[peerId];
    delete this.peers[peerId];

    // updateClients(list => list.filter(c => c !== peerId)); //update clients!
    return;
  },
  [EVENTS.SHARE_ROOMS_INFO]: async function ({ rooms }) {
    this.rooms = rooms
    return;
  }
}
