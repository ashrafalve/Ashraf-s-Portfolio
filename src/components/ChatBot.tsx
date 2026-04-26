import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const faqQuestions = [
  "who are you", "what is your name", "about you", "about yourself",
  "skills", "what do you know", "technologies", "tech stack", "expertise",
  "experience", "work history", "jobs", "employment",
  "projects", "portfolio", "work done", "what have you built",
  "education", "degree", "university", "college", "academic",
  "contact", "how to contact", "email", "phone", "linkedin", "github",
  "awards", "achievements", "honors", "recognition",
  "location", "where are you from", "address",
  "cv", "resume", "download cv",
  "react native", "mobile app", "android", "app development",
  "python", "django", "web development",
];

const getAnswer = (question: string): string => {
  const q = question.toLowerCase();
  
  // About
  if (faqQuestions.slice(0, 4).some(kw => q.includes(kw))) {
    return "Hi! I'm Ashraf Ahmed Alve, a passionate React Native App Developer currently working at Fire AI (Betopia Group). I'm a CSE graduate from University of Asia Pacific with 1+ years of experience in mobile and web development. I'm passionate about building great apps and learning new technologies.";
  }
  
  // Skills
  if (faqQuestions.slice(4, 9).some(kw => q.includes(kw))) {
    return "My technical skills include:\n\nMobile: React Native, Android Studio, Firebase\n\nProgramming: C, C++, Python, Java, JavaScript\n\nWeb: HTML, CSS, Django, React (Basic), SQL, REST API, FastAPI\n\nOther: OOP, Machine Learning (Basic), Web Scraping, GitHub\n\nTools: Android Studio, VS Code, GitHub, Firebase, Adobe Illustrator, Canva, MS Office";
  }
  
  // Experience
  if (faqQuestions.slice(9, 13).some(kw => q.includes(kw))) {
    return "My professional experience:\n\n1. React Native App Developer - Fire AI Agency (Betopia Group) [Present]\n   Currently working as a React Native App Developer\n\n2. Website Manager & Designer - Gadget Track BD [June 2023 - Present]\n   Managing website content, UI updates, and designing graphics for marketing campaigns\n\n3. Frontend Developer - Eutropia IT Solutions [Aug 2025 - Nov 2025]\n   Developed UI components using modern front-end technologies\n\n4. Research Executive Intern - eChithi [Jul 2025 - Sep 2025]\n   Assisted in research tasks and data analysis";
  }
  
  // Projects
  if (faqQuestions.slice(13, 17).some(kw => q.includes(kw))) {
    return "Some of my notable projects:\n\n- FoodKart - Food Delivery Platform with live demo\n- GroceryBD - Grocery E-commerce Platform with live demo\n- Porto E-commerce - Full shopping cart functionality\n- ShopFinder - Local Business Discovery App\n- Expense Tracker - Budget Planning & Tracking App\n- Music Player - PulseWave Web Music Player\n\nWant to see more details about any specific project?";
  }
  
  // Education
  if (faqQuestions.slice(17, 21).some(kw => q.includes(kw))) {
    return "Education:\n\nBSc in Computer Science & Engineering\nUniversity of Asia Pacific, Dhaka\n2021 - 2025\n\nAchievements:\n- Among top 15% of the batch\n- VC & Dean's Award recipient (4 times)\n- Ideathon Champion (Season 2.0 & 3.0)\n- Rising Star Award in Hackathon (SNH Club, CSE)\n- ICPC 2022 Preliminary Contest Participant\n- University Singing Competition Champion";
  }
  
  // Contact
  if (faqQuestions.slice(21, 27).some(kw => q.includes(kw))) {
    return "You can contact me through:\n\nEmail: ashrafahmedalve@gmail.com\nPhone: +880 1798 760871\nLinkedIn: linkedin.com/in/ashraf-ahmed-alve-6a3853376/\nGitHub: github.com/ashrafalve\nLocation: Dhaka, Bangladesh";
  }
  
  // Awards
  if (faqQuestions.slice(27, 31).some(kw => q.includes(kw))) {
    return "My achievements and awards:\n\n- Ideathon Champion - ECDC, UAP (Season 2.0 & 3.0)\n- VC & Dean's Award - University of Asia Pacific (4 times)\n- Rising Star Award - Hackathon, SNH Club, CSE\n- ICPC 2022 Preliminary Contest Participant\n- Multiple Programming Contest Wins at UAP\n- CSE Magazine Designer - UAP\n- University Singing Competition Champion";
  }
  
  // Location
  if (faqQuestions.slice(31, 34).some(kw => q.includes(kw))) {
    return "I'm based in Dhaka, Bangladesh. I'm available for remote work and freelance projects.";
  }
  
  // CV/Resume
  if (faqQuestions.slice(34, 36).some(kw => q.includes(kw))) {
    return "You can view my CV here:\n/Ashraf_Ahmed_Resume.pdf";
  }
  
  // React Native
  if (faqQuestions.slice(36, 39).some(kw => q.includes(kw))) {
    return "Yes! I'm currently working as a React Native App Developer at Fire AI Agency (Betopia Group). I have experience building mobile apps using React Native, Android Studio, and Firebase. I've developed several projects including FoodKart, GroceryBD, and Expense Tracker.";
  }
  
  // Python/Django
  if (faqQuestions.slice(39, 41).some(kw => q.includes(kw))) {
    return "Yes! I'm familiar with Python and Django for web development. I also know FastAPI and have experience with web scraping. Python is one of my programming languages along with C, C++, Java, and JavaScript.";
  }
  
  // Default
  return "Thanks for your question! I'm Ashraf Ahmed Alve, a React Native App Developer at Fire AI (Betopia Group). You can ask me about my skills, experience, projects, education, achievements, or how to contact me. What would you like to know?";
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm Ashraf's AI assistant. Ask me anything about him - his skills, experience, projects, education, or how to contact him!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const answer = getAnswer(input);
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What are your skills?",
    "Tell me about your experience",
    "What projects have you built?",
    "How can I contact you?",
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 md:bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
      >
        <MessageCircle className="w-7 h-7 text-primary-foreground" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-48 md:bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] max-h-[70vh] md:max-h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Header */}
          <div 
            className="bg-primary p-4 flex items-center justify-between flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground font-semibold text-sm">Ashraf's AI Assistant</p>
                <p className="text-primary-foreground/70 text-xs">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.role === "assistant" && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                    )}
                    {msg.role === "user" && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground rounded-2xl rounded-bl-md px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div 
              className="px-4 pb-2 flex flex-wrap gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                    setTimeout(handleSend, 100);
                  }}
                  className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div 
            className="p-4 border-t border-border bg-card flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="bg-secondary border-border"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="rounded-full"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
