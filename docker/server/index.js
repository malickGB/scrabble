const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;


app.get("/", (req,res)=>{
    res.send({response: "working"}).status(200)
})

let players = [];
let current_turn = true; //for player 1, false otherwise
let data = { "player1": 0, "player2": 0, "board": Array(225).fill[null, null, null]}


io.on("connection", (socket) =>{
    console.log("Player connected in room " + 1);
    players.push(socket)
    if (players.length == 2)
    {
        players[0].emit("initPlayers", true)
    }
    socket.on("endTurn",(board) =>{
        data["board"] = board
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
