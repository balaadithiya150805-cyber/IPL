// Recent IPL player pool represented across the 2023-2026 seasons.
// Season metadata is kept on each record so the API can expose the source window.
const RECENT_IPL_SEASONS = [2023, 2024, 2025, 2026];
const defaultImage = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80';

const player = ({ id, name, role, nationality, basePrice, matches, runs, strikeRate, wickets, economy, specialty }) => ({
  id,
  name,
  role,
  nationality,
  isOverseas: nationality !== 'India',
  basePrice,
  imageURL: defaultImage,
  seasons: RECENT_IPL_SEASONS,
  stats: { matches, runs, strikeRate, wickets, economy, specialty }
});

export const RECENT_IPL_PLAYERS = [
  player({ id: 'recent-01', name: 'Ishan Kishan', role: 'Wicketkeeper', nationality: 'India', basePrice: 150, matches: 105, runs: 2644, strikeRate: 135.0, wickets: 0, economy: 0, specialty: 'Left-hand attacking opener and wicketkeeper' }),
  player({ id: 'recent-02', name: 'Tilak Varma', role: 'Batter', nationality: 'India', basePrice: 150, matches: 45, runs: 1200, strikeRate: 145.0, wickets: 1, economy: 8.0, specialty: 'Left-hand middle-order batter with range' }),
  player({ id: 'recent-03', name: 'Rajat Patidar', role: 'Batter', nationality: 'India', basePrice: 100, matches: 30, runs: 799, strikeRate: 158.0, wickets: 0, economy: 0, specialty: 'Right-hand top-order stroke player' }),
  player({ id: 'recent-04', name: 'Faf du Plessis', role: 'Batter', nationality: 'South Africa', basePrice: 150, matches: 145, runs: 4571, strikeRate: 136.0, wickets: 0, economy: 0, specialty: 'Experienced opener and fielding leader' }),
  player({ id: 'recent-05', name: 'Devon Conway', role: 'Batter', nationality: 'New Zealand', basePrice: 150, matches: 24, runs: 924, strikeRate: 141.0, wickets: 0, economy: 0, specialty: 'Left-hand anchor with powerplay control' }),
  player({ id: 'recent-06', name: 'Cameron Green', role: 'All-Rounder', nationality: 'Australia', basePrice: 200, matches: 28, runs: 707, strikeRate: 139.0, wickets: 16, economy: 9.0, specialty: 'Tall seam-bowling all-rounder and clean striker' }),
  player({ id: 'recent-07', name: 'Daryl Mitchell', role: 'All-Rounder', nationality: 'New Zealand', basePrice: 150, matches: 20, runs: 373, strikeRate: 142.0, wickets: 2, economy: 10.0, specialty: 'Right-hand middle-order power all-rounder' }),
  player({ id: 'recent-08', name: 'Will Jacks', role: 'All-Rounder', nationality: 'England', basePrice: 150, matches: 18, runs: 500, strikeRate: 171.0, wickets: 6, economy: 9.0, specialty: 'Explosive opener and off-spin option' }),
  player({ id: 'recent-09', name: 'Tim David', role: 'All-Rounder', nationality: 'Singapore', basePrice: 150, matches: 38, runs: 700, strikeRate: 180.0, wickets: 0, economy: 0, specialty: 'Right-hand finishing specialist' }),
  player({ id: 'recent-10', name: 'Dinesh Karthik', role: 'Wicketkeeper', nationality: 'India', basePrice: 100, matches: 257, runs: 4842, strikeRate: 135.0, wickets: 0, economy: 0, specialty: 'Veteran wicketkeeper and late-innings finisher' }),
  player({ id: 'recent-11', name: 'Quinton de Kock', role: 'Wicketkeeper', nationality: 'South Africa', basePrice: 150, matches: 107, runs: 3157, strikeRate: 135.0, wickets: 0, economy: 0, specialty: 'Left-hand wicketkeeper-opener' }),
  player({ id: 'recent-12', name: 'Venkatesh Iyer', role: 'All-Rounder', nationality: 'India', basePrice: 125, matches: 50, runs: 1200, strikeRate: 135.0, wickets: 3, economy: 9.5, specialty: 'Left-hand top-order batter and seam option' }),
  player({ id: 'recent-13', name: 'Washington Sundar', role: 'All-Rounder', nationality: 'India', basePrice: 100, matches: 60, runs: 400, strikeRate: 130.0, wickets: 37, economy: 7.5, specialty: 'Powerplay off-spinner and lower-order batter' }),
  player({ id: 'recent-14', name: 'Rahul Tewatia', role: 'All-Rounder', nationality: 'India', basePrice: 100, matches: 100, runs: 1200, strikeRate: 130.0, wickets: 32, economy: 8.0, specialty: 'Left-hand finisher and leg-spin utility player' }),
  player({ id: 'recent-15', name: 'Krunal Pandya', role: 'All-Rounder', nationality: 'India', basePrice: 100, matches: 130, runs: 1600, strikeRate: 130.0, wickets: 90, economy: 7.5, specialty: 'Left-arm spin and middle-order all-rounder' }),
  player({ id: 'recent-16', name: 'Bhuvneshwar Kumar', role: 'Bowler', nationality: 'India', basePrice: 100, matches: 180, runs: 300, strikeRate: 100.0, wickets: 185, economy: 7.4, specialty: 'Swing bowler with new-ball control' }),
  player({ id: 'recent-17', name: 'Deepak Chahar', role: 'Bowler', nationality: 'India', basePrice: 100, matches: 85, runs: 400, strikeRate: 130.0, wickets: 80, economy: 8.0, specialty: 'New-ball swing bowler and lower-order hitter' }),
  player({ id: 'recent-18', name: 'Avesh Khan', role: 'Bowler', nationality: 'India', basePrice: 100, matches: 65, runs: 35, strikeRate: 75.0, wickets: 70, economy: 9.0, specialty: 'Right-arm fast bowler for middle and death overs' }),
  player({ id: 'recent-19', name: 'Mukesh Kumar', role: 'Bowler', nationality: 'India', basePrice: 75, matches: 35, runs: 15, strikeRate: 60.0, wickets: 30, economy: 9.0, specialty: 'Right-arm seam bowler with death-over variations' }),
  player({ id: 'recent-20', name: 'Noor Ahmad', role: 'Bowler', nationality: 'Afghanistan', basePrice: 100, matches: 30, runs: 25, strikeRate: 80.0, wickets: 35, economy: 8.0, specialty: 'Left-arm wrist spinner and middle-over wicket-taker' }),
  player({ id: 'recent-21', name: 'Fazalhaq Farooqi', role: 'Bowler', nationality: 'Afghanistan', basePrice: 75, matches: 18, runs: 10, strikeRate: 60.0, wickets: 20, economy: 8.5, specialty: 'Left-arm swing and death-overs pace' }),
  player({ id: 'recent-22', name: 'Gerald Coetzee', role: 'Bowler', nationality: 'South Africa', basePrice: 100, matches: 15, runs: 10, strikeRate: 60.0, wickets: 20, economy: 9.0, specialty: 'Right-arm express pace and aggressive lengths' }),
  player({ id: 'recent-23', name: 'Shahrukh Khan', role: 'Batter', nationality: 'India', basePrice: 100, matches: 50, runs: 700, strikeRate: 150.0, wickets: 0, economy: 0, specialty: 'Right-hand power finisher' }),
  player({ id: 'recent-24', name: 'Manish Pandey', role: 'Batter', nationality: 'India', basePrice: 75, matches: 170, runs: 3800, strikeRate: 120.0, wickets: 0, economy: 0, specialty: 'Experienced right-hand middle-order batter' })
];
