import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ScrollingText from "@/components/ScrollingText";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import SkillLevels from "@/components/SkillLevels";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollToTop from "@/components/ScrollToTop";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <ScrollReveal animation="fade-up" once={false}>
        <Hero />
      </ScrollReveal>
      <ScrollReveal animation="fade-left" delay={0.2} once={false}>
        <About />
      </ScrollReveal>
      <ScrollReveal animation="slide-up" delay={0.1} once={false}>
        <ScrollingText />
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={0.2} once={false}>
        <Skills />
      </ScrollReveal>
      <ScrollReveal animation="fade-right" delay={0.1} once={false}>
        <Experience />
      </ScrollReveal>
      <ScrollReveal animation="zoom-in" delay={0.2} once={false}>
        <Projects />
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={0.1} once={false}>
        <TechStack />
      </ScrollReveal>
      <ScrollReveal animation="fade-left" delay={0.2} once={false}>
        <SkillLevels />
      </ScrollReveal>
      <ScrollReveal animation="fade-right" delay={0.1} once={false}>
        <Achievements />
      </ScrollReveal>
      <ScrollReveal animation="zoom-in" delay={0.2} once={false}>
        <Contact />
      </ScrollReveal>
      <ScrollToTop />
    </div>
  );
};

export default Index;
