import { Link } from "react-router-dom";

export function HomePage() {
  const games = [
    { key: "rps", name: "Rock Paper Scissors", isMultiplayer: true },
    { key: "tic-tac-toe", name: "Tic-Tac-Toe", isMultiplayer: true },
    { key: "wordle", name: "Wordle", isMultiplayer: false },
    { key: "hangman", name: "Hangman", isMultiplayer: false },
    { key: "blackjack", name: "Blackjack", isMultiplayer: false },
  ];

  return (
    <section className="home-page">
      <h2 className="games-title">Available Games</h2>

      <ul className="games-list">
        {games.map((game) => (
          <li key={game.key} className="game-item">
            <Link to={`/lobby/${game.key}`} className="game-link">
              <span className="game-label">{game.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}