import { useState, useEffect, useCallback } from 'react';
import { GameState, LuxuryItem } from '../types';
import { LUXURY_ITEMS, GRID_SIZE, LEVELS, INITIAL_LIVES, GAME_TIME } from '../constants';

const createInitialGrid = (): LuxuryItem[] => {
  const itemTypes = Object.keys(LUXURY_ITEMS);
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
    id: index,
    type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
    matched: false,
  }));
};

const initialGameState: GameState = {
  currentLevel: 0,
  score: 0,
  money: 0,
  timeLeft: GAME_TIME,
  movesLeft: LEVELS[0].moves,
  lives: INITIAL_LIVES,
  grid: createInitialGrid(),
  selectedItems: [],
  stars: 0,
  targetItem: LEVELS[0].targetItem,
  isGameStarted: false,
  showLevelCompleteDialog: false,
  showGameOverDialog: false,
  requiredScore: LEVELS[0].requiredScore,
  history: {
    lastLevel: 0,
    scores: [],
  },
};

const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const handleItemClick = useCallback((index: number) => {
    setGameState((prevState) => {
      const newSelectedItems = [...prevState.selectedItems];
      const newGrid = [...prevState.grid];

      if (newSelectedItems.length === 0) {
        // First item selected
        newSelectedItems.push(index);
      } else if (newSelectedItems.length === 1) {
        // Second item selected
        const firstIndex = newSelectedItems[0];
        const secondIndex = index;

        if (areItemsAdjacent(firstIndex, secondIndex)) {
          // Swap items
          const temp = newGrid[firstIndex];
          newGrid[firstIndex] = newGrid[secondIndex];
          newGrid[secondIndex] = temp;

          // Clear selected items
          newSelectedItems.length = 0;

          // Check for matches after swapping
          const matchedIndices = checkForMatches(newGrid);
          if (matchedIndices.length > 0) {
            // Handle matched items
            matchedIndices.forEach((i) => {
              newGrid[i].matched = true;
            });
            // Update score, etc.
            // This is a placeholder, you should implement proper scoring logic
            const newScore = prevState.score + matchedIndices.length * 10;
            return {
              ...prevState,
              grid: newGrid,
              score: newScore,
              selectedItems: newSelectedItems,
            };
          } else {
            // If no matches, swap back
            const temp = newGrid[firstIndex];
            newGrid[firstIndex] = newGrid[secondIndex];
            newGrid[secondIndex] = temp;
          }
        } else {
          // If not adjacent, just select the new item
          newSelectedItems.length = 0;
          newSelectedItems.push(index);
        }
      }

      return {
        ...prevState,
        grid: newGrid,
        selectedItems: newSelectedItems,
      };
    });
  }, []);

  const areItemsAdjacent = (index1: number, index2: number): boolean => {
    const row1 = Math.floor(index1 / GRID_SIZE);
    const col1 = index1 % GRID_SIZE;
    const row2 = Math.floor(index2 / GRID_SIZE);
    const col2 = index2 % GRID_SIZE;

    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  const checkForMatches = (grid: LuxuryItem[]): number[] => {
    const matchedIndices: number[] = [];

    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const index = row * GRID_SIZE + col;
        if (
          grid[index].type === grid[index + 1].type &&
          grid[index].type === grid[index + 2].type
        ) {
          matchedIndices.push(index, index + 1, index + 2);
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
        const index = row * GRID_SIZE + col;
        if (
          grid[index].type === grid[index + GRID_SIZE].type &&
          grid[index].type === grid[index + GRID_SIZE * 2].type
        ) {
          matchedIndices.push(index, index + GRID_SIZE, index + GRID_SIZE * 2);
        }
      }
    }

    // Remove duplicates
    return Array.from(new Set(matchedIndices));
  };

  const resetLevel = useCallback(() => {
    setGameState((prevState) => ({
      ...initialGameState,
      currentLevel: prevState.currentLevel,
      lives: prevState.lives - 1,
      history: prevState.history,
    }));
  }, []);

  const restartGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  const startGame = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      isGameStarted: true,
    }));
  }, []);

  const nextLevel = useCallback(() => {
    setGameState((prevState) => {
      const nextLevel = prevState.currentLevel + 1;
      const levelConfig = LEVELS[nextLevel] || LEVELS[LEVELS.length - 1];
      return {
        ...initialGameState,
        currentLevel: nextLevel,
        grid: createInitialGrid(),
        requiredScore: levelConfig.requiredScore,
        targetItem: levelConfig.targetItem,
        movesLeft: levelConfig.moves,
        isGameStarted: true,
        history: prevState.history,
      };
    });
  }, []);

  const saveGame = useCallback(() => {
    // Implement save game logic
  }, []);

  const loadGame = useCallback((level: number) => {
    // Implement load game logic
  }, []);

  const handlePurchase = useCallback((item: string, cost: number, currency: 'levels' | 'money') => {
    // Implement purchase logic
  }, []);

  return {
    gameState,
    handleItemClick,
    resetLevel,
    restartGame,
    startGame,
    nextLevel,
    saveGame,
    loadGame,
    handlePurchase,
  };
};

export default useGame;