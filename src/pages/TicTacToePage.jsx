import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/tictactoe.css";

export function TicTacToePage() {

  const location = useLocation();

  const playerName = location.state?.name || "Player";
  const isMultiplayer = location.state?.mode === "multiplayer";
  const roomId = location.state?.roomId;

  const API_URL = "https://game-room-api.fly.dev/api/rooms";

  const emptyBoard = Array(9).fill(null);

  const [board, setBoard] = useState(emptyBoard);
  const [winner, setWinner] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerRole, setPlayerRole] = useState(null);

  // ========================
  // 🧠 WIN CHECK
  // ========================
  const checkWinner = (b) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (let [a,b1,c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return b[a];
      }
    }

    if (b.every(cell => cell)) return "Draw";
    return null;
  };

  // ========================
  // 🌐 ROLE ASSIGNMENT
  // ========================
  useEffect(() => {
    if (!isMultiplayer || !roomId) return;

    const assignRole = async () => {
      const res = await fetch(`${API_URL}/${roomId}`);
      const data = await res.json();

      const state = data.gameState;
      let updated = { ...state };

      if (!state.player1Id) {
        updated.player1Id = playerName;
        setPlayerRole("player1");
      } else if (!state.player2Id && state.player1Id !== playerName) {
        updated.player2Id = playerName;
        setPlayerRole("player2");
      }

      if (!state.board) updated.board = emptyBoard;
      if (!state.turn) updated.turn = "X";
      if (!state.wins) updated.wins = { player1: 0, player2: 0 };

      await fetch(`${API_URL}/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameState: updated })
      });
    };

    assignRole();
  }, [roomId, isMultiplayer]);

  // ========================
  // 🌐 MOVE
  // ========================
  const handleMove = async (index) => {
    if (!roomId || !playerRole) return;

    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();

    const current = data.gameState;

    const symbol = playerRole === "player1" ? "X" : "O";

    if (current.board[index] || current.winner) return;
    if (current.turn !== symbol) return;

    const newBoard = [...current.board];
    newBoard[index] = symbol;

    const newWinner = checkWinner(newBoard);

    const updated = {
      ...current,
      board: newBoard,
      turn: symbol === "X" ? "O" : "X",
      winner: newWinner
    };

    // 🎯 SCORE UPDATE
    if (newWinner === "X") updated.wins.player1 += 1;
    if (newWinner === "O") updated.wins.player2 += 1;

    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updated })
    });
  };

  // ========================
  // 🌐 POLLING
  // ========================
  useEffect(() => {
    if (!isMultiplayer || !roomId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${API_URL}/${roomId}`);
      const data = await res.json();

      setGameState(data.gameState);
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId]);

  // ========================
  // 🔄 RESET
  // ========================
  const resetGame = async () => {
    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();

    const updated = {
      ...data.gameState,
      board: emptyBoard,
      turn: "X",
      winner: null
    };

    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updated })
    });
  };

  const displayBoard = gameState?.board || emptyBoard;

  return (
    <section className="ttt-page">

      <h2>Tic Tac Toe</h2>
      <p>{playerName}</p>

      {/* 🧮 SCORE */}
      {gameState?.wins && (
        <p>
          {gameState.player1Id}: {gameState.wins.player1} |{" "}
          {gameState.player2Id}: {gameState.wins.player2}
        </p>
      )}

      {/* TURN */}
      {gameState && (
        <p>
          Turn: {gameState.turn} (
          {gameState.turn === "X" ? gameState.player1Id : gameState.player2Id}
          )
        </p>
      )}

      {/* BOARD */}
      <div className="board">
        {displayBoard.map((cell, i) => (
          <button
            key={i}
            className="cell"
            data-value={cell}
            onClick={() => handleMove(i)}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* RESULT */}
      {gameState?.winner && (
        <h3>
          {gameState.winner === "Draw"
            ? "Draw"
            : `${gameState.winner === "X"
                ? gameState.player1Id
                : gameState.player2Id
              } Wins`}
        </h3>
      )}

      <button onClick={resetGame}>New Game</button>

      <div className="navigation">
        <Link to="/" className="back-button">Leave</Link>
      </div>

    </section>
  );
}