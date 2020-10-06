import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './controls.css'

function Controls(props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        props.socket.on("initPlayers", () => {
            setShow(prevState => !prevState);
        });
        props.socket.on("refreshScore", (data) => {
            setShow(prevState => !prevState);
            props.newTurnListener(data);
        });
        return () => props.socket.disconnect();
    }, [props.socket])

    if(show)
    {
        return (    
            <div className="controls">
                <span onClick={ () => props.turn !== 0 ?  setShow(prevState => !prevState) : null}>
                    {props.getLetters}
                </span>
                {props.cancelTurn}
                <span onClick={() => setShow(prevState => !prevState)}>
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
