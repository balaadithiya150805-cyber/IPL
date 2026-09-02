import React from 'react';
import { useSocket } from '../context/SocketContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, XCircle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useSocket();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let bg = 'bg-slate-800/90 border-slate-700 text-slate-100';
        let Icon = Info;

        if (toast.type === 'sold') {
          bg = 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-lg shadow-emerald-500/20';
          Icon = Sparkles;
        } else if (toast.type === 'bid') {
          bg = 'bg-amber-950/90 border-amber-500/50 text-amber-200 shadow-lg shadow-amber-500/20';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-lg shadow-rose-500/20';
          Icon = XCircle;
        } else if (toast.type === 'warning') {
          bg = 'bg-orange-950/90 border-orange-500/50 text-orange-200 shadow-lg shadow-orange-500/20';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md text-sm font-medium shadow-xl transform transition-all duration-300 animate-slide-up ${bg}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
