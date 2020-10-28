// FIXME controls not disappearing

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require("fs");

const port = process.env.PORT || 8080;

let rooms_data = [];
var clients = []

// Init words dictionnary
let array_words = fs.readFileSync('./dico.txt', 'utf8').split('\n');
let words_dict = {};
array_words.forEach((word) => {
    if (word.length in words_dict)
        words_dict[word.length].push(word)
    else
        words_dict[word.length] = [word];
})

// Listen to events
io.on("connection", (socket) =>{

    clients.push(socket.id);
    var available_rooms = () =>{
        // Get all rooms where the player is waiting for opponent
        all_rooms = Object.keys(io.sockets.adapter.rooms).filter((elm) =>{
            let isSocketName = clients.includes(elm)
            if(!isSocketName)
            {
                return io.sockets.adapter.rooms[elm]["length"] == 1;
            }
        })
        return all_rooms;
    }

    socket.emit('AvailableRooms', available_rooms());

    socket.on('createRoom', (roomId) =>{
        socket.join(roomId);
        console.log("Player created room " + roomId);
    });

    socket.on('leftRoomCreation', (roomId) => {
        socket.leave(roomId);
        console.log("Player left room " + roomId)
    })

    socket.on('joinRoom', (roomId) => {
        var roomExists = io.sockets.adapter.rooms[roomId]
        if(typeof (roomExists) !== "undefined" && roomExists.length > 0)
        {
            var connectedSockets = io.sockets.adapter.rooms[roomId].sockets;
            if (io.sockets.adapter.rooms[roomId] && Object.keys(connectedSockets).length < 2){
                console.log("Player joined room "+ roomId);
                socket.join(roomId);
                
                var player1Id = Object.keys(connectedSockets)[0];
                var player2Id = Object.keys(connectedSockets)[1];

                // Send opponent Id to each, allows to track score
                io.to(player1Id).emit('GameStart', roomId, player2Id);
                io.to(player2Id).emit('GameStart', roomId, player1Id);
                

                data = {}
                data[player1Id] = 0;
                data[player2Id] = 0;

                io.sockets.connected[player1Id].emit('initPlayers');
                console.log("sent to player 1")
                rooms_data[roomId] = Object.assign({}, data,  { "board": Array(225).fill[null, null, null], "letters": {} })
            }
        }
    })

   
    // Word validation
    //FIXME DO SOMETHINNG
    socket.on("endTurn",(board, letters, roomId, refreshLetterOnly=false) =>{
        var data = rooms_data[roomId];
        data["board"] = board;
        data["letters"] = letters;
        io.to(roomId).emit("refreshScore", data)
    })

    socket.on('checkWords', (words, callback) => {

        var response = {"isValid": true};
        for (var i = 0; i < words.length; i++) {
            var arr = (words_dict[words[i].length])
            if(typeof(arr) !== "undefined" && !arr.includes(String(words[i]))){
                response = { "isValid": false };
                callback(response);
                break;
            }
        }
        if(response["isValid"]){
            callback(response);
        }
            
    })

    //Updates scores
    socket.on("newScore",(playerId,score, roomId) => {
        data = rooms_data[roomId];
        console.log(playerId);
        data[playerId] = score;
    })

    // Remove player from array
    socket.on("disconnecting", () =>{
        console.log(socket.id + " disconnected");
        var roomsSocketIn = Object.keys(socket.rooms);
        roomsSocketIn.forEach( (room )=>{ 
            socket.leave(room) ; 

            // notify remaining player that he is alone
            io.to(room).emit('leftGame'); // FIXME: do something with this event

            // removes room from array
            rooms_data.splice(rooms_data.indexOf(room), 1) 
        })
    })
})

server.listen(port, () => {
    console.log('listening on port ' + port)
})
