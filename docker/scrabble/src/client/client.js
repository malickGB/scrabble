import React from 'react'
import socketIOClient from 'socket.io-client';
import Game from '../game/game';
import shortid from 'shortid';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
const ENDPOINT = "http://localhost:8080";


var socket = socketIOClient(ENDPOINT);

class Client extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isPlaying: false
        }
        this.roomId = null;
    }

    createGameHandler = () => {
        this.roomId = shortid.generate().substring(0,6);
        socket.emit('createRoom', this.roomId);
        Swal.fire({
            title: "Partagez ce code avec un ami",
            text:  this.roomId,
            allowOutsideClick: false,
            confirmButtonText: "Quitter",
            confirmButtonColor: "red"
        }).then((res)=>{
            if(res.isConfirmed){
                socket.emit('leftRoomCreation', this.roomId);
            }
        })
        // FIXME
    }

    joinGameHandler = () => {
        Swal.fire({
            title: 'Identifiant de partie',
            input: 'text',
            inputPlaceholder: 'Entrez un identifiant ',
            inputAttributes: {
                'aria-label': 'Type your message here'
            },
            showCancelButton: true,
            inputValidator: (roomId) =>{
                socket.emit('joinRoom', roomId)
            }
        })
    }

    render() {
        if (!this.state.isPlaying){
            return(
                <div className="lobby">
                    <div className="buttons-container">
                        <button className="btn btn-primary" onClick={this.createGameHandler.bind(this)}>Create</button>
                        <button className="btn btn-primary" onClick={this.joinGameHandler.bind(this)}>Join</button>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div>

                    <Game
                        socket={socket}
                    />
                </div>
            )
        }
    }
}

export default Client