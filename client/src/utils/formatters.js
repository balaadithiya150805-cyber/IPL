// Formats Lakhs into Crores / Lakhs strings (e.g. 200 -> "₹2.00 Cr", 75 -> "₹75 L")
export function formatLakhs(amountInLakhs) {
  if (amountInLakhs === null || amountInLakhs === undefined) return '₹0';
  const val = Number(amountInLakhs);
  if (isNaN(val)) return '₹0';

  if (val >= 100) {
    const cr = val / 100;
    return `₹${cr.toFixed(2)} Cr`;
  }
  return `₹${val.toFixed(0)} L`;
}

// Format timer into seconds or MM:SS
export function formatTimer(seconds) {
  if (seconds === null || seconds === undefined) return '00';
  const s = Math.max(0, Math.floor(seconds));
  return s < 10 ? `0${s}` : `${s}`;
}

// Role badge styling colors
export function getRoleBadgeStyle(role) {
  switch (role?.toLowerCase()) {
    case 'batter':
      return {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/40',
        icon: '🏏'
      };
    case 'bowler':
      return {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        icon: '🎯'
      };
    case 'all-rounder':
      return {
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        icon: '⚡'
      };
    case 'wicketkeeper':
      return {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/40',
        icon: '🧤'
      };
    default:
      return {
        bg: 'bg-slate-500/20',
        text: 'text-slate-300',
        border: 'border-slate-500/40',
        icon: '🏏'
      };
  }
}
