import React from 'react'
import socketIOClient from 'socket.io-client';
import Game from '../game/game';
const ENDPOINT = "http://localhost:8080";


var socket = socketIOClient(ENDPOINT);

class Client extends React.Component {
    
    render() {
        return (
            <div>
                <Game
                    socket={socket}
                />
            </div>
        )
    }
}

export default Client