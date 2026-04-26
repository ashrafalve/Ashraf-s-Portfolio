import { Home, Briefcase, User, Mail, MessageSquare, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

const MobileNav = () => {
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "skills", icon: Cpu, label: "Skills" },
    { id: "projects", icon: Briefcase, label: "Work" },
    { id: "about", icon: User, label: "About" },
    { id: "contact", icon: Mail, label: "Contact" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <nav className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex items-center justify-around shadow-2xl shadow-black/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 relative ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-primary/10 rounded-2xl animate-in fade-in zoom-in duration-300" />
              )}
              <Icon className={`w-6 h-6 ${isActive ? "scale-110" : "scale-100"} transition-transform duration-300`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
