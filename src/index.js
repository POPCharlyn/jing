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

// class Square extends React.Component {
//     // 添加构造函数，初始化state
//     // constructor( props ) {
//     //     super( props ); // 在所有含有构造函数的的 React 组件中，构造函数必须以 super(props) 开头
//     //     this.state = {
//     //         value: null,
//     //     };
//     // }
//
//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={ () => this.props.onClick( { value: 'X' } ) }
//             >
//                 { this.props.value }
//             </button>
//         );
//     }
// }

class Board extends React.Component {
    // 为 Board 组件添加构造函数，将 Board 组件的初始状态设置为长度为 9 的空值数组：
    // constructor( props ) {
    //     super( props );
    //     this.state = {
    //         squares: Array( 9 ).fill( null ),
    //         // xIsNext（布尔值）
    //         xIsNext: true,
    //     };
    // }

    handleClick( i ) {
        // https://zh.javascript.info/array-methods#slice
        // 使用 .slice() 函数对 squares 数组进行拷贝，而非直接修改现有的数组
        const history = this.state.history;
        const current = history[ history.length - 1 ];
        const squares = this.state.squares.slice();

        if ( calculateWinner( squares ) || squares[ i ] ) {
            return;
        }
        squares[ i ] = this.state.xIsNext ? 'X' : 'O'; // 实现 “X” 和 “O” 轮流落子
        this.setState( {
            history: history.concat( [ { // concat() 方法创建一个新数组，并不会改变原数组
                squares: squares,
            } ] ),
            xIsNext: !this.state.xIsNext,
        } );
    }

    renderSquare( i ) {
        return (
            <Square value={ this.state.squares[ i ] }
                    onClick={ () => this.handleClick( i ) }
            />
        );
    }

    render() {
        // const winner = calculateWinner( this.state.squares );
        // console.log( winner );
        // let status; // 定义 status
        //
        // if ( winner ) {
        //     status = 'Winner:' + winner;
        //     console.log( winner );
        // } else {
        //     status = 'Next player:' + ( this.state.xIsNext ? 'X' : 'O' );
        // }
        // console.log( status );
        // console.log( winner );
        //const status = 'Next player: ' + ( this.state.xIsNext ? 'X' : 'O' );

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
            xIsNext: true,
        };
    }

    render() {
        // 使用最新一次历史记录来确定并展示游戏的状态
        const history = this.state.history;
        const current = history[ history.length - 1 ];
        const winner = calculateWinner( current.squares );
        let status;

        if ( winner ) {
            status = 'Winner:' + winner;
        } else {
            status = 'Next player:' + ( this.state.xIsNext ? 'X' : 'O' );
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={ current.squares }
                        onClick={ ( i ) => this.handleClick( i ) }
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{/* TODO */ }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById( 'root' )
);

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
        if ( squares[ a ] && squares[ a ] === [ b ] && squares[ a ] === squares[ c ] ) {
            return squares[ a ];
        }
    }
    return null;
}