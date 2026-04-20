import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { words } from "../assets/data/words.js";
import "../styles/hangman.css";

export function HangmanPage() {

  // ========================
  // 📦 PLAYER DATA
  // ========================
  const location = useLocation();
  const playerName = location.state?.name || "Player";

  // ========================
  // 🎴 WORD DATA
  // ========================
  const getRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)];
  };

  // ========================
  // 🧠 GAME STATE
  // ========================
  const [word, setWord] = useState(getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const maxWrong = 6;

  // ========================
  // 🪢 HANGMAN DRAWING
  // ========================
  const hangmanStages = [
    "",
    "😐",
    "😐\n |",
    "😐\n/|",
    "😐\n/|\\",
    "😐\n/|\\\n/",
    "😵\n/|\\\n/ \\"
  ];

  // ========================
  // 🔤 HANDLE GUESS
  // ========================
  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    setGuessedLetters(prev => [...prev, letter]);

    if (!word.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);

      if (newWrong >= maxWrong) {
        setGameOver(true);
      }
    }
  };

  // ========================
  // ⌨️ KEYBOARD INPUT
  // ========================
  useEffect(() => {
    const handleKeyPress = (e) => {
      const letter = e.key.toLowerCase();

      if (/^[a-z]$/.test(letter)) {
        handleGuess(letter);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [guessedLetters, gameOver, word]);

  // ========================
  // 🧮 DISPLAY WORD
  // ========================
  const displayWord = word
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");

  const isWinner = word
    .split("")
    .every(letter => guessedLetters.includes(letter));

  // ========================
  // 🔄 RESET GAME
  // ========================
  const resetGame = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
  };

  // ========================
  // 🎨 UI
  // ========================
  return (
    <section className="hangman-page">

      <h2>Hangman</h2>
      <p>{playerName}</p>

      {/* 🪢 Drawing */}
      <pre className="hangman-drawing">
        {hangmanStages[wrongGuesses]}
      </pre>

      {/* 🔤 Word */}
      <div className="word-display">
        <h3>{displayWord}</h3>
      </div>

      {/* 🧾 Guessed letters */}
      <p className="guessed-letters">
        Guessed: {guessedLetters.join(", ") || "None"}
      </p>

      {/* ❌ Wrong guesses */}
      <p>Wrong Guesses: {wrongGuesses} / {maxWrong}</p>

      {/* 🔠 Letters */}
      <div className="letters">
        {"abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || gameOver || isWinner}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* 🏆 Game status */}
      <div className="game-status">
        {isWinner && <p className="win">🎉 You Win!</p>}
        {gameOver && !isWinner && (
          <p className="lose">💀 You Lose! Word was: {word}</p>
        )}
      </div>

      {/* 🔄 Reset */}
      <button onClick={resetGame} className="new-game-button">
        New Game
        </button>

      {/* 🔙 Navigation */}
      <div className="navigation">
        <Link to="/" className="back-button">Back to Game Select</Link>
        <Link to={`/lobby/hangman`} className="back-button">Back to Lobby</Link>
      </div>

    </section>
  );
}