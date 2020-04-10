const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Users = require('./Users')();
const port = 4000;

const m = (name, text, id) => ({ name, text, id });

io.on('connection', socket => {
    console.log('Socket is connected.');

    socket.on('userJoined', (data, cb) => {
        if (!data.name || !data.room) {
            return cb('Данные некорректны');
        }

        socket.join(data.room);

        Users.remove(socket.id);
        Users.add({
            id: socket.id,
            name: data.name,
            room: data.room
        });

        cb({ userId: socket.id });
        io.to(data.room).emit('updateUsers', Users.getByRoom(data.room));
        socket.emit('newMessage', m('admin', `Добро пожаловать ${data.name}.`));
        socket.broadcast
            .to(data.room)
            .emit('newMessage', m('admin', `Пользователь ${data.name} зашел.`));
    });

    socket.on('createMessage', (data, cb) => {
        if (!data.text) {
            return cb('Текст не может быть пустым');
        }

        const user = Users.get(data.id);
        if (user) {
            io.to(user.room).emit('newMessage', m(user.name, data.text, data.id));
        }
        cb()
    });

    socket.on('userLeft', (id, cb) => {
        const user = Users.remove(id);
        if (user) {
            io.to(user.room).emit('updateUsers', Users.getByRoom(user.room));
            io.to(user.room).emit(
                'newMessage',
                m('admin', `Пользователь ${user.name} вышел.`)
            )
        }
        cb()
    });

    socket.on('disconnect', () => {
        const user = Users.remove(socket.id);
        if (user) {
            io.to(user.room).emit('updateUsers', Users.getByRoom(user.room));
            io.to(user.room).emit(
                'newMessage',
                m('admin', `Пользователь ${user.name} вышел.`)
            )
        }
    })
});

app.get('/', function(req, res) {
    res.send('We are happy to see you!');
});

app.listen(port);
