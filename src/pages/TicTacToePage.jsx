import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/tictactoe.css";

export function TicTacToePage() {

  // ========================
  // 📦 PLAYER DATA
  // ========================
  const location = useLocation();
  const playerName = location.state?.name || "Player";
  const difficulty = location.state?.difficulty || "easy";

  // ========================
  // 🧠 GAME STATE
  // ========================
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  
  // ========================
  // 🏆 WIN CHECK
  // ========================
  const checkWinner = (board) => {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6],
    ];

    for (let [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const getBotMove = (board) => {
  const emptyIndexes = board
    .map((val, idx) => (val === null ? idx : null))
    .filter(val => val !== null);

  if (difficulty === "easy") {
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  }

  if (difficulty === "medium") {
    if (Math.random() < 0.5) {
      return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    }
  }

  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a,b,c] of lines) {
    const line = [board[a], board[b], board[c]];

    if (line.filter(v => v === "O").length === 2 && line.includes(null)) {
      return [a,b,c][line.indexOf(null)];
    }

    if (line.filter(v => v === "X").length === 2 && line.includes(null)) {
      return [a,b,c][line.indexOf(null)];
    }
  }

    // Take center if open
  if (board[4] === null) {
    return 4;
  }

    // Take a corner if available
    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
}

// fallback random
return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
};

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);

  useEffect(() => {
  if (!isXTurn && !winner && !isDraw) {
    const timeout = setTimeout(() => {
      const move = getBotMove(board);

      if (move !== undefined) {
        const newBoard = [...board];
        newBoard[move] = "O";
        setBoard(newBoard);
        setIsXTurn(true);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }
}, [board, isXTurn]);

  // ========================
  // 🔤 HANDLE MOVE
  // ========================
  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";

    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  // ========================
  // 🔄 RESET
  // ========================
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  };

  // ========================
  // 🎨 UI
  // ========================
  return (
    <section className="tictactoe-page">

      <h2>Tic Tac Toe</h2>
      <p>{playerName}</p>

      {/* 🧾 Status */}
      <div className="status">
        {winner && <p>🎉 Winner: {winner}</p>}
        {!winner && isDraw && <p>Draw!</p>}
        {!winner && !isDraw && (
          <p>Next Player: {isXTurn ? "X" : "O"}</p>
        )}
      </div>

      {/* 🎮 Board */}
      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className="square"
            onClick={() => handleClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* 🔄 Reset */}
      <button onClick={resetGame} className="new-game-button">
        New Game
      </button>

      {/* 🔙 Navigation */}
      <div className="navigation">
        <Link to="/" className="back-button">Back to Game Select</Link>
        <Link to={`/lobby/tic-tac-toe`} className="back-button">
          Back to Lobby
        </Link>
      </div>

    </section>
  );
}