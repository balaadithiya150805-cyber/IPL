import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { MessageSquare, Send, Sparkles, AlertCircle, Gavel } from 'lucide-react';

export default function ActivityFeed() {
  const { roomState, sendChatMessage, userRole, myTeam } = useSocket();
  const [inputText, setInputText] = useState('');
  const feedEndRef = useRef(null);

  const messages = roomState?.chatFeed || [];

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[340px] lg:h-[400px] border border-white/10 overflow-hidden shadow-xl">
      {/* Feed Header */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-bold text-sm text-white">Live Bidding & Room Feed</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">
          Real-Time
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
        {messages.length === 0 ? (
          <div className="text-center py-10 text-slate-500 italic">
            Auction activity and banter will appear here...
          </div>
        ) : (
          messages.map((msg) => {
            let itemBg = 'bg-slate-900/60 border-white/5 text-slate-300';

            if (msg.type === 'sold') {
              itemBg = 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200 font-medium';
            } else if (msg.type === 'bid') {
              itemBg = 'bg-amber-950/50 border-amber-500/30 text-amber-200';
            } else if (msg.type === 'unsold') {
              itemBg = 'bg-rose-950/50 border-rose-500/30 text-rose-200';
            } else if (msg.type === 'hammer' || msg.type === 'player_call') {
              itemBg = 'bg-purple-950/60 border-purple-500/30 text-purple-200 font-semibold';
            }

            return (
              <div
                key={msg.id}
                className={`p-2.5 rounded-xl border flex items-start gap-2 animate-fade-in ${itemBg}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-white tracking-tight flex items-center gap-1">
                      {msg.teamBadge && <span>{msg.teamBadge}</span>}
                      <span>{msg.sender}</span>
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="leading-snug break-words">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={feedEndRef} />
      </div>

      {/* Quick Banter / Message Input */}
      <form onSubmit={handleSend} className="p-2 bg-slate-950/80 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send a reaction or banter..."
          maxLength={100}
          className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 disabled:opacity-50"
          disabled={!inputText.trim()}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
