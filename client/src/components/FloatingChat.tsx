import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, X, Send, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export function FloatingChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create or load session
  useEffect(() => {
    let guestId = localStorage.getItem("lunex_guest_id");
    if (!guestId) {
      guestId = "guest_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("lunex_guest_id", guestId);
    }
    
    // Load session
    fetch(`/api/chat/session?guestId=${guestId}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setSession(data);
        } else {
          // Keep session null until user opens and sends a message, or create right away?
          // Let's defer creation until they open the chat.
        }
      })
      .catch(err => console.error("Could not fetch chat session", err));
  }, []);

  // Poll messages
  useEffect(() => {
    if (!session?.id || !isOpen) return;
    
    const fetchMsgs = () => {
      fetch(`/api/chat/session/${session.id}/messages`)
        .then(r => r.json())
        .then((data: any[]) => {
          if (Array.isArray(data)) setMessages(data);
        });
    };
    
    fetchMsgs();
    const int = setInterval(fetchMsgs, 3000);
    return () => clearInterval(int);
  }, [session?.id, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isSending) return;
    
    setIsSending(true);
    try {
      let currentSessionId = session?.id;
      
      // If no session exists, create one
      if (!currentSessionId) {
        const guestId = localStorage.getItem("lunex_guest_id");
        const res = await fetch("/api/chat/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestId })
        });
        const createdSession = await res.json();
        setSession(createdSession);
        currentSessionId = createdSession.id;
      }
      
      // Send message
      const msgRes = await fetch(`/api/chat/session/${currentSessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputVal, isAdmin: false })
      });
      const newMsg = await msgRes.json();
      setMessages(prev => [...prev, newMsg]);
      setInputVal("");
    } catch (error) {
      console.error("Failed to send msg", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-[350px] h-[450px] bg-background border border-border/50 rounded-2xl shadow-xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-primary/5 p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-col justify-center items-center">
                    <span className="text-xl">🧑‍💻</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Lunex Support</h3>
                    <p className="text-xs text-[hsl(var(--success))] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse"></span>
                      Typically replies in minutes
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-8 h-8 text-muted-foreground hover:bg-muted/50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface/30">
                <div className="text-center text-xs text-muted-foreground mb-4">
                  Welcome to Lunex! How can we help you today?
                </div>
                {messages.map((msg: any) => (
                  <div key={msg.id} className={cn("flex w-full", msg.isAdmin ? "justify-start" : "justify-end")}>
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.isAdmin ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <form onSubmit={handleSend} className="p-3 bg-background border-t border-border/40 flex items-center gap-2">
                <Input 
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="Type a message..."
                  className="rounded-full bg-surface"
                />
                <Button type="submit" size="icon" disabled={isSending || !inputVal.trim()} className="rounded-full shrink-0 w-10 h-10">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors border-none",
            isOpen ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
          )}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.button>
      </div>
    </>
  );
}
