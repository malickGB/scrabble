import React from 'react'


class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bonus: this.props.bonus
        }
    }

    render(){
        return (
            <td>
                <button type="button" className="square">
                {this.props.letter}
                </button>
            </td>
        );
    }


}

export default Square
