import { Link } from "react-router-dom";

export function HomePage() {
  const games = [
    { key: "rps", name: "Rock Paper Scissors" },
    { key: "tic-tac-toe", name: "Tic-Tac-Toe" },
    { key: "wordle", name: "Wordle" },
    { key: "hangman", name: "Hangman" },
    { key: "blackjack", name: "Blackjack" },
  ];

  return (
    <section className="home-page">
      <h2 className="games-title">Available Games</h2>

      <ul className="games-list">
        {games.map((game) => (
          <li key={game.key} className="game-item">
            <Link to={`/game/${game.key}`} className="game-link">
              <span className="game-label">{game.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}