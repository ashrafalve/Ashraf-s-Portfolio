import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomCursor from "@/components/CustomCursor";
import ChatBot from "@/components/ChatBot";
import Game from "@/components/Game";
import AIArena from "@/components/AIArena";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<"brick" | "arena" | null>(null);

  const handleGameSelect = (game: "brick" | "arena") => {
    setSelectedGame(game);
    setIsGameOpen(true);
  };

  const handleCloseGame = () => {
    setIsGameOpen(false);
    setSelectedGame(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CustomCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
          {selectedGame === "brick" && <Game isOpen={isGameOpen} onClose={handleCloseGame} />}
          {selectedGame === "arena" && <AIArena isOpen={isGameOpen} onClose={handleCloseGame} />}
        </BrowserRouter>
        
        {/* Game Selection Modal */}
        {isGameOpen && selectedGame === null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Choose a Game</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleGameSelect("brick")}
                  className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-xl hover:scale-105 transition-transform border-2 border-white/20"
                >
                  <div className="text-4xl mb-2" style={{ textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff' }}>🧱</div>
                  <div className="text-white font-bold">Brick Breaker</div>
                  <div className="text-white/70 text-sm">Classic arcade game</div>
                </button>
                <button
                  onClick={() => handleGameSelect("arena")}
                  className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl hover:scale-105 transition-transform border-2 border-white/20"
                >
                  <div className="text-4xl mb-2" style={{ textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff' }}>🎯</div>
                  <div className="text-white font-bold">Survival Arena</div>
                  <div className="text-white/70 text-sm">Survival shooter</div>
                </button>
              </div>
              <button
                onClick={handleCloseGame}
                className="mt-6 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsGameOpen(true)}
          className="fixed top-24 right-6 z-40 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold hover:shadow-[0_0_30px_hsl(15_90%_55%/0.6)] hover:scale-110 transition-all duration-300 cursor-pointer animate-pulse"
        >
          🎮 Bored? Click Here!
        </button>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
