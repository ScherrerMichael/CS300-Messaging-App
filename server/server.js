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
    console.log('We Have a new Connection!!!');

    socket.on('join', (user, callback) =>{
        console.log(user + 'has joined');

        callback({message: 'from server: user ' + user + '  has joined'})
    });

    socket.on('sendMessage', ({message}, callback) =>{
        console.log(message.uid + ': ' + message.message_body);

        callback({callback: {
            result: message,
        }});
    });

    socket.on('disconnect', ()=> {
        console.log('User has left!');
    })
})

server.listen(PORT, () =>{
    console.log(`Server running at 192.168.0.50:${PORT}`);
});
