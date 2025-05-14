import React from "react";
import "../styles/Square.css";

const Square = ({ value, onClick, isWinningSquare }) => {
  return (
    <button
      className={`square ${isWinningSquare ? "winning" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
