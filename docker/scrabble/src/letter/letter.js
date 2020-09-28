import React from 'react'
import './letters.css'

class Letter extends React.Component {
    constructor(props){
        super(props);
        this.state=({
            id: this.props.id,
            letter: this.props.letter
        })
    };
    
    handleClick = () => {
        this.setState(() =>{
            if (this.props.onClickLetter){
                this.props.onClickLetter(this.state.id, this.state.letter)
            }
        })
    }

    render(){
        return (
            <button 
                id = {this.props.id}
                onClick={this.handleClick.bind(this)}
                className="letter btn btn-outline-light"
            >
            {this.props.letter}
            </button>
        )
    }
}
export default Letter
