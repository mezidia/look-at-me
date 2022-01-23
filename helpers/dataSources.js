export default {
  webCamera: (opts = { video: true, audio: true }) => {
    return navigator.mediaDevices.getUserMedia(opts)
  },
  screenCast: (opts = { video: true, audio: true }) => {
    return navigator.mediaDevices.getDisplayMedia(opts)
  }
}
