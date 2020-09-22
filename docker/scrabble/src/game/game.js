import React from 'react'
import Board from '../board/board';
import Letter from '../letter/letter';

class Game extends React.Component{
    getLetters(){
        var res = {
            "A": 9,
            "B": 2,
            "C": 2,
            "D": 3,
            "E": 15,
            "F": 2,
            "G": 2,
            "H": 2,
            "I": 8,
            "J": 1,
            "K": 1,
            "L": 5,
            "M": 3,
            "N": 6,
            "O": 6,
            "P": 2,
            "Q": 1,
            "R": 6,
            "S": 6,
            "T": 6,
            "U": 6,
            "V": 2,
            "W": 1,
            "X": 1,
            "Y": 1,
            "Z": 1,
            "_": 2
        };
        return res;
    }
    
    constructor(props){
        super(props);
        var lettersBag = this.getLetters();
        this.state = 
        {
            array: Array(205).fill(null),
            lettersBag: lettersBag
        }
    }


    render(){
        return (
            <Board 
                squares = {this.state.array}
                lettersBag = {this.state.lettersBag}
            />
        );
    }
}

export default Game