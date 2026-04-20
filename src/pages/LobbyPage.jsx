/*
Lobby Page Component

* Allows player to configure game before starting
* Handles avatar selection, player name, difficulty, and game mode
* Passes selected data into the game via React Router navigation
  */

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/lobby.css";

export function LobbyPage() {

// ========================
// 📦 ROUTE + NAVIGATION
// ========================
const { gameKey } = useParams();
const navigate = useNavigate();

// ========================
// 🧠 PLAYER STATE
// ========================
const [playerName, setPlayerName] = useState("");
const [difficulty, setDifficulty] = useState("easy");
const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
const [failedImages, setFailedImages] = useState({});
const [gameMode, setGameMode] = useState(null);

// ========================
// 🎭 AVATAR DATA
// ========================
// List of selectable avatars with styling + images
const avatars = [
{ name: "Mario", color: "linear-gradient(135deg, #cc0000, #ff0000)", emoji: "🔴", image: "/src/assets/avatars/mario.png" },
{ name: "Luigi", color: "linear-gradient(135deg, #00aa00, #00ff00)", emoji: "🟢", image: "/src/assets/avatars/luigi.png" },
{ name: "Peach", color: "linear-gradient(135deg, #ff69b4, #ffc0cb)", emoji: "👑", image: "/src/assets/avatars/peach.png" },
{ name: "Yoshi", color: "linear-gradient(135deg, #ffaa00, #ffff00)", emoji: "🦕", image: "/src/assets/avatars/yoshi.png" },
{ name: "Bowser", color: "linear-gradient(135deg, #8b4513, #a0522d)", emoji: "🐢", image: "/src/assets/avatars/bowser.png" },
{ name: "Toad", color: "linear-gradient(135deg, #ff0000, #ffffff)", emoji: "🍄", image: "/src/assets/avatars/toad.png" },
];

// ========================
// 🎮 GAME DATA
// ========================
// Defines available games and whether they support multiplayer
const games = [
{ key: "rps", name: "Rock Paper Scissors", isMultiplayer: true },
{ key: "tic-tac-toe", name: "Tic-Tac-Toe", isMultiplayer: true },
{ key: "wordle", name: "Wordle", isMultiplayer: false },
{ key: "hangman", name: "Hangman", isMultiplayer: false },
{ key: "blackjack", name: "Blackjack", isMultiplayer: false },
];

// Get selected game and avatar
const game = games.find(g => g.key === gameKey);
const currentAvatar = avatars[selectedAvatarIndex];

// Image handling (fallback to emoji if image fails)
const imageKey = currentAvatar.name;
const imageFailedToLoad = failedImages[imageKey];

// Determine if difficulty should be shown
const gamesWithoutDifficulty = ["hangman", "blackjack"];

const shouldShowDifficulty =
  (!game.isMultiplayer || gameMode === "solo") &&
  !gamesWithoutDifficulty.includes(gameKey);

// ========================
// 🔄 AVATAR CONTROLS
// ========================
const handlePrevAvatar = () => {
setSelectedAvatarIndex((prev) => (prev - 1 + avatars.length) % avatars.length);
};

const handleNextAvatar = () => {
setSelectedAvatarIndex((prev) => (prev + 1) % avatars.length);
};

// ========================
// 🖼 IMAGE ERROR HANDLING
// ========================
// If avatar image fails, fallback to emoji
const handleImageError = () => {
setFailedImages(prev => ({
...prev,
[imageKey]: true
}));
};

// ========================
// 🚀 NAVIGATION TO GAME
// ========================
// Sends player data to game screen
const handleContinue = () => {
  const finalName = playerName.trim() || currentAvatar.name;

  if (finalName) {
    navigate(`/game/${gameKey}`, {
      state: {
        avatar: currentAvatar,
        name: playerName || currentAvatar.name
      }
    });
  }
};

// ========================
// ❌ ERROR STATE
// ========================
if (!game) {
return <div>Game not found</div>;
}

// ========================
// 🧾 DISPLAY NAME / INITIALS
// ========================
const displayName = playerName || currentAvatar.name;

const initials = displayName
.split(" ")
.map(word => word[0])
.join("")
.toUpperCase()
.slice(0, 2) || "?";

// ========================
// 🎨 UI RENDER
// ========================
return ( <section className="lobby-page">

  {/* 🎮 GAME TITLE */}
  <h2>{game.name}</h2>

  <div className="lobby-content">

    {/* 🎭 AVATAR SELECTION */}
    <div className="player-avatar-section">

      {/* ◀ Previous Avatar */}
      <button
        className="avatar-arrow avatar-arrow-left"
        onClick={handlePrevAvatar}
        aria-label="Previous avatar"
      >
        ◀
      </button>

      {/* 🎭 CURRENT AVATAR */}
      <div className="player-avatar">
        <div className="avatar-circle" style={{ background: currentAvatar.color }}>
          {imageFailedToLoad ? (
            <span className="avatar-emoji">{currentAvatar.emoji}</span>
          ) : (
            <img
              src={currentAvatar.image}
              alt={currentAvatar.name}
              className="avatar-image"
              onError={handleImageError}
            />
          )}
        </div>
        <p className="avatar-label">{currentAvatar.name}</p>
      </div>

      {/* ▶ Next Avatar */}
      <button
        className="avatar-arrow avatar-arrow-right"
        onClick={handleNextAvatar}
        aria-label="Next avatar"
      >
        ▶
      </button>
    </div>

    {/* 📝 PLAYER INPUT FORM */}
    <form className="lobby-form" onSubmit={(e) => e.preventDefault()}>

      {/* 🧍 PLAYER NAME */}
      <div className="form-group">
        <label htmlFor="name">Player Name (or auto-use avatar name)</label>
        <input
          id="name"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder={`Leave blank to use "${currentAvatar.name}"`}
          maxLength="20"
        />
      </div>

      {/* 🎮 GAME MODE SELECTOR */}
      {game.isMultiplayer && gameMode === null && (
        <div className="game-mode-selector">
          <label>Game Mode</label>
          <div className="mode-buttons">
            <button type="button" onClick={() => setGameMode("solo")}>
              Solo
            </button>
            <button type="button" onClick={() => setGameMode("multiplayer")}>
              Multiplayer
            </button>
          </div>
        </div>
      )}

      {/* 🔄 CHANGE MODE BUTTON */}
      {gameMode && (
        <button type="button" onClick={() => setGameMode(null)}>
          Change Mode
        </button>
      )}

      {/* 🎯 DIFFICULTY */}
      {shouldShowDifficulty && (
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

      {/* 🧠 MODE DISPLAY */}
      {gameMode && (
        <div className="game-mode">
          <p>{gameMode === "solo" ? "Solo Mode" : "Multiplayer Mode"}</p>
        </div>
      )}

    </form>
  </div>

  {/* 🔘 NAVIGATION BUTTONS */}
  <div className="lobby-buttons">
    <Link to="/" className="back-button">Back to Game Select</Link>

    <button
      onClick={handleContinue}
      disabled={game.isMultiplayer && gameMode === null}
      className="continue-button"
    >
      Continue to Game
    </button>
  </div>

</section>

);
}
