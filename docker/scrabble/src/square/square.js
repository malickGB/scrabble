import React from 'react'
import Letter from '../letter/letter';


class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            bonus_letter: this.props.bonus_letter,
            bonus_word: this.props.bonus_word,
        }
    }
    
    handleclick = () =>{
        this.setState(() =>{
            if (this.props.onClickEmpty){
                this.props.onClickEmpty(this.state.id, this.state.bonus_letter, this.state.bonus_word)
            }
        })
    }

    render(){
        var style = null;
        if (this.state.bonus_letter == 2)
        {
            style = {backgroundColor: '#34aeeb'}
        }
        else if (this.state.bonus_letter == 3)
        {
            style = {backgroundColor: "#1a5287"}
        }
        else if (this.state.bonus_word == 2)
        {
            style = {backgroundColor: "#bf9a21"}
        }
        else if (this.state.bonus_word == 3)
        {
            style = {backgroundColor: "#bf3621"}
        }
        return (
            <td>
                <button className="square" style={style}  onClick={this.handleclick.bind(this)}>
                    {this.props.letter}
                </button>
                
            </td>
        );
    }
}

export default Square
