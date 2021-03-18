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

    socket.on('join', (user, room, callback) =>{
        socket.join(room._id);
        console.log(`user ${user} has joined: ${room._id}`);
        io.to(room._id).emit('welcome', `welcome, ${user}.`);
        //callback({message: `from server: ${user} has joined room: "${room.topic}"`})
    });

    socket.on('sendMessage', (user, room, message, callback) =>{
        console.log(`${user.displayName}: ${message.message_body} ; ${room}`);

        socket.to(room).emit('re', {
            user: user.displayname,
            message: message
        })

        callback({callback: {
            server: 'sent message',
            status: 'ok',
            message: message
        }});
    });

    socket.on('disconnect', ()=> {
        console.log('User has left!');
    })
})

server.listen(PORT, () =>{
    console.log(`Server running at 192.168.0.50:${PORT}`);
});
