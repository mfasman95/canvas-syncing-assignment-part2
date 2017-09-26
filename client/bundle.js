// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

var squareSize = 50;
var defaultData = 'No Data Emitted';

var drawRect = function drawRect(x, y, color) {
  console.log(color);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, squareSize, squareSize);
};

var clearCanvas = function clearCanvas() {
  return ctx.clearRect(0, 0, canvas.width, canvas.height);
};

var socketHandlers = Object.freeze({
  initCanvas: function initCanvas(data) {
    for (var i = 0; i < data.length; i++) {
      drawRect(data[i].x, data[i].y, data[i].color);
    }
  },
  drawSquare: function drawSquare(data) {
    return drawRect(data.x, data.y, data.color);
  },
  clearCanvas: clearCanvas
});

var emitter = function emitter(eventName) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultData;
  return socket.emit('clientMsg', { eventName: eventName, data: data });
};

window.onload = function () {
  window.canvas = document.querySelector('#canvas');
  window.ctx = canvas.getContext('2d');
  window.clearButton = document.querySelector('#clearCanvas');

  window.socket = io.connect();
  socket.on('connect', function () {
    console.log('Connected to server...');
    clearCanvas();
  });
  socket.on('serverMsg', function (data) {
    if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);else console.warn('Missing event handler for ' + data.eventName);
  });

  canvas.addEventListener('click', function (e) {
    return emitter('drawSquare', {
      x: e.offsetX - squareSize / 2,
      y: e.offsetY - squareSize / 2
    });
  });

  clearButton.addEventListener('click', function () {
    return emitter('clearCanvas');
  });
};
