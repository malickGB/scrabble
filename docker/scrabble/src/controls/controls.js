import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './controls.css'

function Controls(props) {
    const [show, setShow] = useState(false);
    const listener = props.newTurnListener;
    
    useEffect(() => {
        var tmp = show;
        props.socket.on("initPlayers", () => {
            setShow(prevState => !prevState);
            
        });
        props.socket.on("refreshScore", (data) => {
            setShow(prevState => !prevState);
            listener(data);
        });
        props.socket.on("disconnect", () => {
            props.socket.disconnect();
        })
        
        props.socket.on("leftGame")
    }, [props.socket]) 


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
