import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { wordList } from "../assets/data/wordlewords.js";
import "../styles/wordle.css";

export function WordlePage() {

  // ========================
  // 📦 PLAYER DATA
  // ========================
  const location = useLocation();
  const playerName = location.state?.name || "Player";

  // ========================
  // 🎴 WORD
  // ========================
  const getWord = () => {
    return wordList[Math.floor(Math.random() * wordList.length)];
  };

  const [solution, setSolution] = useState(getWord());

  // ========================
  // 🧠 STATE
  // ========================
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState(null);

  // ========================
  // 📌 REF FOR FOCUS
  // ========================
  const pageRef = useRef(null);

  useEffect(() => {
    pageRef.current.focus(); // focus on load
  }, []);

  // ========================
  // 🎨 FORMAT GUESS
  // ========================
  const formatGuess = (guess) => {
    return guess.split("").map((letter, i) => {
      if (solution[i] === letter) return { letter, status: "correct" };
      if (solution.includes(letter)) return { letter, status: "present" };
      return { letter, status: "absent" };
    });
  };

  // ========================
  // ⌨️ INPUT
  // ========================
  const handleKey = (e) => {
    if (e.repeat) return;

    // ENTER
    if (e.key === "Enter") {
      if (gameOver) return;

      if (currentGuess.length !== 5) {
        setError("Must be 5 letters!");
        return;
      }

      if (!wordList.includes(currentGuess)) {
        setError("Not a valid word!");
        return;
      }

      setError(null);

      const formatted = formatGuess(currentGuess);
      const newGuesses = [...guesses, formatted];

      setGuesses(newGuesses);

      if (currentGuess === solution || newGuesses.length === 6) {
        setGameOver(true);
      }

      setCurrentGuess("");
      return;
    }

    // BACKSPACE
    if (e.key === "Backspace") {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    // LETTERS
    if (/^[a-zA-Z]$/.test(e.key)) {
      if (currentGuess.length >= 5) return;
      setCurrentGuess(prev => prev + e.key.toLowerCase());
      setError(null);
    }
  };

  // ========================
  // 🔄 RESET
  // ========================
  const resetGame = () => {
    setSolution(getWord());
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setError(null);

    pageRef.current.focus(); // 🔥 keep keyboard working after reset
  };

  // ========================
  // 🎨 UI
  // ========================
  return (
    <section
      ref={pageRef}
      className="wordle-page"
      tabIndex="0"
      onKeyDown={handleKey}
    >

      <p>{playerName}</p>
      <h2>Wordle</h2>

      {/* GRID */}
      <div className="grid">
        {[...Array(6)].map((_, i) => {
          const guess = guesses[i];

          return (
            <div key={i} className="row">
              {[...Array(5)].map((_, j) => {
                const letterObj = guess?.[j];

                return (
                  <div
                    key={j}
                    className={`cell ${letterObj?.status || ""}`}
                  >
                    {letterObj?.letter || (i === guesses.length ? currentGuess[j] : "")}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ERROR */}
      {error && <p className="error">{error}</p>}

      {/* RESULT */}
      {gameOver && (
        <div className="result">
          {guesses.some(g => g.map(l => l.letter).join("") === solution)
            ? <p>🎉 You Win!</p>
            : <p>💀 Word was: {solution}</p>}
        </div>
      )}

      {/* RESET */}
      <button onClick={resetGame} className="new-game-button">
        New Game
      </button>

      {/* NAV */}
      <div className="navigation">
        <Link to="/" className="back-button">Back to Game Select</Link>
        <Link to={`/lobby/wordle`} className="back-button">Back to Lobby</Link>
      </div>

    </section>
  );
}