const http = require('http');
const app = require('./app');
const socketio = require('socket.io');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

io.on('connection', (socket)=> { //this is so cool

    socket.on('join', (user, roomId, callback) =>{
        socket.join(roomId);
        console.log(`user ${user} has joined: ${roomId}`);
        io.to(roomId).emit('welcome', `welcome, ${user}.`);
    });

    socket.on('send-message', (user, room, message, callback) =>{
        console.log(`${user.displayName}: ${message.message_body} ; ${room}`);

        socket.to(room).emit('message-recieved', {
            user: user.displayname,
            message: message
        })

        callback({callback: {
            server: 'sent message',
            status: 'ok',
            message: message
        }});
    });

    socket.on('create-room', (user, topic, callback) =>{
        console.log(`user ${user.displayName} created room: ${topic}`);

        callback({callback: {
            status: 'ok',
            server: 'created room',
            room: topic,
        }})
    });

    socket.on('add-friend', (senderUid, reciepientUid, callback) => {
        console.log(`user ${senderUid} has send a freind request to: ${reciepientUid}`)

        socket.broadcast.emit('add-friend-response', reciepientUid)

        callback({callback: {
            status: 'ok',
            sender: senderUid,
            reciepient: reciepientUid,
        }})
    });


    socket.on('remove-friend', (userId, removedId, callback) => {
        console.log(`user ${userId} removed friendId: ${removedId}`);

        socket.broadcast.emit('remove-friend-response', removedId);

            callback({callback: {
                status: 'ok',
                server: 'removed friend',
                removed: removedId,
            }})

    })

    socket.on('remove-room', (userId, removedId, callback) => {
        console.log(`user ${userId} removed room: ${removedId}`);

        socket.broadcast.emit('remove-room-response', userId, removedId);
            callback({callback: {
                status: 'ok',
                server: 'removed room',
                removed: removedId,
            }})

    })

    socket.on('accept-request', (user, uid, callback) => {

        socket.broadcast.emit('accepted-request', user.uid, uid);

        callback({callback: {
            status: 'ok',
            server: 'accepted friend request',
            user_01: user.uid,
            user_02: uid
        }})
    })


    socket.on('disconnect', ()=> {
        console.log('User has left!');
    })
})

server.listen(PORT, () =>{
    console.log(`Server running on port: ${PORT}`);
});
