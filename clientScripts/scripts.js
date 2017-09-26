// Disabling full file because linter is not required on client side
/* eslint-disable */
'use strict';

let socket;
const SERVER_LOCATION = 'localhost:3000';
const updatableTimer = document.querySelector('#updatableTimer');
const updatableCounter = document.querySelector('#updatableCounter');
const counterIncrementer = document.querySelector('#counterIncrement');

let counter = 0;

const socketHandlers = Object.freeze({
  updateTimer: data => updatableTimer.innerHTML = `Timer: ${data.timer}`,
  updateCounter: data => {
    counter = data.counter;
    updatableCounter.innerHTML = `Counter: ${counter}`;
  },
});

const emitter = (eventName, data) => socket.emit('clientMsg', { eventName, data });

window.onload = () => {
  window.socket = io.connect();
  socket.on('connect', () => console.log('Connected to server...'));
  socket.on('serverMsg', (data) => {
     if (socketHandlers[data.eventName]) return socketHandlers[data.eventName](data.data);
     else console.warn(`Missing event handler for ${data.eventName}!`);
  });

  counterIncrementer.onclick = () => emitter('incrementCounter', {});
};
