import React from 'react'

function Letter(props) {
    return (
        <p value={getValue(props.letter)}>{props.letter}</p>
    )
}

function getValue(letter){
    var value = 0;
    switch(letter){
        case 'A':
            value = 1;
            break;
        case 'B':
            value = 3;
            break;
        case 'C':
            value = 4;
            break;
        case 'D':
            value = 2;
            break;
        case 'E':
            value = 1;
            break;
        case 'F':
            value = 4;
            break;
        case 'G':
            value = 2;
            break;
        case 'H':
            value = 4;
            break;
        case 'I':
            value = 1;
            break;
        case 'J':
            value = 8;
            break;
        case 'K':
            value = 10;
            break;
        case 'L':
            value = 1;
            break;
        case 'M':
            value = 2;
            break;
        case 'N':
            value = 1;
            break;
        case 'O':
            value = 1;
            break;
        case 'P':
            value = 3;
            break;
        case 'Q':
            value = 8;
            break;
        case 'R':
            value = 1;
            break;
        case 'S':
            value = 1;
            break;
        case 'T':
            value = 1;
            break;
        case 'U':
            value = 1;
            break;
        case 'V':
            value = 4;
            break;
        case 'W':
            value = 10;
            break;
        case 'X':
            value = 10;
            break;
        case 'Y':
            value = 10;
            break;
        case 'Z':
            value = 10;
            break;
        default:
            value = 0;
            break;
    }
    return value;
}
export default Letter
