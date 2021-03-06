import React from 'react'
import './square.css'


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
        var style = {};
        if (this.state.bonus_letter === 2)
        {
            style = {backgroundColor: '#34aeeb'}
        }
        else if (this.state.bonus_letter === 3)
        {
            style = {backgroundColor: "#1a5287"}
        }
        else if (this.state.bonus_word === 2)
        {
            style = {backgroundColor: "#bf9a21"}
        }
        else if (this.state.bonus_word === 3)
        {
            style = {backgroundColor: "#bf3621"}
        }
        if(this.props.isValidMove){
            Object.assign(style,{border: "2px solid green"})
        }
        if(this.props.letter)
        {
            Object.assign(style, { backgroundColor: "#76bd89" })
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
