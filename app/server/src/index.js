const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const cors = require('cors');
const Users = require('./Users')();
const app = new express();
const port = 4000;
const m = (name, text, id) => ({name, text, id});

app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
    res.json({msg: 'We are glad to see you!'});
});

const server = app.listen(port, () => {
    console.log("Howdy, I am running at PORT " + port)
});

const io = socket(server);

io.on("connection", function (socket) {
    console.log("Socket Connection Established with ID :" + socket.id);

    socket.on('hello', (name, country) => {
        console.log('server response.......hello', new Date());
        socket.emit('hello', {
            name: name,
            country: country
        })
    });

    socket.on('userJoined', (data, cb) => {
    // socket.on('userJoined', (data) => {
        if (!data.name || !data.room) {
            return cb('Данные некорректны');
        }

        socket.join(data.room);
        Users.remove(socket.id);

        const newUser = {
            id: socket.id,
            name: data.name,
            room: data.room
        };
        Users.add(newUser);
        cb({userId: socket.id});
        // io.to(data.room).emit('setUser', newUser);
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
