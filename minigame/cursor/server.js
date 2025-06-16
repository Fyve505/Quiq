const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = {};

function assignTag(name) {
    const similar = Object.values(users).filter(u => u.name === name);
    return `#${(similar.length + 1).toString().padStart(3, '0')}`;
}

io.on('connection', socket => {
    socket.on('join', data => {
        const tag = assignTag(data.name);
        users[socket.id] = { ...data, tag };

        io.emit('userUpdate', users);
    });

    socket.on('cursorMove', pos => {
        if (users[socket.id]) {
            users[socket.id].x = pos.x;
            users[socket.id].y = pos.y;
            io.emit('userUpdate', users);
        }
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('userUpdate', users);
    });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
