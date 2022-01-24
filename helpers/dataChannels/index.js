import handlers from "./handlers";

function handleDataChannel(e) {
  console.log('handleDataChannel:', this);
  console.log(e.data);
  const parsedEvent = JSON.parse(e.data)
  const handler = handlers[parsedEvent.type]
  if (handler) handler.call(this, parsedEvent.data)
}

export default handleDataChannel
