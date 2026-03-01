import { Smartphone, Laptop, Github, Flame, Palette, FileText } from "lucide-react";
import androidStudio from "@/assets/icons/Androidstudio_icon.png";
import vscode from "@/assets/icons/VSCode_icon.png";
import githubIcon from "@/assets/icons/github_icon.png";
import firebaseIcon from "@/assets/icons/firebase_icon.png";
import uiuxIcon from "@/assets/icons/uiux_icon.png";
import canvaIcon from "@/assets/icons/canva.png";
import msofficeIcon from "@/assets/icons/msoffice_icon.png";
import adobeIcon from "@/assets/icons/adobe-illustrator.png";

const technologies = [
  { name: "Android Studio", icon: androidStudio },
  { name: "VS Code", icon: vscode },
  { name: "GitHub", icon: githubIcon },
  { name: "Firebase", icon: firebaseIcon },
  { name: "Adobe Illustrator", icon: adobeIcon },
  { name: "Canva", icon: canvaIcon },
  { name: "MS Excel", icon: msofficeIcon },
  { name: "MS PowerPoint", icon: msofficeIcon },
  { name: "MS Word", icon: msofficeIcon },
];

const TechStack = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden bg-card/50">
      <div className="container mx-auto px-4 mb-12">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Tools I Use</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground max-w-2xl">
          Development <span className="text-primary">Tools</span>
        </h2>
      </div>

      <div className="relative">
        <div className="flex marquee whitespace-nowrap">
          {[...technologies, ...technologies].map((tech, i) => (
            <div
              key={i}
              className="inline-block mx-3 p-5 bg-card border border-border rounded-xl whitespace-nowrap flex items-center gap-4"
            >
              <img src={tech.icon} alt={tech.name} className={`w-10 h-10 object-contain flex-shrink-0 ${tech.name === 'GitHub' ? 'bg-white rounded-lg p-1' : ''}`} />
              <span className="text-foreground font-semibold">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex marquee-reverse whitespace-nowrap">
          {[...technologies.slice().reverse(), ...technologies.slice().reverse()].map((tech, i) => (
            <div
              key={i}
              className="inline-block mx-3 p-5 bg-card border border-border rounded-xl whitespace-nowrap flex items-center gap-4"
            >
              <span className="text-foreground font-semibold">{tech.name}</span>
              <img src={tech.icon} alt={tech.name} className={`w-10 h-10 object-contain flex-shrink-0 ${tech.name === 'GitHub' ? 'bg-white rounded-lg p-1' : ''}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
