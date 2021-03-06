import { io } from 'socket.io-client';

const isProd = process.env.NODE_ENV === 'production'

const serverUrl = isProd ? 'https://look-at-me-ws.herokuapp.com/' : 'http://localhost:8000';

const options = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout : 10000,
  transports : ["websocket"],
  secure: true
}

export default () => io(serverUrl, options);
