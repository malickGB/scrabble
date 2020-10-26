import React, { useEffect, useState } from 'react'
import socketIOClient from 'socket.io-client';
import Game from '../game/game';
import shortid from 'shortid';
import './client.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const ENDPOINT = "http://localhost:8080";


var socket = socketIOClient(ENDPOINT);

function Client(){

    const [isPlaying, setIsPlaying] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [opponentId, setOpponentId] = useState(null)

    useEffect(() => {
        socket.on('GameStart', (id, opponentId) =>{
            setRoomId(id);  
            setIsPlaying(prevState => !prevState);
            setOpponentId(opponentId);
            Swal.close()
        })
    })
    

    if (!isPlaying){
        return(
            <div className="lobby">
                <div className="container">
                    <h1>Bienvenue</h1>
                    <div className="buttons-container">
                        <button className="btn btn-primary" onClick={() => createGameHandler()}>Create</button>
                        <button className="btn btn-primary" onClick={() => joinGameHandler()}>Join</button>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return (
            <div>
                <Game
                    socket={socket}
                    roomId={roomId}
                    opponentId={opponentId}
                />
            </div>
        )
    }
    
}

function createGameHandler(){
    var roomId = shortid.generate().substring(0, 6);
    socket.emit('createRoom', roomId);
    Swal.fire({
        title: "Partagez ce code avec un ami",
        text: roomId,
        allowOutsideClick: false,
        confirmButtonText: "Quitter",
        confirmButtonColor: "red"
    }).then((res) => {
        if (res.isConfirmed) {
            socket.emit('leftRoomCreation', roomId);
        }
    })
}

function joinGameHandler(){
    Swal.fire({
        title: 'Identifiant de partie',
        input: 'text',
        inputPlaceholder: 'Entrez un identifiant ',
        inputAttributes: {
            'aria-label': 'Type your message here'
        },
        showCancelButton: true,
        inputValidator: (roomId) => {
            socket.emit('joinRoom', roomId)

        }
    })
}


export default Client