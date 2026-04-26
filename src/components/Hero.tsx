import { ArrowRight, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NetworkMesh from "./NetworkMesh";
import { useState, useEffect } from "react";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const phrases = ["Ahmed", "Alve"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    if (isTyping) {
      if (typedText.length < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (typedText.length > 0) {
        const timeout = setTimeout(() => {
          setTypedText(typedText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setIsTyping(true);
      }
    }
  }, [typedText, isTyping, phraseIndex, phrases]);

  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <NetworkMesh />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in-left">
            <div className="flex gap-3">
              <a
                href="https://github.com/ashrafalve"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:text-primary hover:border-primary transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ashraf-ahmed-alve-6a3853376/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:text-primary hover:border-primary transition-colors cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:ashrafahmedalve@gmail.com"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:text-primary hover:border-primary transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1 text-sm">
              React Native Developer at Fire AI (Betopia Group)
            </Badge>

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Hi, I'm <span className="text-primary">Ashraf</span> <span className="text-primary">{typedText}</span><span className="animate-pulse">|</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight mt-4 text-primary break-words">
                Web & Mobile App Developer | Software & Frontend Enthusiast | CSE Graduate
              </p>
            </div>

            <p className="text-muted-foreground text-lg max-w-md">
              A passionate developer with experience in React Native, Flutter, Python, C/C++, and Java. CSE graduate from University of Asia Pacific.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="rounded-full gap-2 px-8" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                View Projects <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full gap-2 px-8" asChild>
                <a href="/Ashraf_Ahmed_Resume.pdf" target="_blank" rel="noopener noreferrer">
                  View CV <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="animate-slide-in-right">
            {/* Circular Profile Card with Flip Animation */}
            <div className="relative max-w-sm mx-auto">
              {/* Flip Card Container */}
              <div 
                className="relative w-72 h-72 mx-auto cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => setShowProfileInfo(!showProfileInfo)}
              >
                {/* Flipper */}
                <div 
                  className="w-full h-full"
                  style={{
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: showProfileInfo ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front - Profile Photo with Neon Border */}
                  <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
                    {/* Animated Gradient Border Ring */}
                    <div 
                      className="relative w-full h-full rounded-full"
                      style={{
                        background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)) 50%, transparent 50%, transparent)',
                        backgroundSize: '200% 200%',
                        animation: 'neon-rotate 3s linear infinite',
                        padding: '4px',
                      }}
                    >
                      <style>{`
                        @keyframes neon-rotate {
                          0% { background-position: 0% 50%; }
                          100% { background-position: 200% 50%; }
                        }
                      `}</style>
                      {/* Inner Circle with Glow */}
                      <div 
                        className="w-full h-full rounded-full overflow-hidden"
                        style={{
                          background: 'hsl(var(--card))',
                          boxShadow: `
                            0 0 30px hsl(var(--primary) / 0.4),
                            0 0 60px hsl(var(--primary) / 0.2),
                            inset 0 0 30px hsl(var(--primary) / 0.1)
                          `,
                        }}
                      >
                        <img 
                          src="/profile.jpg" 
                          alt="Ashraf Ahmed Alve" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Back - Profile Stats */}
                  <div 
                    className="absolute inset-0 rounded-full flex flex-col justify-center items-center p-4"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: 'hsl(var(--card))',
                      boxShadow: `
                        0 0 30px hsl(var(--primary) / 0.4),
                        0 0 60px hsl(var(--primary) / 0.2)
                      `,
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2 text-center w-full">
                      {[
                        { value: "1+", label: "Years" },
                        { value: "8+", label: "Projects" },
                        { value: "Top 15%", label: "Batch" },
                        { value: "4+", label: "Awards" },
                      ].map((stat, idx) => (
                        <div key={idx} className="p-2">
                          <p className="text-xl font-bold text-primary">{stat.value}</p>
                          <p className="text-muted-foreground text-xs">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full border-2 border-primary/30"></div>
              <div className="absolute -bottom-4 -left-8 w-4 h-4 rounded-full bg-primary/20"></div>
              <div className="absolute -top-8 -right-6 w-6 h-6 rounded-full border border-primary/20"></div>

              {/* Click hint */}
              <p className="text-center text-muted-foreground text-sm mt-6">
                {showProfileInfo ? '• Click to see photo' : '• Click to see stats'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
