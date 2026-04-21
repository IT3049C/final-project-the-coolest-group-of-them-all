import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/tictactoe.css";

export function TicTacToePage() {

  const location = useLocation();

  const playerName = location.state?.name || "Player";
  const isMultiplayer = location.state?.mode === "multiplayer";
  const roomId = location.state?.roomId;
  const difficulty = location.state?.difficulty || "easy";

  const API_URL = "https://game-room-api.fly.dev/api/rooms";

  const emptyBoard = Array(9).fill(null);

  // SOLO STATE
  const [board, setBoard] = useState(emptyBoard);
  const [winner, setWinner] = useState(null);

  // MULTIPLAYER STATE
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
  // 🤖 BOT HELPERS
  // ========================
  const getRandomMove = (b) => {
    const empty = b
      .map((val, i) => (val === null ? i : null))
      .filter(i => i !== null);

    return empty[Math.floor(Math.random() * empty.length)];
  };

  const minimax = (b, depth, isMax) => {
    const result = checkWinner(b);

    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    if (result === "Draw") return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < b.length; i++) {
        if (b[i] === null) {
          b[i] = "O";
          best = Math.max(best, minimax(b, depth + 1, false));
          b[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < b.length; i++) {
        if (b[i] === null) {
          b[i] = "X";
          best = Math.min(best, minimax(b, depth + 1, true));
          b[i] = null;
        }
      }
      return best;
    }
  };

  const getBestMove = (b) => {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < b.length; i++) {
      if (b[i] === null) {
        b[i] = "O";
        let score = minimax(b, 0, false);
        b[i] = null;

        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  };

  // ========================
  // 🎮 SOLO MOVE (WITH AI)
  // ========================
  const handleSoloMove = (index) => {
    if (board[index] || winner) return;

    let newBoard = [...board];
    newBoard[index] = "X";

    let result = checkWinner(newBoard);
    if (result) {
      setBoard(newBoard);
      setWinner(result);
      return;
    }

    let botMove;

    if (difficulty === "easy") {
      botMove = getRandomMove(newBoard);
    } else if (difficulty === "medium") {
      botMove = Math.random() < 0.5
        ? getBestMove(newBoard)
        : getRandomMove(newBoard);
    } else {
      botMove = getBestMove(newBoard);
    }

    newBoard[botMove] = "O";

    result = checkWinner(newBoard);

    setBoard(newBoard);
    if (result) setWinner(result);
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
  // 🌐 MULTIPLAYER MOVE
  // ========================
  const handleMultiplayerMove = async (index) => {
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
  }, [roomId, isMultiplayer]);

  // ========================
  // 🔄 RESET
  // ========================
  const resetGame = async () => {
    if (!isMultiplayer) {
      setBoard(emptyBoard);
      setWinner(null);
      return;
    }

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

  const displayBoard = isMultiplayer ? gameState?.board || emptyBoard : board;
  const displayWinner = isMultiplayer ? gameState?.winner : winner;

  return (
    <section className="ttt-page">

      <h2>Tic Tac Toe</h2>
      <p>{playerName}</p>

      {/* SCORE */}
      {isMultiplayer && gameState?.wins && (
        <p>
          {gameState.player1Id}: {gameState.wins.player1} |{" "}
          {gameState.player2Id}: {gameState.wins.player2}
        </p>
      )}

      {/* BOARD */}
      <div className="board">
        {displayBoard.map((cell, i) => (
          <button
            key={i}
            className="cell"
            data-value={cell}
            onClick={() =>
              isMultiplayer
                ? handleMultiplayerMove(i)
                : handleSoloMove(i)
            }
          >
            {cell}
          </button>
        ))}
      </div>

      {/* RESULT */}
      {displayWinner && (
        <h3>
          {displayWinner === "Draw"
            ? "Draw"
            : `${displayWinner} Wins`}
        </h3>
      )}

      <button onClick={resetGame}>New Game</button>

      <div className="navigation">
        <Link to="/" className="back-button">Back</Link>
      </div>

    </section>
  );
}