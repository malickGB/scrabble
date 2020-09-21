import React from 'react';
import Letter from '../letter/letter';
import './board.css'
import Square from '../square/square'

class Board extends React.Component {
    // Display 1 square
    renderSquare(i, bonus = 1 ) {
        return (
            <Square 
                value = {null}
                bonus = {bonus}
            />
        );
    }

    render() {
        return (
            <div className = "game-board">
                <table>
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
                    <tr className="board-row">
                        {this.renderSquare(0, 3)} 
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                        {this.renderSquare(9)}
                        {this.renderSquare(10)}
                        {this.renderSquare(11)}
                        {this.renderSquare(12)}
                        {this.renderSquare(13)}
                        {this.renderSquare(14)}
                        <th>1</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(15)}
                        {this.renderSquare(16)}
                        {this.renderSquare(17)}
                        {this.renderSquare(18)}
                        {this.renderSquare(19)}
                        {this.renderSquare(20)}
                        {this.renderSquare(21)}
                        {this.renderSquare(22)}
                        {this.renderSquare(23)}
                        {this.renderSquare(24)}
                        {this.renderSquare(25)}
                        {this.renderSquare(26)}
                        {this.renderSquare(27)}
                        {this.renderSquare(28)}
                        {this.renderSquare(29)}
                        <th>2</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(30)}
                        {this.renderSquare(31)}
                        {this.renderSquare(32)}
                        {this.renderSquare(33)}
                        {this.renderSquare(34)}
                        {this.renderSquare(35)}
                        {this.renderSquare(36)}
                        {this.renderSquare(37)}
                        {this.renderSquare(38)}
                        {this.renderSquare(39)}
                        {this.renderSquare(40)}
                        {this.renderSquare(41)}
                        {this.renderSquare(42)}
                        {this.renderSquare(43)}
                        {this.renderSquare(44)}
                        <th>3</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(45)}
                        {this.renderSquare(46)}
                        {this.renderSquare(47)}
                        {this.renderSquare(48)}
                        {this.renderSquare(49)}
                        {this.renderSquare(50)}
                        {this.renderSquare(51)}
                        {this.renderSquare(52)}
                        {this.renderSquare(53)}
                        {this.renderSquare(54)}
                        {this.renderSquare(55)}
                        {this.renderSquare(56)}
                        {this.renderSquare(57)}
                        {this.renderSquare(58)}
                        {this.renderSquare(59)}
                        <th>4</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(60)}
                        {this.renderSquare(61)}
                        {this.renderSquare(62)}
                        {this.renderSquare(63)}
                        {this.renderSquare(64)}
                        {this.renderSquare(65)}
                        {this.renderSquare(66)}
                        {this.renderSquare(67)}
                        {this.renderSquare(68)}
                        {this.renderSquare(69)}
                        {this.renderSquare(70)}
                        {this.renderSquare(71)}
                        {this.renderSquare(72)}
                        {this.renderSquare(73)}
                        {this.renderSquare(74)}
                        <th>5</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(75)}
                        {this.renderSquare(76)}
                        {this.renderSquare(77)}
                        {this.renderSquare(78)}
                        {this.renderSquare(79)}
                        {this.renderSquare(80)}
                        {this.renderSquare(81)}
                        {this.renderSquare(82)}
                        {this.renderSquare(83)}
                        {this.renderSquare(84)}
                        {this.renderSquare(85)}
                        {this.renderSquare(86)}
                        {this.renderSquare(87)}
                        {this.renderSquare(88)}
                        {this.renderSquare(89)}
                        <th>6</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(90)}
                        {this.renderSquare(91)}
                        {this.renderSquare(92)}
                        {this.renderSquare(93)}
                        {this.renderSquare(94)}
                        {this.renderSquare(95)}
                        {this.renderSquare(96)}
                        {this.renderSquare(97)}
                        {this.renderSquare(98)}
                        {this.renderSquare(99)}
                        {this.renderSquare(100)}
                        {this.renderSquare(101)}
                        {this.renderSquare(102)}
                        {this.renderSquare(103)}
                        {this.renderSquare(104)}
                        <th>7</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(105)}
                        {this.renderSquare(106)}
                        {this.renderSquare(107)}
                        {this.renderSquare(108)}
                        {this.renderSquare(109)}
                        {this.renderSquare(110)}
                        {this.renderSquare(111)}
                        {this.renderSquare(112)}
                        {this.renderSquare(113)}
                        {this.renderSquare(114)}
                        {this.renderSquare(115)}
                        {this.renderSquare(116)}
                        {this.renderSquare(117)}
                        {this.renderSquare(118)}
                        {this.renderSquare(119)}
                        <th>8</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(120)}
                        {this.renderSquare(121)}
                        {this.renderSquare(122)}
                        {this.renderSquare(123)}
                        {this.renderSquare(124)}
                        {this.renderSquare(125)}
                        {this.renderSquare(126)}
                        {this.renderSquare(127)}
                        {this.renderSquare(128)}
                        {this.renderSquare(129)}
                        {this.renderSquare(130)}
                        {this.renderSquare(131)}
                        {this.renderSquare(132)}
                        {this.renderSquare(133)}
                        {this.renderSquare(134)}
                        <th>9</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(135)}
                        {this.renderSquare(136)}
                        {this.renderSquare(137)}
                        {this.renderSquare(138)}
                        {this.renderSquare(139)}
                        {this.renderSquare(140)}
                        {this.renderSquare(141)}
                        {this.renderSquare(142)}
                        {this.renderSquare(143)}
                        {this.renderSquare(144)}
                        {this.renderSquare(145)}
                        {this.renderSquare(146)}
                        {this.renderSquare(147)}
                        {this.renderSquare(148)}
                        {this.renderSquare(149)}
                        <th>10</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(150)}
                        {this.renderSquare(151)}
                        {this.renderSquare(152)}
                        {this.renderSquare(153)}
                        {this.renderSquare(154)}
                        {this.renderSquare(155)}
                        {this.renderSquare(156)}
                        {this.renderSquare(157)}
                        {this.renderSquare(158)}
                        {this.renderSquare(159)}
                        {this.renderSquare(160)}
                        {this.renderSquare(161)}
                        {this.renderSquare(162)}
                        {this.renderSquare(163)}
                        {this.renderSquare(164)}
                        <th>11</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(165)}
                        {this.renderSquare(166)}
                        {this.renderSquare(167)}
                        {this.renderSquare(168)}
                        {this.renderSquare(169)}
                        {this.renderSquare(170)}
                        {this.renderSquare(171)}
                        {this.renderSquare(172)}
                        {this.renderSquare(173)}
                        {this.renderSquare(174)}
                        {this.renderSquare(175)}
                        {this.renderSquare(176)}
                        {this.renderSquare(177)}
                        {this.renderSquare(178)}
                        {this.renderSquare(179)}
                        <th>12</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(180)}
                        {this.renderSquare(181)}
                        {this.renderSquare(182)}
                        {this.renderSquare(183)}
                        {this.renderSquare(184)}
                        {this.renderSquare(185)}
                        {this.renderSquare(186)}
                        {this.renderSquare(187)}
                        {this.renderSquare(188)}
                        {this.renderSquare(189)}
                        {this.renderSquare(190)}
                        {this.renderSquare(191)}
                        {this.renderSquare(192)}
                        {this.renderSquare(193)}
                        {this.renderSquare(194)}
                        <th>13</th>
                    </tr>
                    <tr className="board-row">
                        {this.renderSquare(195)}
                        {this.renderSquare(196)}
                        {this.renderSquare(197)}
                        {this.renderSquare(198)}
                        {this.renderSquare(199)}
                        {this.renderSquare(200)}
                        {this.renderSquare(201)}
                        {this.renderSquare(202)}
                        {this.renderSquare(203)}
                        {this.renderSquare(204)}
                        {this.renderSquare(205)}
                        {this.renderSquare(206)}
                        {this.renderSquare(207)}
                        {this.renderSquare(208)}
                        {this.renderSquare(209)}
                        <th>14</th>
                    </tr>
                    <tr className="board-row">
                            {this.renderSquare(210)}
                            {this.renderSquare(211)}
                            {this.renderSquare(212)}
                            {this.renderSquare(213)}
                            {this.renderSquare(214)}
                            {this.renderSquare(215)}
                            {this.renderSquare(216)}
                            {this.renderSquare(217)}
                            {this.renderSquare(218)}
                            {this.renderSquare(219)}
                            {this.renderSquare(220)}
                            {this.renderSquare(221)}
                            {this.renderSquare(222)}
                            {this.renderSquare(223)}
                            {this.renderSquare(224)}
                            <th>15</th>
                        </tr>
                </table>
            </div>
        )
    }
}

export default Board
