// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

var socket = void 0;
var SERVER_LOCATION = 'localhost:3000';
var updatableTimer = document.querySelector('#updatableTimer');
var updatableCounter = document.querySelector('#updatableCounter');
var counterIncrementer = document.querySelector('#counterIncrement');

var counter = 0;

var socketHandlers = Object.freeze({
  updateTimer: function updateTimer(data) {
    return updatableTimer.innerHTML = 'Timer: ' + data.timer;
  },
  updateCounter: function updateCounter(data) {
    counter = data.counter;
    updatableCounter.innerHTML = 'Counter: ' + counter;
  }
});

var emitter = function emitter(eventName, data) {
  return socket.emit('clientMsg', { eventName: eventName, data: data });
};

window.onload = function () {
  window.socket = io.connect();
  socket.on('connect', function () {
    return console.log('Connected to server...');
  });
  socket.on('serverMsg', function (data) {
    if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);else console.warn('Missing event handler for ' + data.eventName + '!');
  });

  counterIncrementer.onclick = function () {
    return emitter('incrementCounter', {});
  };
};
