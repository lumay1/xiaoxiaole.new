import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Game from './Game';

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];
const BOARD_SIZE = 8;
const GAME_TIME = 60;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [selectedItems, setSelectedItems] = useState<[number, number][]>([]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft]);

  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => COLORS[Math.floor(Math.random() * COLORS.length)])
    );
    setGrid(newBoard);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    initializeBoard();
    setScore(0);
    setTimeLeft(GAME_TIME);
  };

  const handleItemClick = (row: number, col: number) => {
    const color = grid[row][col];
    const visited = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(false));
    const matches = checkMatch(row, col, color, visited);

    if (matches.length >= 3) {
      setSelectedItems(matches);
      setTimeout(() => {
        let newGrid = [...grid];
        matches.forEach(([r, c]) => {
          newGrid[r][c] = '';
        });
        // Drop tiles
        for (let c = 0; c < BOARD_SIZE; c++) {
          let emptyRow = BOARD_SIZE - 1;
          for (let r = BOARD_SIZE - 1; r >= 0; r--) {
            if (newGrid[r][c] !== '') {
              newGrid[emptyRow][c] = newGrid[r][c];
              if (emptyRow !== r) {
                newGrid[r][c] = '';
              }
              emptyRow--;
            }
          }
        }
        // Fill empty spaces
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            if (newGrid[r][c] === '') {
              newGrid[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
          }
        }
        setGrid(newGrid);
        setScore((prevScore) => prevScore + matches.length);
        setSelectedItems([]);
      }, 300);
    }
  };

  const checkMatch = (row: number, col: number, color: string, visited: boolean[][]) => {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE || 
        visited[row][col] || grid[row][col] !== color) {
      return [];
    }

    visited[row][col] = true;
    let matches = [[row, col]];

    // Check horizontal and vertical
    matches = matches.concat(checkMatch(row + 1, col, color, visited));
    matches = matches.concat(checkMatch(row - 1, col, color, visited));
    matches = matches.concat(checkMatch(row, col + 1, color, visited));
    matches = matches.concat(checkMatch(row, col - 1, color, visited));

    return matches;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="game-container">
        {gameStarted ? (
          <>
            <div className="mb-4 text-xl">
              分数: {score} | 时间: {timeLeft}s
            </div>
            <Game
              grid={grid}
              onItemClick={handleItemClick}
              selectedItems={selectedItems}
            />
          </>
        ) : (
          <motion.button
            className="mt-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-6 px-12 rounded-full shadow-lg flex items-center justify-center text-2xl font-serif"
            onClick={handleStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="mr-4" size={32} />
            开始游戏
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default App;
