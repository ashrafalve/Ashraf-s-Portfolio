import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
  size: number;
  isRed: boolean;
}

const NetworkMesh = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pointsRef = useRef<Point[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CONNECTION_DIST = 150;
    const MOUSE_RADIUS = 250;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initPoints();
    };

    const initPoints = () => {
      const pts: Point[] = [];
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const isRed = Math.random() < 0.4;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 0.5;
        pts.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          originX: x,
          originY: y,
          size: isRed ? 2.5 + Math.random() * 2 : 1 + Math.random() * 1.5,
          isRed,
        });
      }
      pointsRef.current = pts;
    };

    let time = 0;
    const animate = () => {
      time += 0.01;
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const pts = pointsRef.current;

      // Update positions
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx -= (dx / dist) * force * 2;
          p.vy -= (dy / dist) * force * 2;
        }

        // Continuous orbital motion around origin
        const orbitRadius = 30;
        const orbitSpeed = 0.5 + (i % 5) * 0.1;
        const targetX = p.originX + Math.cos(time * orbitSpeed + i) * orbitRadius;
        const targetY = p.originY + Math.sin(time * orbitSpeed + i) * orbitRadius;
        
        p.vx += (targetX - p.x) * 0.02;
        p.vy += (targetY - p.y) * 0.02;

        // Add slight drift
        p.vx += Math.sin(time * 2 + i * 0.5) * 0.02;
        p.vy += Math.cos(time * 2 + i * 0.5) * 0.02;

        // Less friction for more movement
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw connections — thin white/gray lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
            ctx.strokeStyle = `rgba(220, 220, 220, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw points
      for (const p of pts) {
        if (p.isRed) {
          // Red glowing dots
          ctx.shadowColor = "rgba(229, 57, 53, 0.6)";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "rgba(229, 57, 53, 0.9)";
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(200, 200, 200, 0.4)";
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current = { 
        x: (e.clientX - rect.left) * scaleX, 
        y: (e.clientY - rect.top) * scaleY 
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "auto" }}
    />
  );
};

export default NetworkMesh;
