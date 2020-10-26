import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './controls.css'

function Controls(props) {
    const [show, setShow] = useState(false);
    let socket = props.socket;
    let listener = props.newTurnListener;
    useEffect(() => {
        socket.on("initPlayers", () => {
            setShow(prevState => !prevState);
        });
        socket.on("refreshScore", (data) => {
            setShow(prevState => !prevState);
            listener(data);
        });
        return () => props.socket.disconnect();
    }, [socket])

    if(show)
    {
        return (    
            <div className="controls">
                <span>
                    {props.getLetters}
                </span>
                {props.cancelTurn}
                <span>
                    {props.endTurn}
                </span>
            </div>
        )
    }
    else{
        return(<div className="controls"></div>)
    }

}

export default Controls
