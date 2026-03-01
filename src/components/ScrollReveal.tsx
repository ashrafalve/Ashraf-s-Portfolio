import { useEffect, useRef, useState, ReactNode,} from "react";

type AnimationType = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right"
  | "zoom-in" 
  | "zoom-out"
  | "flip-x"
  | "flip-y"
  | "slide-up"
  | "bounce"
  | "rotate"
  | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

const ScrollReveal = ({ 
  children, 
  animation = "fade-up", 
  delay = 0, 
  duration = 0.8,
  once = true,
  className = ""
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once]);

  const getAnimationStyles = (): React.CSSProperties => {
    if (!isVisible) {
      const hiddenStyles: Record<AnimationType, React.CSSProperties> = {
        "fade-up": { opacity: 0, transform: "translateY(80px)" },
        "fade-down": { opacity: 0, transform: "translateY(-80px)" },
        "fade-left": { opacity: 0, transform: "translateX(-80px)" },
        "fade-right": { opacity: 0, transform: "translateX(80px)" },
        "zoom-in": { opacity: 0, transform: "scale(0.5)" },
        "zoom-out": { opacity: 0, transform: "scale(1.5)" },
        "flip-x": { opacity: 0, transform: "rotateX(90deg)" },
        "flip-y": { opacity: 0, transform: "rotateY(90deg)" },
        "slide-up": { opacity: 0, transform: "translateY(100%)" },
        "bounce": { opacity: 0, transform: "translateY(40px)" },
        "rotate": { opacity: 0, transform: "rotate(-180deg) scale(0.5)" },
        "scale": { opacity: 0, transform: "scale(0)" },
      };
      return hiddenStyles[animation];
    }

    const visibleStyles: Record<AnimationType, React.CSSProperties> = {
      "fade-up": { opacity: 1, transform: "translateY(0)" },
      "fade-down": { opacity: 1, transform: "translateY(0)" },
      "fade-left": { opacity: 1, transform: "translateX(0)" },
      "fade-right": { opacity: 1, transform: "translateX(0)" },
      "zoom-in": { opacity: 1, transform: "scale(1)" },
      "zoom-out": { opacity: 1, transform: "scale(1)" },
      "flip-x": { opacity: 1, transform: "rotateX(0)" },
      "flip-y": { opacity: 1, transform: "rotateY(0)" },
      "slide-up": { opacity: 1, transform: "translateY(0)" },
      "bounce": { opacity: 1, transform: "translateY(0)" },
      "rotate": { opacity: 1, transform: "rotate(0) scale(1)" },
      "scale": { opacity: 1, transform: "scale(1)" },
    };
    return visibleStyles[animation];
  };

  const style: React.CSSProperties = {
    ...getAnimationStyles(),
    transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
