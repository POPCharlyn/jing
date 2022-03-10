import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 把 Square 组件重写为一个函数组件
// 组件只包含一个 render 方法，并且不包含 state
function Square( props ) {
    return (
        <button className="square" onClick={ props.onClick }>
            { props.value }
        </button>
    );
}

class Board extends React.Component {
    renderSquare( i ) {
        return (
            <Square value={ this.props.squares[ i ] }
                    onClick={ () => this.props.onClick( i ) }
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    { this.renderSquare( 0 ) }
                    { this.renderSquare( 1 ) }
                    { this.renderSquare( 2 ) }
                </div>
                <div className="board-row">
                    { this.renderSquare( 3 ) }
                    { this.renderSquare( 4 ) }
                    { this.renderSquare( 5 ) }
                </div>
                <div className="board-row">
                    { this.renderSquare( 6 ) }
                    { this.renderSquare( 7 ) }
                    { this.renderSquare( 8 ) }
                </div>
            </div>
        );
    }
}

// Game 组件渲染游戏的状态
class Game extends React.Component {
    // 在构造函数中初始化 state
    constructor( props ) {
        super( props );
        this.state = {
            history: [ {
                squares: Array( 9 ).fill( null ),
            } ],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick( i ) {
        // https://zh.javascript.info/array-methods#slice
        // 使用 .slice() 函数对 squares 数组进行拷贝，而非直接修改现有的数组
        const history = this.state.history.slice( 0, this.state.stepNumber + 1 );
        const current = history[ history.length - 1 ];
        const squares = current.squares.slice();

        if ( calculateWinner( squares ) || squares[ i ] ) {
            return;
        }
        squares[ i ] = this.state.xIsNext ? 'X' : 'O'; // 实现 “X” 和 “O” 轮流落子
        this.setState( {
                           history: history.concat( [ { // concat() 方法创建一个新数组，并不会改变原数组
                               squares: squares,
                           } ] ),
                           stepNumber: history.length,
                           xIsNext: !this.state.xIsNext,
                       } );
    }

    jumpTo( step ) {
        this.setState( {
                           stepNumber: step,
                           // 每当我们落下一颗新棋子的时候，我们需要调用 this.setState
                           // 并传入参数 stepNumber: history.length，以更新 stepNumber
                           xIsNext: (
                                        step % 2
                                    ) === 0, // 当状态 stepNumber 是偶数时，我们把 xIsNext 设为 true
                       } );
    }

    render() {
        // 使用最新一次历史记录来确定并展示游戏的状态
        const history = this.state.history;
        // 将代码从始终根据最后一次移动渲染修改为根据当前 stepNumber 渲染
        const current = history[ this.state.stepNumber ];
        const winner = calculateWinner( current.squares );

        const moves = history.map( ( step, move ) => {
            const desc = move ?
                         'Go to move #' + move :
                         'Go to game start';
            return (
                <li key={ move }>
                    <button
                        onClick={ () => this.jumpTo( move ) }>{ desc }</button>
                </li>
            );
        } );

        let status;

        if ( winner ) {
            status = 'Winner:' + winner;
        } else {
            status = 'Next player:' + (
                this.state.xIsNext ? 'X' : 'O'
            );
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={ current.squares }
                        onClick={ i => this.handleClick( i ) }
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render( <Game/>, document.getElementById( 'root' ) );


// calculateWinner 函数，显示游戏的结果来判定游戏结束
function calculateWinner( squares ) {
    const lines = [
        [ 0, 1, 2 ],
        [ 3, 4, 5 ],
        [ 6, 7, 8 ],
        [ 0, 3, 6 ],
        [ 1, 4, 7 ],
        [ 2, 5, 8 ],
        [ 0, 4, 8 ],
        [ 2, 4, 6 ],
    ];
    for ( let i = 0; i < lines.length; i++ ) {
        const [ a, b, c ] = lines[ i ];
        if ( squares[ a ] && squares[ a ] === squares[ b ] && squares[ a ] === squares[ c ] ) {
            return squares[ a ];
        }
    }
    return null;
}