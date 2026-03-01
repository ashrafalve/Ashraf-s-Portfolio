import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setDotPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Circle */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: "40px",
          height: "40px",
          left: position.x - 20,
          top: position.y - 20,
          background: "linear-gradient(135deg, #ff4500 0%, #ff6b35 50%, #ffa500 100%)",
          opacity: 0.3,
        }}
      />
      {/* Inner Dot/Point */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: "8px",
          height: "8px",
          left: dotPosition.x - 4,
          top: dotPosition.y - 4,
          background: "linear-gradient(135deg, #ff4500 0%, #ff6b35 50%, #ffa500 100%)",
        }}
      />
    </>
  );
};

export default CustomCursor;
