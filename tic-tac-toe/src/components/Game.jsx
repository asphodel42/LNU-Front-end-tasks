import React, { useState, useEffect } from "react";
import Board from "./Board";
import "../styles/Game.css";

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [stats, setStats] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
  });
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState(null);

  const current = history[currentStep];
  const winner = calculateWinner(current);

  useEffect(() => {
    const savedStats = localStorage.getItem("ticTacToeStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ticTacToeStats", JSON.stringify(stats));
  }, [stats]);

  const handleClick = (i) => {
    if (gameOver || current[i] || winner) {
      return;
    }

    const newHistory = history.slice(0, currentStep + 1);
    const squares = current.slice();

    squares[i] = xIsNext ? "X" : "O";

    setHistory([...newHistory, squares]);
    setCurrentStep(newHistory.length);
    setXIsNext(!xIsNext);

    const nextWinner = calculateWinner(squares);
    if (nextWinner) {
      setGameOver(true);
      setWinningLine(nextWinner.line);

      if (nextWinner.winner === "X") {
        setStats((prev) => ({ ...prev, xWins: prev.xWins + 1 }));
      } else {
        setStats((prev) => ({ ...prev, oWins: prev.oWins + 1 }));
      }
    } else if (!squares.includes(null)) {
      setGameOver(true);
      setStats((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0);
    setXIsNext(true);
    setGameOver(false);
    setWinningLine(null);
  };

  let status;
  if (winner) {
    status = `Winner: ${winner.winner}`;
  } else if (!current.includes(null)) {
    status = "Draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>

      <div className="game-board">
        <Board
          squares={current}
          onClick={handleClick}
          winningLine={winningLine}
        />
      </div>

      <div className="game-info">
        <div className="status">{status}</div>
        <button className="reset-button" onClick={resetGame}>
          New Game
        </button>
      </div>

      <div className="game-stats">
        <h2>Statistics</h2>
        <div>X Wins: {stats.xWins}</div>
        <div>O Wins: {stats.oWins}</div>
        <div>Draws: {stats.draws}</div>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }

  return null;
}

export default Game;
