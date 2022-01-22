import freeice from 'freeice'
import EVENTS from './events'



export const inputEvents = {
  [EVENTS.ADD_PEER]: async function ({ peerId, createOffer }) {
    if (this.peers.hasOwnProperty(peerId)) {
      console.log('peer already exist'); 
      return;
    }

    console.log('add peer', peerId);
    this.peers[peerId] = new RTCPeerConnection({ iceServers: freeice() })
    this.peers[peerId].onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit(EVENTS.ACCEPT_ICE, { peerId, iceCandidate: event.candidate})
      }
    }
    this.peers[peerId].onsignalingstatechange = ev => {
      console.log(this.peers[peerId].signalingState, ev);
    };
    let tracksNumber = 0;
    this.peers[peerId].ontrack = ({ streams: [ remoteStream ] }) => {                 ////ontrack
      tracksNumber++;
      this.addUser(peerId, remoteStream);
      const peerVideo = document.getElementById('video' + peerId);
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
            console.log('peers', peerId, this.socket.id)
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
      console.log('setLocal offer');
      await this.peers[peerId].setLocalDescription(offer)
      this.socket.emit(EVENTS.ACCEPT_SDP, { peerId, from: this.socket.id, sessionDescription: offer })
    }
    return;
  },
  [EVENTS.SESSION_DESCRIPTION]: async function ({ peerId, from, sessionDescription: remoteDescription }) {
    console.log('got desc', remoteDescription);
    console.log('recived setRemote', remoteDescription.type);
    console.log({
      peers: this.peers,
      to: peerId,
      from,
      me: this.socket.id
    });
    await this.peers[from]?.setRemoteDescription(
      new RTCSessionDescription(remoteDescription)
    ).then(() => {
      console.log('setRemoteDescription done');
    });
    if (remoteDescription.type === 'offer') {
      const answer = await this.peers[peerId].createAnswer();
      console.log('setLocal answer');
      await this.peers[peerId].setLocalDescription(answer);
      console.log('createAnswer for ', peerId, this.socket.id);
      this.socket.emit(EVENTS.ACCEPT_SDP, {
        peerId,
        from: this.socket.id,
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
    console.log('leave', peerId)
    this.deleteUser(peerId);

    if (this.peers[peerId]) {
      this.peers[peerId].close();
    }
    
    delete this.peers[peerId];
    delete this.peers[peerId];
    return;
  },
  [EVENTS.SHARE_ROOMS_INFO]: async function ({ rooms }) {
    this.rooms = rooms
    return;
  }
}
