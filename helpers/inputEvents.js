import freeice from 'freeice'
import EVENTS from './events'

export const inputEvents = {
  [EVENTS.ADD_PEER]: async function ({ peerId, createOffer }) {
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
    let tracksNumber = 0;
    this.peers[peerId].ontrack = ({ streams: [ remoteStream ] }) => {
      tracksNumber++
      if (tracksNumber === 2) {
        tracksNumber = 0
        if (this.clients.includes(peerId)) return // error
        // assign stream
        this.window.remoteAudio.srcObject = remoteStream // C
        this.window.remoteAudio.autoplay = true
        //
      }
    }
    Object.values(this.myMediaStreams).forEach(track => {
      this.peers[peerId].addTrack(track, this.myMediaStreams);
    })
    if (createOffer) {
      const offer = await this.peers[peerId].createOffer()
      await this.peers[peerId].setLocalDescription(offer)
      this.socket.emit(EVENTS.ACCEPT_SDP, { peerId, sessionDescription: offer })
    }
    return;
  }
}
