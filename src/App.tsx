import { useLenis } from "./hooks/useLenis";
import { CursorGlow } from "./components/layout/CursorGlow";
import { Navbar } from "./components/layout/Navbar";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import Dashboard from "./components/sections/Dashboard";
import { Terminal } from "./components/ui/Terminal";

export default function App() {
  useLenis();

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-white">
      <div className="pointer-events-none fixed inset-0 bg-noise bg-[length:18px_18px] opacity-[0.18]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,213,255,0.12),transparent_38%),radial-gradient(circle_at_82%_36%,rgba(139,92,246,0.12),transparent_32%)]" />
      <ScrollProgress />
      <Navbar />
      <CursorGlow />
      <main className="relative z-10">
        <Dashboard />
      </main>
      <Terminal />
    </div>
  );
}
