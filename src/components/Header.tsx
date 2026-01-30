{
  /* ================= MOBILE DRAWER (ARCCA 1:1 - MENU RIGHT, INFO LEFT) ================= */
}
{
  mobileOpen && (
    <div className="fixed inset-0 z-[2147483647] lg:hidden bg-black overflow-hidden min-h-[100dvh]" dir="rtl">
      {/* Fullscreen panel */}
      <div className="fixed inset-0 z-[2147483647] grid grid-cols-[1.15fr_0.85fr] min-h-[100dvh]">
        {/* ===== RIGHT COLUMN (MENU LIGHT) ===== */}
        <nav className="bg-[#d7cfbf] text-[#1b1b1b] h-full min-h-[100dvh] overflow-hidden text-right" dir="rtl">
          <div className="h-[64px] border-b border-black/20" />

          <div className="divide-y divide-black/20">
            <Link
              to="/"
              onClick={closeMobile}
              className="h-[56px] px-5 flex items-center justify-end tracking-[0.12em] uppercase hover:bg-black/5"
            >
              עמוד ראשי
            </Link>

            <Link
              to="/about"
              onClick={closeMobile}
              className="h-[56px] px-5 flex items-center justify-end tracking-[0.12em] uppercase hover:bg-black/5"
            >
              אודות
            </Link>

            {/* SERVICES */}
            <div>
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                className="w-full h-[56px] px-5 flex items-center justify-between tracking-[0.12em] uppercase hover:bg-black/5"
              >
                {/* ב-RTL החץ צריך להיות משמאל */}
                <span className="text-[14px]">{servicesOpen ? "▲" : "▼"}</span>
                שירותים
              </button>

              {servicesOpen && (
                <div className="border-t border-black/20">
                  {serviceLinks.map((s) => (
                    <Link
                      key={s.path}
                      to={s.path}
                      onClick={closeMobile}
                      className="block px-6 py-3 text-[14px] hover:bg-black/5 text-right"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/projects"
              onClick={closeMobile}
              className="h-[56px] px-5 flex items-center justify-end tracking-[0.12em] uppercase hover:bg-black/5"
            >
              פרויקטים
            </Link>

            <Link
              to="/pricing"
              onClick={closeMobile}
              className="h-[56px] px-5 flex items-center justify-end tracking-[0.12em] uppercase hover:bg-black/5"
            >
              מחירים
            </Link>

            <Link
              to="/contact"
              onClick={closeMobile}
              className="h-[56px] px-5 flex items-center justify-end tracking-[0.12em] uppercase hover:bg-black/5"
            >
              צור קשר
            </Link>
          </div>
        </nav>

        {/* ===== LEFT COLUMN (DARK INFO) ===== */}
        <aside className="bg-[#1c1714] text-[#e6dccb] relative h-full min-h-[100dvh] overflow-hidden" dir="ltr">
          {/* CLOSE (LEFT) */}
          <button
            type="button"
            onClick={closeMobile}
            className="absolute top-4 left-4 w-11 h-11 rounded-xl border border-white/20 text-white hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="h-full flex flex-col px-6 pt-10 pb-6">
            <img src={logoImage} className="h-[60px] w-auto object-contain" alt="logo" />

            <div className="mt-8 h-px bg-white/10" />

            <div className="mt-6 grid grid-cols-2 gap-6 text-[12px]">
              <div>
                <div className="opacity-60 uppercase tracking-widest">Email</div>
                <div className="mt-2 break-words">contact@heights-projects.com</div>
              </div>

              <div>
                <div className="opacity-60 uppercase tracking-widest">Phone</div>
                <div className="mt-2 break-words">055-661-6326</div>
              </div>

              <div>
                <div className="opacity-60 uppercase tracking-widest">Location</div>
                <div className="mt-2 break-words">Israel</div>
              </div>

              <div>
                <div className="opacity-60 uppercase tracking-widest">Social</div>
                <div className="mt-2 break-words">Instagram / Facebook</div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="h-px bg-white/10 mb-4" />
              <div className="flex justify-between text-[10px] opacity-60 tracking-widest">
                <span>Privacy Policy</span>
                <span>© A.A</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
