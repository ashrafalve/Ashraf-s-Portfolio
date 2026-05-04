import { ArrowRight, Github, ExternalLink, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const projects = [
  {
    title: "UpCycle/RemakeX",
    category: "Upcycling Marketplace",
    desc: "The innovative marketplace to buy, sell, and creatively upcycle pre-loved products. Give your old items a second life with custom designs from talented artists.",
    tags: ["Marketplace", "Upcycling", "Sustainability"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fupcycle-project.vercel.app%2F?w=1200",
    liveDemo: "https://upcycle-project.vercel.app/",
    github: "https://github.com/ashrafalve/Upcycle-Project",
  },
  {
    title: "Mirpur Xpress",
    category: "Restaurant Landing Page",
    desc: "A premium, high-conversion restaurant landing page built with Next.js, featuring smooth animations and a mobile-first gourmet experience.",
    tags: ["Restaurant", "Next.js", "Landing Page", "UX/UI"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fmirpurxpress.vercel.app%2F?w=1200",
    liveDemo: "https://mirpurxpress.vercel.app/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "AI Voice Receptionist",
    category: "Real-time Voice Agent Dashboard",
    desc: "A sophisticated dashboard for a real-time Twilio voice agent receptionist. Features modern UI for managing AI-driven voice interactions and call logs.",
    tags: ["Twilio", "AI Voice", "Dashboard", "React"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Ffai-dashboarddesign.netlify.app%2F?w=1200",
    liveDemo: "https://fai-dashboarddesign.netlify.app/",
    github: "https://github.com/ashrafalve/FAI-Dashboard-Design-Task",
  },
  {
    title: "Quran Mazid App",
    category: "Quran Learning & Reading Web App",
    desc: "A comprehensive Quran learning and reading platform featuring a Next.js frontend and Node.js backend for a seamless spiritual experience.",
    tags: ["Next.js", "Node.js", "Spiritual", "Full-stack"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fquranmazidapp.vercel.app%2F?w=1200",
    liveDemo: "https://quranmazidapp.vercel.app/",
    github: "https://github.com/ashrafalve/QuranWebApp",
  },
  {
    title: "FoodKart",
    category: "Food Delivery Platform",
    desc: "Modern food delivery platform with restaurant listings and ordering capabilities.",
    tags: ["Food Delivery", "E-commerce", "Live Demo"],
    img: "/foodkart.png",
    liveDemo: "https://ashrafalve.github.io/Foodkart-Web-App/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "StayLux",
    category: "Hotel Booking Platform",
    desc: "A full-stack hotel booking platform with Next.js frontend and NestJS backend. Features user roles, hotel/room management, and real-time booking status.",
    tags: ["Next.js", "NestJS", "Full-stack", "MySQL"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fstayluxhotel.vercel.app%2F?w=1200",
    liveDemo: "https://stayluxhotel.vercel.app/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "AI Project Analysis",
    category: "AI-Powered SaaS Platform",
    desc: "An award-winning AI tool that transforms client requirements into actionable project plans. Features automated task extraction and risk analysis for modern agencies.",
    tags: ["AI", "Next.js", "SaaS", "Productivity"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Faiprojectanalysis.netlify.app%2F?w=1200",
    liveDemo: "https://aiprojectanalysis.netlify.app/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "GroceryBD",
    category: "Grocery Shopping Platform",
    desc: "Comprehensive grocery e-commerce platform with delivery tracking and catalog management.",
    tags: ["E-commerce", "Grocery", "Live Demo"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fashrafalve.github.io%2FGrocery-BD-Frontend%2F?w=1200",
    liveDemo: "https://ashrafalve.github.io/Grocery-BD-Frontend/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "Porto E-commerce",
    category: "E-Commerce Website Frontend",
    desc: "Modern e-commerce platform with product listings, shopping cart, and checkout functionality.",
    tags: ["E-Commerce", "React", "Shopping Cart"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fashrafalve.github.io%2Fporto_ecommerce_Frontend%2F?w=1200",
    liveDemo: "https://ashrafalve.github.io/porto_ecommerce_Frontend/",
    github: "https://github.com/ashrafalve/porto_ecommerce_Frontend",
  },
  {
    title: "ShopFinder",
    category: "Local Business Discovery",
    desc: "Find nearby retail shops by category and location, supporting local businesses.",
    tags: ["Business Directory", "Location Services", "Live Demo"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fshopfinders.netlify.app%2F?w=1200",
    liveDemo: "https://shopfinders.netlify.app/",
    github: "https://github.com/ashrafalve",
  },
  {
    title: "Music Player",
    category: "PulseWave Music Player",
    desc: "A modern web-based music player with intuitive interface and smooth playback controls.",
    tags: ["Music Player", "Web Audio", "Live Demo"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fashrafalve.github.io%2FPulseWave_Music_Player%2F?w=1200",
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
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fapkpure.com%2Fp%2Fcom.qmax.qmax?w=1200",
    liveDemo: "https://apkpure.com/p/com.qmax.qmax",
    github: "https://github.com/ashrafalve/Qmax-Expense-Tracker",
  },
  {
    title: "Fit-Nation",
    category: "Your Personal Fitness Companion",
    desc: "A comprehensive fitness tracking application to help you achieve your health and wellness goals. Features workout tracking, diet management, profile management, and AI-powered personalized recommendations.",
    tags: ["Fitness", "React Vite", "AI"],
    img: "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fashrafalve.github.io%2FFit-Nation%2F?w=1200",
    liveDemo: "https://ashrafalve.github.io/Fit-Nation/",
    github: "https://github.com/ashrafalve/Fit-Nation",
  },
];

const TeamSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? projects : projects.slice(0, 9);

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
          {visibleProjects.map((project) => (
            <div key={project.title} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300">
              <div className="h-48 md:h-56 overflow-hidden relative">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
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

        <div className="flex flex-col items-center gap-6 mt-12">
          {projects.length > 9 && (
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full gap-2 border-primary/50 text-primary hover:bg-primary/10 transition-all duration-300"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Load More <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          )}

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