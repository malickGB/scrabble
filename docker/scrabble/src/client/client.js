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
    const [opponentId, setOpponentId] = useState(null);
    const [AvailableRooms, setAvailableRooms] = useState([]);

    
    useEffect(() => {
        let mounted = true;
        socket.on('GameStart', (id, opponentId) =>{
            if(mounted){
                setRoomId(id);
                setIsPlaying(prevState => !prevState);
                setOpponentId(opponentId);
                mounted = false;
                Swal.close()
            }
        })

        socket.on('AvailableRooms', (data) => {
            
            if(mounted){
                console.log("getting rooms")
                setAvailableRooms(data);
            }
        })
        
        return () => {mounted = false}
    })
    

    const allRooms = AvailableRooms.map((room)=>
        <tr key={room}>
            <td>Owner_name's game</td>
            <td>1/2</td>
            <td><button onClick={() => joindRandomGameHandler(room)} className="btn btn-primary">Join</button></td>
        </tr>
    )

    if (!isPlaying){
        return(
            <div className="lobby">
                <div className="container">
                    <h1>Welcome</h1>
                    <div className="buttons-container">
                        <button className="btn btn-primary" onClick={() => createGameHandler()}>Create</button>
                        <button className="btn btn-primary" onClick={() => joinGameHandler()}>Join</button>
                    </div>
                    <table id="games-lobby">
                        <thead>
                            <tr>
                                <th colSpan="3">Available rooms ({allRooms.length})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allRooms}
                        </tbody>
                    </table>
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

function joindRandomGameHandler(roomId){
    socket.emit('joinRoom', roomId);
}


export default Client