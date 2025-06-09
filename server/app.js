const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost/ai_assistant');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/auth', require('./routes/auth'));
app.use('/agents', require('./routes/agents'));
app.use('/chats', require('./routes/chats'));
app.use('/settings', require('./routes/settings'));

io.on('connection', socket => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => console.log('Server started on http://localhost:3000'));
