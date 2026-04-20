import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/rps.css";

export function RPSPage() {

  // ========================
  // 📦 PLAYER DATA
  // ========================
  const location = useLocation();
  const playerName = location.state?.name || "Player";

  // ========================
  // 🧠 GAME STATE
  // ========================
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({
  wins: 0,
  losses: 0,
  draws: 0
  });

  const choices = ["Rock", "Paper", "Scissors"];

  // ========================
  // 🎮 GAME LOGIC
  // ========================
  const playRound = (choice) => {
    const computer = choices[Math.floor(Math.random() * 3)];

    setPlayerChoice(choice);
    setComputerChoice(computer);

    if (choice === computer) {
  setResult("Draw");
  setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
} 
else if (
  (choice === "Rock" && computer === "Scissors") ||
  (choice === "Paper" && computer === "Rock") ||
  (choice === "Scissors" && computer === "Paper")
) {
  setResult("You Win!");
  setScore(prev => ({ ...prev, wins: prev.wins + 1 }));
} 
else {
  setResult("You Lose!");
  setScore(prev => ({ ...prev, losses: prev.losses + 1 }));
}
  };

  // ========================
  // 🔄 RESET
  // ========================
  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  // ========================
  // 🎨 UI
  // ========================
  return (
    <section className="rps-page">

      <h2>Rock Paper Scissors</h2>
      <p>{playerName}</p>
      <div className="scoreboard">
    <p>
        Wins: {score.wins} | Losses: {score.losses} | Draws: {score.draws}
    </p>
        </div>

      {/* 🎮 Choices */}
      <div className="choices">
  {choices.map((choice) => (
    <button
      key={choice}
      onClick={() => playRound(choice)}
      className={`choice-button ${choice}`}
    >
      <span className="choice-icon">
        {choice === "Rock" && "👊"}
        {choice === "Paper" && "✋"}
        {choice === "Scissors" && "✌️"}
      </span>
      <span className="choice-label">{choice}</span>
    </button>
  ))}
</div>

      {/* 🧾 Results */}
      {playerChoice && (
  <div className="results">

    <div className="matchup">
      <div className="player-side">
        <p>You</p>
        <div className="choice-display">
          {playerChoice === "Rock" && "👊"}
          {playerChoice === "Paper" && "✋"}
          {playerChoice === "Scissors" && "✌️"}
        </div>
      </div>

      <div className="vs">VS</div>

      <div className="player-side">
        <p>Computer</p>
        <div className="choice-display">
          {computerChoice === "Rock" && "👊"}
          {computerChoice === "Paper" && "✋"}
          {computerChoice === "Scissors" && "✌️"}
        </div>
      </div>
    </div>

    <h3 className="result-text">{result}</h3>
  </div>
)}

      {/* 🔄 Reset */}
      <button onClick={resetGame} className="new-game-button">
        New Game
      </button>

      {/* 🔙 Navigation */}
      <div className="navigation">
        <Link to="/" className="back-button">Back to Game Select</Link>
        <Link to={`/lobby/rps`} className="back-button">Back to Lobby</Link>
      </div>

    </section>
  );
}