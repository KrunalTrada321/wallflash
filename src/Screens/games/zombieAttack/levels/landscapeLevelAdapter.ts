import { LevelConfig, PlatformConfig, ObstacleConfig, ZombieConfig } from '../types/gameTypes';

export const LANDSCAPE_WORLD_HEIGHT = 440;
export const LANDSCAPE_GROUND_Y = 370;
export const PLAYER_FEET_OFFSET = 50; // Feet touch at playerPos.y + PLAYER_FEET_OFFSET

/**
 * Transforms a portrait-authored level into a widescreen landscape level:
 * - Expands horizontal gameplay field for long-range, parabolic archery
 * - Sets world height to 440 for widescreen landscape aspect ratios
 * - Perfectly pins the player's feet onto the grass platform surface (no hovering!)
 * - Correctly scales obstacles, moving platforms, patrol zones, and zombies
 */
export function adaptLevelForLandscape(raw: LevelConfig): LevelConfig {
  const origW = raw.worldWidth;
  const isShortLevel = origW <= 460;
  const scaleX = isShortLevel ? 2.25 : 2.1;
  const landscapeWorldWidth = Math.max(1000, Math.round(origW * scaleX));

  // Player Base X at 160px: Generous margin on the left for slingshot / reverse-pull archery
  const PLAYER_BASE_X = 160;
  const mapX = (x: number): number => {
    if (x <= 75) {
      return Math.round(PLAYER_BASE_X * (x / 75));
    }
    return Math.round(PLAYER_BASE_X + (x - 75) * scaleX);
  };

  const scaleY = (LANDSCAPE_GROUND_Y - 70) / (600 - 180); // ~0.714
  const mapY = (y: number): number => {
    return Math.round(LANDSCAPE_GROUND_Y - (600 - y) * scaleY);
  };

  // 1. Transform Platforms
  const hasMultipleGround = raw.platforms.filter(p => p.type === 'ground').length > 1;

  const platforms: PlatformConfig[] = raw.platforms.map(p => {
    const isSingleMainGround = p.type === 'ground' && !hasMultipleGround;

    if (isSingleMainGround) {
      const height = 90;
      return {
        ...p,
        x: landscapeWorldWidth / 2,
        y: LANDSCAPE_GROUND_Y + height / 2,
        width: Math.max(landscapeWorldWidth + 400, 1800),
        height,
      };
    }

    // Floating, pillar, or split ground (e.g. spike gaps)
    const newWidth = Math.max(28, Math.round(p.width * (p.type === 'pillar' ? 1.1 : scaleX * 0.85)));
    const newHeight = Math.max(20, Math.round(p.height * (p.type === 'pillar' ? scaleY * 1.15 : scaleY)));
    const newX = mapX(p.x);
    const newY = mapY(p.y);

    const newMovingPath = p.movingPath
      ? {
          x1: mapX(p.movingPath.x1),
          y1: mapY(p.movingPath.y1),
          x2: mapX(p.movingPath.x2),
          y2: mapY(p.movingPath.y2),
          speed: p.movingPath.speed * 1.1,
        }
      : undefined;

    return {
      ...p,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      movingPath: newMovingPath,
    };
  });

  // 2. Determine Ground Surface Under Player
  const playerX = mapX(raw.playerPos.x);
  const candidatePlatforms = platforms.filter(p => {
    const left = p.x - p.width / 2;
    const right = p.x + p.width / 2;
    return playerX >= left - 40 && playerX <= right + 40;
  });

  // Ensure platforms under player extend comfortably to the left so player is on solid ground
  candidatePlatforms.forEach(p => {
    const leftEdge = p.x - p.width / 2;
    if (leftEdge > -50 && p.type !== 'pillar') {
      const extraLeft = leftEdge + 120;
      p.width += extraLeft;
      p.x -= extraLeft / 2;
    }
  });

  // Find the highest platform below or at player level
  let playerGroundTop = LANDSCAPE_GROUND_Y;
  if (candidatePlatforms.length > 0) {
    // Sort platforms by top edge ascending (closest to top of screen)
    candidatePlatforms.sort((a, b) => (a.y - a.height / 2) - (b.y - b.height / 2));
    for (const cp of candidatePlatforms) {
      const top = cp.y - cp.height / 2;
      // If candidate platform corresponds to player elevation
      if (raw.playerPos.y <= 420) {
        // High platform (like Level 6)
        playerGroundTop = top;
        break;
      } else if (Math.abs(top - LANDSCAPE_GROUND_Y) < 40) {
        playerGroundTop = top;
        break;
      }
    }
  }

  // Set playerPos.y so player's feet (playerPos.y + 50) rest directly on the platform top!
  const playerPos = {
    x: playerX,
    y: playerGroundTop - PLAYER_FEET_OFFSET,
  };

  // 3. Transform Obstacles (TNT, crates, spikes, portals, gates)
  const obstacles: ObstacleConfig[] = raw.obstacles.map(o => {
    const isSpikes = o.type === 'spikes';
    const newWidth = Math.max(24, Math.round(o.width * (isSpikes ? scaleX : 1.25)));
    const newHeight = Math.max(20, Math.round(o.height * (isSpikes ? 0.9 : 0.85)));
    return {
      ...o,
      x: mapX(o.x),
      y: mapY(o.y),
      width: newWidth,
      height: newHeight,
    };
  });

  // 4. Transform Zombies
  const zombies: ZombieConfig[] = raw.zombies.map(z => {
    const newX = mapX(z.x);
    // Align ground zombies directly to ground surface
    let newY = mapY(z.y);
    if (z.type !== 'flying' && z.y >= 530) {
      newY = LANDSCAPE_GROUND_Y - 32; // Body center 32px above ground, so feet touch at 370!
    }

    const baseSpeed = z.speed ?? 0.8;
    // Chapter Difficulty Scaling: higher chapters ramp up speed & aggressiveness
    const chapterDifficultyMultiplier = 1 + (raw.chapter - 1) * 0.14;
    const newSpeed = Math.max(2.2, Number((baseSpeed * 2.8 * chapterDifficultyMultiplier).toFixed(2)));

    return {
      ...z,
      x: newX,
      y: newY,
      speed: newSpeed,
      patrolMin: z.patrolMin !== undefined ? mapX(z.patrolMin) : undefined,
      patrolMax: z.patrolMax !== undefined ? mapX(z.patrolMax) : undefined,
    };
  });

  // 5. Enforce Strict Finite Arrow Limits & Guarantee Every Level is 100% Winnable!
  const totalZombieHitsNeeded = raw.zombies.reduce((acc, z) => {
    const defaultHits = z.type === 'boss' ? 8 : z.type === 'giant' ? 4 : z.type === 'armored' ? 2 : 1;
    return acc + (z.health ?? defaultHits);
  }, 0);

  const computedArrowLimit = Math.max(
    typeof raw.arrowLimit === 'number' && raw.arrowLimit > 0 ? raw.arrowLimit : 0,
    totalZombieHitsNeeded + 2,
    raw.parArrows + 2,
    4
  );

  const defaultWeather: 'clear' | 'rain' | 'snow' | 'hellfire' | 'toxic' =
    raw.weather ??
    (raw.chapter === 2
      ? 'rain'
      : raw.chapter === 3
      ? 'snow'
      : raw.chapter === 4
      ? 'hellfire'
      : raw.chapter === 5
      ? 'toxic'
      : 'clear');

  return {
    ...raw,
    worldWidth: landscapeWorldWidth,
    worldHeight: LANDSCAPE_WORLD_HEIGHT,
    playerPos,
    platforms,
    obstacles,
    zombies,
    arrowLimit: computedArrowLimit,
    weather: defaultWeather,
  };
}
