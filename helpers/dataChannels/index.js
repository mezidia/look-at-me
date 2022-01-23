import handlers from './handlers.js'

function onDataChannelMessage(event) {
  console.log({ data: event.data });
  console.log(this);

  const parsedMsg = JSON.parse(event.data);
  const msgType = parsedMsg.type;
  const args = parsedMsg.args;
  const handler = handlers[msgType];

  if (handler) handler.call(this, args);
}

export default onDataChannelMessage
