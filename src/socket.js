const socketio = require('socket.io');

const defaultData = 'No Data Emitted';

let io;
const drawStack = [];

const emitToAll = (eventName, data = defaultData) => io.sockets.emit('serverMsg', { eventName, data });
const emitToSocket = socket => (eventName, data = defaultData) => socket.emit('serverMsg', { eventName, data });

const randomInt0To255 = () => Math.floor(Math.random() * 255);

const randomColor = () => {
  const r = randomInt0To255();
  const g = randomInt0To255();
  const b = randomInt0To255();
  return (`rgb(${r},${g},${b})`);
};

const socketHandlers = Object.freeze({
  drawSquare: (data) => {
    const squareObj = data;
    squareObj.color = randomColor();
    drawStack.push(squareObj);
    emitToAll('drawSquare', squareObj);
  },
  clearCanvas: () => {
    drawStack.splice(0, drawStack.length);
    emitToAll('clearCanvas');
  },
});

const onDisconnect = (sock) => {
  const socket = sock;
  console.log(`Socket ${socket.id} has disconnected...`);
};

module.exports = Object.freeze({
  init: (server) => {
    io = socketio(server);
    io.sockets.on('connection', (socket) => {
      emitToSocket(socket)('initCanvas', drawStack);
      console.log(`Socket ${socket.id} has connected...`);
      socket.on('clientMsg', (data) => {
        if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);
        return console.warn(`Missing event handler for ${data.eventName}!`);
      });
      socket.on('disconnect', () => onDisconnect(socket));
    });
  },
});
