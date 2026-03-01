import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    num: "01",
    title: "React Native App Developer",
    company: "Fire AI Agency (Betopia Group)",
    period: "Present",
    desc: "Currently working as a React Native App Developer at Fire AI Agency (Betopia Group). Developing mobile applications using React Native for various clients.",
    skills: ["React Native", "Mobile Development", "Firebase", "App Development"],
  },
  {
    num: "02",
    title: "Website Manager & Designer",
    company: "Gadget Track BD, Dhaka",
    period: "June 2023 – Present",
    desc: "Managed website content, UI updates, and product listings, ensuring smooth online operation and enhanced user experience. Designed visually engaging graphics for marketing, social media, and promotional campaigns.",
    skills: ["Website Management", "UI Design", "Graphic Design", "Content Strategy"],
  },
  {
    num: "03",
    title: "Frontend Developer",
    company: "Eutropia IT Solutions",
    period: "Aug 2025 – Nov 2025",
    desc: "Developed and improved UI components using modern front-end technologies. Worked closely with development team to maintain responsive and user-friendly interfaces.",
    skills: ["React", "JavaScript", "UI/UX", "Frontend Development"],
  },
  {
    num: "04",
    title: "Research Executive Intern",
    company: "eChithi",
    period: "Jul 2025 – Sep 2025",
    desc: "Assisted in planning and conducting research tasks to support ongoing projects. Analyzed data and prepared structured reports for internal use.",
    skills: ["Market Research", "Data Analysis", "Business Strategy"],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Experience</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              My <span className="text-primary">Professional Journey</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-6">
              Over 1+ years of professional experience in mobile development, web development, and design. Currently working at Fire AI Agency (Betopia Group).
            </p>
          </div>

          <Accordion type="single" collapsible defaultValue="01" className="space-y-2">
            {experiences.map((exp) => (
              <AccordionItem key={exp.num} value={exp.num} className="border border-border rounded-xl px-6 data-[state=open]:border-primary/50">
                <AccordionTrigger className="hover:no-underline gap-4">
                  <div className="flex items-center gap-4 text-left">
                    <span className="text-primary font-bold text-lg">{exp.num}</span>
                    <div>
                      <span className="text-foreground font-semibold block">{exp.title}</span>
                      <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {exp.company}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12">
                  <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {exp.period}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">{exp.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, i) => (
                      <span key={i} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Experience;
