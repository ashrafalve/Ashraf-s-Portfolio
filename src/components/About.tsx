import { GraduationCap, Award, Music, Code, Palette, Lightbulb } from "lucide-react";

const stats = [
  { value: "1+", label: "Years Experience" },
  { value: "8+", label: "Projects Completed" },
  { value: "Top 15%", label: "Batch Ranking" },
  { value: "4+", label: "Awards & Honors" },
];

const education = [
  {
    degree: "Bachelor of Science in Computer Science & Engineering",
    school: "University of Asia Pacific, Dhaka",
    year: "2021 - 2025",
    achievements: ["Among top 15% of the batch", "VC & Dean's Award recipient (4 times)"],
  },
];

const interests = [
  { icon: Code, label: "Open Source", description: "Contributing to community projects" },
  { icon: Palette, label: "UI/UX Design", description: "Creating beautiful interfaces" },
  { icon: Lightbulb, label: "Hackathons", description: "Competitive problem solving" },
  { icon: Music, label: "Music", description: "University Singing Champion" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">About Me</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            Building Digital{" "}
            <span className="text-primary">Experiences</span> That Matter
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            I'm a passionate software and design professional and a fresh graduate in Computer Science and Engineering from the University of Asia Pacific. With over a year of hands-on experience in Android development, graphic design, and web management, I bring a unique blend of technical expertise and creative vision to every project.
          </p>
        </div>

        {/* Stats Cards with Neon Border */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="group relative bg-card rounded-xl p-[2px] cursor-pointer"
              style={{
                background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)) 50%, transparent 50%, transparent)',
                backgroundSize: '200% 200%',
                animation: 'neon-rotate 3s linear infinite',
              }}
            >
              <style>{`
                @keyframes neon-rotate {
                  0% { background-position: 0% 50%; }
                  100% { background-position: 200% 50%; }
                }
              `}</style>
              <div className="bg-card border border-border rounded-xl p-6 text-center h-full" style={{
                boxShadow: '0 0 15px hsl(var(--primary) / 0.1)',
              }}>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Education Card with Neon Border */}
          <div 
            className="group relative bg-card rounded-2xl p-[2px]"
            style={{
              background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)) 50%, transparent 50%, transparent)',
              backgroundSize: '200% 200%',
              animation: 'neon-rotate 3s linear infinite',
            }}
          >
            <style>{`
              @keyframes neon-rotate {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
              }
            `}</style>
            <div className="bg-card border border-border rounded-2xl p-8 h-full" style={{
              boxShadow: '0 0 20px hsl(var(--primary) / 0.15)',
            }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Education</h3>
              </div>
              
              {education.map((edu, idx) => (
                <div key={idx} className="mb-4">
                  <p className="text-foreground font-semibold text-lg">{edu.degree}</p>
                  <p className="text-primary font-medium">{edu.school}</p>
                  <p className="text-muted-foreground text-sm mb-3">{edu.year}</p>
                  <div className="flex flex-wrap gap-2">
                    {edu.achievements.map((achievement, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm">VC & Dean's Award - 4 times</span>
                </div>
              </div>
            </div>
          </div>

          {/* Beyond Coding Card with Neon Border */}
          <div 
            className="group relative bg-card rounded-2xl p-[2px]"
            style={{
              background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)) 50%, transparent 50%, transparent)',
              backgroundSize: '200% 200%',
              animation: 'neon-rotate 3s linear infinite',
            }}
          >
            <style>{`
              @keyframes neon-rotate {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
              }
            `}</style>
            <div className="bg-card border border-border rounded-2xl p-8 h-full" style={{
              boxShadow: '0 0 20px hsl(var(--primary) / 0.15)',
            }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Beyond Coding</h3>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                When I'm not coding or designing, you'll find me participating in hackathons, contributing to open-source projects, or exploring new technologies. I'm also passionate about music and have won the University Singing Competition, which reflects my creative side and attention to detail.
              </p>

              {/* Interest Tags */}
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <interest.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium text-sm">{interest.label}</p>
                      <p className="text-muted-foreground text-xs">{interest.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
