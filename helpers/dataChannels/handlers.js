import msgTypes from "./msgTypes"

export default {
  [msgTypes.CHAT]: function(data) {
    console.log(data);
  },
  [msgTypes.DEVICE_STATUS]: function(data) {
    this.updateDevicesStatus({ peerId: data.peerId, devices: data });
  },
  [msgTypes.KICK]: async function() {
    await this.leaveRoom();
  },
}
