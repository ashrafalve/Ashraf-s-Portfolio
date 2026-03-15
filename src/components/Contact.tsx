import { ArrowRight, Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const CTAFooter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const mailtoLink = `mailto:ashrafahmedalve@gmail.com?subject=${encodeURIComponent(subject || "Portfolio Contact")}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`)}`;
    window.location.href = mailtoLink;
  };
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Get In Touch</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                Let's <span className="text-primary">Connect</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Feel free to reach out if you're looking for a developer, have questions, or just want to connect.
              </p>

              <div className="space-y-4">
                <a href="mailto:ashrafahmedalve@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  ashrafahmedalve@gmail.com
                </a>
                <a href="tel:+8801798760871" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                  +880 1798 760871
                </a>
                <a href="https://www.linkedin.com/in/ashraf-ahmed-alve-6a3853376/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5 text-primary" />
                  LinkedIn Profile
                </a>
                <a href="https://github.com/ashrafalve" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-5 h-5 text-primary" />
                  GitHub Profile
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  Dhaka, Bangladesh
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <a
                  href="https://github.com/ashrafalve"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ashraf-ahmed-alve-6a3853376/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:ashrafahmedalve@gmail.com"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-foreground font-semibold text-xl mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input 
                      placeholder="Your Name" 
                      className="bg-secondary border-border" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Input 
                      placeholder="Your Email" 
                      type="email" 
                      className="bg-secondary border-border" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <Input 
                  placeholder="Subject" 
                  className="bg-secondary border-border" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
                <Textarea 
                  placeholder="Your Message" 
                  rows={5} 
                  className="bg-secondary border-border"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
                <Button type="submit" size="lg" className="w-full rounded-full gap-2">
                  Send Message <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-primary">AAA</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Web & App Developer | UI/UX Designer | CSE Graduate
              </p>
            </div>
            {[
              { 
                title: "Quick Links", 
                links: ["Home", "About", "Skills", "Projects", "Achievements", "Contact"], 
                ids: ["home", "about", "skills", "projects", "achievements", "contact"] 
              },
              { 
                title: "Projects", 
                links: ["FoodKart", "GroceryBD", "Porto E-commerce", "ShopFinder", "Expense Tracker"], 
                ids: ["", "", "", "", ""] 
              },
              { 
                title: "Contact", 
                links: ["ashrafahmedalve@gmail.com", "+880 1798 760871", "Dhaka, Bangladesh"], 
                ids: ["", "", ""] 
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-foreground font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={link}>
                      {col.ids[i] ? (
                        <button 
                          onClick={() => scrollTo(col.ids[i])}
                          className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer text-left"
                        >
                          {link}
                        </button>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          {link}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 text-center">
            <p className="text-muted-foreground text-sm">© 2025 Ashraf Ahmed Alve. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTAFooter;
