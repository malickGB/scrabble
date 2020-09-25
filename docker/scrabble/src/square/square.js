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
        return (
            <td>
                <button className="square" onClick={this.handleclick.bind(this)}>
                    {this.props.letter}
                </button>
            </td>
        );
    }
}

export default Square
