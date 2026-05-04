import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { useScrollSpy } from "../../hooks/useScrollSpy";

const navItems = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const ids = useMemo(() => navItems.map((item) => item.id), []);
  const active = useScrollSpy(ids);
  const [solid, setSolid] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  const scrollToSection = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", lightMode);
  }, [lightMode]);

  return (
    <header className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 transform-gpu ${solid ? "bg-ink/78 shadow-glow backdrop-blur-md" : "bg-transparent"}`}>
      <nav className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 sm:px-8">
        <a href="#home" onClick={scrollToSection("home")} className="flex items-center gap-3 text-sm font-bold text-white"><span className="text-2xl font-black text-blue-500">MD</span> Mark Domz</a>
        <div className="hidden items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.055] p-1 backdrop-blur-md md:flex">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={scrollToSection(item.id)} className={`rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 ${active === item.id ? "bg-cyanGlow text-ink" : "text-white/68 hover:text-white"}`}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 text-white/80">
          <button
            type="button"
            aria-label="Toggle light and dark theme"
            onClick={() => setLightMode((value) => !value)}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] transition hover:bg-white/10"
          >
            {lightMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
