import { useState, useEffect, useRef, useCallback } from "react";
import { X, RotateCcw, Play, Pause, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  status: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface GameProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  "#ff0080", "#ff4d00", "#ffdd00", "#00ff80",
  "#00ddff", "#8000ff", "#ff1493", "#00ffff",
  "#ffd700", "#7fff00", "#ff4500", "#da70d6",
];

// All game state lives here — one single ref object so draw() always
// reads the freshest values with zero stale-closure risk.
interface GameState {
  running: boolean;
  paused: boolean;
  over: boolean;
  score: number;
  highScore: number;
  maxSpeed: number;
  paddle: { x: number; y: number; width: number; height: number };
  ball: { x: number; y: number; dx: number; dy: number; radius: number };
  bricks: Brick[];
  particles: Particle[];
}

const Game = ({ isOpen, onClose }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Single source of truth for all game logic
  const gs = useRef<GameState>({
    running: false,
    paused: false,
    over: false,
    score: 0,
    highScore: parseInt(localStorage.getItem("brickBreakerHighScore") ?? "0") || 0,
    maxSpeed: 8,
    paddle: { x: 0, y: 0, width: 0, height: 0 },
    ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 0 },
    bricks: [],
    particles: [],
  });

  // React state — only for UI rendering
  const [uiScore, setUiScore] = useState(0);
  const [uiHighScore, setUiHighScore] = useState(gs.current.highScore);
  const [uiStarted, setUiStarted] = useState(false);
  const [uiOver, setUiOver] = useState(false);
  const [uiPaused, setUiPaused] = useState(false);

  /* ── helpers ──────────────────────────────────────────────── */

  const getCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const hud = hudRef.current;
    if (!canvas || !hud) return { w: 800, h: 500 };
    return { w: window.innerWidth, h: window.innerHeight - hud.offsetHeight };
  }, []);

  const buildBricks = useCallback((w: number, h: number): Brick[] => {
    const cols = 10, rows = 5;
    const gapX = w * 0.013;
    const gapY = h * 0.016;
    const offsetTop = h * 0.07;
    const offsetLeft = w * 0.03;
    const brickW = (w - offsetLeft * 2 - gapX * (cols - 1)) / cols;
    const brickH = Math.max(16, h * 0.045);
    const bricks: Brick[] = [];
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++)
        bricks.push({
          x: c * (brickW + gapX) + offsetLeft,
          y: r * (brickH + gapY) + offsetTop,
          width: brickW, height: brickH,
          color: COLORS[(c + r) % COLORS.length],
          status: 1,
        });
    return bricks;
  }, []);

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++)
      gs.current.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1, color,
      });
  };

  /* ── draw loop — defined once, reads gs.current every frame ── */
  const draw = useCallback(() => {
    const g = gs.current;
    if (!g.running || g.paused || g.over) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const clamp = (v: number) => Math.max(-g.maxSpeed, Math.min(g.maxSpeed, v));

    // Clear
    ctx.fillStyle = "#0a0412";
    ctx.fillRect(0, 0, W, H);

    // Paddle
    const { paddle, ball } = g;
    ctx.fillStyle = "#00ffff";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.height / 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = "#ff00ff";
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bricks
    g.bricks.forEach(b => {
      if (b.status !== 1) return;
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.width, b.height, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Particles
    for (let i = g.particles.length - 1; i >= 0; i--) {
      const p = g.particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.03;
      if (p.life <= 0) { g.particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.life * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* — Wall collisions — */
    if (ball.x + ball.dx > W - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
    if (ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;

    /* — Paddle collision — */
    if (
      ball.dy > 0 &&
      ball.y + ball.dy >= paddle.y - ball.radius &&
      ball.y < paddle.y + paddle.height &&
      ball.x > paddle.x && ball.x < paddle.x + paddle.width
    ) {
      ball.dy = -Math.abs(ball.dy);
      const hit = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.dx = clamp(hit * g.maxSpeed);
    }

    /* — Floor — */
    if (ball.y + ball.dy > H + ball.radius) {
      cancelAnimationFrame(rafRef.current!);
      g.running = false;
      g.over = true;
      if (g.score > g.highScore) {
        g.highScore = g.score;
        setUiHighScore(g.score);
        localStorage.setItem("brickBreakerHighScore", String(g.score));
      }
      setUiOver(true);
      setUiStarted(false);
      return;
    }

    /* — Brick collisions — */
    let bounced = false;
    for (const b of g.bricks) {
      if (b.status !== 1 || bounced) continue;
      const ox = ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + b.width;
      const oy = ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + b.height;
      if (ox && oy) {
        b.status = 0;
        bounced = true;
        const prevY = ball.y - ball.dy;
        if (prevY + ball.radius <= b.y || prevY - ball.radius >= b.y + b.height)
          ball.dy = clamp(-ball.dy * 1.02);
        else
          ball.dx = clamp(-ball.dx * 1.02);
        g.score += 15;
        setUiScore(g.score);
        spawnParticles(b.x + b.width / 2, b.y + b.height / 2, b.color);
      }
    }

    /* — Level complete — */
    if (g.bricks.every(b => b.status === 0)) {
      g.score += 200;
      setUiScore(g.score);
      g.bricks = buildBricks(W, H);
    }

    /* — Move ball — */
    ball.x += ball.dx;
    ball.y += ball.dy;

    rafRef.current = requestAnimationFrame(draw);
  // draw reads everything via gs.current — no deps needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── INIT ─────────────────────────────────────────────────── */
  const initGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current!);

    const canvas = canvasRef.current;
    const hud = hudRef.current;
    if (!canvas || !hud) return;

    // Set canvas pixel buffer to match viewport
    const W = window.innerWidth;
    const H = window.innerHeight - hud.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const scale = Math.min(W / 800, H / 500, 1.5);
    const paddleW = Math.min(180, Math.max(80, W * 0.18));
    const paddleH = Math.max(12, Math.round(18 * scale));
    const ballR = Math.max(7, Math.round(10 * scale));
    const speed = Math.max(4, 5 * scale);
    const paddleY = H - paddleH - Math.max(20, H * 0.05);

    const g = gs.current;
    g.running = true;
    g.paused = false;
    g.over = false;
    g.score = 0;
    g.maxSpeed = Math.max(6, 8 * scale);
    g.paddle = { x: W / 2 - paddleW / 2, y: paddleY, width: paddleW, height: paddleH };
    g.ball = { x: W / 2, y: paddleY - ballR - 4, dx: speed, dy: -speed, radius: ballR };
    g.bricks = buildBricks(W, H);
    g.particles = [];

    setUiScore(0);
    setUiOver(false);
    setUiStarted(true);
    setUiPaused(false);

    rafRef.current = requestAnimationFrame(draw);
  }, [draw, buildBricks]);

  /* ── RESIZE — debounced so we don't spam initGame ─────────── */
  useEffect(() => {
    if (!isOpen) return;

    const onResize = () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        // Only resize canvas dimensions; if game is running, restart loop
        const canvas = canvasRef.current;
        const hud = hudRef.current;
        if (!canvas || !hud) return;
        const W = window.innerWidth;
        const H = window.innerHeight - hud.offsetHeight;
        canvas.width = W;   // ← this clears the canvas but doesn't kill the ref
        canvas.height = H;

        const g = gs.current;
        // Re-scale game objects to new size
        if (g.running && !g.over) {
          const scale = Math.min(W / 800, H / 500, 1.5);
          const paddleW = Math.min(180, Math.max(80, W * 0.18));
          const paddleH = Math.max(12, Math.round(18 * scale));
          const paddleY = H - paddleH - Math.max(20, H * 0.05);
          g.maxSpeed = Math.max(6, 8 * scale);
          // Keep paddle clamped inside new width
          g.paddle.width = paddleW;
          g.paddle.height = paddleH;
          g.paddle.y = paddleY;
          g.paddle.x = Math.min(g.paddle.x, W - paddleW);
          // Clamp ball inside new bounds
          g.ball.x = Math.min(g.ball.x, W - g.ball.radius);
          g.ball.y = Math.min(g.ball.y, H - g.ball.radius);
          // Rebuild bricks for new layout
          g.bricks = buildBricks(W, H);

          // Restart the loop (resize killed it by clearing canvas context state)
          cancelAnimationFrame(rafRef.current!);
          if (!g.paused) rafRef.current = requestAnimationFrame(draw);
        }
      }, 150);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimerRef.current);
    };
  }, [isOpen, draw, buildBricks]);

  /* ── PAUSE / RESUME ───────────────────────────────────────── */
  const togglePause = useCallback(() => {
    const g = gs.current;
    if (!g.running || g.over) return;
    g.paused = !g.paused;
    setUiPaused(g.paused);
    if (!g.paused) rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  /* ── MOUSE ────────────────────────────────────────────────── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const p = gs.current.paddle;
      p.x = Math.max(0, Math.min(x - p.width / 2, canvas.width - p.width));
    };
    if (isOpen) window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isOpen]);

  /* ── TOUCH ────────────────────────────────────────────────── */
  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
      const p = gs.current.paddle;
      p.x = Math.max(0, Math.min(x - p.width / 2, canvas.width - p.width));
    };
    if (isOpen) window.addEventListener("touchmove", onTouch, { passive: true });
    return () => window.removeEventListener("touchmove", onTouch);
  }, [isOpen]);

  /* ── KEYBOARD ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.code === "Space") { e.preventDefault(); togglePause(); }
      if (e.code === "KeyR") initGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, togglePause, initGame]);

  /* ── CLEANUP ──────────────────────────────────────────────── */
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      style={{ touchAction: "none" }}
    >
      {/* HUD */}
      <div
        ref={hudRef}
        className="flex justify-between items-center px-4 py-2 bg-purple-700 text-white shrink-0 select-none"
      >
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">BRICK BREAKER</span>
          <span className="sm:hidden">BB</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-5 text-sm sm:text-base">
          <span className="opacity-75 text-xs sm:text-sm">
            Best: <strong>{uiHighScore}</strong>
          </span>
          <span className="text-xs sm:text-sm">
            Score: <strong>{uiScore}</strong>
          </span>

          {uiStarted && (
            <button
              onClick={togglePause}
              className="p-1.5 rounded hover:bg-purple-500 transition-colors"
              title="Space"
            >
              {uiPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={initGame}
            className="p-1.5 rounded hover:bg-purple-500 transition-colors"
            title="R"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-red-500 transition-colors ml-2"
            title="Exit"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Start screen */}
        {!uiStarted && !uiOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-4 px-4">
            <h1 className="text-white text-3xl sm:text-5xl font-bold tracking-widest text-center">
              BRICK BREAKER
            </h1>
            <p className="text-purple-300 text-sm sm:text-base text-center">
              Move mouse or finger to control the paddle
            </p>
            <Button
              onClick={initGame}
              className="mt-2 px-8 py-3 text-lg bg-purple-600 hover:bg-purple-500"
            >
              <Play className="mr-2 w-5 h-5" /> Start Game
            </Button>
            <p className="text-gray-500 text-xs mt-1">Space = pause · R = restart</p>
          </div>
        )}

        {/* Game Over */}
        {uiOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 gap-3 text-white px-4">
            <h2 className="text-4xl sm:text-6xl font-bold text-red-400 tracking-wide">
              GAME OVER
            </h2>
            <p className="text-xl sm:text-2xl text-purple-300">Score: {uiScore}</p>
            {uiScore > 0 && uiScore >= uiHighScore && (
              <p className="text-yellow-400 font-semibold text-lg">🏆 New High Score!</p>
            )}
            <Button
              onClick={initGame}
              className="mt-4 px-8 py-3 text-lg bg-purple-600 hover:bg-purple-500"
            >
              <RotateCcw className="mr-2 w-5 h-5" /> Play Again
            </Button>
          </div>
        )}

        {/* Paused */}
        {uiPaused && !uiOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-4 text-white">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-widest">PAUSED</h2>
            <Button
              onClick={togglePause}
              className="px-8 py-3 text-lg bg-purple-600 hover:bg-purple-500"
            >
              <Play className="mr-2 w-5 h-5" /> Resume
            </Button>
            <p className="text-gray-400 text-sm">Press Space to resume</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;