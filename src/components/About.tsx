import { ArrowRight, GraduationCap, Award, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">About Me</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            Passionate Developer &{" "}
            <span className="text-primary">Designer</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            I'm a passionate software and design professional and a fresh graduate in Computer Science and Engineering from the University of Asia Pacific. With over a year of hands-on experience in Android development, graphic design, and web management, I bring a unique blend of technical expertise and creative vision to every project.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mt-4">
            My journey in technology has been marked by continuous learning and achievement. I'm among the top 15% of my batch and have received the Dean's Award four times for outstanding academic performance. I believe in creating digital solutions that not only function flawlessly but also provide exceptional user experiences.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Education
          </h3>
          {education.map((edu, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-foreground font-semibold text-lg">{edu.degree}</p>
                  <p className="text-primary">{edu.school}</p>
                </div>
                <p className="text-muted-foreground text-sm">{edu.year}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {edu.achievements.map((achievement, i) => (
                  <span key={i} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hobbies / Interests */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-foreground font-semibold text-lg mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Beyond Coding
          </h3>
          <p className="text-muted-foreground">
            When I'm not coding or designing, you'll find me participating in hackathons, contributing to open-source projects, or exploring new technologies. I'm also passionate about music and have won the University Singing Competition, which reflects my creative side and attention to detail.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
