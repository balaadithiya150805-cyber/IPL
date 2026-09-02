// Pre-seeded list of 50+ Star IPL Players with complete stats, roles, and base prices
// Base prices and amounts in Lakhs (e.g. 200 = 2.00 Crore INR, 150 = 1.50 Crore INR, 50 = 50 Lakhs INR)

export const DEFAULT_PLAYER_POOL = [
  // --- SET 1: MARQUEE BATTERS & ALL-ROUNDERS ---
  {
    id: 'p1',
    name: 'Virat Kohli',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200, // ₹2.00 Cr
    imageURL: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 252,
      runs: 8004,
      strikeRate: 131.97,
      wickets: 4,
      economy: 8.8,
      specialty: 'Right-hand Top Order Batter | IPL All-Time Leading Run Scorer'
    }
  },
  {
    id: 'p2',
    name: 'Rohit Sharma',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1531415074868-036b1c575351?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 257,
      runs: 6628,
      strikeRate: 131.14,
      wickets: 15,
      economy: 8.0,
      specialty: 'Right-hand Opener | 5-time IPL Trophy Winning Captain'
    }
  },
  {
    id: 'p3',
    name: 'Jasprit Bumrah',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 133,
      runs: 69,
      strikeRate: 98.5,
      wickets: 165,
      economy: 7.30,
      specialty: 'Right-arm Fast | Yorker King & Premier Death Bowler'
    }
  },
  {
    id: 'p4',
    name: 'Heinrich Klaasen',
    role: 'Wicketkeeper',
    nationality: 'South Africa',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 35,
      runs: 993,
      strikeRate: 168.3,
      wickets: 0,
      economy: 0,
      specialty: 'Right-hand Explosive Middle Order Batter & WK'
    }
  },
  {
    id: 'p5',
    name: 'Travis Head',
    role: 'Batter',
    nationality: 'Australia',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 25,
      runs: 772,
      strikeRate: 180.2,
      wickets: 3,
      economy: 9.1,
      specialty: 'Left-hand Ultra-Aggressive Opener | Powerplay Destroyer'
    }
  },
  {
    id: 'p6',
    name: 'Hardik Pandya',
    role: 'All-Rounder',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 137,
      runs: 2525,
      strikeRate: 146.3,
      wickets: 64,
      economy: 8.95,
      specialty: 'Right-hand Power Finisher & Right-arm Fast Medium'
    }
  },
  {
    id: 'p7',
    name: 'Rashid Khan',
    role: 'Bowler',
    nationality: 'Afghanistan',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 121,
      runs: 545,
      strikeRate: 148.1,
      wickets: 149,
      economy: 6.82,
      specialty: 'Right-arm Leg Spin Magician & Clutch Lower Order Batter'
    }
  },
  {
    id: 'p8',
    name: 'Rishabh Pant',
    role: 'Wicketkeeper',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 111,
      runs: 3284,
      strikeRate: 148.9,
      wickets: 0,
      economy: 0,
      specialty: 'Left-hand Dynamic Middle Order WK & Match Winner'
    }
  },
  {
    id: 'p9',
    name: 'Mitchell Starc',
    role: 'Bowler',
    nationality: 'Australia',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 41,
      runs: 115,
      strikeRate: 105.5,
      wickets: 51,
      economy: 8.52,
      specialty: 'Left-arm Express Fast | Fiery In-Swing Specialist'
    }
  },
  {
    id: 'p10',
    name: 'Suryakumar Yadav',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 150,
      runs: 3594,
      strikeRate: 145.3,
      wickets: 0,
      economy: 0,
      specialty: 'Right-hand 360-Degree T20 Specialist'
    }
  },

  // --- SET 2: ELITE BATTERS & ALL-ROUNDERS ---
  {
    id: 'p11',
    name: 'Shubman Gill',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 103,
      runs: 3216,
      strikeRate: 135.7,
      wickets: 0,
      economy: 0,
      specialty: 'Right-hand Classy Opener & Orange Cap Winner'
    }
  },
  {
    id: 'p12',
    name: 'Nicholas Pooran',
    role: 'Wicketkeeper',
    nationality: 'West Indies',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 76,
      runs: 1769,
      strikeRate: 162.3,
      wickets: 0,
      economy: 0,
      specialty: 'Left-hand Brutal Six-Hitter & Wicketkeeper'
    }
  },
  {
    id: 'p13',
    name: 'Ravindra Jadeja',
    role: 'All-Rounder',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 240,
      runs: 2959,
      strikeRate: 129.5,
      wickets: 160,
      economy: 7.62,
      specialty: 'Slow Left-arm Orthodox & Electric 3D Fielder/Batter'
    }
  },
  {
    id: 'p14',
    name: 'Pat Cummins',
    role: 'All-Rounder',
    nationality: 'Australia',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 58,
      runs: 515,
      strikeRate: 151.2,
      wickets: 63,
      economy: 8.78,
      specialty: 'Right-arm Fast Bowler & World Cup Winning Leader'
    }
  },
  {
    id: 'p15',
    name: 'Sanju Samson',
    role: 'Wicketkeeper',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 167,
      runs: 4419,
      strikeRate: 139.0,
      wickets: 0,
      economy: 0,
      specialty: 'Right-hand Fluent Top-Order Batter & Calm Captain'
    }
  },
  {
    id: 'p16',
    name: 'Yuzvendra Chahal',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 160,
      runs: 37,
      strikeRate: 50.0,
      wickets: 205,
      economy: 7.84,
      specialty: 'Right-arm Leg Spin | IPL All-Time Leading Wicket-Taker'
    }
  },
  {
    id: 'p17',
    name: 'Jos Buttler',
    role: 'Batter',
    nationality: 'England',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 107,
      runs: 3582,
      strikeRate: 147.5,
      wickets: 0,
      economy: 0,
      specialty: 'Right-hand Opener & Master of Centuries in T20s'
    }
  },
  {
    id: 'p18',
    name: 'Kashmiri Sensation Umran Malik',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 100, // ₹1.00 Cr
    imageURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 26,
      runs: 12,
      strikeRate: 75.0,
      wickets: 29,
      economy: 9.3,
      specialty: 'Right-arm 150+ kmph Express Speed Merchant'
    }
  },
  {
    id: 'p19',
    name: 'Rinku Singh',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 150, // ₹1.50 Cr
    imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 45,
      runs: 893,
      strikeRate: 143.3,
      wickets: 0,
      economy: 0,
      specialty: 'Left-hand Ice-Cool Finisher | 5 Sixes in 5 Balls Hero'
    }
  },
  {
    id: 'p20',
    name: 'Kuldeep Yadav',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 84,
      runs: 135,
      strikeRate: 85.4,
      wickets: 87,
      economy: 8.12,
      specialty: 'Left-arm Wrist Spin (Chinaman) Magic & Mystery'
    }
  },

  // --- SET 3: POWER PACKED ALL-ROUNDERS & BOWLERS ---
  {
    id: 'p21',
    name: 'Andre Russell',
    role: 'All-Rounder',
    nationality: 'West Indies',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 127,
      runs: 2484,
      strikeRate: 174.9,
      wickets: 115,
      economy: 9.35,
      specialty: 'Right-hand Monster Six-Hitter & Heavy Ball Fast Bowler'
    }
  },
  {
    id: 'p22',
    name: 'Sunil Narine',
    role: 'All-Rounder',
    nationality: 'West Indies',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 177,
      runs: 1534,
      strikeRate: 165.8,
      wickets: 180,
      economy: 6.73,
      specialty: 'Mystery Off-Spin & Lethal Pinch-Hitting Opener'
    }
  },
  {
    id: 'p23',
    name: 'Arshdeep Singh',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 65,
      runs: 35,
      strikeRate: 70.0,
      wickets: 76,
      economy: 8.74,
      specialty: 'Left-arm Swing Bowler & Precision Death Yorker Specialist'
    }
  },
  {
    id: 'p24',
    name: 'Glenn Maxwell',
    role: 'All-Rounder',
    nationality: 'Australia',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 134,
      runs: 2771,
      strikeRate: 156.7,
      wickets: 37,
      economy: 8.35,
      specialty: 'Right-hand "Big Show" Reverse-Sweep Specialist & Off-Spin'
    }
  },
  {
    id: 'p25',
    name: 'Mohammed Siraj',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 93,
      runs: 110,
      strikeRate: 85.0,
      wickets: 93,
      economy: 8.65,
      specialty: 'Right-arm Fast | New Ball Swing & Relentless Intensity'
    }
  },
  {
    id: 'p26',
    name: 'Kagiso Rabada',
    role: 'Bowler',
    nationality: 'South Africa',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 80,
      runs: 198,
      strikeRate: 105.3,
      wickets: 117,
      economy: 8.42,
      specialty: 'Right-arm Express Pace & Purple Cap Winner'
    }
  },
  {
    id: 'p27',
    name: 'Ruturaj Gaikwad',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 66,
      runs: 2380,
      strikeRate: 136.9,
      wickets: 0,
      economy: 0,
      specialty: 'Right-hand Graceful Opener & CSKs Run Machine'
    }
  },
  {
    id: 'p28',
    name: 'Trent Boult',
    role: 'Bowler',
    nationality: 'New Zealand',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 104,
      runs: 82,
      strikeRate: 80.0,
      wickets: 121,
      economy: 8.29,
      specialty: 'Left-arm Swing King | First Over Wicket Specialist'
    }
  },
  {
    id: 'p29',
    name: 'Axar Patel',
    role: 'All-Rounder',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 150,
      runs: 1653,
      strikeRate: 130.8,
      wickets: 123,
      economy: 7.24,
      specialty: 'Slow Left-arm Accurate Spinner & Hard Hitting Lower Order'
    }
  },
  {
    id: 'p30',
    name: 'Matheesha Pathirana',
    role: 'Bowler',
    nationality: 'Sri Lanka',
    isOverseas: true,
    basePrice: 150, // ₹1.50 Cr
    imageURL: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 20,
      runs: 4,
      strikeRate: 50.0,
      wickets: 34,
      economy: 7.88,
      specialty: 'Right-arm Slinging Action | "Baby Malinga" Death Specialist'
    }
  },

  // --- SET 4: EMERGING TALENTS & IMPACT PLAYERS ---
  {
    id: 'p31',
    name: 'Yashasvi Jaiswal',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 52,
      runs: 1607,
      strikeRate: 150.6,
      wickets: 0,
      economy: 0,
      specialty: 'Left-hand Fearless Opener | Fastest IPL Fifty (13 balls)'
    }
  },
  {
    id: 'p32',
    name: 'Abhishek Sharma',
    role: 'All-Rounder',
    nationality: 'India',
    isOverseas: false,
    basePrice: 150,
    imageURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 63,
      runs: 1377,
      strikeRate: 155.2,
      wickets: 11,
      economy: 8.6,
      specialty: 'Left-hand Ultra-Striker & Useful Slow Left-arm Spin'
    }
  },
  {
    id: 'p33',
    name: 'Mayank Yadav',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 100,
    imageURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 4,
      runs: 0,
      strikeRate: 0,
      wickets: 7,
      economy: 6.9,
      specialty: 'Right-arm Raw 156.7 kmph Thunderbolt Fast Bowler'
    }
  },
  {
    id: 'p34',
    name: 'Phil Salt',
    role: 'Wicketkeeper',
    nationality: 'England',
    isOverseas: true,
    basePrice: 150,
    imageURL: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 21,
      runs: 653,
      strikeRate: 175.5,
      wickets: 0,
      economy: 0,
      specialty: 'Right-hand High Strike-Rate Opener & Dynamic WK'
    }
  },
  {
    id: 'p35',
    name: 'Varun Chakravarthy',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 150,
    imageURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 70,
      runs: 27,
      strikeRate: 60.0,
      wickets: 83,
      economy: 7.56,
      specialty: 'Right-arm Mystery Spin | 7 Variations in One Over'
    }
  },
  {
    id: 'p36',
    name: 'Liam Livingstone',
    role: 'All-Rounder',
    nationality: 'England',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 39,
      runs: 939,
      strikeRate: 162.5,
      wickets: 11,
      economy: 8.9,
      specialty: 'Right-hand 117-meter Monster Sixer & Off/Leg Spin'
    }
  },
  {
    id: 'p37',
    name: 'Shivam Dube',
    role: 'All-Rounder',
    nationality: 'India',
    isOverseas: false,
    basePrice: 150,
    imageURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 65,
      runs: 1502,
      strikeRate: 158.4,
      wickets: 5,
      economy: 9.8,
      specialty: 'Left-hand Spin Demolisher & Medium Fast'
    }
  },
  {
    id: 'p38',
    name: 'Marcus Stoinis',
    role: 'All-Rounder',
    nationality: 'Australia',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 96,
      runs: 1866,
      strikeRate: 142.1,
      wickets: 43,
      economy: 9.45,
      specialty: 'Right-hand Power All-Rounder & Match Winner'
    }
  },
  {
    id: 'p39',
    name: 'Harshal Patel',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 150,
    imageURL: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 105,
      runs: 235,
      strikeRate: 130.0,
      wickets: 135,
      economy: 8.65,
      specialty: 'Right-arm Dipping Slower Balls & 2-Time Purple Cap Winner'
    }
  },
  {
    id: 'p40',
    name: 'Sam Curran',
    role: 'All-Rounder',
    nationality: 'England',
    isOverseas: true,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 59,
      runs: 883,
      strikeRate: 140.4,
      wickets: 58,
      economy: 9.48,
      specialty: 'Left-arm Swing Bowler & Gritty Lower-Order Batter'
    }
  },

  // --- SET 5: VALUE PICKS, PACERS & SPINNERS ---
  {
    id: 'p41',
    name: 'Sai Sudharsan',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 75, // ₹75 Lakhs
    imageURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 25,
      runs: 1034,
      strikeRate: 139.1,
      wickets: 0,
      economy: 0,
      specialty: 'Left-hand Consistent Top-Order Anchor'
    }
  },
  {
    id: 'p42',
    name: 'Nandre Burger',
    role: 'Bowler',
    nationality: 'South Africa',
    isOverseas: true,
    basePrice: 75,
    imageURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 6,
      runs: 0,
      strikeRate: 0,
      wickets: 7,
      economy: 8.4,
      specialty: 'Left-arm 148+ kmph Aggressive Fast Bowler'
    }
  },
  {
    id: 'p43',
    name: 'Ravi Bishnoi',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 150,
    imageURL: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 66,
      runs: 25,
      strikeRate: 65.0,
      wickets: 63,
      economy: 7.78,
      specialty: 'Right-arm Quick Googlies & Flatter Trajectory'
    }
  },
  {
    id: 'p44',
    name: 'Tristan Stubbs',
    role: 'Batter',
    nationality: 'South Africa',
    isOverseas: true,
    basePrice: 100,
    imageURL: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 18,
      runs: 405,
      strikeRate: 178.4,
      wickets: 3,
      economy: 8.8,
      specialty: 'Right-hand Innovation Specialist & Superb Fielder'
    }
  },
  {
    id: 'p45',
    name: 'T Natarajan',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 100,
    imageURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 61,
      runs: 15,
      strikeRate: 60.0,
      wickets: 67,
      economy: 8.65,
      specialty: 'Left-arm Yorker Machine from Salem'
    }
  },
  {
    id: 'p46',
    name: 'Jake Fraser-McGurk',
    role: 'Batter',
    nationality: 'Australia',
    isOverseas: true,
    basePrice: 100,
    imageURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 9,
      runs: 330,
      strikeRate: 234.0,
      wickets: 0,
      economy: 0,
      specialty: 'Right-hand 230+ Strike-Rate Powerplay Destroyer'
    }
  },
  {
    id: 'p47',
    name: 'Sandeep Sharma',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 75,
    imageURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 127,
      runs: 45,
      strikeRate: 75.0,
      wickets: 137,
      economy: 7.86,
      specialty: 'Right-arm Knuckle Ball & Wide Yorker Maestro'
    }
  },
  {
    id: 'p48',
    name: 'Nitish Kumar Reddy',
    role: 'All-Rounder',
    nationality: 'India',
    isOverseas: false,
    basePrice: 75,
    imageURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 15,
      runs: 303,
      strikeRate: 142.9,
      wickets: 3,
      economy: 9.2,
      specialty: 'Emerging Player of the Season | Hard Hitting All-Rounder'
    }
  },
  {
    id: 'p49',
    name: 'Mohit Sharma',
    role: 'Bowler',
    nationality: 'India',
    isOverseas: false,
    basePrice: 75,
    imageURL: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 112,
      runs: 140,
      strikeRate: 105.0,
      wickets: 132,
      economy: 8.44,
      specialty: 'Right-arm Back-of-the-Hand Slower Ball Veteran'
    }
  },
  {
    id: 'p50',
    name: 'MS Dhoni',
    role: 'Wicketkeeper',
    nationality: 'India',
    isOverseas: false,
    basePrice: 200,
    imageURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    stats: {
      matches: 264,
      runs: 5243,
      strikeRate: 137.5,
      wickets: 0,
      economy: 0,
      specialty: 'Thala | 5-time IPL Trophy Winning Captain & Legendary Finisher'
    }
  }
];
