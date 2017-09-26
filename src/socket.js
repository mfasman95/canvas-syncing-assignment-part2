const socketio = require('socket.io');

let io;
let timer = 0;
let counter = 0;

const emitToTall = (eventName, data) => io.sockets.emit('serverMsg', { eventName, data });
const emitToSocket = socket => (eventName, data) => socket.emit('serverMsg', { eventName, data });

const updateTimer = () => {
  timer++;
  emitToTall('updateTimer', { timer });
};


const incrementCounter = () => {
  counter++;
  emitToTall('updateCounter', { counter });
};

const socketHandlers = Object.freeze({
  test: data => console.log(data),
  incrementCounter,
});

const onDisconnect = (sock) => {
  const socket = sock;
  console.log(`Socket ${socket.id} has disconnected...`);
};

setInterval(updateTimer, 1000);

module.exports = Object.freeze({
  init: (server) => {
    io = socketio(server);
    io.sockets.on('connection', (socket) => {
      emitToSocket(socket)('updateTimer', { timer });
      emitToSocket(socket)('updateCounter', { counter });
      console.log(`Socket ${socket.id} has connected...`);
      socket.on('clientMsg', (data) => {
        if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);
        return console.warn(`Missing event handler for ${data.eventName}!`);
      });
      socket.on('disconnect', () => onDisconnect(socket));
    });
  },
});
