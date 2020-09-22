import React from 'react'


class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            bonus: this.props.bonus
        }
    }

    handleclick = () =>{
        this.setState(() =>{
            if (this.props.onClickEmpty){
                this.props.onClickEmpty(this.state.id)
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
