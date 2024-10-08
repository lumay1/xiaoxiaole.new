import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import useGame from './hooks/useGame';
import Grid from './components/Grid';
import GameInfo from './components/GameInfo';
import Dialog from './components/Dialog';
import Tutorial from './components/Tutorial';
import LevelComplete from './components/LevelComplete';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import HistoryModal from './components/HistoryModal';
import StoreModal from './components/StoreModal';

function App() {
  const [showTutorial, setShowTutorial] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [username, setUsername] = useState('');

  const {
    gameState,
    handleItemClick,
    resetLevel,
    restartGame,
    startGame,
    nextLevel,
    saveGame,
    loadGame,
    handlePurchase,
  } = useGame();

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  const handleStartGame = () => {
    startGame();
    setShowTutorial(false);
  };

  const handleLogin = (name: string) => {
    setUsername(name);
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative" 
         style={{
           backgroundImage: "url('https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      <div className="absolute top-4 right-4">
        {username ? (
          <UserMenu
            username={username}
            onLogout={() => setUsername('')}
            onOpenHistory={() => setShowHistoryModal(true)}
            onOpenStore={() => setShowStoreModal(true)}
          />
        ) : (
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowAuthModal(true)}
          >
            注册/登录
          </button>
        )}
      </div>

      <div className="game-container w-3/4 h-3/4">
        {gameState.isGameStarted ? (
          <>
            <GameInfo
              level={gameState.currentLevel + 1}
              score={gameState.score}
              money={gameState.money}
              timeLeft={gameState.timeLeft}
              lives={gameState.lives}
              requiredScore={gameState.requiredScore}
              stars={gameState.stars}
            />
            
            <Grid
              grid={gameState.grid}
              onItemClick={handleItemClick}
              selectedItems={gameState.selectedItems}
            />
          </>
        ) : (
          <>
            <Tutorial isOpen={showTutorial} onClose={handleCloseTutorial} />
            <motion.button
              className="mt-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold py-6 px-12 rounded-full shadow-lg flex items-center justify-center text-2xl font-serif"
              style={{
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 215, 0, 0.6)',
              }}
              onClick={handleStartGame}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 25px rgba(255, 215, 0, 0.7), 0 0 70px rgba(255, 215, 0, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="mr-4" size={32} />
              开始奢华之旅
            </motion.button>
          </>
        )}
      </div>

      <Dialog
        isOpen={gameState.showLevelCompleteDialog}
        onClose={() => {}}
        onRestart={resetLevel}
        onRestartGame={restartGame}
        onNextLevel={nextLevel}
        title="关卡完成"
        message={`恭喜！你完成了第 ${gameState.currentLevel + 1} 关！`}
        showNextButton={true}
        showRestartButton={false}
        showRestartGameButton={false}
        lives={gameState.lives}
      />

      <LevelComplete
        isOpen={gameState.showLevelCompleteDialog}
        level={gameState.currentLevel + 1}
        score={gameState.score}
        requiredScore={gameState.requiredScore}
        onNextLevel={nextLevel}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={gameState.history}
        onSaveGame={saveGame}
        onLoadGame={loadGame}
      />

      <StoreModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        onPurchase={handlePurchase}
        currentLives={gameState.lives}
        currentMoney={gameState.money}
        currentLevel={gameState.currentLevel + 1}
      />
    </div>
  );
}

export default App;