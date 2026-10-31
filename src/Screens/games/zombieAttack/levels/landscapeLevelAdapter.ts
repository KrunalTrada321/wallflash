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
  const groundPlats = raw.platforms.filter(p => p.type === 'ground');
  const hasMultipleGround = groundPlats.length > 1;

  const playerX = mapX(raw.playerPos.x);

  // True chasm levels have spikes in obstacles or 'chasm' in title/description (e.g. Level 4, Level 31)
  const isChasmLevel =
    raw.obstacles.some(o => o.type === 'spikes') ||
    (raw.title && raw.title.toLowerCase().includes('chasm')) ||
    (raw.description && raw.description.toLowerCase().includes('chasm'));

  const shouldSplitGround = hasMultipleGround && groundPlats.length === 2 && isChasmLevel;

  let pitLeft = 0;
  let pitRight = 0;
  const targetPitGap = 75; // Fair, athletic, natural leap gap
  let leftGroundId = '';
  let rightGroundId = '';
  let origPitRight = 0;

  if (shouldSplitGround) {
    const sortedGround = [...groundPlats].sort((a, b) => a.x - b.x);
    leftGroundId = sortedGround[0].id;
    rightGroundId = sortedGround[1].id;
    const origPitLeft = sortedGround[0].x + sortedGround[0].width / 2;
    origPitRight = sortedGround[1].x - sortedGround[1].width / 2;
    pitLeft = Math.max(playerX + 175, mapX(origPitLeft));
    pitRight = pitLeft + targetPitGap;
  }

  let addedMainGround = false;
  const platforms: PlatformConfig[] = [];

  raw.platforms.forEach(p => {
    // If not a true chasm level, unify ground platforms into a continuous solid floor (no dig/pit!)
    if (p.type === 'ground') {
      if (!shouldSplitGround) {
        if (!addedMainGround) {
          addedMainGround = true;
          const height = 90;
          platforms.push({
            ...p,
            id: 'p_ground_main',
            x: landscapeWorldWidth / 2,
            y: LANDSCAPE_GROUND_Y + height / 2,
            width: Math.max(landscapeWorldWidth + 400, 1800),
            height,
          });
        }
        return;
      }

      if (p.id === leftGroundId) {
        const height = 90;
        const width = pitLeft - (-200);
        platforms.push({
          ...p,
          x: (-200 + pitLeft) / 2,
          y: LANDSCAPE_GROUND_Y + height / 2,
          width,
          height,
        });
        return;
      } else if (p.id === rightGroundId) {
        const height = 90;
        const width = landscapeWorldWidth + 300 - pitRight;
        platforms.push({
          ...p,
          x: (pitRight + landscapeWorldWidth + 300) / 2,
          y: LANDSCAPE_GROUND_Y + height / 2,
          width,
          height,
        });
        return;
      }
    }

    // Floating, pillar, or elevated platforms
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

    platforms.push({
      ...p,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      movingPath: newMovingPath,
    });
  });

  // 2. Determine Ground Surface Under Player
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
    if (isSpikes && shouldSplitGround) {
      return {
        ...o,
        x: pitLeft + targetPitGap / 2,
        y: LANDSCAPE_GROUND_Y + 14,
        width: targetPitGap,
        height: 24,
      };
    }
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

  // 4. Transform Zombies with Progressive Level Difficulty
  const levelId = raw.id;
  // Continuous smooth difficulty ramp: 0.0 at level 1 up to 1.0 at level 50
  const levelProgress = Math.min(1.0, Math.max(0, (levelId - 1) / 49));

  const zombies: ZombieConfig[] = raw.zombies.map(z => {
    let newX = mapX(z.x);
    if (shouldSplitGround && origPitRight > 0) {
      if (z.x >= origPitRight - 20) {
        newX = pitRight + Math.max(30, Math.round((z.x - origPitRight) * scaleX));
      }
    }
    // Align ground zombies directly to ground surface
    let newY = mapY(z.y);
    if (z.type !== 'flying' && z.y >= 530) {
      newY = LANDSCAPE_GROUND_Y - 32; // Body center 32px above ground, so feet touch at 370!
    }

    // Dynamic Speed Scaling:
    // Level 1: calm introduction (~2.2 speed)
    // Level 15: ~2.8 speed
    // Level 30: ~3.4 speed
    // Level 50: ~4.2 - 4.6 horde speed!
    const baseSpeed = z.speed ?? 0.8;
    const speedScalingFactor = 2.4 + levelProgress * 1.6;
    const newSpeed = Math.max(2.0, Number((baseSpeed * speedScalingFactor).toFixed(2)));

    // Dynamic Health & Durability Scaling:
    // As levels increase, tough monsters require 2-3+ arrows (and giants/bosses take sustained fire)
    let scaledHealth = z.health;
    if (scaledHealth === undefined) {
      if (z.type === 'boss') {
        // Boss health: Level 10 (Ch1) = 6, Level 20 = 8, Level 30 = 10, Level 40 = 14, Level 50 = 18
        scaledHealth = Math.min(18, 6 + Math.floor(levelId / 10) * 3);
      } else if (z.type === 'giant') {
        scaledHealth = levelId >= 40 ? 6 : levelId >= 25 ? 5 : 4;
      } else if (z.type === 'armored') {
        scaledHealth = levelId >= 25 ? 3 : 2;
      } else if (z.type === 'flying') {
        scaledHealth = levelId >= 30 ? 2 : 1;
      } else {
        scaledHealth = 1;
      }
    } else {
      // If health was specified in config, apply high-level difficulty bonuses
      if (z.type === 'boss') {
        scaledHealth = Math.max(scaledHealth, 6 + Math.floor(levelId / 10) * 3);
      } else if (z.type === 'giant' && levelId >= 30) {
        scaledHealth = Math.max(scaledHealth, 5);
      } else if (z.type === 'armored' && levelId >= 30) {
        scaledHealth = Math.max(scaledHealth, 3);
      }
    }

    return {
      ...z,
      x: newX,
      y: newY,
      speed: newSpeed,
      health: scaledHealth,
      patrolMin: z.patrolMin !== undefined ? mapX(z.patrolMin) : undefined,
      patrolMax: z.patrolMax !== undefined ? mapX(z.patrolMax) : undefined,
    };
  });

  // 5. Enforce Finite Arrow Limits with Difficulty Scaling:
  // Early levels (1-10): Generous surplus (+4 to +5) for learning
  // Mid & Late levels (11-50): Balanced surplus (+3) ensuring challenging but fair gameplay
  const totalZombieHitsNeeded = zombies.reduce((acc, z) => {
    return acc + (z.health ?? 1);
  }, 0);

  const surplusArrows = levelId <= 10 ? 4 : 3;

  const computedArrowLimit = Math.max(
    typeof raw.arrowLimit === 'number' && raw.arrowLimit > 0 ? raw.arrowLimit : 0,
    totalZombieHitsNeeded + surplusArrows,
    raw.parArrows + 2,
    4
  );

  // 6. Strict Weather/Atmosphere Theme Segregation per User Request:
  // - Flying enemies (cyber laser attack) OR Late Boss (41-50): Hellfire realm (eclipsed blood sun + lava)
  // - Levels 1-10: Light daylight sun + green alpine mountains
  // - Levels 11-20: Dark night with radiant silver moon + slate mountains
  // - Levels 21-30: Sickly toxic emerald moon + biohazard marsh
  // - Levels 31-40: Stormy tempest rain + wet basalt peaks
  const hasFlyingLaserZombies = raw.zombies.some(z => z.type === 'flying');
  const levelThemeWeather: 'clear' | 'night_moon' | 'toxic' | 'rain' | 'snow' | 'hellfire' =
    hasFlyingLaserZombies || levelId >= 41
      ? 'hellfire'
      : levelId <= 10
      ? 'clear'
      : levelId <= 20
      ? 'night_moon'
      : levelId <= 30
      ? 'toxic'
      : 'rain';

  return {
    ...raw,
    worldWidth: landscapeWorldWidth,
    worldHeight: LANDSCAPE_WORLD_HEIGHT,
    playerPos,
    platforms,
    obstacles,
    zombies,
    arrowLimit: computedArrowLimit,
    weather: levelThemeWeather,
  };
}
