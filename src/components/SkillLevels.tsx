import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import reactIcon from "@/assets/icons/react_icon.png";
import jsIcon from "@/assets/icons/js_icon.png";
import htmlIcon from "@/assets/icons/html_icon.png";
import androidStudioIcon from "@/assets/icons/Androidstudio_icon.png";
import uiuxIcon from "@/assets/icons/uiux_icon.png";
import sqlIcon from "@/assets/icons/sql_icon.png";
import githubIcon from "@/assets/icons/github_icon.png";
import firebaseIcon from "@/assets/icons/firebase_icon.png";
import tsIcon from "@/assets/icons/typescript_icon.png";
import pyIcon from "@/assets/icons/python_icon.png";

const skillLevels = [
  { name: "React / React Native", level: 80, icon: reactIcon },
  { name: "JavaScript / TypeScript", level: 80, icon: jsIcon },
  { name: "HTML / CSS ", level: 90, icon: htmlIcon },
  { name: "Application Development", level: 80, icon: androidStudioIcon },
  { name: "Design (Adobe Illustrator/Figma/Stitch)", level: 60, icon: uiuxIcon },
  { name: "Django / REST APIs", level: 80, icon: sqlIcon },
  { name: "Python / Fast APIs", level: 70, icon: pyIcon },
  { name: "Git / GitHub", level: 90, icon: githubIcon },
  { name: "Firebase / Subabase", level: 80, icon: firebaseIcon },
];

const PricingSection = () => {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Skill Proficiency</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            My <span className="text-primary">Expertise Level</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {skillLevels.map((skill) => (
            <div
              key={skill.name}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {skill.icon && <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />}
                  <span className="text-foreground font-semibold">{skill.name}</span>
                </div>
                <span className="text-primary font-bold">{skill.level}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Want to see my work? Check out my projects or contact me!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full gap-2" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View Projects <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full gap-2" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Contact Me
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
