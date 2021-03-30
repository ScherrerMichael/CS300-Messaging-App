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

    socket.on('add-friend', (sender, reciepient, callback) => {
        console.log(`user ${sender.displayName} has send a freind request to: ${reciepient}`)

        callback({callback: {
            status: 'ok',
            sender: sender.uid,
            reciepient: reciepient,
        }})
    });


    socket.on('remove-friend', (userId, removedId, callback) => {
        console.log(`user ${userId} removed friendId: ${removedId}`);

        socket.broadcast.emit('remove-friend-response', userId, removedId);
            callback({callback: {
                status: 'ok',
                server: 'removed friend',
                removed: removedId,
            }})

    })

    socket.on('disconnect', ()=> {
        console.log('User has left!');
    })
})

server.listen(PORT, () =>{
    console.log(`Server running at 192.168.0.50:${PORT}`);
});
