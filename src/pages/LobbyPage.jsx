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

// ✅ MULTIPLAYER STATE
const [roomId, setRoomId] = useState("");
const [joinRoomId, setJoinRoomId] = useState("");

// ========================
// 🌐 API
// ========================
const API_URL = "https://game-room-api.fly.dev/api/rooms";

const createRoom = async () => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      initialState: {
        players: [],
        turn: null,
        board: null,
        winner: null,
        version: 0
      }
    })
  });

  const data = await res.json();
  setRoomId(data.roomId);
};

// ========================
// 🎭 AVATAR DATA
// ========================
const avatars = [
{ name: "Mario", color: "linear-gradient(135deg, #cc0000, #ff0000)", emoji: "🔴", image: "/assets/avatars/mario.png" },
{ name: "Luigi", color: "linear-gradient(135deg, #00aa00, #00ff00)", emoji: "🟢", image: "/assets/avatars/luigi.png" },
{ name: "Peach", color: "linear-gradient(135deg, #ff69b4, #ffc0cb)", emoji: "👑", image: "/assets/avatars/peach.png" },
{ name: "Yoshi", color: "linear-gradient(135deg, #ffaa00, #ffff00)", emoji: "🦕", image: "/assets/avatars/yoshi.png" },
{ name: "Bowser", color: "linear-gradient(135deg, #8b4513, #a0522d)", emoji: "🐢", image: "/assets/avatars/bowser.png" },
{ name: "Toad", color: "linear-gradient(135deg, #ff0000, #ffffff)", emoji: "🍄", image: "/assets/avatars/toad.png" },
];

const games = [
{ key: "rps", name: "Rock Paper Scissors", isMultiplayer: true },
{ key: "tic-tac-toe", name: "Tic-Tac-Toe", isMultiplayer: true },
{ key: "wordle", name: "Wordle", isMultiplayer: false },
{ key: "hangman", name: "Hangman", isMultiplayer: false },
{ key: "blackjack", name: "Blackjack", isMultiplayer: false },
];

const game = games.find(g => g.key === gameKey);
const currentAvatar = avatars[selectedAvatarIndex];

const imageKey = currentAvatar.name;
const imageFailedToLoad = failedImages[imageKey];

const gamesWithoutDifficulty = ["hangman", "blackjack", "wordle", "rps"];

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
const handleImageError = () => {
setFailedImages(prev => ({
...prev,
[imageKey]: true
}));
};

// ========================
// 🚀 NAVIGATION
// ========================
const handleContinue = () => {
  const finalName = playerName.trim() || currentAvatar.name;

  if (!finalName) return;

  navigate(`/game/${gameKey}`, {
    state: {
      avatar: currentAvatar,
      name: finalName,
      mode: gameMode,
      roomId: roomId || joinRoomId
    }
  });
};

if (!game) return <div>Game not found</div>;

// ========================
// 🎨 UI
// ========================
return (
<section className="lobby-page">

<h2>{game.name}</h2>

<div className="lobby-content">

<div className="player-avatar-section">

<button className="avatar-arrow avatar-arrow-left" onClick={handlePrevAvatar}>◀</button>

<div className="player-avatar">
  <div className="avatar-circle" style={{ background: currentAvatar.color }}>
    {imageFailedToLoad ? (
      <span className="avatar-emoji">{currentAvatar.emoji}</span>
    ) : (
      <img src={currentAvatar.image} alt={currentAvatar.name} className="avatar-image" onError={handleImageError}/>
    )}
  </div>
  <p className="avatar-label">{currentAvatar.name}</p>
</div>

<button className="avatar-arrow avatar-arrow-right" onClick={handleNextAvatar}>▶</button>

</div>

<form className="lobby-form" onSubmit={(e) => e.preventDefault()}>

<div className="form-group">
  <label>Player Name</label>
  <input
    type="text"
    value={playerName}
    onChange={(e) => setPlayerName(e.target.value)}
    placeholder={`Leave blank to use "${currentAvatar.name}"`}
  />
</div>

{game.isMultiplayer && gameMode === null && (
  <div className="game-mode-selector">
    <label>Game Mode</label>
    <div className="mode-buttons">
      <button type="button" onClick={() => setGameMode("solo")}>Solo</button>
      <button type="button" onClick={() => setGameMode("multiplayer")}>Multiplayer</button>
    </div>
  </div>
)}

{gameMode && (
  <button type="button" onClick={() => setGameMode(null)}>
    Change Mode
  </button>
)}

{shouldShowDifficulty && (
  <div className="form-group">
    <label>Difficulty</label>
    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>
  </div>
)}

{/* ✅ MULTIPLAYER (SAFE INSERT — DOES NOT BREAK LAYOUT) */}
{gameMode === "multiplayer" && (
  <>
    <div className="form-group">
      <button type="button" onClick={createRoom}>
        Create Room
      </button>
    </div>

    {roomId && (
      <div className="form-group">
        <p style={{ color: "#ffd700", fontWeight: "bold" }}>
          Room Code: {roomId}
        </p>
      </div>
    )}

    <div className="form-group">
      <input
        type="text"
        placeholder="Enter Room Code"
        value={joinRoomId}
        onChange={(e) => setJoinRoomId(e.target.value)}
      />
    </div>
  </>
)}

{gameMode && (
  <div className="game-mode">
    <p>{gameMode === "solo" ? "Solo Mode" : "Multiplayer Mode"}</p>
  </div>
)}

</form>
</div>

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