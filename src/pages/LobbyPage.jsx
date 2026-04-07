import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function LobbyPage() {
  const { gameKey } = useParams();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const [gameMode, setGameMode] = useState(null);

  const avatars = [
    { name: "Mario", color: "linear-gradient(135deg, #cc0000, #ff0000)", emoji: "🔴", image: "/src/assets/avatars/mario.png" },
    { name: "Luigi", color: "linear-gradient(135deg, #00aa00, #00ff00)", emoji: "🟢", image: "/src/assets/avatars/luigi.png" },
    { name: "Peach", color: "linear-gradient(135deg, #ff69b4, #ffc0cb)", emoji: "👑", image: "/src/assets/avatars/peach.png" },
    { name: "Yoshi", color: "linear-gradient(135deg, #ffaa00, #ffff00)", emoji: "🦕", image: "/src/assets/avatars/yoshi.png" },
    { name: "Bowser", color: "linear-gradient(135deg, #8b4513, #a0522d)", emoji: "🐢", image: "/src/assets/avatars/bowser.png" },
    { name: "Toad", color: "linear-gradient(135deg, #ff0000, #ffffff)", emoji: "🍄", image: "/src/assets/avatars/toad.png" },
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
  const shouldShowDifficulty = !game.isMultiplayer || gameMode === "solo";

  const handlePrevAvatar = () => {
    setSelectedAvatarIndex((prev) => (prev - 1 + avatars.length) % avatars.length);
  };

  const handleNextAvatar = () => {
    setSelectedAvatarIndex((prev) => (prev + 1) % avatars.length);
  };

  const handleImageError = () => {
    setFailedImages(prev => ({
      ...prev,
      [imageKey]: true
    }));
  };

  const handleContinue = () => {
    const finalName = playerName.trim() || currentAvatar.name;
    if (finalName) {
      if (gameKey === "blackjack") {
        navigate(`/game/blackjack/play`, {
          state: {
            avatar: currentAvatar,
            name: playerName || currentAvatar.name
  }
});
      } else {
        navigate(`/game/${gameKey}`);
      }
    }
  };

  if (!game) {
    return <div>Game not found</div>;
  }

  const displayName = playerName || currentAvatar.name;
  const initials = displayName
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <section className="lobby-page">
      <h2>{game.name}</h2>
      
      <div className="lobby-content">
        <div className="player-avatar-section">
          <button
            className="avatar-arrow avatar-arrow-left"
            onClick={handlePrevAvatar}
            aria-label="Previous avatar"
          >
            ◀
          </button>
          
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

          <button
            className="avatar-arrow avatar-arrow-right"
            onClick={handleNextAvatar}
            aria-label="Next avatar"
          >
            ▶
          </button>
        </div>

        <form className="lobby-form" onSubmit={(e) => e.preventDefault()}>
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

          {game.isMultiplayer && gameMode === null && (
            <div className="game-mode-selector">
              <label>Game Mode</label>
              <div className="mode-buttons">
                <button
                  type="button"
                  className="mode-button solo-button"
                  onClick={() => setGameMode("solo")}
                >
                  Solo
                </button>
                <button
                  type="button"
                  className="mode-button multiplayer-button"
                  onClick={() => setGameMode("multiplayer")}
                >
                  Multiplayer
                </button>
              </div>
            </div>
          )}

          {gameMode && (
            <button
              type="button"
              className="change-mode-button"
              onClick={() => setGameMode(null)}
            >
              Change Mode
            </button>
          )}

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

          {game.isMultiplayer && gameMode === "multiplayer" && (
            <div className="game-mode">
              <p>Multiplayer Mode</p>
            </div>
          )}

          {game.isMultiplayer && gameMode === "solo" && (
            <div className="game-mode">
              <p>Solo Mode</p>
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