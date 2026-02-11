import React, { useEffect, useState } from "react";
import rappellingFigure from "@/assets/rappelling-figure.png";

export default function RappellingFigure() {
  const [figureY, setFigureY] = useState(0);

  // ✅ זה הגודל של הדמות — פה אתה משנה 300 / 200 וכו'
  const figureWidth = 200;

  // ✅ מיקום "קופסת הדמות" מצד ימין של המסך (זה מחליף את right של החבל)
  const wrapperRight = 0;

  // ✅ מיקום החבל יחסית לדמות (מתוך הקצה השמאלי של הדמות)
  // ככה זה לא בורח כשמשנים figureWidth
  // התחלתי לך ביחס ל-300 שהיה לך: 136/300 ≈ 0.453
  const ropeLeft = Math.round(0.453 * figureWidth);

  // ✅ נקודת חיבור על הדמות (כמה פיקסלים מלמעלה של הדמות)
  // אם צריך להוריד/להעלות את נקודת החיבור – משנים רק פה
  const ropeAttachY = Math.round(0.36 * figureWidth); // ערך התחלתי, אפשר לכוון

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const maxY = window.innerHeight - 350;
      setFigureY(progress * maxY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // גובה החבל: מראש הדף (0) עד נקודת החיבור על הדמות
  const ropeHeight = Math.max(0, figureY + ropeAttachY);

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* ✅ WRAPPER משותף: הדמות + החבל */}
      <div
        className="rappel-swing"
        style={{
          position: "absolute",
          right: wrapperRight,
          top: figureY,
          width: figureWidth,
          transformOrigin: "top center",
        }}
      >
        {/* ✅ החבל: יחסית לדמות (left בתוך ה-wrapper), ונמתח עד ראש הדף */}
        <div
          style={{
            position: "absolute",
            left: ropeLeft,
            top: -figureY,
            width: 1.5,
            height: ropeHeight,
            backgroundColor: "#808080",
            willChange: "height",
          }}
        />

        {/* ✅ הדמות */}
        <img
          src={rappellingFigure}
          alt="פועל סנפלינג"
          draggable={false}
          style={{
            display: "block",
            width: figureWidth,
            height: "auto",
            userSelect: "none",
          }}
        />
      </div>

      {/* ✅ אנימציה: עכשיו גם החבל וגם הדמות מתנדנדים יחד */}
      <style>{`
        @keyframes sway {
          0% { transform: rotate(-1.2deg); }
          50% { transform: rotate(1.2deg); }
          100% { transform: rotate(-1.2deg); }
        }
        .rappel-swing {
          animation: sway 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
