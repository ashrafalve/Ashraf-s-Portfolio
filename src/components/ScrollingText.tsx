import reactIcon from "@/assets/icons/react_icon.png";
import jsIcon from "@/assets/icons/js_icon.png";
import tsIcon from "@/assets/icons/typescript_icon.png";
import androidStudioIcon from "@/assets/icons/Androidstudio_icon.png";
import figmaIcon from "@/assets/icons/uiux_icon.png";
import nodeIcon from "@/assets/icons/rest_api.png";
import firebaseIcon from "@/assets/icons/firebase_icon.png";
import githubIcon from "@/assets/icons/github_icon.png";
import pythonIcon from "@/assets/icons/python_icon.png";
import htmlIcon from "@/assets/icons/html_icon.png";
import cssIcon from "@/assets/icons/css_icon.png";
import nextIcon from "@/assets/icons/nextjslogo.png";

const bigText = "WEB DEVELOPER • APP DEVELOPER •  SOFTWARE ENTHUSIAST • UI/UX DESIGNER";

const bigTextIcons = [
  { name: "React", icon: reactIcon },
  { name: "Next.js", icon: nextIcon },
  { name: "JavaScript", icon: jsIcon },
  { name: "TypeScript", icon: tsIcon },
  { name: "Android", icon: androidStudioIcon },
  { name: "Figma", icon: figmaIcon },
  { name: "Node.js", icon: nodeIcon },
  { name: "Firebase", icon: firebaseIcon },
  { name: "Git", icon: githubIcon },
];

const tagsIcons = [
  { name: "React", icon: reactIcon },
  { name: "Next.js", icon: nextIcon },
  { name: "JavaScript", icon: jsIcon },
  { name: "TypeScript", icon: tsIcon },
  { name: "Android", icon: androidStudioIcon },
  { name: "Figma", icon: figmaIcon },
  { name: "Node.js", icon: nodeIcon },
  { name: "Firebase", icon: firebaseIcon },
  { name: "Python", icon: pythonIcon },
  { name: "HTML", icon: htmlIcon },
  { name: "CSS", icon: cssIcon },
];

const ScrollingText = () => {
  return (
    <section className="py-12 overflow-hidden space-y-6">
      <div className="relative">
        <div className="flex marquee-slow whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground/5 mx-8 uppercase tracking-wider">
              {bigText} •
            </span>
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center">
          <div className="flex marquee-slow whitespace-nowrap">
            {Array.from({ length: 4 }).map((_, i) => (
              bigTextIcons.map((item, idx) => (
                <span key={`${i}-${idx}`} className="flex items-center mx-8">
                  <img src={item.icon} alt={item.name} className="h-16 md:h-20 lg:h-24 w-auto object-contain" />
                </span>
              ))
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex marquee-reverse whitespace-nowrap">
          {[...tagsIcons, ...tagsIcons, ...tagsIcons, ...tagsIcons].map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center mx-3 px-8 py-4 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-colors"
            >
              <img src={tag.icon} alt={tag.name} className={`w-6 h-6 object-contain mr-2 ${tag.name === 'REST API' || tag.name === 'GitHub' ? 'bg-white rounded p-1' : ''}`} />
              <span className="text-muted-foreground text-sm">{tag.name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollingText;
