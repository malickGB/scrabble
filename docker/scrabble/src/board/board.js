import React from 'react';
import Letter from '../letter/letter';
import './board.css'
import Square from '../square/square'

class Board extends React.Component {
    bagLetters = {...this.props.lettersBag};

    constructor(props) {
        super(props);
        this.state = {
            squares: this.props.squares,
            player1Letters : [],
            player2Letters : [],
            selectedLetter : null,
        }

    }

    getRandomLetters(currentLetters) {
        //get keys whose value > 0  (contained in the bag)
        var bag = this.bagLetters;
        currentLetters.forEach(element => {
            bag[element[0]] += 1;
        });

        var remainingLetters = Object.keys(bag)
            .filter((key) => bag[key] > 0)
        var res = [];
        for (;Object.keys(remainingLetters).length > 0 && res.length < 7;) {
            var randIndex = Math.floor(Math.random() * remainingLetters.length);
            var letter = remainingLetters[randIndex];
            if (bag[letter] > 0)
            {
                var remaining = bag[letter];
                res.push([letter, remaining]);
                // Change amout of remaining letters
                var remainingLetters = Object.keys(bag)
                    .filter((key) => bag[key] >= 0)
                bag[letter] -= 1;
            }
        }
        this.bagLetters = bag
        console.log(bag);
        return res;
    }

    /**
     * puts letter into the board
     * TODO : Remove from player's hand
     */
    onClickEmptyHandler = (id, data) => {
        if (this.state.selectedLetter != null) {
            var squares = this.state.squares.slice();
            squares[id] = this.state.selectedLetter;
            this.setState({
                squares: squares,
                selectedLetter: null,
            })
        }
    }

    // Displays square
    renderSquare(id, bonus_letter = 1, bonus_word = 1) {
        return (
            <Square
                id = {id}
                letter = {this.state.squares[id][1]}
                bonus_letter = {bonus_letter}
                bonus_word = {bonus_word}
                onClickEmpty = {this.onClickEmptyHandler}
            />
        );
    }


    // Get new Letters
    btn1Click = () => {
        var currentLetters = this.state.player1Letters.slice(); 
        this.setState({
           player1Letters : this.getRandomLetters(currentLetters)
        });
    }

    btn2Click = () => {
        var currentLetters = this.state.player2Letters.slice();
        this.setState({
            player2Letters: this.getRandomLetters(currentLetters)
        });
    }

    render() {
        const onClickLetterHandler = (id, letter) =>{
            this.setState({
                selectedLetter: [id,letter]
            })
        }

        return (
            <div className="game-board">
                <table>
                    <thead>
                        {/* 15*15 board */}
                        <tr>
                            <th>A</th>
                            <th>B</th>
                            <th>C</th>
                            <th>D</th>
                            <th>E</th>
                            <th>F</th>
                            <th>G</th>
                            <th>H</th>
                            <th>I</th>
                            <th>J</th>
                            <th>K</th>
                            <th>L</th>
                            <th>M</th>
                            <th>N</th>
                            <th>O</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="board-row">
                            {this.renderSquare(0, 1, 3)}
                            {this.renderSquare(1)}
                            {this.renderSquare(2)}
                            {this.renderSquare(3, 2)}
                            {this.renderSquare(4)}
                            {this.renderSquare(5)}
                            {this.renderSquare(6)}
                            {this.renderSquare(7, 1, 3)}
                            {this.renderSquare(8)}
                            {this.renderSquare(9)}
                            {this.renderSquare(10)}
                            {this.renderSquare(11, 2)}
                            {this.renderSquare(12)}
                            {this.renderSquare(13)}
                            {this.renderSquare(14, 1, 3)}
                            <th>1</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(15)}
                            {this.renderSquare(16, 1, 2)}
                            {this.renderSquare(17)}
                            {this.renderSquare(18)}
                            {this.renderSquare(19)}
                            {this.renderSquare(20, 3)}
                            {this.renderSquare(21)}
                            {this.renderSquare(22)}
                            {this.renderSquare(23)}
                            {this.renderSquare(24, 3)}
                            {this.renderSquare(25)}
                            {this.renderSquare(26)}
                            {this.renderSquare(27)}
                            {this.renderSquare(28, 1, 2)}
                            {this.renderSquare(29)}
                            <th>2</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(30)}
                            {this.renderSquare(31)}
                            {this.renderSquare(32, 1, 2)}
                            {this.renderSquare(33)}
                            {this.renderSquare(34)}
                            {this.renderSquare(35)}
                            {this.renderSquare(36, 2)}
                            {this.renderSquare(37)}
                            {this.renderSquare(38, 2)}
                            {this.renderSquare(39)}
                            {this.renderSquare(40)}
                            {this.renderSquare(41)}
                            {this.renderSquare(42, 1, 2)}
                            {this.renderSquare(43)}
                            {this.renderSquare(44)}
                            <th>3</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(45, 2)}
                            {this.renderSquare(46)}
                            {this.renderSquare(47)}
                            {this.renderSquare(48, 1, 2)}
                            {this.renderSquare(49)}
                            {this.renderSquare(50)}
                            {this.renderSquare(51)}
                            {this.renderSquare(52, 2)}
                            {this.renderSquare(53)}
                            {this.renderSquare(54)}
                            {this.renderSquare(55)}
                            {this.renderSquare(56, 1, 2)}
                            {this.renderSquare(57)}
                            {this.renderSquare(58)}
                            {this.renderSquare(59, 2)}
                            <th>4</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(60)}
                            {this.renderSquare(61)}
                            {this.renderSquare(62)}
                            {this.renderSquare(63)}
                            {this.renderSquare(64, 1, 2)}
                            {this.renderSquare(65)}
                            {this.renderSquare(66)}
                            {this.renderSquare(67)}
                            {this.renderSquare(68)}
                            {this.renderSquare(69)}
                            {this.renderSquare(70, 1, 2)}
                            {this.renderSquare(71)}
                            {this.renderSquare(72)}
                            {this.renderSquare(73)}
                            {this.renderSquare(74)}
                            <th>5</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(75)}
                            {this.renderSquare(76, 3)}
                            {this.renderSquare(77)}
                            {this.renderSquare(78)}
                            {this.renderSquare(79)}
                            {this.renderSquare(80, 3)}
                            {this.renderSquare(81)}
                            {this.renderSquare(82)}
                            {this.renderSquare(83)}
                            {this.renderSquare(84, 3)}
                            {this.renderSquare(85)}
                            {this.renderSquare(86)}
                            {this.renderSquare(87)}
                            {this.renderSquare(88, 3)}
                            {this.renderSquare(89)}
                            <th>6</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(90)}
                            {this.renderSquare(91)}
                            {this.renderSquare(92, 2)}
                            {this.renderSquare(93)}
                            {this.renderSquare(94)}
                            {this.renderSquare(95)}
                            {this.renderSquare(96, 2)}
                            {this.renderSquare(97)}
                            {this.renderSquare(98, 2)}
                            {this.renderSquare(99)}
                            {this.renderSquare(100)}
                            {this.renderSquare(101)}
                            {this.renderSquare(102, 2)}
                            {this.renderSquare(103)}
                            {this.renderSquare(104)}
                            <th>7</th>
                        </tr>
                        {/*  middle */}
                        <tr className="board-row">
                            {this.renderSquare(105, 1, 3)}
                            {this.renderSquare(106)}
                            {this.renderSquare(107)}
                            {this.renderSquare(108, 2)}
                            {this.renderSquare(109)}
                            {this.renderSquare(110)}
                            {this.renderSquare(111)}
                            {this.renderSquare(112)}
                            {this.renderSquare(113)}
                            {this.renderSquare(114)}
                            {this.renderSquare(115)}
                            {this.renderSquare(116, 2)}
                            {this.renderSquare(117)}
                            {this.renderSquare(118)}
                            {this.renderSquare(119, 1, 3)}
                            <th>8</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(120)}
                            {this.renderSquare(121)}
                            {this.renderSquare(122, 2)}
                            {this.renderSquare(123)}
                            {this.renderSquare(124)}
                            {this.renderSquare(125)}
                            {this.renderSquare(126, 2)}
                            {this.renderSquare(127)}
                            {this.renderSquare(128, 2)}
                            {this.renderSquare(129)}
                            {this.renderSquare(130)}
                            {this.renderSquare(131)}
                            {this.renderSquare(132, 2)}
                            {this.renderSquare(133)}
                            {this.renderSquare(134)}
                            <th>9</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(135)}
                            {this.renderSquare(136, 3)}
                            {this.renderSquare(137)}
                            {this.renderSquare(138)}
                            {this.renderSquare(139)}
                            {this.renderSquare(140, 3)}
                            {this.renderSquare(141)}
                            {this.renderSquare(142)}
                            {this.renderSquare(143)}
                            {this.renderSquare(144, 3)}
                            {this.renderSquare(145)}
                            {this.renderSquare(146)}
                            {this.renderSquare(147)}
                            {this.renderSquare(148, 3)}
                            {this.renderSquare(149)}
                            <th>10</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(150)}
                            {this.renderSquare(151)}
                            {this.renderSquare(152)}
                            {this.renderSquare(153)}
                            {this.renderSquare(154, 1, 2)}
                            {this.renderSquare(155)}
                            {this.renderSquare(156)}
                            {this.renderSquare(157)}
                            {this.renderSquare(158)}
                            {this.renderSquare(159)}
                            {this.renderSquare(160, 1, 2)}
                            {this.renderSquare(161)}
                            {this.renderSquare(162)}
                            {this.renderSquare(163)}
                            {this.renderSquare(164)}
                            <th>11</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(165, 2)}
                            {this.renderSquare(166)}
                            {this.renderSquare(167)}
                            {this.renderSquare(168, 1, 2)}
                            {this.renderSquare(169)}
                            {this.renderSquare(170)}
                            {this.renderSquare(171)}
                            {this.renderSquare(172, 2)}
                            {this.renderSquare(173)}
                            {this.renderSquare(174)}
                            {this.renderSquare(175)}
                            {this.renderSquare(176, 1, 2)}
                            {this.renderSquare(177)}
                            {this.renderSquare(178)}
                            {this.renderSquare(179, 2)}
                            <th>12</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(180)}
                            {this.renderSquare(181)}
                            {this.renderSquare(182, 1, 2)}
                            {this.renderSquare(183)}
                            {this.renderSquare(184)}
                            {this.renderSquare(185)}
                            {this.renderSquare(186, 2)}
                            {this.renderSquare(187)}
                            {this.renderSquare(188, 2)}
                            {this.renderSquare(189)}
                            {this.renderSquare(190)}
                            {this.renderSquare(191)}
                            {this.renderSquare(192, 1, 2)}
                            {this.renderSquare(193)}
                            {this.renderSquare(194)}
                            <th>13</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(195)}
                            {this.renderSquare(196, 1, 2)}
                            {this.renderSquare(197)}
                            {this.renderSquare(198)}
                            {this.renderSquare(199)}
                            {this.renderSquare(200, 3)}
                            {this.renderSquare(201)}
                            {this.renderSquare(202)}
                            {this.renderSquare(203)}
                            {this.renderSquare(204, 3)}
                            {this.renderSquare(205)}
                            {this.renderSquare(206)}
                            {this.renderSquare(207)}
                            {this.renderSquare(208, 1, 2)}
                            {this.renderSquare(209)}
                            <th>14</th>
                        </tr>
                        <tr className="board-row">
                            {this.renderSquare(210, 1, 3)}
                            {this.renderSquare(211)}
                            {this.renderSquare(212)}
                            {this.renderSquare(213, 2)}
                            {this.renderSquare(214)}
                            {this.renderSquare(215)}
                            {this.renderSquare(216)}
                            {this.renderSquare(217, 1, 3)}
                            {this.renderSquare(218)}
                            {this.renderSquare(219)}
                            {this.renderSquare(220)}
                            {this.renderSquare(221, 2)}
                            {this.renderSquare(222)}
                            {this.renderSquare(223)}
                            {this.renderSquare(224, 1, 3)}
                            <th>15</th>
                        </tr>
                    </tbody>
                </table>
                <ul>
                    {this.state.player1Letters.map((value) =>{
                        return  <li key={"player1-"+this.bagLetters[value[0]]+value}>
                                    <Letter
                                        id={"player1-" + this.bagLetters[value[0]] + value}
                                        letter={value[0]}
                                        onClickLetter={onClickLetterHandler}
                                    />
                                </li>
                    })}
                </ul>
                <ul>
                    {this.state.player2Letters.map((value) => {
                        return <li key={"player2-" + this.bagLetters[value[0]] + value}>
                                    <Letter
                                        id={"player2-" + this.bagLetters[value[0]] + value}
                                        letter={value[0]}
                                        onClickLetter={onClickLetterHandler}
                                    />
                                </li>
                    })}
                </ul>
                <button onClick={this.btn1Click.bind(this)}>refresh 1</button>

                <button onClick={this.btn2Click.bind(this)}>refresh 2</button>
            </div>       
        )
    }
}

export default Board
