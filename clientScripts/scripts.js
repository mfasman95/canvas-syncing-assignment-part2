// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

const squareSize = 50;
const defaultData = 'No Data Emitted';

const drawRect = (x, y, color) => {
  console.log(color);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, squareSize, squareSize);
};

const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const socketHandlers = Object.freeze({
  initCanvas: (data) => { for (let i = 0; i < data.length; i++) drawRect(data[i].x, data[i].y, data[i].color); },
  drawSquare: (data) => drawRect(data.x, data.y, data.color),
  clearCanvas,
});


const emitter = (eventName, data = defaultData) => socket.emit('clientMsg', { eventName, data });

window.onload = () => {
  window.canvas = document.querySelector('#canvas');
  window.ctx = canvas.getContext('2d');
  window.clearButton = document.querySelector('#clearCanvas');

  window.socket = io.connect();
  socket.on('connect', () => {
    console.log('Connected to server...');
    clearCanvas();
  });
  socket.on('serverMsg', (data) => {
     if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);
     else console.warn(`Missing event handler for ${data.eventName}`);
  });

  canvas.addEventListener('click', e => emitter('drawSquare', {
    x: e.offsetX - squareSize/2,
    y: e.offsetY - squareSize/2
  }));

  clearButton.addEventListener('click', () => emitter('clearCanvas'));
};
