import { useParams } from "react-router-dom";
import { BlackjackPage } from "./BlackjackPage";
import { HangmanPage } from "./HangmanPage";
import { TicTacToePage } from "./TicTacToePage";
import { RPSPage } from "./RPSPage";

export function GamePage() {
  const { gameKey } = useParams();

  // ========================
  // 🎮 GAME SWITCHER
  // ========================
  if (gameKey === "blackjack") {
    return <BlackjackPage />;
  }

  if (gameKey === "hangman") {
    return <HangmanPage />;
  }

  if (gameKey === "tic-tac-toe") {
    return <TicTacToePage />;
  }

  if (gameKey === "rps") {
    return <RPSPage />;
  }
  
  // ========================
  // ❌ FALLBACK (NOT BUILT YET)
  // ========================
  return (
    <section className="game-page">
      <h2>Game not implemented yet</h2>
      <p>{gameKey} is coming soon.</p>
    </section>
  );
}