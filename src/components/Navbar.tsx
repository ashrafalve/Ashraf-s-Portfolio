import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Flame, Droplets, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Link as RouterLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Removed cycle logic in favor of direct selection via dropdown

  const scrollTo = (id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = id.startsWith("/") ? id : `/#${id}`;
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      window.location.href = href;
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.location.href = href;
    }
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-2 left-2 right-2 z-50 bg-background/80 backdrop-blur-md border border-border rounded-xl">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <a href="#home" className="cursor-pointer">
            <span className="text-2xl font-bold text-primary">AAA</span>
          </a>
        </div>


        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-white font-semibold hover:text-primary transition-colors text-base"
            >
              {link.name}
            </button>
          ))}
        </nav>

        <Button
          className="hidden md:inline-flex rounded-full gap-2"
          onClick={() => scrollTo("contact")}
        >
          Contact Me <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Theme Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors ml-2 flex items-center justify-center outline-none animate-theme-pulse shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              aria-label="Toggle theme"
              disabled={!mounted}
            >
              {mounted && (
                resolvedTheme === "dark" ? (
                  <Flame className="w-5 h-5 text-[#f59614]" />
                ) : resolvedTheme === "teal" ? (
                  <Droplets className="w-5 h-5 text-[#19cdb0]" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-400" />
                )
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-border">
            <DropdownMenuItem 
              onClick={() => setTheme("dark")}
              className="flex items-center gap-2 cursor-pointer focus:bg-primary/10"
            >
              <Flame className="w-4 h-4 text-[#f59614]" />
              <span>Fire Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme("teal")}
              className="flex items-center gap-2 cursor-pointer focus:bg-primary/10"
            >
              <Droplets className="w-4 h-4 text-[#19cdb0]" />
              <span>Teal Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme("ash")}
              className="flex items-center gap-2 cursor-pointer focus:bg-primary/10"
            >
              <Moon className="w-4 h-4 text-slate-400" />
              <span>Ash Theme</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border p-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              {link.name}
            </button>
          ))}
          <Button className="w-full rounded-full gap-2" onClick={() => scrollTo("contact")}>
            Contact Me <ArrowRight className="w-4 h-4" />
          </Button>
          {/* Theme Selection for Mobile */}
          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-xs font-semibold text-muted-foreground px-2 uppercase tracking-wider">Select Theme</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${resolvedTheme === 'dark' ? 'bg-primary/10 border-primary' : 'bg-secondary border-transparent'}`}
              >
                <Flame className="w-5 h-5 text-[#f59614]" />
                <span className="text-[10px] font-bold">Fire</span>
              </button>
              <button
                onClick={() => setTheme("teal")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${resolvedTheme === 'teal' ? 'bg-primary/10 border-primary' : 'bg-secondary border-transparent'}`}
              >
                <Droplets className="w-5 h-5 text-[#19cdb0]" />
                <span className="text-[10px] font-bold">Teal</span>
              </button>
              <button
                onClick={() => setTheme("ash")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${resolvedTheme === 'ash' ? 'bg-primary/10 border-primary' : 'bg-secondary border-transparent'}`}
              >
                <Moon className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold">Ash</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
