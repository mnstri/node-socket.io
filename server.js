'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
   // When this user emits, client side: socket.emit('otherevent',some data);
  socket.on('mouse',
    function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'mouse' " + data.x + " " + data.y);
      
      // Send it to all other clients
      socket.broadcast.emit('mouse', data);
        
      // This is a way to send to everyone including sender
      // io.sockets.emit('message', "this goes to everyone");

      }
    );
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
