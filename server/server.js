const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = new Map();

io.on('connection', (socket) => {
    console.log('Новое подключение:', socket.id);

    socket.on('user:join', (username) => {
        users.set(socket.id, { username, id: socket.id });
        io.emit('users:update', Array.from(users.values()));
    });

    socket.on('message:send', (message) => {
        const user = users.get(socket.id);
        if (user) {
            io.emit('message:receive', {
                text: message,
                user: user.username,
                id: Date.now(),
                timestamp: new Date().toISOString()
            });
        }
    });

    socket.on('disconnect', () => {
        users.delete(socket.id);
        io.emit('users:update', Array.from(users.values()));
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 