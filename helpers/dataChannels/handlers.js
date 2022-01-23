import msgTypes from './msgTypes.js'

export default {
  [msgTypes.NEW_DATA_SOURCE]: (data) => {
    // dcs.forEach(dc => dc.send(JSON.stringify({cameraOn: this.stream.getVideoTracks()[0].enabled, 
    //   micOn: this.stream.getAudioTracks()[0].enabled}))
    // );
    console.log(data);
  },
  [msgTypes.DEVICES_STATUS]: function (args) {
    console.log(args);
    const devices = {
      ...args
    }
    delete devices['peerId']
    this.updateDevicesStatus.call(this, { peerId: args.peerId, devices });
  }
}
