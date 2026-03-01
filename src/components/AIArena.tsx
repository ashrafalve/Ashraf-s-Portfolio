import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   AI ARENA — SURVIVAL
   Player vs waves of AI enemies. Move with mouse/touch.
   Enemies hunt you with flocking + predictive AI.
   Features: XP/leveling, combo multiplier, screen shake,
             power-ups, boss waves, particle trails.
═══════════════════════════════════════════════════════════════ */

interface Vec2 { x: number; y: number }
interface Enemy {
  id: number; x: number; y: number; vx: number; vy: number;
  hp: number; maxHp: number; radius: number; type: EnemyType;
  angle: number; pulseT: number; deathT?: number;
}
interface Bullet {
  id: number; x: number; y: number; vx: number; vy: number;
  life: number; radius: number; pierce: number;
}
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; r: number; color: string; glow?: boolean;
}
interface PowerUp {
  id: number; x: number; y: number; type: PowerUpType; life: number;
}
interface FloatingText {
  x: number; y: number; text: string; life: number; color: string; vy: number;
}

type EnemyType = "chaser" | "sniper" | "tank" | "swarm" | "boss";
type PowerUpType = "shield" | "rapidfire" | "pierce" | "nuke";

interface GS {
  running: boolean; over: boolean; paused: boolean;
  // Player
  px: number; py: number; pRadius: number;
  ptx: number; pty: number; // target (mouse)
  hp: number; maxHp: number;
  shieldT: number; rapidT: number; pierceT: number;
  invincibleT: number;
  // Progression
  score: number; highScore: number;
  wave: number; waveEnemiesLeft: number; waveTimer: number; betweenWaves: boolean;
  xp: number; xpToNext: number; level: number;
  combo: number; comboT: number;
  // Fire
  fireT: number; fireRate: number;
  bulletId: number; enemyId: number; puId: number;
  // Collections
  bullets: Bullet[]; enemies: Enemy[]; particles: Particle[];
  powerUps: PowerUp[]; floatingTexts: FloatingText[];
  // Camera shake
  shakeT: number; shakeMag: number;
  // Time
  dt: number; lastTime: number;
}

const COLORS = {
  bg: "#04070f",
  grid: "#0a1628",
  player: "#00ffe0",
  playerGlow: "#00ffe0",
  bullet: "#ffe100",
  bulletGlow: "#ff9500",
  chaser: "#ff2d55",
  sniper: "#bf5af2",
  tank: "#ff6b00",
  swarm: "#ff375f",
  boss: "#ff0040",
  shield: "#00aaff",
  rapidfire: "#ffdd00",
  pierce: "#00ff88",
  nuke: "#ff4400",
  xpBar: "#00ffe0",
  hpBar: "#ff2d55",
  combo: "#ffe100",
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const dist = (ax: number, ay: number, bx: number, by: number) =>
  Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
const norm = (v: Vec2): Vec2 => {
  const m = Math.sqrt(v.x ** 2 + v.y ** 2) || 1;
  return { x: v.x / m, y: v.y / m };
};
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

interface GameProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Game({ isOpen = true, onClose }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const gs = useRef<GS>(makeGS());

  const [ui, setUi] = useState({
    screen: "start" as "start" | "playing" | "over" | "levelup",
    score: 0, highScore: 0, wave: 1, level: 1,
    hp: 100, maxHp: 100, xp: 0, xpToNext: 100,
    combo: 1, shield: false, rapid: false, pierce: false,
    paused: false,
  });

  function makeGS(): GS {
    const hs = parseInt(localStorage.getItem("arenaHS") || "0") || 0;
    return {
      running: false, over: false, paused: false,
      px: 400, py: 300, pRadius: 14,
      ptx: 400, pty: 300,
      hp: 100, maxHp: 100,
      shieldT: 0, rapidT: 0, pierceT: 0, invincibleT: 0,
      score: 0, highScore: hs,
      wave: 1, waveEnemiesLeft: 0, waveTimer: 0, betweenWaves: true,
      xp: 0, xpToNext: 100, level: 1,
      combo: 1, comboT: 0,
      fireT: 0, fireRate: 0.22,
      bulletId: 0, enemyId: 0, puId: 0,
      bullets: [], enemies: [], particles: [], powerUps: [], floatingTexts: [],
      shakeT: 0, shakeMag: 0,
      dt: 0, lastTime: 0,
    };
  }

  /* ── SPAWN WAVE ── */
  const spawnWave = useCallback((g: GS, W: number, H: number) => {
    const wave = g.wave;
    const isBoss = wave % 5 === 0;
    const count = isBoss ? 1 : Math.min(4 + wave * 2, 30);
    g.waveEnemiesLeft = count;
    g.betweenWaves = false;

    for (let i = 0; i < count; i++) {
      const edge = randInt(0, 3);
      let ex = 0, ey = 0;
      if (edge === 0) { ex = rand(0, W); ey = -30; }
      else if (edge === 1) { ex = W + 30; ey = rand(0, H); }
      else if (edge === 2) { ex = rand(0, W); ey = H + 30; }
      else { ex = -30; ey = rand(0, H); }

      let type: EnemyType = "chaser";
      if (isBoss) type = "boss";
      else if (wave >= 3 && Math.random() < 0.2) type = "sniper";
      else if (wave >= 5 && Math.random() < 0.15) type = "tank";
      else if (wave >= 7 && Math.random() < 0.25) type = "swarm";

      const hp = type === "boss" ? 300 + wave * 50
        : type === "tank" ? 80 + wave * 8
        : type === "sniper" ? 30 + wave * 3
        : type === "swarm" ? 15 + wave * 2
        : 40 + wave * 4;

      const radius = type === "boss" ? 44
        : type === "tank" ? 24
        : type === "swarm" ? 10
        : 16;

      g.enemies.push({
        id: g.enemyId++, x: ex, y: ey, vx: 0, vy: 0,
        hp, maxHp: hp, radius, type, angle: 0, pulseT: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  /* ── FIRE BULLET ── */
  const fireBullet = (g: GS) => {
    const nearest = g.enemies.reduce<Enemy | null>((best, e) => {
      if (e.deathT !== undefined) return best;
      const d = dist(g.px, g.py, e.x, e.y);
      if (!best) return e;
      return d < dist(g.px, g.py, best.x, best.y) ? e : best;
    }, null);

    let dx = 0, dy = -1;
    if (nearest) {
      const d = dist(g.px, g.py, nearest.x, nearest.y) || 1;
      dx = (nearest.x - g.px) / d;
      dy = (nearest.y - g.py) / d;
    }

    const spd = 520;
    const pierce = g.pierceT > 0 ? 3 : 1;
    g.bullets.push({
      id: g.bulletId++, x: g.px, y: g.py,
      vx: dx * spd, vy: dy * spd,
      life: 1.4, radius: g.rapidT > 0 ? 5 : 7, pierce,
    });

    // Muzzle flash
    for (let i = 0; i < 6; i++) {
      const angle = Math.atan2(dy, dx) + rand(-0.5, 0.5);
      g.particles.push({
        x: g.px, y: g.py,
        vx: Math.cos(angle) * rand(60, 140),
        vy: Math.sin(angle) * rand(60, 140),
        life: 0.18, maxLife: 0.18, r: rand(2, 5),
        color: COLORS.bullet, glow: true,
      });
    }
  };

  /* ── SPAWN POWERUP ── */
  const spawnPowerUp = (g: GS, x: number, y: number) => {
    if (Math.random() > 0.22) return;
    const types: PowerUpType[] = ["shield", "rapidfire", "pierce", "nuke"];
    g.powerUps.push({
      id: g.puId++, x, y,
      type: types[randInt(0, types.length - 1)],
      life: 8,
    });
  };

  /* ── MAIN LOOP ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = gs.current;
    if (!g.running || g.over) return;
    if (g.paused) { rafRef.current = requestAnimationFrame(draw); return; }

    const now = performance.now();
    g.dt = Math.min((now - g.lastTime) / 1000, 0.05);
    g.lastTime = now;

    const W = canvas.width, H = canvas.height;

    /* ── UPDATE TIMERS ── */
    g.shieldT = Math.max(0, g.shieldT - g.dt);
    g.rapidT = Math.max(0, g.rapidT - g.dt);
    g.pierceT = Math.max(0, g.pierceT - g.dt);
    g.invincibleT = Math.max(0, g.invincibleT - g.dt);
    g.fireT = Math.max(0, g.fireT - g.dt);
    g.comboT = Math.max(0, g.comboT - g.dt);
    if (g.comboT <= 0 && g.combo > 1) g.combo = 1;
    g.shakeT = Math.max(0, g.shakeT - g.dt);
    if (g.waveTimer > 0) g.waveTimer = Math.max(0, g.waveTimer - g.dt);

    /* ── PLAYER MOVEMENT (smooth follow mouse) ── */
    const spd = 260;
    const dx = g.ptx - g.px, dy = g.pty - g.py;
    const dd = Math.sqrt(dx * dx + dy * dy);
    if (dd > 4) {
      const t = Math.min(1, spd * g.dt / dd);
      g.px = lerp(g.px, g.ptx, t);
      g.py = lerp(g.py, g.pty, t);
    }
    g.px = Math.max(g.pRadius, Math.min(W - g.pRadius, g.px));
    g.py = Math.max(g.pRadius, Math.min(H - g.pRadius, g.py));

    /* ── AUTO FIRE ── */
    const fr = g.rapidT > 0 ? g.fireRate * 0.4 : g.fireRate;
    if (g.fireT <= 0 && g.enemies.some(e => e.deathT === undefined)) {
      fireBullet(g);
      g.fireT = fr;
    }

    /* ── WAVE LOGIC ── */
    if (g.betweenWaves) {
      if (g.waveTimer <= 0) spawnWave(g, W, H);
    } else if (g.enemies.every(e => e.deathT !== undefined && e.deathT <= 0)) {
      g.wave++;
      g.betweenWaves = true;
      g.waveTimer = 3;
      const bonus = g.wave * 50 + g.combo * 20;
      g.score += bonus;
      addFloat(g, W / 2, H / 2, `WAVE CLEAR! +${bonus}`, COLORS.xpBar);
      if (Math.random() < 0.5) spawnPowerUp(g, rand(80, W - 80), rand(80, H - 80));
    }

    /* ── UPDATE ENEMIES ── */
    g.enemies.forEach(e => {
      if (e.deathT !== undefined) {
        e.deathT -= g.dt;
        return;
      }
      e.pulseT += g.dt * 3;
      e.angle += g.dt * (e.type === "boss" ? 1.5 : e.type === "swarm" ? 4 : 2);

      const toPlayer = norm({ x: g.px - e.x, y: g.py - e.y });
      const d = dist(e.x, e.y, g.px, g.py);

      let targetVx = 0, targetVy = 0;
      const baseSpd = e.type === "boss" ? 90 : e.type === "tank" ? 70
        : e.type === "sniper" ? 55 : e.type === "swarm" ? 150 : 100 + g.wave * 3;

      if (e.type === "sniper") {
        // Orbit at distance, then lunge
        if (d > 200) { targetVx = toPlayer.x * baseSpd; targetVy = toPlayer.y * baseSpd; }
        else { targetVx = -toPlayer.y * baseSpd; targetVy = toPlayer.x * baseSpd; }
      } else if (e.type === "swarm") {
        // Flocking + chase
        targetVx = toPlayer.x * baseSpd;
        targetVy = toPlayer.y * baseSpd;
        g.enemies.forEach(o => {
          if (o.id === e.id || o.deathT !== undefined) return;
          const od = dist(e.x, e.y, o.x, o.y);
          if (od < 30) {
            targetVx += (e.x - o.x) * 3;
            targetVy += (e.y - o.y) * 3;
          }
        });
      } else {
        // Predictive chase
        const timeToReach = d / baseSpd;
        const predX = g.px + (g.ptx - g.px) * timeToReach * 0.3;
        const predY = g.py + (g.pty - g.py) * timeToReach * 0.3;
        const pn = norm({ x: predX - e.x, y: predY - e.y });
        targetVx = pn.x * baseSpd;
        targetVy = pn.y * baseSpd;
      }

      e.vx = lerp(e.vx, targetVx, 0.08);
      e.vy = lerp(e.vy, targetVy, 0.08);
      e.x += e.vx * g.dt;
      e.y += e.vy * g.dt;

      // Trail particles
      if (Math.random() < 0.3) {
        g.particles.push({
          x: e.x, y: e.y, vx: rand(-20, 20), vy: rand(-20, 20),
          life: 0.25, maxLife: 0.25, r: e.radius * 0.4,
          color: COLORS[e.type], glow: false,
        });
      }

      // Player collision
      if (dist(e.x, e.y, g.px, g.py) < e.radius + g.pRadius - 4) {
        if (g.invincibleT <= 0) {
          const dmg = e.type === "boss" ? 30 : e.type === "tank" ? 20 : 10;
          if (g.shieldT > 0) {
            g.shieldT = 0;
            screenShake(g, 6, 0.3);
            addFloat(g, g.px, g.py - 20, "SHIELD BROKEN!", COLORS.shield);
            spawnBurst(g, g.px, g.py, COLORS.shield, 18);
          } else {
            g.hp -= dmg;
            g.combo = 1;
            screenShake(g, 10, 0.4);
            addFloat(g, g.px, g.py - 20, `-${dmg}`, COLORS.hpBar);
            spawnBurst(g, g.px, g.py, "#ff2d55", 14);
            if (g.hp <= 0) {
              g.hp = 0;
              endGame(g);
              return;
            }
          }
          g.invincibleT = 0.6;
        }
      }
    });

    // Remove fully dead enemies
    g.enemies = g.enemies.filter(e => e.deathT === undefined || e.deathT > 0);

    /* ── UPDATE BULLETS ── */
    g.bullets.forEach(b => {
      b.life -= g.dt;
      b.x += b.vx * g.dt;
      b.y += b.vy * g.dt;

      // Bullet trail
      g.particles.push({
        x: b.x, y: b.y, vx: rand(-20, 20), vy: rand(-20, 20),
        life: 0.08, maxLife: 0.08, r: b.radius * 0.6,
        color: COLORS.bullet, glow: true,
      });

      g.enemies.forEach(e => {
        if (e.deathT !== undefined || b.pierce <= 0) return;
        if (dist(b.x, b.y, e.x, e.y) < b.radius + e.radius) {
          b.pierce--;
          const dmg = g.pierceT > 0 ? 25 : 15;
          e.hp -= dmg;
          screenShake(g, 2, 0.08);
          spawnBurst(g, e.x, e.y, COLORS[e.type], 8);

          if (e.hp <= 0) {
            g.combo++;
            g.comboT = 3.5;
            const pts = Math.round((e.type === "boss" ? 500 : e.type === "tank" ? 80
              : e.type === "sniper" ? 60 : e.type === "swarm" ? 20 : 40) * g.combo);
            g.score += pts;
            const xpGain = e.type === "boss" ? 80 : e.type === "tank" ? 25 : e.type === "sniper" ? 20 : 10;
            gainXP(g, xpGain);
            addFloat(g, e.x, e.y - 20, `+${pts}`, g.combo > 2 ? COLORS.combo : "#fff");
            if (g.combo > 2) addFloat(g, e.x, e.y - 48, `x${g.combo} COMBO!`, COLORS.combo);
            spawnBurst(g, e.x, e.y, COLORS[e.type], e.type === "boss" ? 60 : 24);
            screenShake(g, e.type === "boss" ? 14 : 4, e.type === "boss" ? 0.5 : 0.15);
            spawnPowerUp(g, e.x, e.y);
            e.deathT = 0.01;
            g.waveEnemiesLeft--;
            if (g.score > g.highScore) {
              g.highScore = g.score;
              localStorage.setItem("arenaHS", String(g.score));
            }
          } else {
            addFloat(g, e.x, e.y - 14, `-${dmg}`, "#fff");
          }
        }
      });
    });
    g.bullets = g.bullets.filter(b => b.life > 0 && b.pierce > 0 &&
      b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20);

    /* ── POWER-UPS ── */
    g.powerUps.forEach(pu => {
      pu.life -= g.dt;
      if (dist(pu.x, pu.y, g.px, g.py) < 28 + g.pRadius) {
        applyPowerUp(g, pu);
        pu.life = -1;
      }
    });
    g.powerUps = g.powerUps.filter(p => p.life > 0);

    /* ── PARTICLES ── */
    g.particles.forEach(p => {
      p.life -= g.dt;
      p.x += p.vx * g.dt;
      p.y += p.vy * g.dt;
      p.vx *= 0.93;
      p.vy *= 0.93;
    });
    g.particles = g.particles.filter(p => p.life > 0);

    /* ── FLOATING TEXTS ── */
    g.floatingTexts.forEach(f => { f.life -= g.dt; f.y += f.vy * g.dt; });
    g.floatingTexts = g.floatingTexts.filter(f => f.life > 0);

    /* ════════════════════════════════
       RENDER
    ════════════════════════════════ */
    const shake = g.shakeT > 0
      ? { x: rand(-g.shakeMag, g.shakeMag), y: rand(-g.shakeMag, g.shakeMag) }
      : { x: 0, y: 0 };

    ctx.save();
    ctx.translate(shake.x, shake.y);

    // Background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(-shake.x, -shake.y, W + Math.abs(shake.x) * 2, H + Math.abs(shake.y) * 2);

    // Grid
    drawGrid(ctx, W, H, g.wave);

    // Vignette
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, "rgba(0,0,0,0.65)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // Particles (behind)
    g.particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.save();
      if (p.glow) { ctx.shadowColor = p.color; ctx.shadowBlur = 10; }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.r * alpha), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Power-ups
    g.powerUps.forEach(pu => {
      const t = performance.now() / 1000;
      const bounce = Math.sin(t * 3 + pu.id) * 4;
      const color = { shield: COLORS.shield, rapidfire: COLORS.rapidfire, pierce: COLORS.pierce, nuke: COLORS.nuke }[pu.type];
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.9 + Math.sin(t * 4) * 0.1;
      // Outer ring
      ctx.beginPath();
      ctx.arc(pu.x, pu.y + bounce, 18, 0, Math.PI * 2);
      ctx.stroke();
      // Icon text
      ctx.fillStyle = color;
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const icon = { shield: "⬡", rapidfire: "⚡", pierce: "◆", nuke: "☢" }[pu.type];
      ctx.fillText(icon, pu.x, pu.y + bounce);
      // Expire warning
      if (pu.life < 2) {
        ctx.globalAlpha = (pu.life % 0.4 < 0.2) ? 0.9 : 0.3;
      }
      ctx.restore();
    });

    // Enemies
    g.enemies.forEach(e => {
      if (e.deathT !== undefined) return;
      const pulse = 0.85 + Math.sin(e.pulseT) * 0.15;
      const color = COLORS[e.type];
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.angle);
      ctx.shadowColor = color;
      ctx.shadowBlur = e.type === "boss" ? 30 : 14;

      if (e.type === "boss") {
        // Spiky boss
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const r1 = e.radius * pulse;
          const r2 = e.radius * 0.55;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r2, Math.sin(a) * r2);
          ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, e.radius * 0.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      } else if (e.type === "swarm") {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(0, 0, e.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === "tank") {
        // Hexagon
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          i === 0 ? ctx.moveTo(Math.cos(a) * e.radius * pulse, Math.sin(a) * e.radius * pulse)
            : ctx.lineTo(Math.cos(a) * e.radius * pulse, Math.sin(a) * e.radius * pulse);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Triangle (chaser/sniper)
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, -e.radius * pulse);
        ctx.lineTo(e.radius * 0.8 * pulse, e.radius * 0.7 * pulse);
        ctx.lineTo(-e.radius * 0.8 * pulse, e.radius * 0.7 * pulse);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // HP bar (only if damaged)
      if (e.hp < e.maxHp) {
        const bw = e.radius * 2.4, bh = 4;
        const bx = e.x - bw / 2, by = e.y - e.radius - 10;
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(bx, by, bw, bh);
        ctx.fillStyle = color;
        ctx.fillRect(bx, by, bw * (e.hp / e.maxHp), bh);
      }
    });

    // Player
    const t = performance.now() / 1000;
    const playerPulse = 1 + Math.sin(t * 4) * 0.04;
    ctx.save();
    ctx.translate(g.px, g.py);

    // Shield ring
    if (g.shieldT > 0) {
      ctx.save();
      ctx.rotate(t * 2);
      ctx.strokeStyle = COLORS.shield;
      ctx.shadowColor = COLORS.shield;
      ctx.shadowBlur = 20;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.globalAlpha = 0.7 + Math.sin(t * 6) * 0.3;
      ctx.beginPath();
      ctx.arc(0, 0, g.pRadius + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Player glow
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, g.pRadius * 2.5);
    grad.addColorStop(0, "rgba(0,255,224,0.25)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, g.pRadius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Player body (diamond)
    ctx.shadowColor = COLORS.playerGlow;
    ctx.shadowBlur = 22;
    ctx.fillStyle = g.invincibleT > 0 && Math.floor(t * 10) % 2 === 0 ? "#fff" : COLORS.player;
    ctx.beginPath();
    const pr = g.pRadius * playerPulse;
    ctx.moveTo(0, -pr);
    ctx.lineTo(pr * 0.7, 0);
    ctx.lineTo(0, pr);
    ctx.lineTo(-pr * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Floating texts
    g.floatingTexts.forEach(f => {
      const alpha = Math.min(1, f.life * 2);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = f.color;
      ctx.shadowColor = f.color;
      ctx.shadowBlur = 8;
      ctx.font = `bold ${f.text.includes("COMBO") ? 18 : 14}px 'Courier New', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    });

    // Between-wave countdown
    if (g.betweenWaves && g.waveTimer > 0) {
      ctx.save();
      ctx.fillStyle = COLORS.xpBar;
      ctx.shadowColor = COLORS.xpBar;
      ctx.shadowBlur = 20;
      ctx.font = `bold ${Math.floor(44 + Math.sin(t * 6) * 4)}px 'Courier New', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`WAVE ${g.wave} IN ${Math.ceil(g.waveTimer)}...`, W / 2, H / 2);
      ctx.restore();
    }

    ctx.restore(); // end shake

    /* ── HUD ── */
    drawHUD(ctx, g, W, H);

    // Sync UI every ~10 frames (throttle React re-renders)
    if (Math.random() < 0.1) {
      setUi(prev => ({
        ...prev,
        screen: "playing",
        score: g.score,
        highScore: g.highScore,
        wave: g.wave,
        level: g.level,
        hp: g.hp,
        maxHp: g.maxHp,
        xp: g.xp,
        xpToNext: g.xpToNext,
        combo: g.combo,
        shield: g.shieldT > 0,
        rapid: g.rapidT > 0,
        pierce: g.pierceT > 0,
        paused: g.paused,
      }));
    }

    rafRef.current = requestAnimationFrame(draw);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, wave: number) {
    const spacing = 48;
    const alpha = 0.07 + Math.min(wave * 0.005, 0.08);
    ctx.save();
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.globalAlpha = alpha;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  function drawHUD(ctx: CanvasRenderingContext2D, g: GS, W: number, H: number) {
    const pad = 14;

    // Combo counter (bottom-right)
    if (g.combo > 1 && g.comboT > 0) {
      const alpha = Math.min(1, g.comboT);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COLORS.combo;
      ctx.shadowColor = COLORS.combo;
      ctx.shadowBlur = 16;
      ctx.font = `bold ${Math.min(18 + g.combo, 32)}px 'Courier New', monospace`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(`x${g.combo} COMBO`, W - pad, H - pad - 14);
      // Combo decay bar
      const cbW = 90;
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(W - pad - cbW, H - pad - 10, cbW, 3);
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLORS.combo;
      ctx.fillRect(W - pad - cbW, H - pad - 10, cbW * (g.comboT / 3.5), 3);
      ctx.restore();
    }

    // Active power-up timers (bottom-left, in-canvas)
    const puList: [number, string, string][] = [];
    if (g.shieldT > 0)  puList.push([g.shieldT,  "⬡ SHIELD",     COLORS.shield]);
    if (g.rapidT > 0)   puList.push([g.rapidT,   "⚡ RAPID",      COLORS.rapidfire]);
    if (g.pierceT > 0)  puList.push([g.pierceT,  "◆ PIERCE",     COLORS.pierce]);
    puList.forEach(([t, label, color], i) => {
      const y = H - pad - i * 22;
      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.font = "bold 11px 'Courier New', monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText(`${label}  ${Math.ceil(t)}s`, pad, y);
      ctx.restore();
    });
  }

  function screenShake(g: GS, mag: number, dur: number) {
    if (mag > g.shakeMag) { g.shakeMag = mag; g.shakeT = dur; }
  }

  function spawnBurst(g: GS, x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = rand(40, 200);
      g.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: rand(0.3, 0.8), maxLife: 0.8,
        r: rand(2, 6), color, glow: true,
      });
    }
  }

  function addFloat(g: GS, x: number, y: number, text: string, color: string) {
    g.floatingTexts.push({ x, y, text, life: 1.2, color, vy: -38 });
  }

  function gainXP(g: GS, amount: number) {
    g.xp += amount;
    if (g.xp >= g.xpToNext) {
      g.xp -= g.xpToNext;
      g.level++;
      g.xpToNext = Math.round(g.xpToNext * 1.4);
      g.maxHp += 20;
      g.hp = Math.min(g.maxHp, g.hp + 30);
      g.fireRate = Math.max(0.1, g.fireRate - 0.01);
      const canvas = canvasRef.current;
      if (canvas) {
        addFloat(g, canvas.width / 2, canvas.height / 2 + 40, `LEVEL UP! LV ${g.level}`, COLORS.xpBar);
        spawnBurst(g, canvas.width / 2, canvas.height / 2, COLORS.xpBar, 30);
        screenShake(g, 5, 0.25);
      }
    }
  }

  function applyPowerUp(g: GS, pu: PowerUp) {
    const canvas = canvasRef.current;
    const W = canvas?.width ?? 800, H = canvas?.height ?? 500;
    if (pu.type === "shield") {
      g.shieldT = 8;
      addFloat(g, g.px, g.py - 30, "SHIELD!", COLORS.shield);
      spawnBurst(g, g.px, g.py, COLORS.shield, 20);
    } else if (pu.type === "rapidfire") {
      g.rapidT = 6;
      addFloat(g, g.px, g.py - 30, "RAPID FIRE!", COLORS.rapidfire);
      spawnBurst(g, g.px, g.py, COLORS.rapidfire, 20);
    } else if (pu.type === "pierce") {
      g.pierceT = 7;
      addFloat(g, g.px, g.py - 30, "PIERCE!", COLORS.pierce);
      spawnBurst(g, g.px, g.py, COLORS.pierce, 20);
    } else if (pu.type === "nuke") {
      g.enemies.forEach(e => {
        if (e.deathT !== undefined) return;
        const pts = 25 * g.combo;
        g.score += pts;
        spawnBurst(g, e.x, e.y, COLORS[e.type], 20);
        e.deathT = 0.01;
        g.waveEnemiesLeft--;
      });
      screenShake(g, 20, 0.6);
      addFloat(g, W / 2, H / 2, "☢ NUKE!", COLORS.nuke);
      spawnBurst(g, W / 2, H / 2, COLORS.nuke, 80);
    }
    screenShake(g, 3, 0.15);
  }

  function endGame(g: GS) {
    g.running = false;
    g.over = true;
    if (g.score > g.highScore) {
      g.highScore = g.score;
      localStorage.setItem("arenaHS", String(g.score));
    }
    cancelAnimationFrame(rafRef.current!);
    setUi(prev => ({ ...prev, screen: "over", score: g.score, highScore: g.highScore }));
  }

  /* ── EXIT GAME ── */
  const handleExit = useCallback(() => {
    cancelAnimationFrame(rafRef.current!);
    gs.current.running = false;
    gs.current.paused = false;
    if (onClose) onClose();
    else setUi(prev => ({ ...prev, screen: "start", paused: false }));
  }, [onClose]);

  /* ── TOGGLE PAUSE ── */
  const togglePause = useCallback(() => {
    const g = gs.current;
    if (!g.running || g.over) return;
    g.paused = !g.paused;
    setUi(prev => ({ ...prev, paused: g.paused }));
    if (!g.paused) {
      g.lastTime = performance.now();
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [draw]);

  /* ── START GAME ── */
  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current!);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const HUD_H = 52;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - HUD_H;

    const fresh = makeGS();
    fresh.px = canvas.width / 2;
    fresh.py = canvas.height / 2;
    fresh.ptx = fresh.px;
    fresh.pty = fresh.py;
    fresh.running = true;
    fresh.betweenWaves = true;
    fresh.waveTimer = 2;
    gs.current = fresh;

    setUi(prev => ({ ...prev, screen: "playing" }));
    fresh.lastTime = performance.now();
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  /* ── RESIZE ── */
  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const HUD_H = 52;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - HUD_H;
      const g = gs.current;
      if (g.running) {
        g.px = Math.min(g.px, canvas.width - g.pRadius);
        g.py = Math.min(g.py, canvas.height - g.pRadius);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── MOUSE ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      gs.current.ptx = (e.clientX - rect.left) * (canvas.width / rect.width);
      gs.current.pty = (e.clientY - rect.top) * (canvas.height / rect.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── TOUCH ── */
  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      gs.current.ptx = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
      gs.current.pty = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height);
    };
    window.addEventListener("touchmove", onTouch, { passive: false });
    return () => window.removeEventListener("touchmove", onTouch);
  }, []);

  /* ── KEYBOARD ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); togglePause(); }
      if (e.code === "Escape") { e.preventDefault(); togglePause(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePause]);

  /* ── CLEANUP ── */
  useEffect(() => () => cancelAnimationFrame(rafRef.current!), []);

  if (!isOpen) return null;

  const isPlaying = ui.screen === "playing";
  const hudBg = "rgba(4,7,15,0.95)";
  const hudBorder = "rgba(0,255,224,0.12)";

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden select-none pointer-events-none"
      style={{ fontFamily: "'Courier New', monospace", touchAction: "none", background: COLORS.bg, zIndex: 60 }}
    >
      <style>{`
        .arena-btn { cursor: pointer !important; pointer-events: auto; }
        canvas { cursor: none; pointer-events: auto; }
        .arena-hud { pointer-events: auto; }
        .arena-pause-btn { pointer-events: auto; }
      `}</style>

      {/* ══════════════════════════════════════════
          TOP HUD BAR — always visible
      ══════════════════════════════════════════ */}
      <div
        className="shrink-0 flex items-center justify-between px-3 sm:px-5 z-30 arena-hud"
        style={{
          height: 52,
          background: hudBg,
          borderBottom: `1px solid ${hudBorder}`,
          boxShadow: "0 2px 20px rgba(0,255,224,0.06)",
        }}
      >
        {/* LEFT — title + wave */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black tracking-wider hidden xs:inline"
              style={{ color: "#00ffe0", textShadow: "0 0 12px #00ffe060" }}>
              AI ARENA
            </span>
            <span className="text-xs font-black tracking-wider xs:hidden"
              style={{ color: "#00ffe0", textShadow: "0 0 12px #00ffe060" }}>
              ARENA
            </span>
          </div>
          {isPlaying && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold tracking-widest"
              style={{ background: "rgba(0,255,224,0.08)", border: "1px solid rgba(0,255,224,0.2)", color: "#00ffe0" }}>
              W{ui.wave}
            </div>
          )}
        </div>

        {/* CENTER — score + best */}
        <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
          <div className="text-base sm:text-xl font-black tabular-nums"
            style={{ color: "#fff", letterSpacing: "0.05em", lineHeight: 1 }}>
            {String(ui.score).padStart(7, "0")}
          </div>
          <div className="text-[9px] sm:text-[10px] tabular-nums mt-0.5"
            style={{ color: COLORS.combo, opacity: 0.7 }}>
            BEST {String(ui.highScore).padStart(7, "0")}
          </div>
        </div>

        {/* RIGHT — HP bar + level + pause + exit */}
        <div className="flex items-center gap-2 sm:gap-3 arena-hud">
          {/* HP + Level (only while playing) */}
          {isPlaying && (
            <div className="hidden sm:flex flex-col items-end gap-0.5">
              {/* HP bar */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold" style={{ color: COLORS.hpBar }}>HP</span>
                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: "#0d1b2a" }}>
                  <div className="h-full rounded-full transition-all duration-100"
                    style={{
                      width: `${(ui.hp / ui.maxHp) * 100}%`,
                      background: ui.hp / ui.maxHp > 0.5 ? COLORS.pierce
                        : ui.hp / ui.maxHp > 0.25 ? COLORS.rapidfire : COLORS.hpBar,
                      boxShadow: `0 0 6px currentColor`,
                    }} />
                </div>
                <span className="text-[9px] tabular-nums" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {ui.hp}/{ui.maxHp}
                </span>
              </div>
              {/* XP bar */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold" style={{ color: COLORS.xpBar }}>LV{ui.level}</span>
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "#0d1b2a" }}>
                  <div className="h-full rounded-full transition-all duration-100"
                    style={{
                      width: `${(ui.xp / ui.xpToNext) * 100}%`,
                      background: COLORS.xpBar,
                      boxShadow: "0 0 4px #00ffe080",
                    }} />
                </div>
              </div>
            </div>
          )}

          {/* Active power-up badges */}
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-1">
              {ui.shield && <span className="text-xs px-1 py-0.5 rounded font-bold" style={{ background: "rgba(0,170,255,0.15)", color: COLORS.shield, border: "1px solid rgba(0,170,255,0.3)" }}>⬡</span>}
              {ui.rapid  && <span className="text-xs px-1 py-0.5 rounded font-bold" style={{ background: "rgba(255,221,0,0.15)",  color: COLORS.rapidfire, border: "1px solid rgba(255,221,0,0.3)" }}>⚡</span>}
              {ui.pierce && <span className="text-xs px-1 py-0.5 rounded font-bold" style={{ background: "rgba(0,255,136,0.15)", color: COLORS.pierce,    border: "1px solid rgba(0,255,136,0.3)" }}>◆</span>}
            </div>
          )}

          {/* PAUSE button — only while playing */}
          {isPlaying && (
            <button
              className="arena-btn flex items-center justify-center rounded transition-all active:scale-90"
              onClick={togglePause}
              title="Pause (Space)"
              style={{
                width: 36, height: 36,
                background: ui.paused ? "rgba(0,255,224,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${ui.paused ? "#00ffe0" : "rgba(255,255,255,0.15)"}`,
                color: ui.paused ? "#00ffe0" : "rgba(255,255,255,0.6)",
                boxShadow: ui.paused ? "0 0 14px #00ffe050" : "none",
              }}
            >
              {ui.paused
                ? <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor"><polygon points="3,1 13,7 3,13" /></svg>
                : <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="4" height="12" rx="1"/><rect x="8" y="1" width="4" height="12" rx="1"/></svg>
              }
            </button>
          )}

          {/* EXIT button — always */}
          <button
            className="arena-btn flex items-center justify-center rounded transition-all active:scale-90"
            onClick={handleExit}
            title="Exit"
            style={{
              width: 36, height: 36,
              background: "rgba(255,45,85,0.08)",
              border: "1px solid rgba(255,45,85,0.25)",
              color: "rgba(255,45,85,0.7)",
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(255,45,85,0.2)";
              b.style.borderColor = "#ff2d55";
              b.style.color = "#ff2d55";
              b.style.boxShadow = "0 0 12px #ff2d5540";
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(255,45,85,0.08)";
              b.style.borderColor = "rgba(255,45,85,0.25)";
              b.style.color = "rgba(255,45,85,0.7)";
              b.style.boxShadow = "none";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
            </svg>
          </button>

          {/* HOME button — always */}
          <button
            className="arena-btn flex items-center justify-center rounded transition-all active:scale-90"
            onClick={handleExit}
            title="Home"
            style={{
              width: 36, height: 36,
              background: "rgba(0,255,224,0.08)",
              border: "1px solid rgba(0,255,224,0.25)",
              color: "rgba(0,255,224,0.7)",
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(0,255,224,0.2)";
              b.style.borderColor = "#00ffe0";
              b.style.color = "#00ffe0";
              b.style.boxShadow = "0 0 12px #00ffe040";
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(0,255,224,0.08)";
              b.style.borderColor = "rgba(0,255,224,0.25)";
              b.style.color = "rgba(0,255,224,0.7)";
              b.style.boxShadow = "none";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CANVAS AREA — fills remaining space
      ══════════════════════════════════════════ */}
      <div className="relative flex-1 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* ── START SCREEN ── */}
        {ui.screen === "start" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 arena-hud"
            style={{ background: "radial-gradient(ellipse at 50% 40%, #0d1b2a 0%, #04070f 70%)" }}>

            <div className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "linear-gradient(#00ffe0 1px,transparent 1px),linear-gradient(90deg,#00ffe0 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

            <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-sm w-full">
              <div>
                <div className="text-[10px] tracking-[0.5em] mb-2" style={{ color: "#00ffe0", opacity: 0.5 }}>SECTOR 7 — CLASSIFIED</div>
                <h1 className="text-4xl sm:text-6xl font-black leading-none"
                  style={{ color: "#00ffe0", textShadow: "0 0 40px #00ffe0, 0 0 80px #00ffe030", letterSpacing: "-0.02em" }}>
                  AI ARENA
                </h1>
                <div className="text-base sm:text-xl font-bold tracking-[0.3em] mt-1"
                  style={{ color: "#ff2d55", textShadow: "0 0 16px #ff2d55" }}>
                  SURVIVAL
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Rogue AI entities have breached containment.<br/>
                <span style={{ color: "#00ffe0" }}>You</span> are the last line of defense.
              </p>

              <div className="grid grid-cols-2 gap-2 w-full text-xs">
                {([["⬡","SHIELD",COLORS.shield],["⚡","RAPID FIRE",COLORS.rapidfire],["◆","PIERCE",COLORS.pierce],["☢","NUKE",COLORS.nuke]] as [string,string,string][]).map(([icon, name, color]) => (
                  <div key={name} className="flex items-center gap-2 px-3 py-1.5 rounded"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span style={{ color }}>{icon}</span>
                    <span className="text-gray-400">{name}</span>
                  </div>
                ))}
              </div>

              <button onClick={startGame} className="arena-btn w-full py-3.5 text-base font-black tracking-widest border-2 transition-all active:scale-95"
                style={{
                  color: "#04070f", background: "#00ffe0", borderColor: "#00ffe0",
                  boxShadow: "0 0 28px #00ffe070, 0 0 60px #00ffe020",
                  clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
                }}>
                ENTER ARENA
              </button>

              {ui.highScore > 0 && (
                <div className="text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                  PERSONAL BEST: <span style={{ color: COLORS.combo }}>{String(ui.highScore).padStart(7, "0")}</span>
                </div>
              )}
              <div className="text-[10px] text-gray-600">Move cursor / finger · Auto-aim · Survive · Space to pause</div>
            </div>
          </div>
        )}

        {/* ── GAME OVER SCREEN ── */}
        {ui.screen === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 arena-hud"
            style={{ background: "radial-gradient(ellipse at 50% 40%, #1a0010 0%, #04070f 70%)" }}>
            <div className="flex flex-col items-center gap-4 text-center max-w-sm w-full">
              <div className="text-[10px] tracking-[0.5em]" style={{ color: "#ff2d55", opacity: 0.6 }}>SYSTEM FAILURE</div>
              <h2 className="text-4xl sm:text-6xl font-black"
                style={{ color: "#ff2d55", textShadow: "0 0 40px #ff2d55, 0 0 80px #ff2d5530" }}>
                ELIMINATED
              </h2>

              <div className="flex gap-6 sm:gap-8 w-full justify-center my-1">
                {[
                  [String(ui.score).padStart(7,"0"), "SCORE", "#fff"],
                  [String(ui.highScore).padStart(7,"0"), "BEST", COLORS.combo],
                  [String(ui.wave), "WAVE", COLORS.xpBar],
                  [String(ui.level), "LEVEL", COLORS.pierce],
                ].map(([val, label, color]) => (
                  <div key={label} className="text-center">
                    <div className="text-xl sm:text-3xl font-black tabular-nums" style={{ color }}>{val}</div>
                    <div className="text-[9px] tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
                  </div>
                ))}
              </div>

              {ui.score > 0 && ui.score >= ui.highScore && (
                <div className="text-xs font-bold tracking-widest px-4 py-1.5"
                  style={{ color: COLORS.combo, border: `1px solid ${COLORS.combo}`, boxShadow: `0 0 14px ${COLORS.combo}40` }}>
                  ★ NEW RECORD ★
                </div>
              )}

              <div className="flex gap-3 w-full mt-2">
                <button onClick={startGame} className="arena-btn flex-1 py-3 text-sm font-black tracking-widest border-2 transition-all active:scale-95"
                  style={{
                    color: "#04070f", background: "#ff2d55", borderColor: "#ff2d55",
                    boxShadow: "0 0 24px #ff2d5560",
                    clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
                  }}>
                  TRY AGAIN
                </button>
                <button onClick={handleExit} className="arena-btn flex-1 py-3 text-sm font-black tracking-widest border-2 transition-all active:scale-95"
                  style={{
                    color: "rgba(255,255,255,0.5)", background: "transparent",
                    borderColor: "rgba(255,255,255,0.15)",
                    clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
                  }}
                  onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color="#fff"; b.style.borderColor="rgba(255,255,255,0.4)"; }}
                  onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color="rgba(255,255,255,0.5)"; b.style.borderColor="rgba(255,255,255,0.15)"; }}>
                  EXIT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PAUSE OVERLAY ── */}
        {ui.screen === "playing" && ui.paused && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 arena-hud"
            style={{ background: "rgba(4,7,15,0.88)", backdropFilter: "blur(6px)" }}>
            <div className="flex flex-col items-center gap-4 w-48">
              <div>
                <div className="text-[10px] tracking-[0.5em] text-center mb-1" style={{ color: "rgba(0,255,224,0.4)" }}>WAVE {ui.wave}</div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-[0.3em] text-center"
                  style={{ color: "#00ffe0", textShadow: "0 0 30px #00ffe0" }}>PAUSED</h2>
              </div>

              <button onClick={togglePause} className="arena-btn w-full py-3 text-sm font-black tracking-widest border-2 transition-all active:scale-95"
                style={{
                  color: "#04070f", background: "#00ffe0", borderColor: "#00ffe0",
                  boxShadow: "0 0 20px #00ffe060",
                  clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
                }}>
                ▶ RESUME
              </button>

              <button onClick={handleExit} className="arena-btn w-full py-3 text-sm font-black tracking-widest border-2 transition-all active:scale-95"
                style={{
                  color: "#ff2d55", background: "transparent", borderColor: "#ff2d55",
                  boxShadow: "0 0 10px #ff2d5530",
                  clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
                }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background="#ff2d55"; b.style.color="#04070f"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background="transparent"; b.style.color="#ff2d55"; }}>
                ✕ EXIT
              </button>

              <div className="text-[10px] text-gray-600 text-center">Space / ESC to resume</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}