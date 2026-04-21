import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/rps.css";

export function RPSPage() {

  const location = useLocation();

  const playerName = location.state?.name || "Player";
  const isMultiplayer = location.state?.mode === "multiplayer";
  const roomId = location.state?.roomId;

  const API_URL = "https://game-room-api.fly.dev/api/rooms";

  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);

  const [score, setScore] = useState({
    wins: 0,
    losses: 0,
    draws: 0
  });

  const [gameState, setGameState] = useState(null);
  const [playerRole, setPlayerRole] = useState(null);

  const choices = ["rock", "paper", "scissors"];

  // ========================
  // 🎮 SOLO MODE
  // ========================
  const playSoloRound = (choice) => {
    const computer = choices[Math.floor(Math.random() * 3)];

    setPlayerChoice(choice);
    setComputerChoice(computer);

    if (choice === computer) {
      setResult("Draw");
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else if (
      (choice === "rock" && computer === "scissors") ||
      (choice === "paper" && computer === "rock") ||
      (choice === "scissors" && computer === "paper")
    ) {
      setResult("You Win!");
      setScore(prev => ({ ...prev, wins: prev.wins + 1 }));
    } else {
      setResult("You Lose!");
      setScore(prev => ({ ...prev, losses: prev.losses + 1 }));
    }
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
      } else {
        if (state.player1Id === playerName) setPlayerRole("player1");
        if (state.player2Id === playerName) setPlayerRole("player2");
      }

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
  const playMultiplayerRound = async (choice) => {
    if (!roomId || !playerRole) return;

    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();

    const current = data.gameState;

    if (current[`${playerRole}Choice`]) return;

    const updated = {
      ...current,
      [`${playerRole}Choice`]: choice
    };

    if (!updated.wins) {
      updated.wins = { player1: 0, player2: 0 };
    }

    if (updated.player1Choice && updated.player2Choice) {
      const p1 = updated.player1Choice;
      const p2 = updated.player2Choice;

      if (p1 === p2) {
        updated.result = "Draw";
      } else if (
        (p1 === "rock" && p2 === "scissors") ||
        (p1 === "paper" && p2 === "rock") ||
        (p1 === "scissors" && p2 === "paper")
      ) {
        updated.result = `${updated.player1Id} Wins`;
        updated.wins.player1 += 1;
      } else {
        updated.result = `${updated.player2Id} Wins`;
        updated.wins.player2 += 1;
      }
    }

    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updated })
    });

    setPlayerChoice(choice);
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

      if (data.gameState?.result) {
        setResult(data.gameState.result);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId, isMultiplayer]);

  // ========================
  // 🔄 RESET
  // ========================
  const resetGame = async () => {
    if (!isMultiplayer) {
      setPlayerChoice(null);
      setComputerChoice(null);
      setResult(null);
      return;
    }

    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();

    const updated = {
      ...data.gameState,
      player1Choice: null,
      player2Choice: null,
      result: null
    };

    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updated })
    });

    setPlayerChoice(null);
    setResult(null);
  };

  const playRound = (choice) => {
    if (isMultiplayer) playMultiplayerRound(choice);
    else playSoloRound(choice);
  };

  const renderIcon = (choice) => {
    if (choice === "rock") return "👊";
    if (choice === "paper") return "✋";
    if (choice === "scissors") return "✌️";
    return "";
  };

  return (
    <section className="rps-page">

      <h2>Rock Paper Scissors</h2>
      <p>{playerName}</p>

      {/* SCOREBOARD */}
      {isMultiplayer && gameState?.wins && (
        <div className="scoreboard">
          <p>
            {gameState.player1Id}: {gameState.wins.player1} |{" "}
            {gameState.player2Id}: {gameState.wins.player2}
          </p>
        </div>
      )}

      {!isMultiplayer && (
        <div className="scoreboard">
          <p>
            Wins: {score.wins} | Losses: {score.losses} | Draws: {score.draws}
          </p>
        </div>
      )}

      {/* CHOICES */}
      <div className="choices">
        {choices.map((choice) => (
          <button key={choice} onClick={() => playRound(choice)} className={`choice-button ${choice}`}>
            <span className="choice-icon">{renderIcon(choice)}</span>
            <span className="choice-label">{choice}</span>
          </button>
        ))}
      </div>

      {/* MATCHUP */}
      {playerChoice && (
        <div className="results">

          <div className="matchup">

            <div className="player-side">
              <p>{gameState?.player1Id || playerName}</p>
              <div className="choice-display">
                {isMultiplayer && !gameState?.result && "🔒"}
                {(!isMultiplayer || gameState?.result) &&
                  renderIcon(isMultiplayer ? gameState?.player1Choice : playerChoice)}
              </div>
            </div>

            <div className="vs">VS</div>

            <div className="player-side">
              <p>{isMultiplayer ? gameState?.player2Id || "Waiting..." : "Computer"}</p>
              <div className="choice-display">
                {isMultiplayer && !gameState?.result && "🔒"}
                {(!isMultiplayer || gameState?.result) &&
                  renderIcon(isMultiplayer ? gameState?.player2Choice : computerChoice)}
              </div>
            </div>

          </div>

          <h3 className="result-text">{result}</h3>

        </div>
      )}

      <button onClick={resetGame} className="new-game-button">
        New Game
      </button>

      <div className="navigation">
        <Link to="/">Back</Link>
      </div>

    </section>
  );
}