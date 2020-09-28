import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './controls.css'

class Controls extends React.Component {
    render(){    
        return (
            <div className="controls">
                <button className="btn btn-outline-primary" onClick={this.props.getLetters}>Get letters</button>
                <button className="btn btn-outline-danger" onClick={this.props.cancelTurn}>Cancel</button>
                {this.props.endTurn}
            </div>
        )
    }
}

export default Controls
