# 🏏 IPL Mock Auction - Real-Time Multiplayer Web App

A full-stack, real-time multiplayer mock auction platform inspired by **mockauction.in**, tailored for cricket clubs and tournaments.

---

## ⚡ Core Features

### 1. 🏠 Room Creation & Lobby Management
- **Auctioneer / Admin Controls**: Create a room with a customized 6-character code (e.g. `IPL924`), set initial purse budgets (e.g. ₹100 Crores), squad limits, and bid timers.
- **Franchise Owners**: Join using the 6-character code and choose an iconic IPL franchise badge (CSK, MI, RCB, KKR, RR, SRH, DC, GT, LSG, PBKS) or custom team.
- **Lobby Synchronization**: Live list of connected teams and readiness checks before starting.

### 2. 🎯 Real-Time Synchronized Bidding (Socket.io)
- **Active Player Spotlight**: Full stats, role tags, nationality flags (Indian / Overseas), base price, and live highest bidder status.
- **Dynamic IPL Increments**: Automatically adjusts increments based on current bid (+10L under 1 Cr, +20L under 2 Cr, +25L under 5 Cr, +50L above 5 Cr).
- **Purse & Reserve Validation**: Enforces minimum reserve balance for remaining required squad slots.
- **Admin Hammer Controls**: Official "SOLD 🔨", "UNSOLD ❌", "PAUSE/RESUME", "NEXT PLAYER", and "RESET BIDS" buttons.

### 3. 📊 Franchise Dashboard & Standings
- **My Roster Breakdown**: Filter bought players by role (Batters, Bowlers, All-rounders, Keepers) and check overseas slots.
- **Live Leaderboard**: Real-time purse balances and squad counts for all 10 franchises.
- **Activity & Banter Feed**: Real-time log of bids, auctioneer announcements, and room reactions.
- **Celebration Overlays**: Full-screen hammer drop with canvas-confetti bursts and sound effects.
- **Export Summary**: Download comprehensive auction report as CSV or JSON.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Audio API Synthesizer
- **Backend**: Node.js, Express, Socket.io, Mongoose / MongoDB (with zero-latency in-memory cache)
- **Real-Time Communication**: Bi-directional WebSocket events with atomic state locks

---

## 🚀 Quick Start Guide

### 1. Run Server & Client Concurrently
From the project root:
```bash
# Start both backend (Port 5000) and frontend (Port 3000)
npm run dev
```

### 2. Run Separately
```bash
# Terminal 1: Backend Server
cd server
npm run dev

# Terminal 2: Frontend Client
cd client
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 🔌 Socket.io Events Reference

| Event Name | Direction | Description |
|---|---|---|
| `join_room` | Client ➔ Server | Join room as Admin or Franchise Team |
| `room_state_update` | Server ➔ Broadcast | Full sync of current player, teams, purse, timer |
| `place_bid` | Client ➔ Server | Franchise raises the bid (server validates purse & increments) |
| `bid_placed` | Server ➔ Broadcast | Broadcasts updated bid & leader to all participants |
| `admin_start_auction` | Client ➔ Server | Starts the auction and draws first player |
| `admin_next_player` | Client ➔ Server | Draws next player from queue |
| `admin_sold` | Client ➔ Server | Sells player to highest bidder; updates purse & squad |
| `admin_unsold` | Client ➔ Server | Marks player as unsold |
| `player_sold` | Server ➔ Broadcast | Triggers celebration overlay, gavel audio, and roster sync |
| `timer_tick` | Server ➔ Broadcast | Synchronized countdown timer ticks |
| `send_chat_message` | Client ➔ Server ➔ All | Live reactions and banter stream |
