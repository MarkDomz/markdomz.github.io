import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [history, setHistory] = useState<{ type: "input" | "output"; content: string }[]>([
    { type: "output", content: "System initialized. Type 'help' for commands." }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isOpen, isMinimized]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, { type: "input", content: trimmed }]);

    let output = "";
    switch (trimmed.toLowerCase()) {
      case "help":
        output = "Available commands:\n  help    - Show this help message\n  about   - Info about this system\n  clear   - Clear terminal output\n  echo    - Repeat your message";
        break;
      case "about":
        output = "Interactive Terminal v1.0.0\nReady for operation.";
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        if (trimmed.toLowerCase().startsWith("echo ")) {
          output = trimmed.slice(5);
        } else {
          output = `Command not found: ${trimmed}. Type 'help' for commands.`;
        }
    }

    setHistory((prev) => [...prev, { type: "output", content: output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink border border-neonGreen/30 text-neonGreen shadow-[0_0_20px_rgba(57,255,20,0.15)] hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] transition-shadow backdrop-blur-xl"
          >
            <TerminalIcon size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ 
              y: isMinimized ? 'calc(100% - 3rem)' : 0, 
              opacity: 1, 
              scale: 1 
            }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50 flex w-full max-w-[24rem] flex-col overflow-hidden rounded-xl border border-neonGreen/30 bg-ink/95 shadow-[0_0_40px_rgba(57,255,20,0.1)] backdrop-blur-xl font-mono text-sm sm:max-w-md"
            style={{ height: isMinimized ? 'auto' : '24rem' }}
          >
            {/* Header */}
            <div className="flex h-12 items-center justify-between border-b border-neonGreen/20 bg-neonGreen/5 px-4 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-2 text-neonGreen">
                <TerminalIcon size={16} />
                <span className="font-bold tracking-wider">TERMINAL</span>
              </div>
              <div className="flex items-center gap-3 text-neonGreen/70">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:text-neonGreen transition-colors">
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:text-neonGreen transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 modal-scroll">
                  {history.map((msg, i) => (
                    <div key={i} className="mb-2 flex flex-col gap-1">
                      {msg.type === "input" ? (
                        <div className="flex gap-2 text-white/80">
                          <span className="text-neonGreen">❯</span>
                          <span>{msg.content}</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-neonGreen/90 pl-4">{msg.content}</div>
                      )}
                    </div>
                  ))}
                  <div ref={endOfMessagesRef} />
                </div>
                
                {/* Input */}
                <div className="border-t border-neonGreen/20 p-4 pt-3 flex gap-2 items-center">
                  <span className="text-neonGreen font-bold animate-pulse">❯</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-white placeholder-white/20 outline-none"
                    placeholder="Enter command..."
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
