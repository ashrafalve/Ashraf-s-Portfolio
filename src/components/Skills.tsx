import { Code, Smartphone, Database, Cpu, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

// Import all icons from assets
import cppIcon from "@/assets/icons/ISO_C++_Logo.svg.png";
import pythonIcon from "@/assets/icons/python_icon.png";
import javaIcon from "@/assets/icons/java_icon.png";
import jsIcon from "@/assets/icons/js_icon.png";
import tsIcon from "@/assets/icons/typescript_icon.png";
import reactIcon from "@/assets/icons/react_icon.png";
import androidStudioIcon from "@/assets/icons/Androidstudio_icon.png";
import firebaseIcon from "@/assets/icons/firebase_icon.png";
import htmlIcon from "@/assets/icons/html_icon.png";
import cssIcon from "@/assets/icons/css_icon.png";
import djangoIcon from "@/assets/icons/django_icon.png";
import sqlIcon from "@/assets/icons/sql_icon.png";
import restApiIcon from "@/assets/icons/rest_api.png";
import fastApiIcon from "@/assets/icons/FastAPI_logo.svg.png";
import mlIcon from "@/assets/icons/ml_icon.png";
import githubIcon from "@/assets/icons/github_icon.png";
import flutterIcon from "@/assets/icons/flutter.png";
import supabaseIcon from "@/assets/icons/supabase_icon.png";
import vscodeIcon from "@/assets/icons/VSCode_icon.png";
import uiuxIcon from "@/assets/icons/uiux_icon.png";
import msofficeIcon from "@/assets/icons/msoffice_icon.png";

const allSkills = [
  { name: "C", icon: cppIcon },
  { name: "C++", icon: cppIcon },
  { name: "Python", icon: pythonIcon },
  { name: "Java", icon: javaIcon },
  { name: "JavaScript", icon: jsIcon },
  { name: "TypeScript", icon: tsIcon },
  { name: "React", icon: reactIcon },
  { name: "React Native", icon: reactIcon },
  { name: "Flutter", icon: flutterIcon },
  { name: "Android Studio", icon: androidStudioIcon },
  { name: "Firebase", icon: firebaseIcon },
  { name: "Supabase", icon: supabaseIcon },
  { name: "HTML", icon: htmlIcon },
  { name: "CSS", icon: cssIcon },
  { name: "Django", icon: djangoIcon },
  { name: "SQL", icon: sqlIcon },
  { name: "REST API", icon: restApiIcon },
  { name: "FastAPI", icon: fastApiIcon },
  { name: "Machine Learning", icon: mlIcon },
  { name: "VS Code", icon: vscodeIcon },
  { name: "GitHub", icon: githubIcon },
  { name: "UI/UX", icon: uiuxIcon },
  { name: "MS Office", icon: msofficeIcon },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  icon: string;
  name: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  targetX: number;
  targetY: number;
  wanderAngle: number;
}

const PhysicsGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isInteracting, setIsInteracting] = useState(false);
  const animationRef = useRef<number>();

  // Initialize particles with fish-like properties
  useEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const bounds = { width: rect.width, height: rect.height };
      
      const initialParticles: Particle[] = allSkills.map((skill) => ({
        x: Math.random() * (bounds.width - 60) + 30,
        y: Math.random() * (bounds.height - 80) + 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        icon: skill.icon,
        name: skill.name,
        rotation: Math.random() * 360,
        rotationSpeed: 0,
        size: 45,
        targetX: 0,
        targetY: 0,
        wanderAngle: Math.random() * Math.PI * 2,
      }));
      setParticles(initialParticles);
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsInteracting(false);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev.map((p) => {
          let { x, y, vx, vy, rotation, rotationSpeed, wanderAngle, size } = p;

          // Get current container bounds for responsiveness
          let bounds = { minX: 30, maxX: 770, minY: 30, maxY: 250 };
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            bounds = { 
              minX: 30, 
              maxX: rect.width - 30, 
              minY: 30, 
              maxY: rect.height - 50 
            };
          }
          
          // Random wandering - change direction slowly
          wanderAngle += (Math.random() - 0.5) * 0.1;
          
          // Gentle swimming motion
          const swimSpeed = 1.5;
          vx += Math.cos(wanderAngle) * 0.1;
          vy += Math.sin(wanderAngle) * 0.1;
          
          // Limit speed
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > swimSpeed) {
            vx = (vx / speed) * swimSpeed;
            vy = (vy / speed) * swimSpeed;
          }

          // Update position
          x += vx;
          y += vy;

          // Boundary bounce - like fish hitting tank walls
          if (x < bounds.minX) { 
            x = bounds.minX; 
            vx *= -0.8; 
            wanderAngle = Math.PI - wanderAngle + (Math.random() - 0.5);
          }
          if (x > bounds.maxX) { 
            x = bounds.maxX; 
            vx *= -0.8; 
            wanderAngle = Math.PI - wanderAngle + (Math.random() - 0.5);
          }
          if (y < bounds.minY) { 
            y = bounds.minY; 
            vy *= -0.8; 
            wanderAngle = -wanderAngle + (Math.random() - 0.5);
          }
          if (y > bounds.maxY) { 
            y = bounds.maxY; 
            vy *= -0.8; 
            wanderAngle = -wanderAngle + (Math.random() - 0.5);
          }

          // Rotate to face direction of movement
          const targetRotation = Math.atan2(vy, vx) * (180 / Math.PI);
          rotation = rotation + (targetRotation - rotation) * 0.1;

          // Mouse interaction - fish attracted to cursor
          if (isInteracting) {
            const dx = mousePos.x - x;
            const dy = mousePos.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const attractionRadius = 150;
            
            if (dist < attractionRadius && dist > 0) {
              const force = (attractionRadius - dist) / attractionRadius;
              const angle = Math.atan2(dy, dx);
              vx += Math.cos(angle) * force * 0.5;
              vy += Math.sin(angle) * force * 0.5;
            }
          }

          // Soft collision with other fish - avoid overlapping
          prev.forEach((other) => {
            if (other === p) return;
            const odx = x - other.x;
            const ody = y - other.y;
            const odist = Math.sqrt(odx * odx + ody * ody);
            const minDist = 50;
            if (odist < minDist && odist > 0) {
              const angle = Math.atan2(ody, odx);
              const overlap = minDist - odist;
              x += Math.cos(angle) * overlap * 0.3;
              y += Math.sin(angle) * overlap * 0.3;
            }
          });

          return { ...p, x, y, vx, vy, rotation, wanderAngle };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [mousePos, isInteracting]);

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef} 
        className="relative w-full max-w-4xl mx-auto h-[300px] md:h-[350px] rounded-2xl overflow-hidden cursor-crosshair"
        style={{
          background: 'linear-gradient(180deg, #0a4d5c 0%, #0d2d3a 50%, #071f26 100%)',
          boxShadow: 'inset 0 0 50px rgba(0, 200, 255, 0.1), 0 0 20px rgba(0, 150, 200, 0.3)',
          border: '2px solid rgba(0, 200, 255, 0.3)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Aquarium bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-bubble" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-cyan-300/20 rounded-full animate-bubble" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-3/4 w-2 h-2 bg-cyan-400/25 rounded-full animate-bubble" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-0 left-1/6 w-2 h-2 bg-cyan-300/20 rounded-full animate-bubble" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-2/3 w-3 h-3 bg-cyan-400/15 rounded-full animate-bubble" style={{ animationDelay: '3s' }} />
        </div>
        
        {/* Sand at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(194, 148, 79, 0.4) 100%)',
        }} />
        
        <p className="text-center text-cyan-200/60 text-sm pt-2">
          {isInteracting ? "🐠 Move mouse to attract the fish!" : "🫧 Watch the fish swim around - hover to interact"}
        </p>
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center justify-center transition-transform hover:scale-125"
            style={{
              left: p.x - 28,
              top: p.y - 35,
              transform: `rotate(${p.rotation}deg)`,
            }}
          >
            <img 
              src={p.icon} 
              alt={p.name} 
              className={`w-9 h-9 object-contain drop-shadow-lg ${p.name === 'REST API' || p.name === 'GitHub' ? 'bg-white rounded-lg p-1' : ''}`}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-280px) scale(0.5); opacity: 0; }
        }
        .animate-bubble {
          animation: bubble 6s infinite ease-in;
        }
      `}</style>
    </div>
  );
};

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code,
    skills: [
      { name: "C", icon: cppIcon },
      { name: "C++", icon: cppIcon },
      { name: "Python", icon: pythonIcon },
      { name: "Java", icon: javaIcon },
      { name: "JavaScript", icon: jsIcon },
    ],
  },
  {
    title: "Mobile Development",
    icon: Smartphone,
    skills: [
      { name: "React Native", icon: reactIcon },
      { name: "Android Studio", icon: androidStudioIcon },
      { name: "Firebase", icon: firebaseIcon },
    ],
  },
  {
    title: "Web Development",
    icon: Database,
    skills: [
      { name: "HTML", icon: htmlIcon },
      { name: "CSS", icon: cssIcon },
      { name: "Django", icon: djangoIcon },
      { name: "React", icon: reactIcon },
      { name: "SQL", icon: sqlIcon },
      { name: "REST API", icon: restApiIcon },
      { name: "FastAPI", icon: fastApiIcon },
    ],
  },
  {
    title: "Other Skills",
    icon: Cpu,
    skills: [
      { name: "OOP", icon: cppIcon },
      { name: "Machine Learning", icon: mlIcon },
      { name: "Web Scraping", icon: pythonIcon },
      { name: "AI Development", icon: pythonIcon },
      { name: "GitHub", icon: githubIcon },
    ],
  },
];

const Skills = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">My Skills</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Technical Expertise</h2>
        </div>

        <PhysicsGrid />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {skillCategories.map((category, idx) => (
            <div
              key={category.title}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredCategory(idx)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <category.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`text-xs px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      hoveredCategory === idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {skill.icon && <img src={skill.icon} alt={skill.name} className="w-4 h-4 object-contain" />}
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
