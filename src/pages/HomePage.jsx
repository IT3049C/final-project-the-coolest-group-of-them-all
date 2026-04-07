import { Link, useSearchParams } from "react-router-dom";

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const search = (params.get("search") || "").toLowerCase();

  const games = [
    { key: "rps", name: "Rock Paper Scissors" },
    { key: "tic-tac-toe", name: "Tic-Tac-Toe" },
    { key: "wordle", name: "Wordle" },
    { key: "hangman", name: "Hangman" },
    { key: "blackjack", name: "Blackjack" },
  ];

  const filteredGames = games.filter((game) =>
    !search || game.name.toLowerCase().includes(search)
  );

  return (
    <section className="home-page">
      <h2 className="games-title">Available Games</h2>

      <input
        id="game-search"
        className="game-search"
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() === "") setParams({});
          else setParams({ search: value });
        }}
      />

      <ul className="games-list">
        {filteredGames.map((game) => (
          <li key={game.key} className="game-item">
            <Link to={`/game/${game.key}`} className="game-link">{game.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}