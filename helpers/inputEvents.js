import freeice from 'freeice'
import EVENTS from './events'

export const inputEvents = {
  [EVENTS.ADD_PEER]: async function ({ peerId, createOffer }) {
    console.log(1)
    console.log('TEST' ,peerId, createOffer);
    if (this.peers.hasOwnProperty(peerId)) {
      return //error
    }
    this.peers[peerId] = new RTCPeerConnection({ iceServers: freeice() })
    this.peers[peerId].onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit(EVENTS.ACCEPT_ICE, { peerId, iceCandidate: event.candidate})
      }
    }
    console.log(2)
    let tracksNumber = 0;
    this.peers[peerId].ontrack = ({ streams: [ remoteStream ] }) => {
      tracksNumber++;
      console.log('peeeeers', this.peers[peerId]);
      if (tracksNumber === 2) {
        tracksNumber = 0
        if (this.clients.includes(peerId)) return // error
        // assign stream
        document.getElementById('video1').srcObject = remoteStream // C
        //this.window.remoteAudio.autoplay = true
        //
      }
    }
    this.stream.getTracks().forEach(track => {
      this.peers[peerId].addTrack(track, this.stream);
    })
    if (createOffer) {
      const offer = await this.peers[peerId].createOffer()
      await this.peers[peerId].setLocalDescription(offer)
      this.socket.emit(EVENTS.ACCEPT_SDP, { peerId, sessionDescription: offer })
    }
    return;
  },
  [EVENTS.SESSION_DESCRIPTION]: async function ({ peerId, sessionDescription: remoteDescription }) {
    await this.peers[peerId]?.setRemoteDescription(
      new RTCSessionDescription(remoteDescription)
    );

    if (remoteDescription.type === 'offer') {
      const answer = await this.peers[peerId].createAnswer();

      await this.peers[peerId].setLocalDescription(answer);

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
  }
}
