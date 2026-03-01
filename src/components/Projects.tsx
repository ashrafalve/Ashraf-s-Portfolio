import { ArrowRight, Github, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "FoodKart",
    category: "Food Delivery Platform",
    desc: "Modern food delivery platform with restaurant listings and ordering capabilities.",
    tags: ["Food Delivery", "E-commerce", "Live Demo"],
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop",
    liveDemo: "https://ashrafalve.github.io/Foodkart-Web-App/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "GroceryBD",
    category: "Grocery Shopping Platform",
    desc: "Comprehensive grocery e-commerce platform with delivery tracking and catalog management.",
    tags: ["E-commerce", "Grocery", "Live Demo"],
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop",
    liveDemo: "https://ashrafalve.github.io/Grocery-BD-Frontend/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "Porto E-commerce",
    category: "E-Commerce Website Frontend",
    desc: "Modern e-commerce platform with product listings, shopping cart, and checkout functionality.",
    tags: ["E-Commerce", "React", "Shopping Cart"],
    img: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop",
    liveDemo: "https://ashrafalve.github.io/porto_ecommerce_Frontend/",
    github: "https://github.com/ashrafalve/porto_ecommerce_Frontend",
  },
  {
    title: "ShopFinder",
    category: "Local Business Discovery",
    desc: "Find nearby retail shops by category and location, supporting local businesses.",
    tags: ["Business Directory", "Location Services", "GitHub"],
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
    liveDemo: "",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "Expense Tracker",
    category: "Budget Planning & Tracking",
    desc: "Comprehensive expense tracking and budget planning application with offline capabilities.",
    tags: ["Budget Planning", "Expense Tracking", "Offline App"],
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    liveDemo: "https://ashrafalve.github.io/Expense-Tracker-Offline/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "Music Player",
    category: "PulseWave Music Player",
    desc: "A modern web-based music player with intuitive interface and smooth playback controls.",
    tags: ["Music Player", "Web Audio", "Live Demo"],
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
    liveDemo: "https://ashrafalve.github.io/PulseWave_Music_Player/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "AI Website Analyzer",
    category: "AI-Powered Website Analysis",
    desc: "Enter any competitor URL → Get SWOT analysis, marketing strategy, weakness suggestions, and SEO recommendations in seconds.",
    tags: ["Python", "React", "AI"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    liveDemo: "",
    github: "https://github.com/ashrafalve/AI-WebsiteAnalyzer",
  },
  {
    title: "Qmax Expense Tracker",
    category: "Flutter Advance Expense Management",
    desc: "A advanced expense management app built with Flutter for tracking, budgeting, and financial planning.",
    tags: ["Flutter", "Mobile App", "Expense Tracker"],
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    liveDemo: "https://apkpure.com/p/com.qmax.qmax",
    github: "https://github.com/ashrafalve/Qmax-Expense-Tracker",
  },
  {
    title: "Fit-Nation",
    category: "Your Personal Fitness Companion",
    desc: "A comprehensive fitness tracking application to help you achieve your health and wellness goals. Features workout tracking, diet management, profile management, and AI-powered personalized recommendations.",
    tags: ["Fitness", "React Vite", "AI"],
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=250&fit=crop",
    liveDemo: "https://ashrafalve.github.io/Fit-Nation/",
    github: "https://github.com/ashrafalve/Fit-Nation",
  },
];

const TeamSection = () => {
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Projects</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Featured <span className="text-primary">Work</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.title} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300">
              <div className="h-32 md:h-40 overflow-hidden relative">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/80 transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary text-secondary-foreground p-2 rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="p-3 md:p-6">
                <p className="text-primary text-xs font-semibold mb-1 md:mb-2">{project.category}</p>
                <h3 className="text-foreground font-semibold text-base md:text-lg mb-1 md:mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-2 md:mb-4 line-clamp-2 md:line-clamp-none">{project.desc}</p>
                <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 md:py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.liveDemo && (
                    <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs px-2 md:px-4" asChild>
                      <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                        Live <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs px-2 md:px-4" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      GitHub <Github className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="rounded-full gap-2 px-8" asChild>
            <a href="https://github.com/ashrafalve?tab=repositories" target="_blank" rel="noopener noreferrer">
              View All Projects <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;