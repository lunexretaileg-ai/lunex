import { AdminLayout } from "./AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Loader2, Send, MessageSquare, CheckCircle2, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminChat() {
  const qc = useQueryClient();
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/chat/sessions"],
    refetchInterval: 5000, 
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/chat/session/messages", selectedSessionId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/session/${selectedSessionId}/messages`);
      return res.json();
    },
    enabled: !!selectedSessionId,
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await fetch(`/api/chat/session/${selectedSessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, isAdmin: true }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/chat/session/messages", selectedSessionId] });
      qc.invalidateQueries({ queryKey: ["/api/admin/chat/sessions"] });
      setInputVal("");
    }
  });

  const closeSessionMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/admin/chat/sessions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/chat/sessions"] });
      if (selectedSessionId) {
        setSelectedSessionId(null);
      }
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !selectedSessionId) return;
    sendMessageMutation.mutate(inputVal);
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-8rem)] bg-card rounded-3xl border border-border/50 overflow-hidden">
        {/* Sessions Sidebar */}
        <div className="w-1/3 min-w-[300px] border-r border-border/50 flex flex-col">
          <div className="p-5 border-b border-border/50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Live Chat
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sessionsLoading ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No chat sessions found.</div>
            ) : (
              <div className="divide-y divide-border/20">
                {sessions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSessionId(s.id)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-surface transition-colors",
                      selectedSessionId === s.id ? "bg-surface/80 border-l-4 border-l-primary" : ""
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm truncate">
                        {s.user ? s.user.fullName : s.guestId ? `Guest (${s.guestId.substring(0, 8)})` : "Anonymous"}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {new Date(s.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{s.lastMessage}</p>
                    {s.status === "closed" && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground uppercase">Closed</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-surface/10">
          {selectedSessionId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 bg-card flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {selectedSession?.user ? selectedSession.user.fullName : selectedSession?.guestId ? `Guest (${selectedSession.guestId.substring(0, 8)})` : "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">Session #{selectedSession?.id} • {selectedSession?.status}</p>
                  </div>
                </div>
                {selectedSession?.status === "active" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => closeSessionMutation.mutate(selectedSessionId)}
                    disabled={closeSessionMutation.isPending}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                    Mark Resolved
                  </Button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messagesLoading ? (
                  <div className="flex justify-center h-full items-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center h-full items-center text-muted-foreground text-sm">No messages yet.</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={cn("flex w-full", msg.isAdmin ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-5 py-3 text-sm flex flex-col",
                        msg.isAdmin ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm"
                      )}>
                        <span>{msg.content}</span>
                        <span className="text-[10px] opacity-70 mt-1.5 self-end">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {selectedSession?.status === "active" ? (
                <form onSubmit={handleSend} className="p-4 bg-card border-t border-border/50 flex gap-3">
                  <Input
                    placeholder="Type your reply..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button type="submit" disabled={!inputVal.trim() || sendMessageMutation.isPending} className="px-6">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </form>
              ) : (
                <div className="p-4 bg-muted text-center text-sm text-muted-foreground border-t border-border/50">
                  This session is closed. Participants can no longer send messages.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 opacity-20 mb-4" />
              <p>Select a conversation from the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
