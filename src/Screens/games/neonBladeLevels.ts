export interface FruitConfig {
  type: string;
  name: string;
  emoji: string;
  color: string;
  rindColor: string;
  pulpColors: string[];
  points: number;
  radius: number;
  maxHits?: number;
  isSpecial?: 'freeze' | 'frenzy' | 'boss';
  isObstacle?: boolean;
}

export const FRUIT_CONFIGS: Record<string, FruitConfig> = {
  watermelon: {
    type: 'watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    color: '#EF4444',
    rindColor: '#10B981',
    pulpColors: ['#EF4444', '#DC2626', '#1E1B4B'], // Red juice + black seed particles
    points: 10,
    radius: 34,
  },
  banana: {
    type: 'banana',
    name: 'Banana',
    emoji: '🍌',
    color: '#FACC15',
    rindColor: '#EAB308',
    pulpColors: ['#FEF08A', '#FACC15', '#CA8A04'],
    points: 12,
    radius: 32,
  },
  apple: {
    type: 'apple',
    name: 'Red Apple',
    emoji: '🍎',
    color: '#DC2626',
    rindColor: '#991B1B',
    pulpColors: ['#FEF2F2', '#DC2626', '#7F1D1D'],
    points: 14,
    radius: 30,
  },
  orange: {
    type: 'orange',
    name: 'Citrus Orange',
    emoji: '🍊',
    color: '#F97316',
    rindColor: '#EA580C',
    pulpColors: ['#FB923C', '#F97316', '#C2410C'],
    points: 15,
    radius: 31,
  },
  strawberry: {
    type: 'strawberry',
    name: 'Neon Strawberry',
    emoji: '🍓',
    color: '#F43F5E',
    rindColor: '#10B981',
    pulpColors: ['#FDA4AF', '#F43F5E', '#BE123C'],
    points: 18,
    radius: 26,
  },
  pineapple: {
    type: 'pineapple',
    name: 'Golden Pineapple',
    emoji: '🍍',
    color: '#F59E0B',
    rindColor: '#D97706',
    pulpColors: ['#FDE68A', '#F59E0B', '#B45309'],
    points: 20,
    radius: 36,
  },
  grapes: {
    type: 'grapes',
    name: 'Cosmic Grapes',
    emoji: '🍇',
    color: '#8B5CF6',
    rindColor: '#6D28D9',
    pulpColors: ['#C4B5FD', '#8B5CF6', '#5B21B6'],
    points: 22,
    radius: 28,
  },
  kiwi: {
    type: 'kiwi',
    name: 'Cyber Kiwi',
    emoji: '🥝',
    color: '#22C55E',
    rindColor: '#15803D',
    pulpColors: ['#86EFAC', '#22C55E', '#14532D', '#0F172A'], // Green pulp + black seeds
    points: 25,
    radius: 27,
  },
  peach: {
    type: 'peach',
    name: 'Juicy Peach',
    emoji: '🍑',
    color: '#FB923C',
    rindColor: '#F43F5E',
    pulpColors: ['#FED7AA', '#FB923C', '#EA580C'],
    points: 24,
    radius: 31,
  },
  mango: {
    type: 'mango',
    name: 'Tropical Mango',
    emoji: '🥭',
    color: '#FBBF24',
    rindColor: '#EA580C',
    pulpColors: ['#FEF08A', '#FBBF24', '#D97706'],
    points: 26,
    radius: 33,
  },
  lemon: {
    type: 'lemon',
    name: 'Zesty Lemon',
    emoji: '🍋',
    color: '#FDE047',
    rindColor: '#EAB308',
    pulpColors: ['#FEF9C3', '#FDE047', '#CA8A04'],
    points: 16,
    radius: 29,
  },
  coconut: {
    type: 'coconut',
    name: 'Armored Coconut',
    emoji: '🥥',
    color: '#F8FAFC',
    rindColor: '#78716C',
    pulpColors: ['#FFFFFF', '#E2E8F0', '#78716C'],
    points: 50,
    radius: 33,
    maxHits: 2,
  },
  freeze: {
    type: 'freeze',
    name: 'Freeze Melon',
    emoji: '❄️',
    color: '#38BDF8',
    rindColor: '#0284C7',
    pulpColors: ['#BAE6FD', '#38BDF8', '#0284C7', '#FFFFFF'],
    points: 30,
    radius: 33,
    isSpecial: 'freeze',
  },
  frenzy: {
    type: 'frenzy',
    name: 'Frenzy Dragonfruit',
    emoji: '🐉',
    color: '#EC4899',
    rindColor: '#8B5CF6',
    pulpColors: ['#FCE7F3', '#EC4899', '#BE185D', '#8B5CF6'],
    points: 40,
    radius: 35,
    isSpecial: 'frenzy',
  },
  titan: {
    type: 'titan',
    name: 'Titan Watermelon',
    emoji: '👑',
    color: '#F43F5E',
    rindColor: '#10B981',
    pulpColors: ['#FDA4AF', '#F43F5E', '#E11D48', '#FBBF24'],
    points: 500,
    radius: 58,
    maxHits: 12,
    isSpecial: 'boss',
  },
  bomb: {
    type: 'bomb',
    name: 'Plasma Bomb',
    emoji: '💣',
    color: '#EF4444',
    rindColor: '#1E1B4B',
    pulpColors: ['#EF4444', '#DC2626', '#450A0A'],
    points: 0,
    radius: 29,
    isObstacle: true,
  },
  spike: {
    type: 'spike',
    name: 'Laser Spike',
    emoji: '⚙️',
    color: '#F59E0B',
    rindColor: '#78716C',
    pulpColors: ['#FDE68A', '#F59E0B'],
    points: 0,
    radius: 30,
    isObstacle: true,
  },
};

export interface BladeLevel {
  id: number;
  title: string;
  dojo: string;
  targetSlices: number;
  timeLimit: number;
  allowedFruits: string[];
  bombChance: number;
  spikeCount: number;
  hasGhostFruits?: boolean;
  bossType?: string;
  lore: string;
}

export const BLADE_LEVELS: BladeLevel[] = [
  // --- DOJO 1: The Orchard Gate (Levels 1 - 10) ---
  { id: 1, title: 'First Strike', dojo: 'The Orchard Gate', targetSlices: 15, timeLimit: 40, allowedFruits: ['watermelon', 'banana'], bombChance: 0.12, spikeCount: 0, lore: 'Learn the katana swipe. Slice 15 fruits and avoid plasma bombs!' },
  { id: 2, title: 'Citrus & Apples', dojo: 'The Orchard Gate', targetSlices: 18, timeLimit: 40, allowedFruits: ['apple', 'orange', 'watermelon'], bombChance: 0.14, spikeCount: 0, lore: 'Faster parabolic arcs with incoming bombs. Slice 18 fruits.' },
  { id: 3, title: 'Tropical Bounty', dojo: 'The Orchard Gate', targetSlices: 22, timeLimit: 38, allowedFruits: ['pineapple', 'mango', 'banana'], bombChance: 0.16, spikeCount: 0, lore: 'Tropical fruits fly higher. Build up combos without hitting bombs.' },
  { id: 4, title: 'Berry & Peach Blitz', dojo: 'The Orchard Gate', targetSlices: 25, timeLimit: 38, allowedFruits: ['strawberry', 'peach', 'grapes'], bombChance: 0.18, spikeCount: 0, lore: 'Compact berries and live bombs require precise slashes.' },
  { id: 5, title: 'First Plasma Hazard', dojo: 'The Orchard Gate', targetSlices: 28, timeLimit: 35, allowedFruits: ['watermelon', 'orange', 'kiwi'], bombChance: 0.20, spikeCount: 0, lore: 'Higher bomb density! Curve your blade around them.' },
  { id: 6, title: 'Lemon Zest Combos', dojo: 'The Orchard Gate', targetSlices: 30, timeLimit: 35, allowedFruits: ['lemon', 'apple', 'banana'], bombChance: 0.20, spikeCount: 0, lore: 'Slice multiple fruits in a single stroke for bonus combos.' },
  { id: 7, title: 'Grape & Kiwi Crossfire', dojo: 'The Orchard Gate', targetSlices: 32, timeLimit: 35, allowedFruits: ['grapes', 'kiwi', 'pineapple', 'strawberry'], bombChance: 0.22, spikeCount: 0, lore: 'Fast arcs with live bombs mixed in. Keep your eyes sharp.' },
  { id: 8, title: 'Glacial Awakening', dojo: 'The Orchard Gate', targetSlices: 35, timeLimit: 35, allowedFruits: ['watermelon', 'mango', 'freeze'], bombChance: 0.22, spikeCount: 0, lore: 'Slice the Freeze Melon to trigger slow-motion bullet time!' },
  { id: 9, title: 'Dragon Storm', dojo: 'The Orchard Gate', targetSlices: 36, timeLimit: 35, allowedFruits: ['orange', 'peach', 'frenzy'], bombChance: 0.24, spikeCount: 0, lore: 'Strike the Frenzy Dragonfruit to unleash a chaotic fruit rain!' },
  { id: 10, title: 'Mini-Boss: Giant Melon', dojo: 'The Orchard Gate', targetSlices: 30, timeLimit: 35, allowedFruits: ['watermelon', 'strawberry', 'titan'], bombChance: 0.20, spikeCount: 0, bossType: 'titan', lore: 'BOSS BATTLE: A giant Titan Melon appears! Rapidly slice it 12 times!' },

  // --- DOJO 2: Hazard Alley (Levels 11 - 20) ---
  { id: 11, title: 'Hazard Alley Gate', dojo: 'Hazard Alley', targetSlices: 34, timeLimit: 35, allowedFruits: ['apple', 'lemon', 'banana'], bombChance: 0.24, spikeCount: 0, lore: 'Bomb density increases significantly. Watch your swing.' },
  { id: 12, title: 'Rotating Spike Intro', dojo: 'Hazard Alley', targetSlices: 35, timeLimit: 35, allowedFruits: ['orange', 'pineapple', 'grapes'], bombChance: 0.22, spikeCount: 1, lore: 'A rotating laser spike hovers mid-air! Avoid touching it.' },
  { id: 13, title: 'Spike & Minefield', dojo: 'Hazard Alley', targetSlices: 36, timeLimit: 35, allowedFruits: ['watermelon', 'kiwi', 'strawberry'], bombChance: 0.25, spikeCount: 1, lore: 'Fruits fly behind the rotating spike while bombs fall on the edges.' },
  { id: 14, title: 'Frozen Squeeze', dojo: 'Hazard Alley', targetSlices: 38, timeLimit: 35, allowedFruits: ['mango', 'peach', 'freeze'], bombChance: 0.24, spikeCount: 1, lore: 'Freeze time to safely navigate the hazard corridor.' },
  { id: 15, title: 'Twin Laser Spikes', dojo: 'Hazard Alley', targetSlices: 38, timeLimit: 35, allowedFruits: ['apple', 'grapes', 'banana'], bombChance: 0.25, spikeCount: 2, lore: 'Two rotating laser blades now patrol the airspace.' },
  { id: 16, title: 'High Speed Cascade', dojo: 'Hazard Alley', targetSlices: 40, timeLimit: 32, allowedFruits: ['kiwi', 'lemon', 'watermelon'], bombChance: 0.26, spikeCount: 1, lore: 'Fruits launch with higher momentum. Rapid reflex test.' },
  { id: 17, title: 'Dragon Storm II', dojo: 'Hazard Alley', targetSlices: 42, timeLimit: 35, allowedFruits: ['orange', 'strawberry', 'frenzy'], bombChance: 0.26, spikeCount: 1, lore: 'Trigger the dragonfruit to slice 20 fruits in 5 chaotic seconds!' },
  { id: 18, title: 'Citrus Minefield', dojo: 'Hazard Alley', targetSlices: 42, timeLimit: 32, allowedFruits: ['lemon', 'orange', 'pineapple', 'freeze'], bombChance: 0.28, spikeCount: 2, lore: 'Twin spikes and bombs leave only narrow slicing windows.' },
  { id: 19, title: 'Zero Mercy', dojo: 'Hazard Alley', targetSlices: 44, timeLimit: 32, allowedFruits: ['peach', 'banana', 'kiwi'], bombChance: 0.30, spikeCount: 2, lore: 'Intense crossfire wave. Keep your blade clean.' },
  { id: 20, title: 'Boss: Iron Titan', dojo: 'Hazard Alley', targetSlices: 35, timeLimit: 35, allowedFruits: ['watermelon', 'titan', 'freeze'], bombChance: 0.24, spikeCount: 1, bossType: 'titan', lore: 'BOSS BATTLE: The Titan returns guarded by a spinning laser spike!' },

  // --- DOJO 3: Cybernetics & Shields (Levels 21 - 30) ---
  { id: 21, title: 'Armor Breaker', dojo: 'Cybernetics & Shields', targetSlices: 40, timeLimit: 35, allowedFruits: ['watermelon', 'coconut'], bombChance: 0.26, spikeCount: 1, lore: 'Armored Coconuts introduced! Requires 2 rapid consecutive strikes.' },
  { id: 22, title: 'Steel & Apples', dojo: 'Cybernetics & Shields', targetSlices: 42, timeLimit: 35, allowedFruits: ['apple', 'coconut', 'orange'], bombChance: 0.27, spikeCount: 1, lore: 'Mix of single-hit apples and heavy double-hit armored coconuts.' },
  { id: 23, title: 'Ghost Protocol', dojo: 'Cybernetics & Shields', targetSlices: 42, timeLimit: 35, allowedFruits: ['grapes', 'mango', 'kiwi'], bombChance: 0.28, spikeCount: 1, hasGhostFruits: true, lore: 'Ghost Fruits phase between visible and invisible! Time your slash.' },
  { id: 24, title: 'Shielded Dragon', dojo: 'Cybernetics & Shields', targetSlices: 44, timeLimit: 35, allowedFruits: ['coconut', 'peach', 'frenzy'], bombChance: 0.28, spikeCount: 1, lore: 'Frenzy storm populated with armored shells and sweet peaches.' },
  { id: 25, title: 'Ghost & Spike', dojo: 'Cybernetics & Shields', targetSlices: 44, timeLimit: 32, allowedFruits: ['banana', 'coconut', 'lemon'], bombChance: 0.29, spikeCount: 2, hasGhostFruits: true, lore: 'Phasing targets weaving between dual rotating spikes.' },
  { id: 26, title: 'Heavy Metal Orchard', dojo: 'Cybernetics & Shields', targetSlices: 45, timeLimit: 35, allowedFruits: ['coconut', 'freeze', 'strawberry'], bombChance: 0.29, spikeCount: 1, lore: 'Time freeze is crucial to deliver double slashes to coconuts.' },
  { id: 27, title: 'Crossfire Matrix', dojo: 'Cybernetics & Shields', targetSlices: 46, timeLimit: 32, allowedFruits: ['watermelon', 'coconut', 'kiwi'], bombChance: 0.30, spikeCount: 2, lore: 'Fast-paced armored wave with high bomb frequency.' },
  { id: 28, title: 'Ghost Minefield', dojo: 'Cybernetics & Shields', targetSlices: 46, timeLimit: 32, allowedFruits: ['strawberry', 'orange', 'pineapple'], bombChance: 0.32, spikeCount: 1, hasGhostFruits: true, lore: 'Invisible targets suddenly appearing right next to live bombs!' },
  { id: 29, title: 'Double Shell Gauntlet', dojo: 'Cybernetics & Shields', targetSlices: 48, timeLimit: 32, allowedFruits: ['coconut', 'grapes', 'frenzy'], bombChance: 0.31, spikeCount: 2, lore: 'Pure multi-slash endurance before the Cyber Titan.' },
  { id: 30, title: 'Boss: Cyber Titan', dojo: 'Cybernetics & Shields', targetSlices: 40, timeLimit: 35, allowedFruits: ['coconut', 'titan', 'freeze'], bombChance: 0.26, spikeCount: 2, bossType: 'titan', lore: 'BOSS BATTLE: Cyber Titan Melon requiring 15 ultra-rapid slashes!' },

  // --- DOJO 4: The Void Tempest (Levels 31 - 40) ---
  { id: 31, title: 'Parabolic Tempest', dojo: 'The Void Tempest', targetSlices: 46, timeLimit: 32, allowedFruits: ['mango', 'pineapple', 'apple'], bombChance: 0.32, spikeCount: 2, lore: 'Fruits launched diagonally from both left and right edges.' },
  { id: 32, title: 'Dark Shroud', dojo: 'The Void Tempest', targetSlices: 48, timeLimit: 30, allowedFruits: ['strawberry', 'coconut', 'freeze'], bombChance: 0.33, spikeCount: 2, hasGhostFruits: true, lore: 'Night mode styling with glowing neon cores and phasing targets.' },
  { id: 33, title: 'Rapid Fuse Trial', dojo: 'The Void Tempest', targetSlices: 48, timeLimit: 30, allowedFruits: ['watermelon', 'lemon', 'frenzy'], bombChance: 0.35, spikeCount: 2, lore: 'High bomb volume. Swift horizontal strokes are essential.' },
  { id: 34, title: 'Tri-Spike Grid', dojo: 'The Void Tempest', targetSlices: 48, timeLimit: 30, allowedFruits: ['peach', 'kiwi', 'freeze'], bombChance: 0.32, spikeCount: 3, lore: 'Three rotating laser spikes form a lethal triangle barrier.' },
  { id: 35, title: 'Glacial Passage', dojo: 'The Void Tempest', targetSlices: 50, timeLimit: 32, allowedFruits: ['coconut', 'grapes', 'freeze'], bombChance: 0.33, spikeCount: 3, lore: 'Use Freeze Melons to slow down the 3 spinning spikes.' },
  { id: 36, title: 'Void Frenzy', dojo: 'The Void Tempest', targetSlices: 52, timeLimit: 32, allowedFruits: ['orange', 'frenzy', 'coconut'], bombChance: 0.34, spikeCount: 2, lore: 'Chaotic storm of armored fruits and speeding oranges.' },
  { id: 37, title: 'Ghost Storm', dojo: 'The Void Tempest', targetSlices: 50, timeLimit: 30, allowedFruits: ['strawberry', 'banana', 'mango'], bombChance: 0.35, spikeCount: 2, hasGhostFruits: true, lore: 'Flickering targets crossing dense bomb trajectories.' },
  { id: 38, title: 'High Gravity Well', dojo: 'The Void Tempest', targetSlices: 52, timeLimit: 28, allowedFruits: ['coconut', 'pineapple', 'apple'], bombChance: 0.34, spikeCount: 2, lore: 'Gravity is amplified! Targets fall twice as fast.' },
  { id: 39, title: 'Threshold of Chaos', dojo: 'The Void Tempest', targetSlices: 54, timeLimit: 30, allowedFruits: ['watermelon', 'peach', 'freeze'], bombChance: 0.36, spikeCount: 3, lore: 'Penultimate trial before the Void Dragon.' },
  { id: 40, title: 'Boss: Void Dragon Titan', dojo: 'The Void Tempest', targetSlices: 45, timeLimit: 35, allowedFruits: ['titan', 'frenzy', 'freeze'], bombChance: 0.28, spikeCount: 2, bossType: 'titan', lore: 'BOSS BATTLE: Void Titan requiring 18 strikes amidst a raging storm!' },

  // --- DOJO 5: The Grandmaster Trial (Levels 41 - 50) ---
  { id: 41, title: 'The Obsidian Gate', dojo: 'The Grandmaster Trial', targetSlices: 52, timeLimit: 30, allowedFruits: ['watermelon', 'coconut', 'freeze', 'grapes'], bombChance: 0.36, spikeCount: 2, hasGhostFruits: true, lore: 'Armored, ghost, and freeze targets simultaneously active.' },
  { id: 42, title: 'Hurricane Wave', dojo: 'The Grandmaster Trial', targetSlices: 55, timeLimit: 30, allowedFruits: ['pineapple', 'kiwi', 'frenzy'], bombChance: 0.36, spikeCount: 3, lore: 'Non-stop salvos across the tri-spike minefield.' },
  { id: 43, title: 'Blind Precision', dojo: 'The Grandmaster Trial', targetSlices: 54, timeLimit: 28, allowedFruits: ['coconut', 'strawberry', 'lemon'], bombChance: 0.38, spikeCount: 2, hasGhostFruits: true, lore: 'Razor-thin slice windows between high-frequency bombs.' },
  { id: 44, title: 'Quad Spike Hell', dojo: 'The Grandmaster Trial', targetSlices: 56, timeLimit: 30, allowedFruits: ['watermelon', 'mango', 'freeze'], bombChance: 0.34, spikeCount: 4, lore: 'Four spinning laser hazards guarding the four quadrants.' },
  { id: 45, title: 'Temporal Surge', dojo: 'The Grandmaster Trial', targetSlices: 58, timeLimit: 28, allowedFruits: ['coconut', 'frenzy', 'kiwi'], bombChance: 0.36, spikeCount: 3, lore: 'Fastest launch speed in the entire campaign.' },
  { id: 46, title: 'The Zen Blade', dojo: 'The Grandmaster Trial', targetSlices: 60, timeLimit: 28, allowedFruits: ['watermelon', 'coconut', 'apple'], bombChance: 0.40, spikeCount: 3, lore: 'Maximum bomb density. Pure flow state concentration.' },
  { id: 47, title: 'Ghost Hurricane', dojo: 'The Grandmaster Trial', targetSlices: 60, timeLimit: 30, allowedFruits: ['strawberry', 'orange', 'coconut'], bombChance: 0.38, spikeCount: 3, hasGhostFruits: true, lore: 'Phasing targets weaving through a quad-spike barrier.' },
  { id: 48, title: 'Supernova Precursor', dojo: 'The Grandmaster Trial', targetSlices: 62, timeLimit: 28, allowedFruits: ['peach', 'coconut', 'frenzy', 'freeze'], bombChance: 0.38, spikeCount: 3, lore: 'Master all power-ups to clear 62 targets.' },
  { id: 49, title: 'Penultimate Symphony', dojo: 'The Grandmaster Trial', targetSlices: 65, timeLimit: 30, allowedFruits: ['watermelon', 'coconut', 'pineapple', 'grapes'], bombChance: 0.40, spikeCount: 3, hasGhostFruits: true, lore: 'The final barrier before the Cosmic Supernova Titan.' },
  { id: 50, title: 'Cosmic Supernova Titan', dojo: 'The Grandmaster Trial', targetSlices: 50, timeLimit: 35, allowedFruits: ['titan', 'freeze', 'frenzy'], bombChance: 0.30, spikeCount: 3, bossType: 'titan', lore: 'GRAND FINALE: The Colossal Supernova Watermelon! 25 rapid slashes unlocks the Secret 4K Blade Master Wallpaper!' },
];
