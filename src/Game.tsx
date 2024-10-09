import React from 'react';
import { motion } from 'framer-motion';

interface GameProps {
  grid: string[][];
  onItemClick: (row: number, col: number) => void;
  selectedItems: [number, number][];
}

const Game: React.FC<GameProps> = ({ grid, onItemClick, selectedItems }) => {
  return (
    <div className="game-grid">
      {grid.map((row, rowIndex) =>
        row.map((item, colIndex) => (
          <motion.div
            key={`${rowIndex}-${colIndex}`}
            className={`game-item ${selectedItems.some(([r, c]) => r === rowIndex && c === colIndex) ? 'selected' : ''}`}
            onClick={() => onItemClick(rowIndex, colIndex)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src={`/images/${item}.png`} alt={item} />
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Game;
