const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

const rooms = new Map();

app.post('/rooms', (req, res) => {
  const {roomID, password} = req.body;

  if (!rooms.has(roomID)) {
    rooms.set(
      roomID,
      new Map([
        ['pass', password],
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  } else if (rooms.has(roomID)) {
    const passRoom = rooms.get(roomID).get('pass');

    if (passRoom !== password) {
      return res.json({
        message: 'Неверный пароль'
      })
    }
  }
  res.send();
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', async ({roomID, userName}) => {
    socket.join(roomID);
    rooms.get(roomID).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomID).get('users').values()];
    const messages = rooms.get(roomID).get('messages');
    io.in(roomID).emit('ROOM:SET_DATA', {
      users,
      messages
    })
  });
  socket.on('ROOM:NEW_MESSAGES', ({roomID, userName, text}) => {
    const obj = {
      userName,
      text
    };

    rooms.get(roomID).get('messages').push(obj);
    socket.to(roomID).broadcast.emit('ROOM:NEW_MESSAGE', obj)
  });
  socket.on('disconnect', () => {
    rooms.forEach((value, roomID) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomID).broadcast.emit('ROOM:SET_USERS', users);
      }
    })
  })
});

server.listen(9999, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен!');
});
