import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import ShortBanner from "../Components/ShortBanner";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_SIZE = 4;
const CARD_SIZE = (SCREEN_WIDTH - 80) / GRID_SIZE;

const cardValues = ["🍎", "🍌", "🍒", "🍇", "🍉", "🥝", "🍍", "🍓"];

export default function MemoryCardGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [performance, setPerformance] = useState("");

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const deck = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value }));

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setGameOver(false);
    setPerformance("");
  };

  const handleFlip = (index) => {
    // Prevent flipping if already flipped, matched, more than 2 cards flipped, or game over
    if (flipped.includes(index) || matched.includes(index) || flipped.length >= 2 || gameOver) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1);

      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setMatched(prev => {
            const updatedMatched = [...prev, ...newFlipped];
            if (updatedMatched.length === cards.length) {
              setGameOver(true);
              evaluatePerformance(attempts + 1);
            }
            return updatedMatched;
          });
          setFlipped([]);
        }, 400);
      } else {
        // No match
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const evaluatePerformance = (totalAttempts) => {
    if (totalAttempts <= 8) setPerformance("Excellent! 🌟");
    else if (totalAttempts <= 12) setPerformance("Very Good! 👍");
    else if (totalAttempts <= 16) setPerformance("Good 😊");
    else if (totalAttempts <= 20) setPerformance("Not Bad 🙂");
    else setPerformance("Keep Practicing! 💪");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Memory Match</Text>
      <Text style={styles.score}>Attempts: {attempts}</Text>



      <View style={styles.board}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          const isMatched = matched.includes(index);
          return (
            <Pressable
              key={card.id}
              style={[
                styles.card,
                isMatched && styles.cardMatched,
                isFlipped && !isMatched && styles.cardFlipped,
              ]}
              onPress={() => handleFlip(index)}
              disabled={isFlipped || gameOver}
            >
              <Text style={styles.cardText}>
                {isFlipped ? card.value : "❓"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.restartBtn} onPress={resetGame}>
        <Text style={styles.restartText}>🔄 Restart Game</Text>
      </Pressable>

      <View style={{ alignItems: 'center' }}>
        <ShortBanner />
      </View> 

      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.winContainer}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={styles.gameOverText}>YOU WIN!</Text>
            <Text style={styles.performance}>{performance}</Text>
            <Text style={styles.attemptsText}>
              Total Attempts: {attempts}
            </Text>
            <Pressable style={styles.playAgainBtn} onPress={resetGame}>
              <Text style={styles.playAgainText}>🎮 Play Again</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0a2e",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00ffff",
    marginBottom: 15,
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  score: {
    fontSize: 20,
    color: "#ffeb3b",
    marginBottom: 15,
    fontWeight: "600",
  },
  restartBtn: {
    marginTop: scale(14),
    backgroundColor: "#00ffff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  restartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a0a2e",
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH - 20,
    paddingHorizontal: 10,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: 5,
    backgroundColor: "#2d1b4e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4a2d6e",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardFlipped: {
    backgroundColor: "#00ffff",
    borderColor: "#00ffff",
  },
  cardMatched: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  cardText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  winContainer: {
    backgroundColor: "#6a0dad",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ff00ff",
    elevation: 10,
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  trophy: {
    fontSize: 80,
    marginBottom: 20,
  },
  gameOverText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffeb3b",
    marginBottom: 20,
    textShadowColor: "#ffeb3b",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  performance: {
    fontSize: 28,
    color: "#4caf50",
    marginBottom: 15,
    fontWeight: "bold",
  },
  attemptsText: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 30,
    fontWeight: "600",
  },
  playAgainBtn: {
    backgroundColor: "#00ffff",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  playAgainText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a0a2e",
  },
});