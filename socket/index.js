const socketIO = require('socket.io');

const activeUsers = new Set();

const socketServer = server => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('SOCKET CONNECTED');

        socket.on('disconnect', () => {
            console.log('SOCKET DISCONNECTED');
        });
    
        socket.on('joinRoom', async data => {
            console.log('JOIN ROOM data', data);
            if (!data.chatId || !data.email) return;
            socket.email = data.email;
            activeUsers.add({email: data.email, chatId: data.chatId});
            socket.join(data.chatId);
            // const onlinePeople = io.sockets.adapter.rooms.get(data.chatId);
            // console.log('online people in chat ' + data.chatId, onlinePeople);
            socket.to(data.chatId).emit('userJoined', {
                message: data.firstName + " " + data.lastName + " has joined",
                chatId: data.chatId,
                email: data.email,
            });
            io.to(data.chatId).emit('online', [...activeUsers].filter(p => p.chatId == data.chatId));
        });

        socket.on('leaveRoom', data => {
            console.log('LEAVE ROOM data', data);
            if (!data.chatId || !data.email) return;
            socket.leave(data.chatId);
            activeUsers.forEach(user => {
                if (user.email === data.email && user.chatId == data.chatId) {
                    activeUsers.delete(user);
                }
            });
            // const onlinePeople = io.sockets.adapter.rooms.get(data.chatId);
            // console.log('online people in chat ' + data.chatId, onlinePeople);
            socket.to(data.chatId).emit('userLeft', {
                message: data.firstName + " " + data.lastName + " has left",
                chatId: data.chatId,
                email: data.email,
            });
            io.to(data.chatId).emit('online', [...activeUsers].filter(p => p.chatId == data.chatId));
        });
    });

};

module.exports = socketServer;