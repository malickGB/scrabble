const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;


let players = [];
let current_turn = true; //for player 1, false otherwise
let data = { "player1": 0, "player2": 0, "board": Array(225).fill[null, null, null], "letters": {}}


io.on("connection", (socket) =>{
    // console.log("Player connected in room " + 1);

    socket.on('createRoom', (roomId) =>{
        socket.join(roomId);
        console.log("Player created room " + roomId);
    });

    socket.on('joinRoom', (roomId) =>{
        if (io.sockets.adapter.rooms[roomId]){
            console.log("Player joined room "+ roomId);
            socket.join(roomId);
        }
    })

    socket.on('leftRoomCreation', (roomId) => {
        socket.leave(roomId);
        console.log("Player left room "+ roomId)
    })

    players.push(socket)
    if (players.length == 2)
    {
        players[0].emit("initPlayers", true)
    }
    socket.on("endTurn",(board, letters) =>{
        data["board"] = board;
        data["letters"] = letters;
        socket.broadcast.emit("refreshScore", data)
    })

    //Updates scores
    socket.on("newScore",(player,score) => {
        data[player] = score;
    })

    // Remove player from array
    socket.on("disconnecting", () =>{
        console.log(socket.id + " disconnected");
        players.splice(players.indexOf(socket), 1)
        current_turn = true;
    })
})


server.listen(port, () => {
    console.log('listening on port ' + port)
})
