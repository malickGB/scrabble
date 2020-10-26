import React from 'react';
import Letter from '../letter/letter';
import './board.css'
import Square from '../square/square'
import {getValue, playerHas} from '../utils/utils'
import Controls from '../controls/controls';
import { type } from 'jquery';


/**
 * TODO:
 *      Mechanics                                       [X]
 *      - Get availables tile to play                   [X]
 *          - Play horizontallly                        [X]
 *          - Play vertically                           [X]
 *          - Reset turn                                [X]
 *      - Add validation button to end turn             [X]
 *      - Check turn, know if middle only available     [X]
 *      - Save state before playing:                    [X]
 *          - If cancel                                 [X]
 *      - Add case not turn 1, and 1 letter played      [X]
 *      - Pass turn when get new letters                [X]
 *      - Handle game finish                            [ ]
 *      - Create a lobby                                [ ]
 * 
 *
 *  ... Implement rules                                 [ ]
 *      - Get newly created word                        [X]
 *      - Count total points for newly created word     [X]
 *      - Count Bonus                                   [X]
 *      - Count Bonus Word                              [X]
 *      - in case not valid word , cancel input         [ ]
 *      - Add verification (from dictionnary API?)      [ ]
 *      - Add SCRABBLE +50                              [X]
 * 
 *      Style
 *      - Display playable squares                      [X]
 *      - Have a better Interface                       [ ]
 *      - Show scores                                   [X]
 */
class Board extends React.Component {
    bagLetters = { ...this.props.lettersBag};
    constructor(props) {
        super(props);
        this.props.socket.on("initPlayers", (turn) => {
            this.setState({
                player1Turn: turn,
                isPlayerTurn: true  
            })
        })
        this.state = {
            squares: this.props.squares,
            player1Letters: [],
            player2Letters: [],
            selectedLetter: null,
            backup: [],
            player1Turn: false,
            validSquares: { 'top': null, 'bot': null, 'left': null, 'right': null, 'first': 112 },
            allAvailableSquares: [],
            turn: 0,
            scorePlayer1:0,
            scorePlayer2:0,
            isPlayerTurn: false,
            roomId: this.props.roomId,

        }
    }

    /**
     * Gives player a new set of letters
     * Put his letters back to the set
     * 
     * @param {Array} currentLetters 
     * @param {Bool} complete : if player has played, completes letters to 7 
     */
    getRandomLetters(currentLetters = [], complete = false) {
        //get keys whose value > 0  (contained in the bag)
        var bag = this.bagLetters;
        if (!complete)
        {
            // Put back player's letters in the bag
            currentLetters.forEach(element => {
                bag[element[0]] += 1;
            });
            var res = [];
        }
        else
            res = [...currentLetters];
        var remainingLetters = Object.keys(bag)
            .filter((key) => bag[key] > 0)
        for (; remainingLetters.length > 0 && res.length < 7;) {
            var randIndex = Math.floor(Math.random() * remainingLetters.length);
            var letter = remainingLetters[randIndex];
                
            if (bag[letter] > 0) {
                var remaining = bag[letter];
                res.push([letter, remaining - 1]);
                // Change amout of remaining letters
                bag[letter] -= 1;
                remainingLetters = Object.keys(bag)
                    .filter((key) => bag[key] > 0)
            }
        }
        // FIXME: Handle finishing game
        // if(remainingLetters == [])
        // {
        //     this.bagLetters = null;  
        // }
        this.bagLetters = bag;
        return res;
    }


    /**
     * Returns true if the board is empty
     */
    isEmpty = () => {
        for (var i = 0; i < this.state.squares.length; i++) {
            if (this.state.squares[i][0] != null)
                return false;
        }
        return true;
    }

    /**
     * Returns availables squares depending on the last one played
     */
    getNextCoordinates = (squares, backup) => {
        var top = backup[backup.length - 1][2] - 15;
        if (typeof squares[top] == 'undefined' || squares[top][0] != null) {
            while (typeof squares[top] != 'undefined' && squares[top][0] != null) {
                top -= 15;
            }
            if (top < 0)
                top = null;
        }
        var bot = backup[backup.length - 1][2] + 15;
        if (typeof squares[bot] == 'undefined' || squares[bot][0] != null) {
            while (typeof squares[bot] != 'undefined' && squares[bot][0] != null) {
                bot += 15;
            }
            if (bot > 224)
                bot = null;
        }
        var left = backup[backup.length - 1][2] - 1;
        if (typeof squares[left] == 'undefined' || squares[left][0] != null || left % 15 === 14) {
            while (typeof squares[left] != 'undefined' && squares[left][0] != null && left % 15 !== 14) {
                left -= 1;
            }
            if (left < 0 || (left % 15) === 14)
                left = null;
        }
        var right = backup[backup.length - 1][2] + 1;
        if (typeof squares[right] == 'undefined' || squares[right][0] != null || right % 15 === 0) {
            while (typeof squares[right] != 'undefined' && squares[right][0] != null && right % 15 !== 0) {
                right += 1;
            }
            if ((right % 15) === 0)
                right = null;
        }
        return [top, bot, left, right];
    }

    getValidSquares = () => {
        // case first turn
        if (this.state.validSquares['first'] === 112 && this.state.squares[112][0] === null) {
            return
        }

        // If player has canceled his first move, reset to middle square only available
        var canceledFirstMove = true;
        Object.keys(this.state.validSquares).forEach((key) => {
            if (this.state.validSquares[key] != null)
                canceledFirstMove = false;
        })

        if (canceledFirstMove && this.isEmpty()) {
            this.setState({
                validSquares: { 'top': null, 'bot': null, 'left': null, 'right': null, 'first': 112 }
            });
            return;
        }

        var validSquares = { 'top': null, 'bot': null, 'left': null, 'right': null, 'first': null };
        var squares = [...this.state.squares];
        var backup = [...this.state.backup];
        // Player starts playing, get all available squares
        
        if (backup.length === 0) {
            var allAvailableSquares = [];
            
            for (var i = 0; i < squares.length; i++) {
                if (squares[i][0] != null) {
                    var top = i - 15;
                    var bot = i + 15;
                    var left = i - 1;
                    var right = i + 1;
                    if (typeof squares[top] != 'undefined' && squares[top][0] == null)
                        allAvailableSquares.push(top);
                    if (typeof squares[bot] != 'undefined' && squares[bot][0] == null)
                        allAvailableSquares.push(bot);
                    if (typeof squares[left] != 'undefined' && squares[left][0] == null && left % 15 !== 14)
                        allAvailableSquares.push(left);
                    if (typeof squares[right] != 'undefined' && squares[right][0] == null && right % 15 !== 0)
                        allAvailableSquares.push(right);
                }
            }
            this.setState({
                allAvailableSquares: allAvailableSquares,
                validSquares: { 'top': null, 'bot': null, 'left': null, 'right': null, 'first': null }
            });
            return;
        }
        else if (backup.length > 0) {
            // Player has played already, get coordinates from last played square
            var newCoordinates = this.getNextCoordinates(squares, backup);
            top = newCoordinates[0];
            bot = newCoordinates[1];
            left = newCoordinates[2];
            right = newCoordinates[3];
            if (backup.length > 1) {
                var axis = backup[backup.length - 1][2] - backup[backup.length - 2][2]
                //playing horizontally
                if (Math.abs(axis) < 15) {
                    validSquares['top'] = null;
                    validSquares['bot'] = null;
                    validSquares['left'] = left;
                    validSquares['right'] = right;
                }
                // Playing vertically
                else {
                    validSquares['top'] = top;
                    validSquares['bot'] = bot;
                    validSquares['left'] = null;
                    validSquares['right'] = null;
                }
            }
            else {
                // Played only 1 time, don't know which direction to play
                validSquares = { 'top': top, 'bot': bot, 'left': left, 'right': right, 'first': null };
            }
        }
        this.setState({
            validSquares: validSquares
        })
    }

    /**
     * puts letter into the board
     * Sets a bonus
     */
    onClickEmptyHandler = (id, bonus_letter, bonus_word) => {
        // remove from player's hand
        // if(this.state.player1Letters.includes())
        var nextMoveLegal = false;
        Object.keys(this.state.validSquares).forEach((key) => {
            if (id === this.state.validSquares[key])
                nextMoveLegal = true;
        })
        if (this.state.allAvailableSquares.includes(id))
            nextMoveLegal = true
        if (this.state.selectedLetter != null && nextMoveLegal === true) {
            var squares = this.state.squares.slice();
            var backup = this.state.backup.slice();
            // INSERTS BONUS HERE
            squares[id] = [this.state.selectedLetter[1], bonus_letter, bonus_word];
            var letter_id = this.state.selectedLetter[0];
            letter_id = letter_id.split('-');
            var letter_id_number = letter_id[letter_id.length - 1];
            backup.push([this.state.selectedLetter[1], parseInt(letter_id_number), id]);
            this.setState({
                squares: squares,
                selectedLetter: null,
                backup: backup,
                allAvailableSquares: []
            })
            var playercopy = this.state.player1Letters.slice();
            var removeFromPlayer1 = true
            var selected = [this.state.selectedLetter[1], parseInt(letter_id_number)] // parse id to match with player's letters
            var index = playerHas(playercopy, selected);

            // Check who has the letter & delete from his letters
            if (index < 0) {
                playercopy = this.state.player2Letters.slice();
                removeFromPlayer1 = false;
                index = playerHas(playercopy, selected);
            }
            playercopy.splice(index, 1);

            // Re render letters list
            if (removeFromPlayer1) {
                this.setState({
                    player1Letters: playercopy
                })
            }
            else {
                this.setState({
                    player2Letters: playercopy
                })
            }
            this.renderSquare(id);
        }
    }

    // Displays square
    renderSquare(id, bonus_letter = 1, bonus_word = 1) {
        var isValidMove = false
        Object.keys(this.state.validSquares).forEach((key) => {
            if (id === this.state.validSquares[key])
                isValidMove = true;
        })
        if (this.state.allAvailableSquares.includes(id)){
            isValidMove = true;
        }
        return (
            <Square
                id={id}
                letter={this.state.squares[id][0]}
                bonus_letter={bonus_letter}
                bonus_word={bonus_word}
                onClickEmpty={this.onClickEmptyHandler}
                isValidMove={isValidMove}
            />
        );
    }

    // Get new Letters
    refreshPlayerLetters = () => {
        // if (this.state.player1Turn) {
        //     var currentLetters = this.state.player1Letters.slice();
        //     if(this.state.turn !== 0 || (this.state.turn === 0 && this.state.player1Letters.length !== 0))
        //     {
        //         this.setState({
        //             player1Letters: this.getRandomLetters(currentLetters),
        //             selectedLetter: null,
        //             backup: [],
        //             validSquares: { 'top': null, 'bot': null, 'left': null, 'right': null, 'first': null },
        //             turn: this.state.turn + 1,
        //             isPlayerTurn: !this.state.isPlayerTurn
        //         });
        //         this.props.socket.emit("endTurn", this.state.squares, this.bagLetters, this.state.roomId, true);
        //     }
        //     else{
        //         this.setState({
        //             player1Letters: this.getRandomLetters(currentLetters)
        //         })
        //     }
        // }
        // // Player 2
        // else {
            var currentLetters = this.state.player2Letters.slice();
            if (this.state.turn !== 0 || (this.state.turn === 0 && this.state.player2Letters.length !== 0)) {
                this.setState({
                    player2Letters: this.getRandomLetters(currentLetters),
                    selectedLetter: null,
                    backup: [],
                    validSquares: { 'top': null, 'bot': null, 'left': null, 'right': null, 'first': null },
                    turn: this.state.turn + 1,
                    isPlayerTurn: !this.state.isPlayerTurn
                });
                this.props.socket.emit("endTurn", this.state.squares, this.bagLetters, this.state.roomId, true);
            }
            else {
                this.setState({
                    player2Letters: this.getRandomLetters(currentLetters)
                })
            }
        // }
    }

    onClickLetterHandler = (id, letter) => {
        this.getValidSquares();
        this.setState({
            selectedLetter: [id, letter]
        })
    }

    /**
     * Put letters back in player's hand
     * Removes table from board
     */
    onClickCancel = () => {
        var backup = this.state.backup;
        var squares = this.state.squares;
        var playerLetters = this.state.player1Letters;
        if (!this.state.player1Turn) {
            playerLetters = this.state.player2Letters;
        }
        for (var i = 0; i < backup.length; i++) {
            playerLetters.push([backup[i][0], backup[i][1]]);
            squares[backup[i][2]] = [null, null];
        }
        if (this.state.player1Turn) {
            this.setState({
                player1Letters: playerLetters,
                backup: [],
                validSquares: {},
                squares: squares,

            })
        }
        else {
            this.setState({
                player2Letters: playerLetters,
                backup: [],
                validSquares: {},
                squares: squares, 

            })
        }
    }

    /**
     * Returns letter value * bonus_letter
     */
    countLettersPoint = (letter, index, squaresCopy) => {
        var res = getValue(letter) * squaresCopy[index][1];

        // Remove bonus because already used
        if (squaresCopy[index][1] !== 1) {
            squaresCopy[index] = [squaresCopy[index][0], 1, squaresCopy[index][2]]
        }
        return [res, squaresCopy];
    }

    /**
     * Returns words created by consequence..
     */
    getAdjacentWords = () => {
        var putLetters = this.state.backup.map((elm) => elm[2]).sort((a, b) => a - b);
        var res = [];
        var index = putLetters.length - 1;
        var current = putLetters[index];
        var score = 0;
        var bonus_word = 1;
        var bonus_id = 0;
        var squaresCopy = [...this.state.squares];
        // Plays horizontally
        if ((putLetters[1] - putLetters[0]) < 15) {
            // Go all the way right and watch left
            while ((current + 1) % 15 !== 0 && typeof squaresCopy[current + 1] != 'undefined' && squaresCopy[current + 1][0] !== null) {
                current += 1;
            }
            var tmp = "";

            // Go all the way left, build the word from end to beginning
            // WHILE : on the same line | not empty 
            while (((current - 1) % 15) !== 14 && typeof squaresCopy[current] != 'undefined' && squaresCopy[current][0] !== null) {
                tmp = squaresCopy[current][0] + tmp;
                // Remember to Apply bonus word at the end
                if (squaresCopy[current][2] > 1){
                    bonus_word = squaresCopy[current][2];
                    bonus_id = current;
                }
                var updated = this.countLettersPoint(squaresCopy[current][0], current, squaresCopy);
                score += updated[0];
                squaresCopy = updated[1];
                current -= 1;
            }
            // Apply bonus & reset value
            if(bonus_word !== 1)
            {

                score *= bonus_word;
                bonus_word = 1;
                squaresCopy[bonus_id] = [squaresCopy[bonus_id][0], squaresCopy[bonus_id][1], bonus_word]
            }
            res.push([tmp, score])

            // Watch vertically for all letters
            score = 0;
            for (var i = 0; i < putLetters.length; i++) {
                var first = putLetters[i];
                // Go to the first vertically
                while (typeof squaresCopy[first - 15] != 'undefined' && squaresCopy[first - 15][0] != null) {
                    first -= 15;
                }
                tmp = "";
                // Get the whole word vertically
                while (typeof squaresCopy[first] != 'undefined' && squaresCopy[first][0] != null) {
                    tmp = tmp + squaresCopy[first][0];
                    if (squaresCopy[first][2] > 1){
                        bonus_id = first
                        bonus_word = squaresCopy[first][2];
                    }
                    updated = this.countLettersPoint(squaresCopy[first][0], first, squaresCopy);
                    score += updated[0];
                    squaresCopy = updated[1];
                    first += 15;
                }
                if (tmp.length > 1) {
                    if (bonus_word !== 1)
                    {
                        score *= bonus_word;
                        bonus_word = 1;
                        squaresCopy[bonus_id] = [squaresCopy[bonus_id][0], squaresCopy[bonus_id][1], 1]
                    }          
                    res.push([tmp, score]);
                }
                score = 0;
            }
        }
        else {
            // go all the way top and watch bottom
            while (typeof squaresCopy[current - 15] != 'undefined' && squaresCopy[current - 15][0] != null) {
                current -= 15;
            }
            tmp = "";
            // Builds the word up to down
            while (typeof squaresCopy[current] != 'undefined' && squaresCopy[current][0] != null) {
                tmp = tmp + squaresCopy[current][0];
                updated = this.countLettersPoint(squaresCopy[current][0], current, squaresCopy);
                // ADD BONUS WORD HERE
                if (squaresCopy[current][2] > 1){
                    bonus_word = squaresCopy[current][2];
                    bonus_id = current;
                }
                score += updated[0];
                squaresCopy = updated[1];
                current += 15;
            }
            if (bonus_word !== 1) {
                score *= bonus_word;
                bonus_word = 1;
                squaresCopy[bonus_id] = [squaresCopy[bonus_id][0], squaresCopy[bonus_id][1], 1]
            }
            res.push([tmp, score])
            score = 0;
            // Watch horizontally for all words
            for (i = 0; i < putLetters.length; i++) {
                first = putLetters[i];
                // go all the way left
                while (((first - 1) % 15) !== 14 && typeof squaresCopy[first - 1] != 'undefined' && squaresCopy[first - 1][0] !== null) {
                    first -= 1;
                }

                tmp = "";
                // Get whole word horizontally
                while (((first + 1) % 15) !== 0 && typeof squaresCopy[first] != 'undefined' && squaresCopy[first][0] != null) {
                    tmp = tmp + squaresCopy[first][0];
                    updated = this.countLettersPoint(squaresCopy[first][0], first, squaresCopy);
                    // ADD BONUS WORD HERE
                    if (squaresCopy[first][2] > 1){
                        bonus_word = squaresCopy[first][2];
                        bonus_id = first;
                    }
                    score += updated[0];
                    squaresCopy = updated[1];
                    first += 1;
                }
                if (tmp.length > 1) {
                    if (bonus_word !== 1) {
                        score *= bonus_word;
                        bonus_word = 1;
                        squaresCopy[bonus_id] = [squaresCopy[bonus_id][0], squaresCopy[bonus_id][1], 1];
                    }  
                    res.push([tmp, score]);
                }
                score = 0;
            }
        }
        this.setState({
            squares: squaresCopy
        })
        return res;
    }


    /** 
     * Returns the word players has created with own letters
     */
    getCreatedWord = async () => {
        var res = this.getAdjacentWords();
        var score = 0;
        if(this.state.player1Turn)
        {
            score = this.state.scorePlayer1;
        }
        else
            score = this.state.scorePlayer2;

        var words = []; 
        for (var i = 0; i < res.length; i++) {
            var points = res[i][1];
            if (res[i][0].length > 1)
                words.push(res[i][0]); 
            score += points
        }

        console.log(words);

        const checkValid = new Promise(resolve => {
            this.props.socket.emit('checkWords', words, (res) => {
                resolve(res);
            });
        })

        return checkValid.then((isValid) => {
            if (isValid["isValid"]) {
                // Get new letters if scrabble , adds extra  50 points
                if (this.state.backup.length === 7)
                    score += 50;

                if (this.state.player1Turn) {
                    this.props.socket.emit("newScore", "player1", score, this.state.roomId)
                    var completedLetters = this.getRandomLetters(this.state.player1Letters, true)
                    this.setState({
                        player1Letters: completedLetters,
                        scorePlayer1: score
                    })
                }
                else {
                    completedLetters = this.getRandomLetters(this.state.player2Letters, true)
                    this.props.socket.emit("newScore", "player2", score, this.state.roomId)
                    this.setState({
                        player2Letters: completedLetters,
                        scorePlayer2: score,
                    })
                }
                return true;
            }
            else {
                this.onClickCancel();
                return false;
            }
        })
        // FIXME : Add verification from a dictionnary
    }

    // Wait till variable is defined : FIXME
    onClickEndTurn = async () => {
        var isValid = await this.getCreatedWord();        
        if(isValid)
        {
            this.setState({
                selectedLetter: null,
                backup: [],
                validSquares: { 'top': null, 'bot': null, 'left': null, 'right': null, 'first': null },
                turn: this.state.turn + 1,
                isPlayerTurn: !this.state.isPlayerTurn,
            })
            this.props.socket.emit("endTurn", this.state.squares, this.bagLetters, this.state.roomId);
        }
    }

    newTurnListener = (data) =>{
        this.bagLetters = data["letters"];
        console.log("updating letters")
        this.setState({
            scorePlayer1: data["player1"],
            scorePlayer2: data["player2"],
            squares: data["board"],
            isPlayerTurn: !this.state.isPlayerTurn
        })
    }

    render() {
        var getLetters =  <button  id="getLettersButton" className="btn btn-outline-primary" onClick={this.refreshPlayerLetters.bind(this)}>Get Letters</button>
        var player1Letters =  this.state.isPlayerTurn ? <div className="player-letters">
            {this.state.player1Letters.map((value) => {
                return <span key={"player1-" + this.bagLetters[value[0]] + value}>
                    <Letter
                        id={"player1-" + value[0] + '-' + value[1]}
                        letter={value[0]}
                        onClickLetter={this.onClickLetterHandler}
                    />
                </span>
            })}
        </div> :
            <div className="player-letters">
                {this.state.player1Letters.map((value) => {
                    return <span key={"player1-" + this.bagLetters[value[0]] + value}>
                        <Letter
                            id={"player1-" + value[0] + '-' + value[1]}
                            letter={value[0]}
                            disabled
                        />
                    </span>
                })}
            </div>;
        var player2Letters = this.state.isPlayerTurn ?  <div className="player-letters">
                {this.state.player2Letters.map((value) => {
                    return <span key={"player2-" + this.bagLetters[value[0]] + value}>
                        <Letter
                            id={"player2-" + value[0] + '-' + value[1]}
                            letter={value[0]}
                            onClickLetter={this.onClickLetterHandler}
                        />
                    </span>
                })}
            </div> : 
            <div className="player-letters">
                {this.state.player2Letters.map((value) => {
                    return <span key={"player2-" + this.bagLetters[value[0]] + value}>
                        <Letter
                            id={"player2-" + value[0] + '-' + value[1]}
                            letter={value[0]}
                            disabled
                        />
                    </span>
                })}
            </div>
        ;
        var endTurn = (this.state.backup.length > 0 && (this.state.turn > 0 || !this.state.player1Turn)) || (this.state.backup.length >= 2 && this.state.turn == 0) ? <button id="endTurnButton" className="btn btn-outline-success" onClick={this.onClickEndTurn.bind(this)}>End turn</button> :
            <button className="btn btn-outline-success" disabled>End turn</button>
        var cancelTurn = <button id="cancelTurnButton" className="btn btn-outline-danger" onClick={this.onClickCancel.bind(this)}>Cancel</button>
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
                {player1Letters}
                {player2Letters}
                <div className="players-scores">
                    <p>Player 1: {this.state.scorePlayer1}</p>
                    <p>Player 2: {this.state.scorePlayer2}</p>
                </div>
                <Controls 
                    newTurnListener={this.newTurnListener.bind(this)}
                    getLetters = {getLetters}
                    cancelTurn={cancelTurn}
                    endTurn={endTurn}
                    socket={this.props.socket}
                    turn={this.state.turn}
                    player1Turn={this.state.player1Turn}
                    player1Letters={this.state.player1Letters}
                    player2Letters={this.state.player2Letters}
                />
            </div>
        )
    }
}

export default Board
