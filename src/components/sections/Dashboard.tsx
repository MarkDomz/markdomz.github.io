import { FormEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Play,
  Send,
  X,
  Database,
  Gauge,
  Lock,
  Activity,
  Globe,
  Layout,
  Layers,
  Shield
} from "lucide-react";
import { fadeUp, modalSpring, staggerContainer } from "../../animations/variants";
import { projects } from "../../data/projects";
import type { Project } from "../../types";
import { GenericSystemPreview } from "../preview/GenericSystemPreview";
import { IMPMSPreview } from "../preview/IMPMSPreview";
import HeroText from "../ui/HeroText";

const capabilities = [
  { icon: Database, title: "Data-first architecture", copy: "Typed models, durable storage, clean operational flows." },
  { icon: Gauge, title: "Fast interfaces", copy: "GPU-friendly motion, responsive layouts, and focused state." },
  { icon: Lock, title: "Admin-ready controls", copy: "Role-aware surfaces, audit-friendly actions, and sane defaults." },
  { icon: Activity, title: "Live dashboards", copy: "Monitoring screens designed for scanning and repeated action." },
];



const skills = [
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/ffffff", invertLight: true },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
  { name: "C#", icon: "https://cdn.simpleicons.org/csharp/9B4F96" },
  { name: ".NET", icon: "https://cdn.simpleicons.org/dotnet/512BD4" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github/ffffff", invertLight: true },
  { name: "VS Code", icon: "https://cdn.simpleicons.org/visualstudiocode/007ACC" },
];
const stack = ["React", "Electron", "TypeScript", "MySQL", ".NET 8"];

function ProjectPreview({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (project.cover) {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0B1220] ${compact ? "h-28" : "h-64"}`}>
        <img src={project.cover} alt={`${project.title} preview`} className="h-full w-full object-contain" loading="lazy" />
        {project.video && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <Play size={13} /> Video demo
          </span>
        )}
      </div>
    );
  }
  if (project.id === "impms") return <IMPMSPreview />;
  if (project.id === "edusched") {
    return (
      <div className={`overflow-hidden rounded-xl border border-white/10 bg-[#0B1220] ${compact ? "h-28" : "h-64"}`}>
        <img src="/portfolio-reference.png" alt="EduSched dashboard reference" className="h-full w-full object-contain" loading="lazy" />
      </div>
    );
  }
  return <GenericSystemPreview />;
}

const ProjectCard = memo(function ProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  return (
    <motion.button
      variants={fadeUp}
      onClick={() => onSelect(project)}
      whileHover={{ y: -6, rotateX: 3, rotateY: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group project-card rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-left shadow-glow backdrop-blur-xl transform-gpu"
    >
      <ProjectPreview project={project} compact />
      <h3 className="mt-4 text-lg font-bold text-white">{project.title}</h3>
      <p className="mt-1 min-h-12 text-sm leading-5 text-white/62">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.slice(0, 3).map((tech) => (
          <motion.span
            key={tech}
            whileHover={{ y: -3, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="tech-tag inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20"
          >
            <img src={`https://cdn.simpleicons.org/${tech.toLowerCase().replace(/[\s\.]/g, '')}/white`} className="w-2.5 h-2.5 opacity-70" onError={(e) => (e.currentTarget.style.display = 'none')} />
            {tech}
          </motion.span>
        ))}
      </div>
    </motion.button>
  );
});

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeMedia, setActiveMedia] = useState(project.media?.[0] ?? null);
  const modalScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    // Hide site navbar while modal is open
    document.documentElement.classList.add("modal-open");

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.documentElement.classList.remove("modal-open");
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const scroller = modalScrollRef.current;
    if (!scroller) return;
    scroller.scrollTop += event.deltaY;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050813]/90 p-2 sm:p-4 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.article
        variants={modalSpring}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(event) => event.stopPropagation()}
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220] shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* ── Sticky header with close button ── */}
        <div className="relative flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0B1220] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">Project Demo</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{project.title}</h3>
          </div>
          {/* Large, easy-to-click close button */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/20 hover:text-white active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div
          ref={modalScrollRef}
          onWheelCapture={handleWheel}
          className="modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-5"
        >
          {/* Stacked on mobile, side-by-side on lg */}
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.4fr_0.6fr]">

            {/* Left — media viewer */}
            <div className="min-w-0">
              {activeMedia ? (
                <div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black sm:h-80 lg:h-[52vh]">
                  {activeMedia.type === "video" ? (
                    <video
                      key={activeMedia.src}
                      className="h-full w-full object-contain"
                      controls
                      playsInline
                      preload="auto"
                      poster={project.cover}
                      src={activeMedia.src}
                    />
                  ) : (
                    <img
                      src={activeMedia.src}
                      alt={activeMedia.title}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <ProjectPreview project={project} />
              )}

              {/* Thumbnail strip */}
              {project.media && (
                <div className="modal-scroll mt-4 flex gap-3 overflow-x-auto pb-2">
                  {project.media.map((item) => (
                    <button
                      key={item.src}
                      onClick={() => setActiveMedia(item)}
                      className={`w-36 shrink-0 overflow-hidden rounded-xl border p-1 text-left transition ${
                        activeMedia?.src === item.src
                          ? "border-blue-400 bg-blue-500/10"
                          : "border-white/10 bg-white/[0.04] hover:border-white/25"
                      }`}
                    >
                      <div className="relative h-20 overflow-hidden rounded-lg bg-black">
                        {item.type === "video" ? (
                          <>
                            <video className="h-full w-full object-contain" muted playsInline preload="metadata" src={item.src} />
                            <span className="absolute inset-0 grid place-items-center bg-black/40 text-white">
                              <Play size={18} />
                            </span>
                          </>
                        ) : (
                          <img src={item.src} alt="" className="h-full w-full object-contain" />
                        )}
                      </div>
                      <span className="mt-1 block truncate px-1 pb-1 text-[11px] font-semibold text-white/70">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — project info */}
            <div className="min-w-0">
              <p className="leading-7 text-white/68">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{
                      y: -5,
                      scale: 1.1,
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="tech-tag cursor-default inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/78 border border-white/5"
                  >
                    <img
                      src={`https://cdn.simpleicons.org/${tech.toLowerCase().replace(/[\s\.]/g, "")}/white`}
                      className="w-3.5 h-3.5 opacity-80"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    {tech}
                  </motion.span>
                ))}
              </div>

            </div>

          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function Dashboard() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", details: "" });
  const featured = projects[0];
  const handleSelect = useCallback((project: Project) => setSelected(project), []);
  const featuredProjects = useMemo(() => projects.slice(0, 3), []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setFormData({ name: "", email: "", details: "" });
    }, 900);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 pt-24 sm:px-6 lg:px-8">
      <motion.section id="home" variants={fadeUp} className="grid min-h-[560px] items-center gap-8 rounded-2xl border border-white/10 bg-[#07101D]/72 p-6 backdrop-blur-xl md:grid-cols-[1fr_0.9fr] lg:p-12">
        <div>
          <HeroText />
          <div className="mt-8 flex flex-wrap gap-6 md:justify-center">
            {stack.map((item) => <span key={item} className="text-sm font-medium text-white/80">{item}</span>)}
          </div>
        </div>
        <div className="relative mx-auto grid aspect-square w-full max-w-[280px] place-items-center">
          <motion.div className="absolute inset-0 rounded-full border border-blue-500/20" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute inset-6 rounded-full border-2 border-blue-500/80 shadow-glow" animate={{ scale: [1, 1.05, 1], opacity: [0.75, 1, 0.75] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.div className="absolute inset-12 rounded-full bg-cyanGlow/20 blur-2xl" animate={{ scale: [0.9, 1.12, 0.9] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="h-44 w-44 overflow-hidden rounded-full border border-white/10 bg-gradient-to-b from-blue-500/20 to-violet-600/20 shadow-glow transform-gpu" initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }} transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}>
            <img src="/profile/mark-domz.jpg" alt="Mark Domz profile" className="h-full w-full object-cover object-[50%_22%]" loading="eager" />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-lg transform-gpu will-change-transform"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanGlow">Selected Work</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">System Portfolio</h2>
            <p className="mt-2 text-white/50">A showcase of my three most recent professional projects.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.4fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
            <h3 className="text-2xl font-bold text-white">{featured.title}</h3>
            <span className="mt-3 inline-flex rounded-md bg-violet-600/55 px-3 py-1 text-xs font-bold text-white">Featured Project</span>
            <button onClick={() => setSelected(featured)} className="mt-5 block w-full text-left"><ProjectPreview project={featured} /></button>
            <p className="mt-5 leading-7 text-white/70">{featured.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {featured.tech.map((tech) => (
                <span key={tech} className="tech-tag inline-flex items-center gap-1.5 rounded-md bg-[#141D2E] px-2 py-1 text-[10px] font-bold text-white/84 border border-white/5">
                  <img src={`https://cdn.simpleicons.org/${tech.toLowerCase().replace(/[\s\.]/g, '')}/white`} className="w-3 h-3 opacity-80" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setSelected(featured)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 shadow-glow">View Details <ExternalLink size={16} /></button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredProjects.map((project) => <ProjectCard key={project.id} project={project} onSelect={handleSelect} />)}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="skills"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 shadow-2xl backdrop-blur-lg transform-gpu will-change-transform"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanGlow">Technical Arsenal</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Skills &amp; Tools</h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center transition hover:border-blue-500/30"
            >
              <img
                src={skill.icon}
                alt={skill.name}
                data-invert-light={skill.invertLight ? "true" : undefined}
                className="h-8 w-8 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-xs font-bold text-white/88">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="about"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 shadow-2xl backdrop-blur-lg transform-gpu will-change-transform"
      >
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanGlow">The Builder</p>
            <h2 className="mt-4 text-4xl font-bold text-white">About Me</h2>
            <p className="mt-8 text-lg leading-relaxed text-white/70">
              I'm Mark Domz, a Full-Stack Developer specializing in high-performance desktop and web applications. 
              With expertise in Electron, React, and robust backend systems like MySQL and .NET, I bridge the gap 
              between complex functionality and premium user experiences.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              I take pride in engineering software that is not only reliable under pressure but also visually stunning. 
              My goal is to deliver cinematic polish to every operational tool I build.
            </p>
            <div className="mt-10 flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="h-12 w-12 rounded-full border-4 border-[#07101D] bg-gradient-to-br from-blue-500/30 to-violet-500/30 backdrop-blur-md" />
                  ))}
               </div>
               <span className="text-sm font-bold tracking-tight text-white/40 uppercase">Full-Stack Developer since 2020</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-cyanGlow/30 hover:bg-white/[0.06]">
                <Icon className="text-cyanGlow transition-transform group-hover:scale-110" size={24} />
                <h3 className="mt-5 text-base font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 shadow-2xl backdrop-blur-lg transform-gpu will-change-transform"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanGlow">Transmission</p>
            <h2 className="mt-4 text-4xl font-bold text-white">Let's Connect</h2>
            <p className="mt-6 text-lg text-white/60">I'm always open to discussing new opportunities, architecture challenges, or creative ideas.</p>
            <div className="mt-10 space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'markdomz14@gmail.com' },
                { icon: MapPin, label: 'Location', value: 'Philippines' }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-5 text-white/80">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyanGlow shadow-glow"><Icon size={20} /></div>
                  <div><p className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</p><p>{value}</p></div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-white/20 outline-none transition focus:border-cyanGlow/50" />
              <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-white/20 outline-none transition focus:border-cyanGlow/50" />
            </div>
            <textarea placeholder="Project details or message..." required rows={6} value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-white/20 outline-none transition focus:border-cyanGlow/50" />
            <button disabled={loading} type="submit" className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 shadow-glow">
              {loading ? "Transmitting..." : <><Send size={18} /> Send Message</>}
            </button>
          </form>
        </div>
      </motion.section>

      <footer className="mt-12 border-t border-white/5 bg-[#07101D]/40 py-16 backdrop-blur-lg transform-gpu will-change-transform">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-glow">MD</div>
              <p className="text-sm font-medium text-white/40">Mark Domz &copy; 2020. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {['Home', 'Projects', 'Skills', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 transition hover:text-cyanGlow">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex gap-4">
              <a href="https://github.com" className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/40 transition-all hover:border-cyanGlow/50 hover:text-cyanGlow">
                <Github size={20} />
              </a>
              <a href="mailto:markdomz14@gmail.com" className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/40 transition-all hover:border-cyanGlow/50 hover:text-cyanGlow">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>{selected && <Modal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </motion.div>
  );
}
