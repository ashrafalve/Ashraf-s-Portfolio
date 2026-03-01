import { ArrowRight, Trophy, Medal, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const achievements = [
  {
    title: "Ideathon Champion",
    organization: "ECDC, UAP",
    description: "Winner of Ideathon Season 2.0 & 3.0 organized by ECDC, UAP",
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "VC & Dean's Award",
    organization: "University of Asia Pacific",
    description: "Received multiple times for outstanding academic performance",
    icon: Medal,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Rising Star Award",
    organization: "SNH Club, CSE",
    description: "Winner in Hackathon organized by SNH Club, CSE",
    icon: Star,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "ICPC Participant",
    organization: "ICPC 2022",
    description: "Selected for ICPC 2022 Preliminary Contest",
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Programming Contest Winner",
    organization: "UAP",
    description: "Won multiple online programming contests at UAP",
    icon: Trophy,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "CSE Magazine Designer",
    organization: "UAP",
    description: "Designed the official CSE Magazine for UAP",
    icon: Star,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Singing Champion",
    organization: "University Competition",
    description: "Champion in University Singing Competition",
    icon: Crown,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

const BlogSection = () => {
  return (
    <section id="achievements" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Achievements</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Awards & <span className="text-primary">Recognition</span>
            </h2>
          </div>
          <Button variant="outline" className="rounded-full gap-2 border-border hover:border-primary hover:text-primary self-start" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Let's Connect <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, idx) => (
            <div key={idx} className="group relative bg-card rounded-2xl p-[2px] cursor-pointer" style={{
              background: 'linear-gradient(45deg, hsl(15 90% 55%), hsl(15 90% 55%) 50%, transparent 50%, transparent)',
              backgroundSize: '200% 200%',
              animation: 'neon-rotate 3s linear infinite',
            }}>
              <style>{`
                @keyframes neon-rotate {
                  0% { background-position: 0% 50%; }
                  100% { background-position: 200% 50%; }
                }
              `}</style>
              <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors h-full" style={{
                boxShadow: '0 0 15px hsl(15 90% 55% / 0.2)',
              }}>
                <div className={`w-14 h-14 rounded-xl ${achievement.bgColor} flex items-center justify-center mb-4`}>
                  <achievement.icon className={`w-7 h-7 ${achievement.color}`} />
                </div>
                <p className="text-primary text-xs font-semibold mb-2">{achievement.organization}</p>
                <h3 className="text-foreground font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{achievement.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
