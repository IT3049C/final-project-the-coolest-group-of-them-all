import { useParams, Link, useNavigate } from "react-router-dom";

export function LobbyPage() {
  const { gameKey } = useParams();
  const navigate = useNavigate();

  const games = [
    { key: "rps", name: "Rock Paper Scissors", isMultiplayer: true },
    { key: "tic-tac-toe", name: "Tic-Tac-Toe", isMultiplayer: true },
    { key: "wordle", name: "Wordle", isMultiplayer: false },
    { key: "hangman", name: "Hangman", isMultiplayer: false },
    { key: "blackjack", name: "Blackjack", isMultiplayer: false },
  ];

  const game = games.find(g => g.key === gameKey);

  const handleContinue = () => {
    navigate(`/game/${gameKey}`);
  };

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <section className="lobby-page">
      <h2>Lobby for {game.name}</h2>
      <p>Lobby functionality coming soon! Placeholder.</p>

      <div className="lobby-buttons">
        <Link to="/" className="back-button">Back to Game Select</Link>
        <button onClick={handleContinue}>
          Continue to Game
        </button>
      </div>
    </section>
  );
}