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
            activeUsers.add({email: data.email, chatId: data.chatId, socketId: socket.id});
            socket.join(data.chatId);
            // const onlinePeople = io.sockets.adapter.rooms.get(data.chatId);
            // console.log('online people in chat ' + data.chatId, onlinePeople);
            socket.to(data.chatId).emit('userJoined', {
                message: data.firstName + " " + data.lastName + " is online",
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
                message: data.firstName + " " + data.lastName + " is offline",
                chatId: data.chatId,
                email: data.email,
            });
            io.to(data.chatId).emit('online', [...activeUsers].filter(p => p.chatId == data.chatId));
        });

        socket.on('newMessage', data => {
            socket.broadcast.to(data.chatId).emit('messageToClients', data.message);
        });

        socket.on('leaveChat', data => {
            socket.leave(data.chatId);
            socket.broadcast.to(data.chatId).emit('leavechat', data);
        });

        socket.on('adduserstochat', data => {
            const fullNamesUsers = data.addedUsers.map(user => user.full_name);
            socket.broadcast.to(data.chatId).emit('addUserstochat', {
                ...data,
                fullNamesUsers: fullNamesUsers
            });
        });

        socket.on('deletechat', data => {
            socket.leave(data.chatId);
            socket.broadcast.to(data.chatId).emit('deleteChat', data);
        });

        socket.on('addchat', data => {
            if (!data || !data.chat.chatdetails) return;
            const usersInNewChat = data.chat.chatdetails.users.map(user => user.email);
            socket.leave(data.prevChatId.toString());
            // socket.broadcast.to(chat.chatId).emit('deleteChat', chat);
            activeUsers.forEach(activeuser => {
                if (usersInNewChat.indexOf(activeuser.email) > -1 && activeuser.email !== data.chat.chatdetails.created_by) {
                    io.to(activeuser.socketId).emit('newChat', data.chat);
                }
            });
        });

    });

};

module.exports = socketServer;