import { useParams, Link } from "react-router-dom";

export function GamePage() {
  const { gameKey } = useParams();

  const games = [
    { key: "rps", name: "Rock Paper Scissors" },
    { key: "tic-tac-toe", name: "Tic-Tac-Toe" },
    { key: "wordle", name: "Wordle" },
    { key: "hangman", name: "Hangman" },
    { key: "blackjack", name: "Blackjack" },
  ];

  const game = games.find(g => g.key === gameKey);

  return (
    <section className="game-page">
      <h2>{game ? game.name : "Unknown Game"}</h2>
      <p>This game is coming soon! Placeholder for {gameKey}.</p>
      <div className="game-buttons">
        <Link to="/" className="back-button">Back to Game Select</Link>
        <Link to={`/lobby/${gameKey}`} className="back-button">
          Go back to Lobby
        </Link>
      </div>
    </section>
  );
}