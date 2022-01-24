import msgTypes from "./msgTypes"

export default {
  [msgTypes.CHAT]: function(data) {
    this.drawMessageInChat(data.text)
  },
  [msgTypes.DEVICE_STATUS]: function(data) {
    this.updateDevicesStatus({ peerId: data.peerId, devices: data });
  },
  [msgTypes.KICK]: async function() {
    await this.leaveRoom();
  },
}
