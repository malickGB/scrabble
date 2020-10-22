const { clearLine } = require('readline');

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require("fs");
const port = process.env.PORT || 8080;


let players = [];
let current_turn = true; //for player 1, false otherwise
let rooms_data = [];

io.on("connection", (socket) =>{

    socket.on('createRoom', (roomId) =>{
        socket.join(roomId);
        console.log("Player created room " + roomId);
    });

    socket.on('leftRoomCreation', (roomId) => {
        socket.leave(roomId);
        console.log("Player left room " + roomId)
    })

    socket.on('joinRoom', (roomId) =>{
        var connectedSockets = io.sockets.adapter.rooms[roomId].sockets;
        if (io.sockets.adapter.rooms[roomId] && Object.keys(connectedSockets).length < 2){
            console.log("Player joined room "+ roomId);
            socket.join(roomId);
            io.to(roomId).emit('GameStart');
            var player1Id= Object.keys(connectedSockets)[0];
            io.sockets.connected[player1Id].emit('initPlayers')
            rooms_data[roomId] = { "player1": 0, "player2": 0, "board": Array(225).fill[null, null, null], "letters": {} }
        }
    })

    // Word validation
    // FIXME DEFINE these events in front end
    socket.on('checkWord', (word) =>{
        fs.readFile('./dico.txt', (err, data) => {
            if (data.includes(word))
                socket.emit('validWord');
            else
                socket.emit('InvalidWord')
        })
    })
    
    // FIXME : define roomId in front-end
    socket.on("endTurn",(board, letters, roomId) =>{
        data = rooms_data[roomId];
        data["board"] = board;
        data["letters"] = letters;
        socket.broadcast.emit("refreshScore", data)
    })

    //Updates scores
    socket.on("newScore",(player,score, roomId) => {
        data = rooms_data[roomId];
        data[player] = score;
    })

    // Remove player from array
    socket.on("disconnecting", () =>{
        console.log(socket.id + " disconnected");
        var roomsSocketIn = Object.keys(socket.rooms);
        roomsSocketIn.forEach( (room )=>{ 
            socket.leave(room) ; 

            // notify remaining player that he is alone
            io.to(room).emit('LeftGame'); // FIXME: do something with this event

            // removes room from array
            rooms_data.splice(rooms_data.indexOf(roomId), 1) 
        })
    })
})


server.listen(port, () => {
    console.log('listening on port ' + port)
})
