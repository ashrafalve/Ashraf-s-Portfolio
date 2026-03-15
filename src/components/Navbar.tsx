import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Flame, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Link as RouterLink } from "react-router-dom";

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

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "teal" : "dark");
  };

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

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors ml-2"
          aria-label="Toggle theme"
          disabled={!mounted}
        >
          {mounted && (resolvedTheme === "dark" ? (
            <Droplets className="w-5 h-5 text-[#5eead4]" />
          ) : (
            <Flame className="w-5 h-5 text-orange-500" />
          ))}
        </button>

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
          {/* Theme Toggle for Mobile */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
            aria-label="Toggle theme"
            disabled={!mounted}
          >
            {mounted && (resolvedTheme === "dark" ? (
              <>
                <Droplets className="w-5 h-5 text-[#5eead4]" />
                <span className="text-muted-foreground">Switch to Teal Theme</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-muted-foreground">Switch to Fire Theme</span>
              </>
            ))}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
