import React from "react";
import Square from "./Square";
import "../styles/Board.css";

const Board = ({ squares, onClick, winningLine }) => {
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinningSquare={winningLine && winningLine.includes(i)}
      />
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < 3; row++) {
      const currentRow = [];
      for (let col = 0; col < 3; col++) {
        const squareIndex = row * 3 + col;
        currentRow.push(renderSquare(squareIndex));
      }
      board.push(
        <div key={row} className="board-row">
          {currentRow}
        </div>
      );
    }
    return board;
  };

  return <div className="board">{renderBoard()}</div>;
};

export default Board;
