import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function BlackjackPage() {
  const location = useLocation();
  const avatar = location.state?.avatar;
  const playerName = location.state?.name || "Player";
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState("betting"); // betting, playing, dealer-turn, game-over
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [message, setMessage] = useState("Place your bet!");
  const [bet, setBet] = useState(10);
  const [bankroll, setBankroll] = useState(1000);
  const [canDouble, setCanDouble] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const [newCardIndices, setNewCardIndices] = useState({ player: [], dealer: [] });

  const dealerAvatar = {
  name: "Dealer Luigi",
  image: "/src/assets/avatars/dealerluigi.png",
  emoji: "🟢",
  color: "linear-gradient(135deg, #00aa00, #00ff00)"
  };

  // Card suits and values
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  // Create and shuffle deck
  const createDeck = () => {
    const newDeck = [];
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push({ suit, value });
      }
    }
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Calculate hand value
  const calculateHandValue = (hand) => {
    let value = 0;
    let aces = 0;

    for (let card of hand) {
      if (card.value === "A") {
        aces += 1;
        value += 11;
      } else if (["J", "Q", "K"].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    }

    // Handle aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  // Deal initial cards
  const dealCards = () => {
    const newDeck = createDeck();
    const playerCards = [newDeck.pop(), newDeck.pop()];
    const dealerCards = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setPlayerScore(calculateHandValue(playerCards));
    setDealerScore(calculateHandValue([dealerCards[0]])); // Only show first card score initially
    setGameState("playing");
    setMessage("Hit or Stand?");
    setCanDouble(true);
    setCanSplit(playerCards[0].value === playerCards[1].value);

    // Trigger animations for initial cards
    setNewCardIndices({ player: [0, 1], dealer: [0, 1] });

    // Clear animation flags after animation completes
    setTimeout(() => {
      setNewCardIndices({ player: [], dealer: [] });
    }, 600);
  };

  // Player actions
  const hit = () => {
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newHand = [...playerHand, newCard];
    const newScore = calculateHandValue(newHand);

    setDeck(newDeck);
    setPlayerHand(newHand);
    setPlayerScore(newScore);
    setNewCardIndices(prev => ({
      ...prev,
      player: [...prev.player, newHand.length - 1]
    }));

    // Clear animation after it plays
    setTimeout(() => {
      setNewCardIndices(prev => ({
        ...prev,
        player: []
      }));
    }, 600);

    setCanDouble(false);
    setCanSplit(false);

    if (newScore > 21) {
      setGameState("game-over");
      setMessage("Bust! You lose.");
      setBankroll(prev => prev - bet);
    }
  };

  const stand = () => {
    setGameState("dealer-turn");
    setCanDouble(false);
    setCanSplit(false);
    dealerTurn();
  };

  const doubleDown = () => {
    if (bankroll >= bet) {
      setBet(prev => prev * 2);
      const newDeck = [...deck];
      const newCard = newDeck.pop();
      const newHand = [...playerHand, newCard];
      const newScore = calculateHandValue(newHand);

      setDeck(newDeck);
      setPlayerHand(newHand);
      setPlayerScore(newScore);

      if (newScore > 21) {
        setGameState("game-over");
        setMessage("Bust! You lose.");
        setBankroll(prev => prev - bet);
      } else {
        dealerTurn();
      }
    }
  };

  const dealerTurn = () => {
    let currentDealerHand = [...dealerHand];
    let currentDealerScore = calculateHandValue(currentDealerHand);
    let currentDeck = [...deck];

    // Reveal dealer's hole card first
    setDealerScore(currentDealerScore);

    const hitDealer = () => {
      if (currentDealerScore < 17) {
        const newCard = currentDeck.pop();
        currentDealerHand = [...currentDealerHand, newCard];
        currentDealerScore = calculateHandValue(currentDealerHand);

        setDealerHand([...currentDealerHand]);
        setDealerScore(currentDealerScore);
        setDeck([...currentDeck]);
        setNewCardIndices(prev => ({
          ...prev,
          dealer: [currentDealerHand.length - 1]
        }));

        // Clear animation after it plays
        setTimeout(() => {
          setNewCardIndices(prev => ({
            ...prev,
            dealer: []
          }));
        }, 600);

        // Continue hitting if needed
        if (currentDealerScore < 17) {
          setTimeout(hitDealer, 1000); // 1 second pause between hits
        } else {
          // Dealer stands, determine winner
          setTimeout(() => {
            determineWinner(currentDealerScore);
          }, 1000);
        }
      } else {
        // Dealer stands, determine winner
        setTimeout(() => {
          determineWinner(currentDealerScore);
        }, 1000);
      }
    };

    hitDealer();
  };

  const determineWinner = (dealerFinalScore) => {
    if (dealerFinalScore > 21) {
      setMessage("Dealer busts! You win!");
      setBankroll(prev => prev + bet);
    } else if (playerScore > dealerFinalScore) {
      setMessage("You win!");
      setBankroll(prev => prev + bet);
    } else if (playerScore < dealerFinalScore) {
      setMessage("Dealer wins!");
      setBankroll(prev => prev - bet);
    } else {
      setMessage("Push! It's a tie.");
    }
    setGameState("game-over");
  };

  const newGame = () => {
    setGameState("betting");
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerScore(0);
    setDealerScore(0);
    setMessage("Place your bet!");
    setCanDouble(false);
    setCanSplit(false);
    setNewCardIndices({ player: [], dealer: [] });
  };

  const adjustBet = (amount) => {
    const newBet = Math.max(10, Math.min(bet + amount, bankroll));
    setBet(newBet);
  };

  const startGame = () => {
    if (bankroll >= bet) {
      dealCards();
    }
  };

  return (
    <section className="blackjack-page">
      <div className="game-header">
        <h2>Blackjack</h2>
        <div className="bankroll-display">
          <span>Bankroll: ${bankroll}</span>
        </div>
      </div>

      <div className="game-area">
        {/* Dealer */}
        <div className="dealer-section">
          <div className="dealer-header">
            <div className="avatar-circle small" style={{ background: dealerAvatar.color }}>
                <img src={dealerAvatar.image} className="avatar-image" />
        </div>
                
                <h3>{dealerAvatar.name}</h3>
        </div>
          <div className="hand">
            {dealerHand.length === 0 ? (
              <>
                <div className="card placeholder"></div>
                <div className="card placeholder"></div>
              </>
            ) : (
              dealerHand.map((card, index) => (
                <div key={index} className={`card ${newCardIndices.dealer.includes(index) ? "card-new" : ""}`} style={{ animationDelay: `${index * 0.15}s` }}>
                  {index === 1 && gameState === "playing" ? (
                    <div className="card-back">
                      <div className="card-pattern"></div>
                    </div>
                  ) : (
                    <div className="card-front">
                      <span className="card-value">{card.value}</span>
                      <span className="card-suit">{card.suit}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          {gameState !== "betting" && gameState !== "playing" && (
            <div className="score">Score: {dealerScore}</div>
          )}
          {gameState === "playing" && (
            <div className="score">Score: {calculateHandValue([dealerHand[0]])}</div>
          )}
        </div>

        {/* Player */}
        <div className="player-section">
          <div className="hand">
            {playerHand.length === 0 ? (
              <>
                <div className="card placeholder"></div>
                <div className="card placeholder"></div>
              </>
            ) : (
            playerHand.map((card, index) => (
              <div key={index} className={`card ${newCardIndices.player.includes(index) ? "card-new" : ""}`} style={{ animationDelay: `${index * 0.15}s` }}>
                
                <div className="card-front">
                  <span className="card-value">{card.value}</span>
                  <span className="card-suit">{card.suit}</span>
                </div>
              </div>
                ))
            )}
          </div>
          <div className="player-header">
            <div className="avatar-circle small" style={{ background: avatar?.color }}>
                {avatar?.image ? (
            <img src={avatar.image} className="avatar-image" />
            ) : (
            <span className="avatar-emoji">{avatar?.emoji}</span>
            )}
        </div>
        <h3>{playerName}</h3>
    </div>
          {gameState !== "betting" && (
            <div className="score">Score: {playerScore}</div>
          )}
        </div>
      </div>

      {/* Betting Phase */}
      {gameState === "betting" && (
        <div className="betting-section">
          <div className="bet-controls">
            <button onClick={() => adjustBet(-10)} disabled={bet <= 10}>-</button>
            <span className="current-bet">Bet: ${bet}</span>
            <button onClick={() => adjustBet(10)} disabled={bet >= bankroll}>+</button>
          </div>
          <button className="deal-button" onClick={startGame} disabled={bankroll < bet}>
            Deal Cards
          </button>
        </div>
      )}

      {/* Playing Phase */}
      {gameState === "playing" && (
        <div className="action-buttons">
          <button onClick={hit}>Hit</button>
          <button onClick={stand}>Stand</button>
          {canDouble && <button onClick={doubleDown} disabled={bankroll < bet}>Double Down</button>}
          {canSplit && <button disabled>Split</button>}
        </div>
      )}

      {/* Game Over */}
      {gameState === "game-over" && (
        <div className="game-over-section">
          <p className="result-message">{message}</p>
          <button className="new-game-button" onClick={newGame}>New Game</button>
        </div>
      )}

      {gameState === "betting" && (
    <div className="navigation">
        <Link to="/" className="back-button">Back to Game Select</Link>
        <Link to={`/lobby/blackjack`} className="back-button">Back to Lobby</Link>
    </div>
    )}
    </section>
  );
}