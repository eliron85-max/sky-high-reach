import React, { useEffect, useRef } from "react";

type Item = {
  title: string;
  image: string;
  href?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  items: Item[];
};

export default function ServicesScrollCards({ title, subtitle, items }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = rootRef.current?.querySelectorAll(".svc-card");
    if (!cards) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("svc-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#f5d58a] text-center">{title}</h2>

        {subtitle && <p className="text-center text-white/60 mt-3 mb-10">{subtitle}</p>}

        <div ref={rootRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <a
              key={i}
              href={s.href || "#"}
              className="svc-card block rounded-2xl overflow-hidden bg-[#0b0f14]"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="relative aspect-[16/9]">
                <img src={s.image} className="absolute inset-0 w-full h-full object-cover" />
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold">{s.title}</h3>
                <p className="text-white/50 text-sm mt-1">עבודות גובה וסנפלינג</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        .svc-card {
          opacity: 0;
          transform: translateX(60px) scale(0.96);
          transition:
            opacity 0.6s ease,
            transform 0.8s cubic-bezier(.2,.9,.2,1);
        }

        .svc-card.svc-in {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      `}</style>
    </section>
  );
}
