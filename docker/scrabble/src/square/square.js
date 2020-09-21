import React from 'react'


class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            bonus: 1
        }
    }

    render(){
        return (
            <td>
                <button type="button" className="square">
                </button>
            </td>
        );
    }


}

export default Square
