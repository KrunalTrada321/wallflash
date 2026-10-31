// ─────────────────────────────────────────────────────────────────────────────
//  all50HookLevels.ts
//  Complete 50 Progressive Levels with Collectible Power-Ups & Quantum Gates
//  Mechanics: Jetpacks, Slow-Mo, Hyper Speed, Coin Magnets, Saws, Lasers, Portals
// ─────────────────────────────────────────────────────────────────────────────

import { HookLevelConfig } from '../types/stickmanHookTypes';

export const ALL_50_HOOK_LEVELS: HookLevelConfig[] = [
  {
    "id": 1,
    "title": "Rooftop Awakening",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 2400,
    "deathY": 820,
    "parTimeSeconds": 17,
    "pins": [
      {
        "id": "p1_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p1_2",
        "x": 530,
        "y": 230
      },
      {
        "id": "p1_3",
        "x": 830,
        "y": 265
      },
      {
        "id": "p1_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p1_5",
        "x": 1340,
        "y": 195
      },
      {
        "id": "p1_6",
        "x": 1640,
        "y": 230
      },
      {
        "id": "p1_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p1_8",
        "x": 2150,
        "y": 160
      }
    ],
    "trampolines": [
      {
        "id": "t1_1",
        "x": 570,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t1_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t1_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t1_fin",
        "x": 2180,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr1_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s1_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s1_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s1_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s1_4",
        "x": 1940,
        "y": 375
      }
    ],
    "powerUps": [
      {
        "id": "pu1_1",
        "type": "magnet",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 2,
    "title": "Skyline Pendulum",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 2620,
    "deathY": 820,
    "parTimeSeconds": 17,
    "pins": [
      {
        "id": "p2_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p2_2",
        "x": 530,
        "y": 240
      },
      {
        "id": "p2_3",
        "x": 830,
        "y": 275
      },
      {
        "id": "p2_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p2_5",
        "x": 1340,
        "y": 205
      },
      {
        "id": "p2_6",
        "x": 1640,
        "y": 240
      },
      {
        "id": "p2_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p2_8",
        "x": 2150,
        "y": 170
      }
    ],
    "trampolines": [
      {
        "id": "t2_1",
        "x": 570,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t2_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t2_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t2_fin",
        "x": 2400,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr2_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s2_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s2_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s2_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s2_4",
        "x": 1940,
        "y": 385
      }
    ],
    "powerUps": [
      {
        "id": "pu2_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 3,
    "title": "Water Tower Vault",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 2840,
    "deathY": 820,
    "parTimeSeconds": 18,
    "pins": [
      {
        "id": "p3_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p3_2",
        "x": 530,
        "y": 250
      },
      {
        "id": "p3_3",
        "x": 830,
        "y": 285
      },
      {
        "id": "p3_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p3_5",
        "x": 1340,
        "y": 215
      },
      {
        "id": "p3_6",
        "x": 1640,
        "y": 250
      },
      {
        "id": "p3_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p3_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p3_9",
        "x": 2450,
        "y": 215
      }
    ],
    "trampolines": [
      {
        "id": "t3_1",
        "x": 570,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t3_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t3_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t3_fin",
        "x": 2620,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr3_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr3_2",
        "x": 2560,
        "y": 195,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s3_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s3_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s3_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s3_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s3_5",
        "x": 2510,
        "y": 325
      }
    ],
    "powerUps": [
      {
        "id": "pu3_1",
        "type": "magnet",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      }
    ],
    "bungeeWebs": [
      {
        "id": "bw3_1",
        "x": 1200,
        "y": 530,
        "width": 140,
        "launchVy": -860,
        "launchVx": 680
      }
    ]
  },
  {
    "id": 4,
    "title": "Billboard Super Spring",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 3060,
    "deathY": 820,
    "parTimeSeconds": 19,
    "pins": [
      {
        "id": "p4_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p4_2",
        "x": 530,
        "y": 230
      },
      {
        "id": "p4_3",
        "x": 830,
        "y": 265
      },
      {
        "id": "p4_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p4_5",
        "x": 1340,
        "y": 195
      },
      {
        "id": "p4_6",
        "x": 1640,
        "y": 230
      },
      {
        "id": "p4_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p4_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p4_9",
        "x": 2450,
        "y": 195
      },
      {
        "id": "p4_10",
        "x": 2690,
        "y": 230
      }
    ],
    "trampolines": [
      {
        "id": "t4_1",
        "x": 570,
        "y": 560,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t4_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t4_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t4_fin",
        "x": 2840,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr4_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr4_2",
        "x": 2560,
        "y": 175,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s4_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s4_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s4_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s4_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s4_5",
        "x": 2510,
        "y": 305
      }
    ],
    "powerUps": [
      {
        "id": "pu4_1",
        "type": "magnet",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 5,
    "title": "High Crane Leap",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 3280,
    "deathY": 820,
    "parTimeSeconds": 19,
    "pins": [
      {
        "id": "p5_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p5_2",
        "x": 530,
        "y": 240
      },
      {
        "id": "p5_3",
        "x": 830,
        "y": 275
      },
      {
        "id": "p5_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p5_5",
        "x": 1340,
        "y": 205
      },
      {
        "id": "p5_6",
        "x": 1640,
        "y": 240
      },
      {
        "id": "p5_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p5_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p5_9",
        "x": 2450,
        "y": 205
      },
      {
        "id": "p5_10",
        "x": 2690,
        "y": 240
      },
      {
        "id": "p5_11",
        "x": 2960,
        "y": 275
      }
    ],
    "trampolines": [
      {
        "id": "t5_1",
        "x": 570,
        "y": 560,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t5_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t5_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t5_4",
        "x": 3000,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t5_fin",
        "x": 3060,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr5_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr5_2",
        "x": 2560,
        "y": 185,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s5_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s5_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s5_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s5_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s5_5",
        "x": 2510,
        "y": 315
      },
      {
        "id": "s5_6",
        "x": 3020,
        "y": 385
      }
    ],
    "powerUps": [
      {
        "id": "pu5_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu5_2",
        "type": "magnet",
        "x": 3070,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      }
    ],
    "barriers": [
      {
        "id": "bar5_1",
        "x": 1000,
        "y": 190,
        "width": 20,
        "height": 160,
        "minSpeed": 460
      }
    ]
  },
  {
    "id": 6,
    "title": "Sunset Expressway",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 3500,
    "deathY": 820,
    "parTimeSeconds": 20,
    "pins": [
      {
        "id": "p6_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p6_2",
        "x": 530,
        "y": 250
      },
      {
        "id": "p6_3",
        "x": 830,
        "y": 285
      },
      {
        "id": "p6_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p6_5",
        "x": 1340,
        "y": 215
      },
      {
        "id": "p6_6",
        "x": 1640,
        "y": 250
      },
      {
        "id": "p6_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p6_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p6_9",
        "x": 2450,
        "y": 215
      },
      {
        "id": "p6_10",
        "x": 2690,
        "y": 250
      },
      {
        "id": "p6_11",
        "x": 2960,
        "y": 285
      },
      {
        "id": "p6_12",
        "x": 3260,
        "y": 180
      }
    ],
    "trampolines": [
      {
        "id": "t6_1",
        "x": 570,
        "y": 560,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t6_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t6_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t6_4",
        "x": 3000,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t6_fin",
        "x": 3280,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr6_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr6_2",
        "x": 2560,
        "y": 195,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s6_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s6_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s6_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s6_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s6_5",
        "x": 2510,
        "y": 325
      },
      {
        "id": "s6_6",
        "x": 3020,
        "y": 395
      }
    ],
    "powerUps": [
      {
        "id": "pu6_1",
        "type": "magnet",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu6_2",
        "type": "magnet",
        "x": 3070,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 7,
    "title": "Antenna Forest",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 3720,
    "deathY": 820,
    "parTimeSeconds": 20,
    "pins": [
      {
        "id": "p7_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p7_2",
        "x": 530,
        "y": 230
      },
      {
        "id": "p7_3",
        "x": 830,
        "y": 265
      },
      {
        "id": "p7_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p7_5",
        "x": 1340,
        "y": 195
      },
      {
        "id": "p7_6",
        "x": 1640,
        "y": 230
      },
      {
        "id": "p7_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p7_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p7_9",
        "x": 2450,
        "y": 195
      },
      {
        "id": "p7_10",
        "x": 2690,
        "y": 230
      },
      {
        "id": "p7_11",
        "x": 2960,
        "y": 265
      },
      {
        "id": "p7_12",
        "x": 3260,
        "y": 160
      },
      {
        "id": "p7_13",
        "x": 3500,
        "y": 195
      }
    ],
    "trampolines": [
      {
        "id": "t7_1",
        "x": 570,
        "y": 560,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t7_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t7_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t7_4",
        "x": 3000,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t7_fin",
        "x": 3500,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr7_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr7_2",
        "x": 2560,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr7_3",
        "x": 3610,
        "y": 175,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s7_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s7_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s7_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s7_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s7_5",
        "x": 2510,
        "y": 305
      },
      {
        "id": "s7_6",
        "x": 3020,
        "y": 375
      },
      {
        "id": "s7_7",
        "x": 3560,
        "y": 305
      }
    ],
    "powerUps": [
      {
        "id": "pu7_1",
        "type": "magnet",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu7_2",
        "type": "magnet",
        "x": 3070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      }
    ],
    "wreckingBalls": [
      {
        "id": "wb7_1",
        "pivotX": 1100,
        "pivotY": 30,
        "chainLength": 210,
        "radius": 24,
        "swingSpeed": 2.2,
        "maxAngle": 0.85
      }
    ]
  },
  {
    "id": 8,
    "title": "Penthouse Velocity",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 3940,
    "deathY": 820,
    "parTimeSeconds": 21,
    "pins": [
      {
        "id": "p8_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p8_2",
        "x": 530,
        "y": 240
      },
      {
        "id": "p8_3",
        "x": 830,
        "y": 275
      },
      {
        "id": "p8_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p8_5",
        "x": 1340,
        "y": 205
      },
      {
        "id": "p8_6",
        "x": 1640,
        "y": 240
      },
      {
        "id": "p8_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p8_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p8_9",
        "x": 2450,
        "y": 205
      },
      {
        "id": "p8_10",
        "x": 2690,
        "y": 240
      },
      {
        "id": "p8_11",
        "x": 2960,
        "y": 275
      },
      {
        "id": "p8_12",
        "x": 3260,
        "y": 170
      },
      {
        "id": "p8_13",
        "x": 3500,
        "y": 205
      }
    ],
    "trampolines": [
      {
        "id": "t8_1",
        "x": 570,
        "y": 560,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t8_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t8_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t8_4",
        "x": 3000,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t8_fin",
        "x": 3720,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr8_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr8_2",
        "x": 2560,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr8_3",
        "x": 3610,
        "y": 185,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s8_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s8_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s8_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s8_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s8_5",
        "x": 2510,
        "y": 315
      },
      {
        "id": "s8_6",
        "x": 3020,
        "y": 385
      },
      {
        "id": "s8_7",
        "x": 3560,
        "y": 315
      }
    ],
    "powerUps": [
      {
        "id": "pu8_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu8_2",
        "type": "magnet",
        "x": 3070,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      }
    ],
    "bungeeWebs": [
      {
        "id": "bw8_1",
        "x": 1550,
        "y": 540,
        "width": 150,
        "launchVy": -880,
        "launchVx": 700
      }
    ]
  },
  {
    "id": 9,
    "title": "Golden Hour Flight",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 4160,
    "deathY": 820,
    "parTimeSeconds": 22,
    "pins": [
      {
        "id": "p9_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p9_2",
        "x": 530,
        "y": 250
      },
      {
        "id": "p9_3",
        "x": 830,
        "y": 285
      },
      {
        "id": "p9_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p9_5",
        "x": 1340,
        "y": 215
      },
      {
        "id": "p9_6",
        "x": 1640,
        "y": 250
      },
      {
        "id": "p9_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p9_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p9_9",
        "x": 2450,
        "y": 215
      },
      {
        "id": "p9_10",
        "x": 2690,
        "y": 250
      },
      {
        "id": "p9_11",
        "x": 2960,
        "y": 285
      },
      {
        "id": "p9_12",
        "x": 3260,
        "y": 180
      },
      {
        "id": "p9_13",
        "x": 3500,
        "y": 215
      },
      {
        "id": "p9_14",
        "x": 3770,
        "y": 250
      }
    ],
    "trampolines": [
      {
        "id": "t9_1",
        "x": 570,
        "y": 560,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t9_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t9_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t9_4",
        "x": 3000,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t9_5",
        "x": 3810,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t9_fin",
        "x": 3940,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr9_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr9_2",
        "x": 2560,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr9_3",
        "x": 3610,
        "y": 195,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s9_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s9_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s9_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s9_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s9_5",
        "x": 2510,
        "y": 325
      },
      {
        "id": "s9_6",
        "x": 3020,
        "y": 395
      },
      {
        "id": "s9_7",
        "x": 3560,
        "y": 325
      }
    ],
    "powerUps": [
      {
        "id": "pu9_1",
        "type": "magnet",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu9_2",
        "type": "magnet",
        "x": 3070,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 10,
    "title": "Rooftop Grand Marathon",
    "chapter": 1,
    "theme": "city_sunset",
    "startX": 80,
    "startY": 280,
    "finishX": 4380,
    "deathY": 820,
    "parTimeSeconds": 22,
    "pins": [
      {
        "id": "p10_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p10_2",
        "x": 530,
        "y": 230
      },
      {
        "id": "p10_3",
        "x": 830,
        "y": 265
      },
      {
        "id": "p10_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p10_5",
        "x": 1340,
        "y": 195
      },
      {
        "id": "p10_6",
        "x": 1640,
        "y": 230
      },
      {
        "id": "p10_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p10_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p10_9",
        "x": 2450,
        "y": 195
      },
      {
        "id": "p10_10",
        "x": 2690,
        "y": 230
      },
      {
        "id": "p10_11",
        "x": 2960,
        "y": 265
      },
      {
        "id": "p10_12",
        "x": 3260,
        "y": 160
      },
      {
        "id": "p10_13",
        "x": 3500,
        "y": 195
      },
      {
        "id": "p10_14",
        "x": 3770,
        "y": 230
      },
      {
        "id": "p10_15",
        "x": 4070,
        "y": 265
      }
    ],
    "trampolines": [
      {
        "id": "t10_1",
        "x": 570,
        "y": 560,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t10_2",
        "x": 1380,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t10_3",
        "x": 2190,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t10_4",
        "x": 3000,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t10_5",
        "x": 3810,
        "y": 560,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t10_fin",
        "x": 4160,
        "y": 570,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr10_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr10_2",
        "x": 2560,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr10_3",
        "x": 3610,
        "y": 175,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s10_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s10_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s10_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s10_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s10_5",
        "x": 2510,
        "y": 305
      },
      {
        "id": "s10_6",
        "x": 3020,
        "y": 375
      },
      {
        "id": "s10_7",
        "x": 3560,
        "y": 305
      },
      {
        "id": "s10_8",
        "x": 4130,
        "y": 375
      }
    ],
    "powerUps": [
      {
        "id": "pu10_1",
        "type": "magnet",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu10_2",
        "type": "magnet",
        "x": 3070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 11,
    "title": "Neon Dawn",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 4800,
    "deathY": 840,
    "parTimeSeconds": 23,
    "pins": [
      {
        "id": "p11_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p11_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p11_3",
        "x": 830,
        "y": 265
      },
      {
        "id": "p11_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p11_5",
        "x": 1340,
        "y": 195
      },
      {
        "id": "p11_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p11_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p11_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p11_9",
        "x": 2450,
        "y": 195
      },
      {
        "id": "p11_10",
        "x": 2690,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 65
        }
      },
      {
        "id": "p11_11",
        "x": 2960,
        "y": 265
      },
      {
        "id": "p11_12",
        "x": 3260,
        "y": 160
      },
      {
        "id": "p11_13",
        "x": 3500,
        "y": 195
      },
      {
        "id": "p11_14",
        "x": 3770,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 65
        }
      },
      {
        "id": "p11_15",
        "x": 4070,
        "y": 265
      },
      {
        "id": "p11_16",
        "x": 4310,
        "y": 160
      },
      {
        "id": "p11_17",
        "x": 4580,
        "y": 195
      }
    ],
    "trampolines": [
      {
        "id": "t11_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t11_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t11_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t11_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t11_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t11_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t11_fin",
        "x": 4580,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr11_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr11_2",
        "x": 2560,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr11_3",
        "x": 3610,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr11_4",
        "x": 4690,
        "y": 175,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s11_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s11_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s11_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s11_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s11_5",
        "x": 2510,
        "y": 305
      },
      {
        "id": "s11_6",
        "x": 3020,
        "y": 375
      },
      {
        "id": "s11_7",
        "x": 3560,
        "y": 305
      },
      {
        "id": "s11_8",
        "x": 4130,
        "y": 375
      },
      {
        "id": "s11_9",
        "x": 4640,
        "y": 305
      }
    ],
    "powerUps": [
      {
        "id": "pu11_1",
        "type": "speed_boost",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu11_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      }
    ],
    "barriers": [
      {
        "id": "bar11_1",
        "x": 950,
        "y": 210,
        "width": 22,
        "height": 170,
        "minSpeed": 460
      }
    ]
  },
  {
    "id": 12,
    "title": "Cyber Skyway",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 5070,
    "deathY": 840,
    "parTimeSeconds": 24,
    "pins": [
      {
        "id": "p12_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p12_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p12_3",
        "x": 830,
        "y": 275
      },
      {
        "id": "p12_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p12_5",
        "x": 1340,
        "y": 205
      },
      {
        "id": "p12_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p12_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p12_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p12_9",
        "x": 2450,
        "y": 205
      },
      {
        "id": "p12_10",
        "x": 2690,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 80
        }
      },
      {
        "id": "p12_11",
        "x": 2960,
        "y": 275
      },
      {
        "id": "p12_12",
        "x": 3260,
        "y": 170
      },
      {
        "id": "p12_13",
        "x": 3500,
        "y": 205
      },
      {
        "id": "p12_14",
        "x": 3770,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 80
        }
      },
      {
        "id": "p12_15",
        "x": 4070,
        "y": 275
      },
      {
        "id": "p12_16",
        "x": 4310,
        "y": 170
      },
      {
        "id": "p12_17",
        "x": 4580,
        "y": 205
      },
      {
        "id": "p12_18",
        "x": 4880,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 80
        }
      }
    ],
    "trampolines": [
      {
        "id": "t12_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t12_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t12_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t12_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t12_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t12_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t12_fin",
        "x": 4850,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr12_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr12_2",
        "x": 2560,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr12_3",
        "x": 3610,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr12_4",
        "x": 4690,
        "y": 185,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s12_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s12_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s12_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s12_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s12_5",
        "x": 2510,
        "y": 315
      },
      {
        "id": "s12_6",
        "x": 3020,
        "y": 385
      },
      {
        "id": "s12_7",
        "x": 3560,
        "y": 315
      },
      {
        "id": "s12_8",
        "x": 4130,
        "y": 385
      },
      {
        "id": "s12_9",
        "x": 4640,
        "y": 315
      }
    ],
    "powerUps": [
      {
        "id": "pu12_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu12_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 13,
    "title": "Hologram Drift",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 5340,
    "deathY": 840,
    "parTimeSeconds": 25,
    "pins": [
      {
        "id": "p13_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p13_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 95
        }
      },
      {
        "id": "p13_3",
        "x": 830,
        "y": 285
      },
      {
        "id": "p13_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p13_5",
        "x": 1340,
        "y": 215
      },
      {
        "id": "p13_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 95
        }
      },
      {
        "id": "p13_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p13_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p13_9",
        "x": 2450,
        "y": 215
      },
      {
        "id": "p13_10",
        "x": 2690,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 95
        }
      },
      {
        "id": "p13_11",
        "x": 2960,
        "y": 285
      },
      {
        "id": "p13_12",
        "x": 3260,
        "y": 180
      },
      {
        "id": "p13_13",
        "x": 3500,
        "y": 215
      },
      {
        "id": "p13_14",
        "x": 3770,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 95
        }
      },
      {
        "id": "p13_15",
        "x": 4070,
        "y": 285
      },
      {
        "id": "p13_16",
        "x": 4310,
        "y": 180
      },
      {
        "id": "p13_17",
        "x": 4580,
        "y": 215
      },
      {
        "id": "p13_18",
        "x": 4880,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 95
        }
      },
      {
        "id": "p13_19",
        "x": 5120,
        "y": 285
      }
    ],
    "trampolines": [
      {
        "id": "t13_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t13_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t13_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t13_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t13_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t13_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t13_fin",
        "x": 5120,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr13_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr13_2",
        "x": 2560,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr13_3",
        "x": 3610,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr13_4",
        "x": 4690,
        "y": 195,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s13_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s13_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s13_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s13_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s13_5",
        "x": 2510,
        "y": 325
      },
      {
        "id": "s13_6",
        "x": 3020,
        "y": 395
      },
      {
        "id": "s13_7",
        "x": 3560,
        "y": 325
      },
      {
        "id": "s13_8",
        "x": 4130,
        "y": 395
      },
      {
        "id": "s13_9",
        "x": 4640,
        "y": 325
      },
      {
        "id": "s13_10",
        "x": 5180,
        "y": 395
      }
    ],
    "powerUps": [
      {
        "id": "pu13_1",
        "type": "slow_mo",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu13_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu13_3",
        "type": "slow_mo",
        "x": 5230,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 14,
    "title": "Grid Runner",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 5610,
    "deathY": 840,
    "parTimeSeconds": 26,
    "pins": [
      {
        "id": "p14_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p14_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 110
        }
      },
      {
        "id": "p14_3",
        "x": 830,
        "y": 265
      },
      {
        "id": "p14_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p14_5",
        "x": 1340,
        "y": 195
      },
      {
        "id": "p14_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 110
        }
      },
      {
        "id": "p14_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p14_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p14_9",
        "x": 2450,
        "y": 195
      },
      {
        "id": "p14_10",
        "x": 2690,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 110
        }
      },
      {
        "id": "p14_11",
        "x": 2960,
        "y": 265
      },
      {
        "id": "p14_12",
        "x": 3260,
        "y": 160
      },
      {
        "id": "p14_13",
        "x": 3500,
        "y": 195
      },
      {
        "id": "p14_14",
        "x": 3770,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 110
        }
      },
      {
        "id": "p14_15",
        "x": 4070,
        "y": 265
      },
      {
        "id": "p14_16",
        "x": 4310,
        "y": 160
      },
      {
        "id": "p14_17",
        "x": 4580,
        "y": 195
      },
      {
        "id": "p14_18",
        "x": 4880,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 110
        }
      },
      {
        "id": "p14_19",
        "x": 5120,
        "y": 265
      },
      {
        "id": "p14_20",
        "x": 5390,
        "y": 160
      }
    ],
    "trampolines": [
      {
        "id": "t14_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t14_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t14_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t14_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t14_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t14_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t14_7",
        "x": 5430,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t14_fin",
        "x": 5390,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr14_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr14_2",
        "x": 2560,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr14_3",
        "x": 3610,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr14_4",
        "x": 4690,
        "y": 175,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s14_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s14_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s14_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s14_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s14_5",
        "x": 2510,
        "y": 305
      },
      {
        "id": "s14_6",
        "x": 3020,
        "y": 375
      },
      {
        "id": "s14_7",
        "x": 3560,
        "y": 305
      },
      {
        "id": "s14_8",
        "x": 4130,
        "y": 375
      },
      {
        "id": "s14_9",
        "x": 4640,
        "y": 305
      },
      {
        "id": "s14_10",
        "x": 5180,
        "y": 375
      }
    ],
    "powerUps": [
      {
        "id": "pu14_1",
        "type": "speed_boost",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu14_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu14_3",
        "type": "slow_mo",
        "x": 5230,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      }
    ],
    "bungeeWebs": [
      {
        "id": "bw14_1",
        "x": 1420,
        "y": 530,
        "width": 140,
        "launchVy": -860,
        "launchVx": 680
      }
    ]
  },
  {
    "id": 15,
    "title": "Luminous Ascent",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 5880,
    "deathY": 840,
    "parTimeSeconds": 26,
    "pins": [
      {
        "id": "p15_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p15_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p15_3",
        "x": 830,
        "y": 275
      },
      {
        "id": "p15_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p15_5",
        "x": 1340,
        "y": 205
      },
      {
        "id": "p15_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p15_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p15_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p15_9",
        "x": 2450,
        "y": 205
      },
      {
        "id": "p15_10",
        "x": 2690,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 65
        }
      },
      {
        "id": "p15_11",
        "x": 2960,
        "y": 275
      },
      {
        "id": "p15_12",
        "x": 3260,
        "y": 170
      },
      {
        "id": "p15_13",
        "x": 3500,
        "y": 205
      },
      {
        "id": "p15_14",
        "x": 3770,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 65
        }
      },
      {
        "id": "p15_15",
        "x": 4070,
        "y": 275
      },
      {
        "id": "p15_16",
        "x": 4310,
        "y": 170
      },
      {
        "id": "p15_17",
        "x": 4580,
        "y": 205
      },
      {
        "id": "p15_18",
        "x": 4880,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 65
        }
      },
      {
        "id": "p15_19",
        "x": 5120,
        "y": 275
      },
      {
        "id": "p15_20",
        "x": 5390,
        "y": 170
      },
      {
        "id": "p15_21",
        "x": 5690,
        "y": 205
      }
    ],
    "trampolines": [
      {
        "id": "t15_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t15_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t15_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t15_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t15_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t15_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t15_7",
        "x": 5430,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t15_fin",
        "x": 5660,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr15_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr15_2",
        "x": 2560,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr15_3",
        "x": 3610,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr15_4",
        "x": 4690,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr15_5",
        "x": 5800,
        "y": 185,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s15_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s15_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s15_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s15_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s15_5",
        "x": 2510,
        "y": 315
      },
      {
        "id": "s15_6",
        "x": 3020,
        "y": 385
      },
      {
        "id": "s15_7",
        "x": 3560,
        "y": 315
      },
      {
        "id": "s15_8",
        "x": 4130,
        "y": 385
      },
      {
        "id": "s15_9",
        "x": 4640,
        "y": 315
      },
      {
        "id": "s15_10",
        "x": 5180,
        "y": 385
      },
      {
        "id": "s15_11",
        "x": 5750,
        "y": 315
      }
    ],
    "powerUps": [
      {
        "id": "pu15_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu15_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu15_3",
        "type": "slow_mo",
        "x": 5230,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 16,
    "title": "Midnight Velocity",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 6150,
    "deathY": 840,
    "parTimeSeconds": 27,
    "pins": [
      {
        "id": "p16_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p16_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p16_3",
        "x": 830,
        "y": 285
      },
      {
        "id": "p16_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p16_5",
        "x": 1340,
        "y": 215
      },
      {
        "id": "p16_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p16_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p16_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p16_9",
        "x": 2450,
        "y": 215
      },
      {
        "id": "p16_10",
        "x": 2690,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 80
        }
      },
      {
        "id": "p16_11",
        "x": 2960,
        "y": 285
      },
      {
        "id": "p16_12",
        "x": 3260,
        "y": 180
      },
      {
        "id": "p16_13",
        "x": 3500,
        "y": 215
      },
      {
        "id": "p16_14",
        "x": 3770,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 80
        }
      },
      {
        "id": "p16_15",
        "x": 4070,
        "y": 285
      },
      {
        "id": "p16_16",
        "x": 4310,
        "y": 180
      },
      {
        "id": "p16_17",
        "x": 4580,
        "y": 215
      },
      {
        "id": "p16_18",
        "x": 4880,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 80
        }
      },
      {
        "id": "p16_19",
        "x": 5120,
        "y": 285
      },
      {
        "id": "p16_20",
        "x": 5390,
        "y": 180
      },
      {
        "id": "p16_21",
        "x": 5690,
        "y": 215
      },
      {
        "id": "p16_22",
        "x": 5930,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5885,
          "max": 5975,
          "speed": 80
        }
      }
    ],
    "trampolines": [
      {
        "id": "t16_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t16_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t16_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t16_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t16_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t16_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t16_7",
        "x": 5430,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t16_fin",
        "x": 5930,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr16_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr16_2",
        "x": 2560,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr16_3",
        "x": 3610,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr16_4",
        "x": 4690,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr16_5",
        "x": 5800,
        "y": 195,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s16_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s16_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s16_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s16_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s16_5",
        "x": 2510,
        "y": 325
      },
      {
        "id": "s16_6",
        "x": 3020,
        "y": 395
      },
      {
        "id": "s16_7",
        "x": 3560,
        "y": 325
      },
      {
        "id": "s16_8",
        "x": 4130,
        "y": 395
      },
      {
        "id": "s16_9",
        "x": 4640,
        "y": 325
      },
      {
        "id": "s16_10",
        "x": 5180,
        "y": 395
      },
      {
        "id": "s16_11",
        "x": 5750,
        "y": 325
      }
    ],
    "powerUps": [
      {
        "id": "pu16_1",
        "type": "slow_mo",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu16_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu16_3",
        "type": "slow_mo",
        "x": 5230,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      }
    ],
    "wreckingBalls": [
      {
        "id": "wb16_1",
        "pivotX": 1350,
        "pivotY": 40,
        "chainLength": 230,
        "radius": 26,
        "swingSpeed": 2.5,
        "maxAngle": 0.9
      }
    ]
  },
  {
    "id": 17,
    "title": "Electric Overpass",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 6420,
    "deathY": 840,
    "parTimeSeconds": 28,
    "pins": [
      {
        "id": "p17_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p17_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 95
        }
      },
      {
        "id": "p17_3",
        "x": 830,
        "y": 265
      },
      {
        "id": "p17_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p17_5",
        "x": 1340,
        "y": 195
      },
      {
        "id": "p17_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 95
        }
      },
      {
        "id": "p17_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p17_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p17_9",
        "x": 2450,
        "y": 195
      },
      {
        "id": "p17_10",
        "x": 2690,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 95
        }
      },
      {
        "id": "p17_11",
        "x": 2960,
        "y": 265
      },
      {
        "id": "p17_12",
        "x": 3260,
        "y": 160
      },
      {
        "id": "p17_13",
        "x": 3500,
        "y": 195
      },
      {
        "id": "p17_14",
        "x": 3770,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 95
        }
      },
      {
        "id": "p17_15",
        "x": 4070,
        "y": 265
      },
      {
        "id": "p17_16",
        "x": 4310,
        "y": 160
      },
      {
        "id": "p17_17",
        "x": 4580,
        "y": 195
      },
      {
        "id": "p17_18",
        "x": 4880,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 95
        }
      },
      {
        "id": "p17_19",
        "x": 5120,
        "y": 265
      },
      {
        "id": "p17_20",
        "x": 5390,
        "y": 160
      },
      {
        "id": "p17_21",
        "x": 5690,
        "y": 195
      },
      {
        "id": "p17_22",
        "x": 5930,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5885,
          "max": 5975,
          "speed": 95
        }
      },
      {
        "id": "p17_23",
        "x": 6200,
        "y": 265
      }
    ],
    "trampolines": [
      {
        "id": "t17_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t17_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t17_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t17_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t17_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t17_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t17_7",
        "x": 5430,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t17_8",
        "x": 6240,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t17_fin",
        "x": 6200,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr17_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr17_2",
        "x": 2560,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr17_3",
        "x": 3610,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr17_4",
        "x": 4690,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr17_5",
        "x": 5800,
        "y": 175,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s17_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s17_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s17_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s17_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s17_5",
        "x": 2510,
        "y": 305
      },
      {
        "id": "s17_6",
        "x": 3020,
        "y": 375
      },
      {
        "id": "s17_7",
        "x": 3560,
        "y": 305
      },
      {
        "id": "s17_8",
        "x": 4130,
        "y": 375
      },
      {
        "id": "s17_9",
        "x": 4640,
        "y": 305
      },
      {
        "id": "s17_10",
        "x": 5180,
        "y": 375
      },
      {
        "id": "s17_11",
        "x": 5750,
        "y": 305
      },
      {
        "id": "s17_12",
        "x": 6260,
        "y": 375
      }
    ],
    "powerUps": [
      {
        "id": "pu17_1",
        "type": "speed_boost",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu17_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu17_3",
        "type": "slow_mo",
        "x": 5230,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 18,
    "title": "Subway Line Aerial",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 6690,
    "deathY": 840,
    "parTimeSeconds": 29,
    "pins": [
      {
        "id": "p18_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p18_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 110
        }
      },
      {
        "id": "p18_3",
        "x": 830,
        "y": 275
      },
      {
        "id": "p18_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p18_5",
        "x": 1340,
        "y": 205
      },
      {
        "id": "p18_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 110
        }
      },
      {
        "id": "p18_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p18_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p18_9",
        "x": 2450,
        "y": 205
      },
      {
        "id": "p18_10",
        "x": 2690,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 110
        }
      },
      {
        "id": "p18_11",
        "x": 2960,
        "y": 275
      },
      {
        "id": "p18_12",
        "x": 3260,
        "y": 170
      },
      {
        "id": "p18_13",
        "x": 3500,
        "y": 205
      },
      {
        "id": "p18_14",
        "x": 3770,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 110
        }
      },
      {
        "id": "p18_15",
        "x": 4070,
        "y": 275
      },
      {
        "id": "p18_16",
        "x": 4310,
        "y": 170
      },
      {
        "id": "p18_17",
        "x": 4580,
        "y": 205
      },
      {
        "id": "p18_18",
        "x": 4880,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 110
        }
      },
      {
        "id": "p18_19",
        "x": 5120,
        "y": 275
      },
      {
        "id": "p18_20",
        "x": 5390,
        "y": 170
      },
      {
        "id": "p18_21",
        "x": 5690,
        "y": 205
      },
      {
        "id": "p18_22",
        "x": 5930,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5885,
          "max": 5975,
          "speed": 110
        }
      },
      {
        "id": "p18_23",
        "x": 6200,
        "y": 275
      },
      {
        "id": "p18_24",
        "x": 6500,
        "y": 170
      }
    ],
    "trampolines": [
      {
        "id": "t18_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t18_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t18_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t18_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t18_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t18_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t18_7",
        "x": 5430,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t18_8",
        "x": 6240,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t18_fin",
        "x": 6470,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr18_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr18_2",
        "x": 2560,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr18_3",
        "x": 3610,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr18_4",
        "x": 4690,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr18_5",
        "x": 5800,
        "y": 185,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s18_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s18_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s18_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s18_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s18_5",
        "x": 2510,
        "y": 315
      },
      {
        "id": "s18_6",
        "x": 3020,
        "y": 385
      },
      {
        "id": "s18_7",
        "x": 3560,
        "y": 315
      },
      {
        "id": "s18_8",
        "x": 4130,
        "y": 385
      },
      {
        "id": "s18_9",
        "x": 4640,
        "y": 315
      },
      {
        "id": "s18_10",
        "x": 5180,
        "y": 385
      },
      {
        "id": "s18_11",
        "x": 5750,
        "y": 315
      },
      {
        "id": "s18_12",
        "x": 6260,
        "y": 385
      }
    ],
    "powerUps": [
      {
        "id": "pu18_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu18_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu18_3",
        "type": "slow_mo",
        "x": 5230,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 19,
    "title": "Data Stream Leap",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 6960,
    "deathY": 840,
    "parTimeSeconds": 29,
    "pins": [
      {
        "id": "p19_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p19_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p19_3",
        "x": 830,
        "y": 285
      },
      {
        "id": "p19_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p19_5",
        "x": 1340,
        "y": 215
      },
      {
        "id": "p19_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p19_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p19_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p19_9",
        "x": 2450,
        "y": 215
      },
      {
        "id": "p19_10",
        "x": 2690,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 65
        }
      },
      {
        "id": "p19_11",
        "x": 2960,
        "y": 285
      },
      {
        "id": "p19_12",
        "x": 3260,
        "y": 180
      },
      {
        "id": "p19_13",
        "x": 3500,
        "y": 215
      },
      {
        "id": "p19_14",
        "x": 3770,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 65
        }
      },
      {
        "id": "p19_15",
        "x": 4070,
        "y": 285
      },
      {
        "id": "p19_16",
        "x": 4310,
        "y": 180
      },
      {
        "id": "p19_17",
        "x": 4580,
        "y": 215
      },
      {
        "id": "p19_18",
        "x": 4880,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 65
        }
      },
      {
        "id": "p19_19",
        "x": 5120,
        "y": 285
      },
      {
        "id": "p19_20",
        "x": 5390,
        "y": 180
      },
      {
        "id": "p19_21",
        "x": 5690,
        "y": 215
      },
      {
        "id": "p19_22",
        "x": 5930,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5885,
          "max": 5975,
          "speed": 65
        }
      },
      {
        "id": "p19_23",
        "x": 6200,
        "y": 285
      },
      {
        "id": "p19_24",
        "x": 6500,
        "y": 180
      },
      {
        "id": "p19_25",
        "x": 6740,
        "y": 215
      }
    ],
    "trampolines": [
      {
        "id": "t19_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t19_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t19_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t19_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t19_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t19_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t19_7",
        "x": 5430,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t19_8",
        "x": 6240,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t19_fin",
        "x": 6740,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr19_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr19_2",
        "x": 2560,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr19_3",
        "x": 3610,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr19_4",
        "x": 4690,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr19_5",
        "x": 5800,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr19_6",
        "x": 6850,
        "y": 195,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s19_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s19_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s19_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s19_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s19_5",
        "x": 2510,
        "y": 325
      },
      {
        "id": "s19_6",
        "x": 3020,
        "y": 395
      },
      {
        "id": "s19_7",
        "x": 3560,
        "y": 325
      },
      {
        "id": "s19_8",
        "x": 4130,
        "y": 395
      },
      {
        "id": "s19_9",
        "x": 4640,
        "y": 325
      },
      {
        "id": "s19_10",
        "x": 5180,
        "y": 395
      },
      {
        "id": "s19_11",
        "x": 5750,
        "y": 325
      },
      {
        "id": "s19_12",
        "x": 6260,
        "y": 395
      },
      {
        "id": "s19_13",
        "x": 6800,
        "y": 325
      }
    ],
    "powerUps": [
      {
        "id": "pu19_1",
        "type": "slow_mo",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu19_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu19_3",
        "type": "slow_mo",
        "x": 5230,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      }
    ],
    "barriers": [
      {
        "id": "bar19_1",
        "x": 1250,
        "y": 200,
        "width": 22,
        "height": 180,
        "minSpeed": 480
      }
    ]
  },
  {
    "id": 20,
    "title": "Neon Superhighway Grand Prix",
    "chapter": 2,
    "theme": "neon_skyway",
    "startX": 80,
    "startY": 280,
    "finishX": 7230,
    "deathY": 840,
    "parTimeSeconds": 30,
    "pins": [
      {
        "id": "p20_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p20_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p20_3",
        "x": 830,
        "y": 265
      },
      {
        "id": "p20_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p20_5",
        "x": 1340,
        "y": 195
      },
      {
        "id": "p20_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p20_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p20_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p20_9",
        "x": 2450,
        "y": 195
      },
      {
        "id": "p20_10",
        "x": 2690,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 2645,
          "max": 2735,
          "speed": 80
        }
      },
      {
        "id": "p20_11",
        "x": 2960,
        "y": 265
      },
      {
        "id": "p20_12",
        "x": 3260,
        "y": 160
      },
      {
        "id": "p20_13",
        "x": 3500,
        "y": 195
      },
      {
        "id": "p20_14",
        "x": 3770,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 3725,
          "max": 3815,
          "speed": 80
        }
      },
      {
        "id": "p20_15",
        "x": 4070,
        "y": 265
      },
      {
        "id": "p20_16",
        "x": 4310,
        "y": 160
      },
      {
        "id": "p20_17",
        "x": 4580,
        "y": 195
      },
      {
        "id": "p20_18",
        "x": 4880,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4835,
          "max": 4925,
          "speed": 80
        }
      },
      {
        "id": "p20_19",
        "x": 5120,
        "y": 265
      },
      {
        "id": "p20_20",
        "x": 5390,
        "y": 160
      },
      {
        "id": "p20_21",
        "x": 5690,
        "y": 195
      },
      {
        "id": "p20_22",
        "x": 5930,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5885,
          "max": 5975,
          "speed": 80
        }
      },
      {
        "id": "p20_23",
        "x": 6200,
        "y": 265
      },
      {
        "id": "p20_24",
        "x": 6500,
        "y": 160
      },
      {
        "id": "p20_25",
        "x": 6740,
        "y": 195
      },
      {
        "id": "p20_26",
        "x": 7010,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6965,
          "max": 7055,
          "speed": 80
        }
      }
    ],
    "trampolines": [
      {
        "id": "t20_1",
        "x": 570,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t20_2",
        "x": 1380,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t20_3",
        "x": 2190,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t20_4",
        "x": 3000,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t20_5",
        "x": 3810,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t20_6",
        "x": 4620,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t20_7",
        "x": 5430,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t20_8",
        "x": 6240,
        "y": 580,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t20_9",
        "x": 7050,
        "y": 580,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t20_fin",
        "x": 7010,
        "y": 590,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr20_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr20_2",
        "x": 2560,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr20_3",
        "x": 3610,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr20_4",
        "x": 4690,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr20_5",
        "x": 5800,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr20_6",
        "x": 6850,
        "y": 175,
        "radius": 22
      }
    ],
    "stars": [
      {
        "id": "s20_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s20_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s20_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s20_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s20_5",
        "x": 2510,
        "y": 305
      },
      {
        "id": "s20_6",
        "x": 3020,
        "y": 375
      },
      {
        "id": "s20_7",
        "x": 3560,
        "y": 305
      },
      {
        "id": "s20_8",
        "x": 4130,
        "y": 375
      },
      {
        "id": "s20_9",
        "x": 4640,
        "y": 305
      },
      {
        "id": "s20_10",
        "x": 5180,
        "y": 375
      },
      {
        "id": "s20_11",
        "x": 5750,
        "y": 305
      },
      {
        "id": "s20_12",
        "x": 6260,
        "y": 375
      },
      {
        "id": "s20_13",
        "x": 6800,
        "y": 305
      }
    ],
    "powerUps": [
      {
        "id": "pu20_1",
        "type": "speed_boost",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu20_2",
        "type": "slow_mo",
        "x": 3070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu20_3",
        "type": "slow_mo",
        "x": 5230,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 21,
    "title": "The Steam Works",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 7600,
    "deathY": 860,
    "parTimeSeconds": 31,
    "pins": [
      {
        "id": "p21_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p21_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p21_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p21_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p21_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p21_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p21_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p21_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p21_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p21_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p21_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p21_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p21_13",
        "x": 3920,
        "y": 195
      },
      {
        "id": "p21_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p21_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p21_16",
        "x": 4730,
        "y": 160
      },
      {
        "id": "p21_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p21_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p21_19",
        "x": 5540,
        "y": 265
      },
      {
        "id": "p21_20",
        "x": 5810,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p21_21",
        "x": 6110,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p21_22",
        "x": 6350,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 65
        }
      },
      {
        "id": "p21_23",
        "x": 6620,
        "y": 265
      },
      {
        "id": "p21_24",
        "x": 6920,
        "y": 160
      },
      {
        "id": "p21_25",
        "x": 7160,
        "y": 195,
        "fragile": true
      }
    ],
    "trampolines": [
      {
        "id": "t21_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t21_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t21_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t21_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t21_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t21_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t21_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t21_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t21_fin",
        "x": 7380,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr21_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr21_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr21_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr21_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr21_5",
        "x": 6220,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr21_6",
        "x": 7270,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz21_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz21_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz21_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz21_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv21_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv21_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv21_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv21_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s21_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s21_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s21_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s21_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s21_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s21_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s21_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s21_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s21_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s21_10",
        "x": 5600,
        "y": 375
      },
      {
        "id": "s21_11",
        "x": 6170,
        "y": 305
      },
      {
        "id": "s21_12",
        "x": 6680,
        "y": 375
      },
      {
        "id": "s21_13",
        "x": 7220,
        "y": 305
      }
    ],
    "portals": [
      {
        "id": "pt21_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu21_1",
        "type": "slow_mo",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu21_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu21_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 22,
    "title": "Piston Pressure",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 7910,
    "deathY": 860,
    "parTimeSeconds": 32,
    "pins": [
      {
        "id": "p22_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p22_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p22_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p22_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p22_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p22_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p22_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p22_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p22_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p22_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p22_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p22_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p22_13",
        "x": 3920,
        "y": 205
      },
      {
        "id": "p22_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p22_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p22_16",
        "x": 4730,
        "y": 170
      },
      {
        "id": "p22_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p22_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p22_19",
        "x": 5540,
        "y": 275
      },
      {
        "id": "p22_20",
        "x": 5810,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p22_21",
        "x": 6110,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p22_22",
        "x": 6350,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 80
        }
      },
      {
        "id": "p22_23",
        "x": 6620,
        "y": 275
      },
      {
        "id": "p22_24",
        "x": 6920,
        "y": 170
      },
      {
        "id": "p22_25",
        "x": 7160,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p22_26",
        "x": 7430,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 80
        }
      }
    ],
    "trampolines": [
      {
        "id": "t22_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t22_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t22_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t22_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t22_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t22_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t22_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t22_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t22_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t22_fin",
        "x": 7690,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr22_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr22_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr22_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr22_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr22_5",
        "x": 6220,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr22_6",
        "x": 7270,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz22_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz22_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz22_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz22_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv22_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv22_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv22_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv22_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s22_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s22_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s22_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s22_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s22_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s22_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s22_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s22_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s22_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s22_10",
        "x": 5600,
        "y": 385
      },
      {
        "id": "s22_11",
        "x": 6170,
        "y": 315
      },
      {
        "id": "s22_12",
        "x": 6680,
        "y": 385
      },
      {
        "id": "s22_13",
        "x": 7220,
        "y": 315
      }
    ],
    "portals": [
      {
        "id": "pt22_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu22_1",
        "type": "slow_mo",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu22_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu22_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      }
    ],
    "bungeeWebs": [
      {
        "id": "bw22_1",
        "x": 1600,
        "y": 550,
        "width": 150,
        "launchVy": -880,
        "launchVx": 720
      }
    ]
  },
  {
    "id": 23,
    "title": "Fragile Crystal Spire",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 8220,
    "deathY": 860,
    "parTimeSeconds": 33,
    "pins": [
      {
        "id": "p23_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p23_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 95
        }
      },
      {
        "id": "p23_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p23_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p23_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p23_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 95
        }
      },
      {
        "id": "p23_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p23_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p23_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p23_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 95
        }
      },
      {
        "id": "p23_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p23_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p23_13",
        "x": 3920,
        "y": 215
      },
      {
        "id": "p23_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 95
        }
      },
      {
        "id": "p23_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p23_16",
        "x": 4730,
        "y": 180
      },
      {
        "id": "p23_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p23_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 95
        }
      },
      {
        "id": "p23_19",
        "x": 5540,
        "y": 285
      },
      {
        "id": "p23_20",
        "x": 5810,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p23_21",
        "x": 6110,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p23_22",
        "x": 6350,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 95
        }
      },
      {
        "id": "p23_23",
        "x": 6620,
        "y": 285
      },
      {
        "id": "p23_24",
        "x": 6920,
        "y": 180
      },
      {
        "id": "p23_25",
        "x": 7160,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p23_26",
        "x": 7430,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 95
        }
      },
      {
        "id": "p23_27",
        "x": 7730,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p23_28",
        "x": 7970,
        "y": 180
      }
    ],
    "trampolines": [
      {
        "id": "t23_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t23_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t23_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t23_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t23_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t23_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t23_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t23_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t23_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t23_fin",
        "x": 8000,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr23_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr23_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr23_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr23_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr23_5",
        "x": 6220,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr23_6",
        "x": 7270,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz23_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz23_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz23_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz23_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv23_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv23_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv23_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv23_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv23_5",
        "x": 8040,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s23_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s23_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s23_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s23_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s23_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s23_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s23_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s23_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s23_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s23_10",
        "x": 5600,
        "y": 395
      },
      {
        "id": "s23_11",
        "x": 6170,
        "y": 325
      },
      {
        "id": "s23_12",
        "x": 6680,
        "y": 395
      },
      {
        "id": "s23_13",
        "x": 7220,
        "y": 325
      },
      {
        "id": "s23_14",
        "x": 7790,
        "y": 395
      }
    ],
    "portals": [
      {
        "id": "pt23_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu23_1",
        "type": "slow_mo",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu23_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu23_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu23_4",
        "type": "slow_mo",
        "x": 7840,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 24,
    "title": "Wind Tunnel Ascent",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 8530,
    "deathY": 860,
    "parTimeSeconds": 34,
    "pins": [
      {
        "id": "p24_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p24_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 110
        }
      },
      {
        "id": "p24_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p24_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p24_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p24_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 110
        }
      },
      {
        "id": "p24_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p24_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p24_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p24_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 110
        }
      },
      {
        "id": "p24_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p24_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p24_13",
        "x": 3920,
        "y": 195
      },
      {
        "id": "p24_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 110
        }
      },
      {
        "id": "p24_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p24_16",
        "x": 4730,
        "y": 160
      },
      {
        "id": "p24_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p24_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 110
        }
      },
      {
        "id": "p24_19",
        "x": 5540,
        "y": 265
      },
      {
        "id": "p24_20",
        "x": 5810,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p24_21",
        "x": 6110,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p24_22",
        "x": 6350,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 110
        }
      },
      {
        "id": "p24_23",
        "x": 6620,
        "y": 265
      },
      {
        "id": "p24_24",
        "x": 6920,
        "y": 160
      },
      {
        "id": "p24_25",
        "x": 7160,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p24_26",
        "x": 7430,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 110
        }
      },
      {
        "id": "p24_27",
        "x": 7730,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p24_28",
        "x": 7970,
        "y": 160
      },
      {
        "id": "p24_29",
        "x": 8240,
        "y": 195
      }
    ],
    "trampolines": [
      {
        "id": "t24_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t24_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t24_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t24_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t24_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t24_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t24_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t24_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t24_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t24_10",
        "x": 8280,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t24_fin",
        "x": 8310,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr24_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr24_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr24_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr24_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr24_5",
        "x": 6220,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr24_6",
        "x": 7270,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr24_7",
        "x": 8350,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz24_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz24_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz24_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz24_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv24_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv24_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv24_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv24_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv24_5",
        "x": 8040,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s24_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s24_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s24_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s24_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s24_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s24_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s24_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s24_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s24_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s24_10",
        "x": 5600,
        "y": 375
      },
      {
        "id": "s24_11",
        "x": 6170,
        "y": 305
      },
      {
        "id": "s24_12",
        "x": 6680,
        "y": 375
      },
      {
        "id": "s24_13",
        "x": 7220,
        "y": 305
      },
      {
        "id": "s24_14",
        "x": 7790,
        "y": 375
      },
      {
        "id": "s24_15",
        "x": 8300,
        "y": 305
      }
    ],
    "portals": [
      {
        "id": "pt24_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu24_1",
        "type": "slow_mo",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu24_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu24_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu24_4",
        "type": "slow_mo",
        "x": 7840,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 25,
    "title": "Quantum Chimney Warp",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 8840,
    "deathY": 860,
    "parTimeSeconds": 35,
    "pins": [
      {
        "id": "p25_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p25_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p25_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p25_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p25_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p25_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p25_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p25_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p25_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p25_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p25_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p25_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p25_13",
        "x": 3920,
        "y": 205
      },
      {
        "id": "p25_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p25_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p25_16",
        "x": 4730,
        "y": 170
      },
      {
        "id": "p25_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p25_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p25_19",
        "x": 5540,
        "y": 275
      },
      {
        "id": "p25_20",
        "x": 5810,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p25_21",
        "x": 6110,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p25_22",
        "x": 6350,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 65
        }
      },
      {
        "id": "p25_23",
        "x": 6620,
        "y": 275
      },
      {
        "id": "p25_24",
        "x": 6920,
        "y": 170
      },
      {
        "id": "p25_25",
        "x": 7160,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p25_26",
        "x": 7430,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 65
        }
      },
      {
        "id": "p25_27",
        "x": 7730,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p25_28",
        "x": 7970,
        "y": 170
      },
      {
        "id": "p25_29",
        "x": 8240,
        "y": 205
      },
      {
        "id": "p25_30",
        "x": 8540,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 65
        }
      }
    ],
    "trampolines": [
      {
        "id": "t25_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t25_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t25_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t25_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t25_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t25_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t25_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t25_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t25_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t25_10",
        "x": 8280,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t25_fin",
        "x": 8620,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr25_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr25_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr25_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr25_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr25_5",
        "x": 6220,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr25_6",
        "x": 7270,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr25_7",
        "x": 8350,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz25_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz25_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz25_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz25_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv25_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv25_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv25_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv25_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv25_5",
        "x": 8040,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s25_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s25_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s25_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s25_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s25_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s25_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s25_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s25_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s25_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s25_10",
        "x": 5600,
        "y": 385
      },
      {
        "id": "s25_11",
        "x": 6170,
        "y": 315
      },
      {
        "id": "s25_12",
        "x": 6680,
        "y": 385
      },
      {
        "id": "s25_13",
        "x": 7220,
        "y": 315
      },
      {
        "id": "s25_14",
        "x": 7790,
        "y": 385
      },
      {
        "id": "s25_15",
        "x": 8300,
        "y": 315
      }
    ],
    "portals": [
      {
        "id": "pt25_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu25_1",
        "type": "slow_mo",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu25_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu25_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu25_4",
        "type": "slow_mo",
        "x": 7840,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      }
    ],
    "wreckingBalls": [
      {
        "id": "wb25_1",
        "pivotX": 1200,
        "pivotY": 50,
        "chainLength": 240,
        "radius": 28,
        "swingSpeed": 2.6,
        "maxAngle": 0.95
      }
    ]
  },
  {
    "id": 26,
    "title": "Furnace Crossway",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 9150,
    "deathY": 860,
    "parTimeSeconds": 36,
    "pins": [
      {
        "id": "p26_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p26_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p26_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p26_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p26_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p26_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p26_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p26_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p26_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p26_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p26_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p26_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p26_13",
        "x": 3920,
        "y": 215
      },
      {
        "id": "p26_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p26_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p26_16",
        "x": 4730,
        "y": 180
      },
      {
        "id": "p26_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p26_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p26_19",
        "x": 5540,
        "y": 285
      },
      {
        "id": "p26_20",
        "x": 5810,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p26_21",
        "x": 6110,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p26_22",
        "x": 6350,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 80
        }
      },
      {
        "id": "p26_23",
        "x": 6620,
        "y": 285
      },
      {
        "id": "p26_24",
        "x": 6920,
        "y": 180
      },
      {
        "id": "p26_25",
        "x": 7160,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p26_26",
        "x": 7430,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 80
        }
      },
      {
        "id": "p26_27",
        "x": 7730,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p26_28",
        "x": 7970,
        "y": 180
      },
      {
        "id": "p26_29",
        "x": 8240,
        "y": 215
      },
      {
        "id": "p26_30",
        "x": 8540,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 80
        }
      },
      {
        "id": "p26_31",
        "x": 8780,
        "y": 285
      }
    ],
    "trampolines": [
      {
        "id": "t26_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t26_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t26_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t26_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t26_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t26_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t26_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t26_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t26_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t26_10",
        "x": 8280,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t26_fin",
        "x": 8930,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr26_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr26_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr26_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr26_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr26_5",
        "x": 6220,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr26_6",
        "x": 7270,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr26_7",
        "x": 8350,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz26_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz26_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz26_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz26_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      },
      {
        "id": "hz26_5",
        "x": 8910,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv26_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv26_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv26_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv26_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv26_5",
        "x": 8040,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s26_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s26_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s26_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s26_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s26_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s26_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s26_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s26_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s26_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s26_10",
        "x": 5600,
        "y": 395
      },
      {
        "id": "s26_11",
        "x": 6170,
        "y": 325
      },
      {
        "id": "s26_12",
        "x": 6680,
        "y": 395
      },
      {
        "id": "s26_13",
        "x": 7220,
        "y": 325
      },
      {
        "id": "s26_14",
        "x": 7790,
        "y": 395
      },
      {
        "id": "s26_15",
        "x": 8300,
        "y": 325
      },
      {
        "id": "s26_16",
        "x": 8840,
        "y": 395
      }
    ],
    "portals": [
      {
        "id": "pt26_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu26_1",
        "type": "slow_mo",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu26_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu26_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu26_4",
        "type": "slow_mo",
        "x": 7840,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 27,
    "title": "Gearbox Pendulum",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 9460,
    "deathY": 860,
    "parTimeSeconds": 36,
    "pins": [
      {
        "id": "p27_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p27_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 95
        }
      },
      {
        "id": "p27_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p27_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p27_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p27_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 95
        }
      },
      {
        "id": "p27_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p27_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p27_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p27_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 95
        }
      },
      {
        "id": "p27_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p27_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p27_13",
        "x": 3920,
        "y": 195
      },
      {
        "id": "p27_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 95
        }
      },
      {
        "id": "p27_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p27_16",
        "x": 4730,
        "y": 160
      },
      {
        "id": "p27_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p27_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 95
        }
      },
      {
        "id": "p27_19",
        "x": 5540,
        "y": 265
      },
      {
        "id": "p27_20",
        "x": 5810,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p27_21",
        "x": 6110,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p27_22",
        "x": 6350,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 95
        }
      },
      {
        "id": "p27_23",
        "x": 6620,
        "y": 265
      },
      {
        "id": "p27_24",
        "x": 6920,
        "y": 160
      },
      {
        "id": "p27_25",
        "x": 7160,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p27_26",
        "x": 7430,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 95
        }
      },
      {
        "id": "p27_27",
        "x": 7730,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p27_28",
        "x": 7970,
        "y": 160
      },
      {
        "id": "p27_29",
        "x": 8240,
        "y": 195
      },
      {
        "id": "p27_30",
        "x": 8540,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 95
        }
      },
      {
        "id": "p27_31",
        "x": 8780,
        "y": 265
      },
      {
        "id": "p27_32",
        "x": 9050,
        "y": 160
      }
    ],
    "trampolines": [
      {
        "id": "t27_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t27_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t27_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t27_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t27_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t27_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t27_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t27_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t27_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t27_10",
        "x": 8280,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t27_11",
        "x": 9090,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t27_fin",
        "x": 9240,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr27_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr27_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr27_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr27_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr27_5",
        "x": 6220,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr27_6",
        "x": 7270,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr27_7",
        "x": 8350,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz27_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz27_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz27_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz27_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      },
      {
        "id": "hz27_5",
        "x": 8910,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv27_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv27_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv27_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv27_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv27_5",
        "x": 8040,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s27_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s27_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s27_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s27_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s27_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s27_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s27_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s27_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s27_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s27_10",
        "x": 5600,
        "y": 375
      },
      {
        "id": "s27_11",
        "x": 6170,
        "y": 305
      },
      {
        "id": "s27_12",
        "x": 6680,
        "y": 375
      },
      {
        "id": "s27_13",
        "x": 7220,
        "y": 305
      },
      {
        "id": "s27_14",
        "x": 7790,
        "y": 375
      },
      {
        "id": "s27_15",
        "x": 8300,
        "y": 305
      },
      {
        "id": "s27_16",
        "x": 8840,
        "y": 375
      }
    ],
    "portals": [
      {
        "id": "pt27_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu27_1",
        "type": "slow_mo",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu27_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu27_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu27_4",
        "type": "slow_mo",
        "x": 7840,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 28,
    "title": "Boiler Room Escape",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 9770,
    "deathY": 860,
    "parTimeSeconds": 37,
    "pins": [
      {
        "id": "p28_1",
        "x": 260,
        "y": 205
      },
      {
        "id": "p28_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 110
        }
      },
      {
        "id": "p28_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p28_4",
        "x": 1070,
        "y": 170
      },
      {
        "id": "p28_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p28_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 110
        }
      },
      {
        "id": "p28_7",
        "x": 1880,
        "y": 275
      },
      {
        "id": "p28_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p28_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p28_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 110
        }
      },
      {
        "id": "p28_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p28_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p28_13",
        "x": 3920,
        "y": 205
      },
      {
        "id": "p28_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 110
        }
      },
      {
        "id": "p28_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p28_16",
        "x": 4730,
        "y": 170
      },
      {
        "id": "p28_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p28_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 110
        }
      },
      {
        "id": "p28_19",
        "x": 5540,
        "y": 275
      },
      {
        "id": "p28_20",
        "x": 5810,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p28_21",
        "x": 6110,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p28_22",
        "x": 6350,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 110
        }
      },
      {
        "id": "p28_23",
        "x": 6620,
        "y": 275
      },
      {
        "id": "p28_24",
        "x": 6920,
        "y": 170
      },
      {
        "id": "p28_25",
        "x": 7160,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p28_26",
        "x": 7430,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 110
        }
      },
      {
        "id": "p28_27",
        "x": 7730,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p28_28",
        "x": 7970,
        "y": 170
      },
      {
        "id": "p28_29",
        "x": 8240,
        "y": 205
      },
      {
        "id": "p28_30",
        "x": 8540,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 110
        }
      },
      {
        "id": "p28_31",
        "x": 8780,
        "y": 275
      },
      {
        "id": "p28_32",
        "x": 9050,
        "y": 170
      },
      {
        "id": "p28_33",
        "x": 9350,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      }
    ],
    "trampolines": [
      {
        "id": "t28_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t28_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t28_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t28_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t28_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t28_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t28_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t28_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t28_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t28_10",
        "x": 8280,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t28_11",
        "x": 9090,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t28_fin",
        "x": 9550,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr28_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr28_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr28_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr28_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr28_5",
        "x": 6220,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr28_6",
        "x": 7270,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr28_7",
        "x": 8350,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr28_8",
        "x": 9460,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz28_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz28_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz28_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz28_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      },
      {
        "id": "hz28_5",
        "x": 8910,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv28_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv28_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv28_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv28_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv28_5",
        "x": 8040,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s28_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s28_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s28_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s28_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s28_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s28_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s28_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s28_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s28_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s28_10",
        "x": 5600,
        "y": 385
      },
      {
        "id": "s28_11",
        "x": 6170,
        "y": 315
      },
      {
        "id": "s28_12",
        "x": 6680,
        "y": 385
      },
      {
        "id": "s28_13",
        "x": 7220,
        "y": 315
      },
      {
        "id": "s28_14",
        "x": 7790,
        "y": 385
      },
      {
        "id": "s28_15",
        "x": 8300,
        "y": 315
      },
      {
        "id": "s28_16",
        "x": 8840,
        "y": 385
      },
      {
        "id": "s28_17",
        "x": 9410,
        "y": 315
      }
    ],
    "portals": [
      {
        "id": "pt28_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu28_1",
        "type": "slow_mo",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu28_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu28_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu28_4",
        "type": "slow_mo",
        "x": 7840,
        "y": 360,
        "radius": 18,
        "durationSeconds": 6
      }
    ],
    "barriers": [
      {
        "id": "bar28_1",
        "x": 1400,
        "y": 190,
        "width": 24,
        "height": 190,
        "minSpeed": 500
      }
    ]
  },
  {
    "id": 29,
    "title": "Steam Geyser Highway",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 10080,
    "deathY": 860,
    "parTimeSeconds": 38,
    "pins": [
      {
        "id": "p29_1",
        "x": 260,
        "y": 215
      },
      {
        "id": "p29_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p29_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p29_4",
        "x": 1070,
        "y": 180
      },
      {
        "id": "p29_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p29_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p29_7",
        "x": 1880,
        "y": 285
      },
      {
        "id": "p29_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p29_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p29_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p29_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p29_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p29_13",
        "x": 3920,
        "y": 215
      },
      {
        "id": "p29_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p29_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p29_16",
        "x": 4730,
        "y": 180
      },
      {
        "id": "p29_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p29_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p29_19",
        "x": 5540,
        "y": 285
      },
      {
        "id": "p29_20",
        "x": 5810,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p29_21",
        "x": 6110,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p29_22",
        "x": 6350,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 65
        }
      },
      {
        "id": "p29_23",
        "x": 6620,
        "y": 285
      },
      {
        "id": "p29_24",
        "x": 6920,
        "y": 180
      },
      {
        "id": "p29_25",
        "x": 7160,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p29_26",
        "x": 7430,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 65
        }
      },
      {
        "id": "p29_27",
        "x": 7730,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p29_28",
        "x": 7970,
        "y": 180
      },
      {
        "id": "p29_29",
        "x": 8240,
        "y": 215
      },
      {
        "id": "p29_30",
        "x": 8540,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 65
        }
      },
      {
        "id": "p29_31",
        "x": 8780,
        "y": 285
      },
      {
        "id": "p29_32",
        "x": 9050,
        "y": 180
      },
      {
        "id": "p29_33",
        "x": 9350,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p29_34",
        "x": 9590,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 65
        }
      },
      {
        "id": "p29_35",
        "x": 9860,
        "y": 285,
        "fragile": true
      }
    ],
    "trampolines": [
      {
        "id": "t29_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t29_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t29_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t29_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t29_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t29_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t29_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t29_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t29_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t29_10",
        "x": 8280,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t29_11",
        "x": 9090,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t29_12",
        "x": 9900,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t29_fin",
        "x": 9860,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr29_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr29_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr29_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr29_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr29_5",
        "x": 6220,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr29_6",
        "x": 7270,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr29_7",
        "x": 8350,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr29_8",
        "x": 9460,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz29_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz29_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz29_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz29_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      },
      {
        "id": "hz29_5",
        "x": 8910,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv29_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv29_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv29_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv29_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv29_5",
        "x": 8040,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv29_6",
        "x": 9660,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s29_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s29_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s29_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s29_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s29_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s29_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s29_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s29_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s29_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s29_10",
        "x": 5600,
        "y": 395
      },
      {
        "id": "s29_11",
        "x": 6170,
        "y": 325
      },
      {
        "id": "s29_12",
        "x": 6680,
        "y": 395
      },
      {
        "id": "s29_13",
        "x": 7220,
        "y": 325
      },
      {
        "id": "s29_14",
        "x": 7790,
        "y": 395
      },
      {
        "id": "s29_15",
        "x": 8300,
        "y": 325
      },
      {
        "id": "s29_16",
        "x": 8840,
        "y": 395
      },
      {
        "id": "s29_17",
        "x": 9410,
        "y": 325
      },
      {
        "id": "s29_18",
        "x": 9920,
        "y": 395
      }
    ],
    "portals": [
      {
        "id": "pt29_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu29_1",
        "type": "slow_mo",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu29_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu29_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu29_4",
        "type": "slow_mo",
        "x": 7840,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu29_5",
        "type": "slow_mo",
        "x": 9970,
        "y": 370,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 30,
    "title": "Steampunk Mega Foundry",
    "chapter": 3,
    "theme": "steampunk",
    "startX": 80,
    "startY": 280,
    "finishX": 10390,
    "deathY": 860,
    "parTimeSeconds": 39,
    "pins": [
      {
        "id": "p30_1",
        "x": 260,
        "y": 195
      },
      {
        "id": "p30_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p30_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p30_4",
        "x": 1070,
        "y": 160
      },
      {
        "id": "p30_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p30_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p30_7",
        "x": 1880,
        "y": 265
      },
      {
        "id": "p30_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p30_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p30_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p30_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p30_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p30_13",
        "x": 3920,
        "y": 195
      },
      {
        "id": "p30_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p30_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p30_16",
        "x": 4730,
        "y": 160
      },
      {
        "id": "p30_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p30_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p30_19",
        "x": 5540,
        "y": 265
      },
      {
        "id": "p30_20",
        "x": 5810,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p30_21",
        "x": 6110,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p30_22",
        "x": 6350,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 80
        }
      },
      {
        "id": "p30_23",
        "x": 6620,
        "y": 265
      },
      {
        "id": "p30_24",
        "x": 6920,
        "y": 160
      },
      {
        "id": "p30_25",
        "x": 7160,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p30_26",
        "x": 7430,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 80
        }
      },
      {
        "id": "p30_27",
        "x": 7730,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p30_28",
        "x": 7970,
        "y": 160
      },
      {
        "id": "p30_29",
        "x": 8240,
        "y": 195
      },
      {
        "id": "p30_30",
        "x": 8540,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 80
        }
      },
      {
        "id": "p30_31",
        "x": 8780,
        "y": 265
      },
      {
        "id": "p30_32",
        "x": 9050,
        "y": 160
      },
      {
        "id": "p30_33",
        "x": 9350,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p30_34",
        "x": 9590,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 80
        }
      },
      {
        "id": "p30_35",
        "x": 9860,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p30_36",
        "x": 10160,
        "y": 160
      }
    ],
    "trampolines": [
      {
        "id": "t30_1",
        "x": 570,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t30_2",
        "x": 1380,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t30_3",
        "x": 2190,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t30_4",
        "x": 3420,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t30_5",
        "x": 4230,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t30_6",
        "x": 5040,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t30_7",
        "x": 5850,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t30_8",
        "x": 6660,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t30_9",
        "x": 7470,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t30_10",
        "x": 8280,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t30_11",
        "x": 9090,
        "y": 600,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t30_12",
        "x": 9900,
        "y": 600,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t30_fin",
        "x": 10170,
        "y": 610,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr30_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr30_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr30_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr30_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr30_5",
        "x": 6220,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr30_6",
        "x": 7270,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr30_7",
        "x": 8350,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr30_8",
        "x": 9460,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz30_1",
        "x": 960,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz30_2",
        "x": 3240,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 3190,
          "max": 3300,
          "speed": 70
        }
      },
      {
        "id": "hz30_3",
        "x": 5130,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz30_4",
        "x": 7050,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 7000,
          "max": 7110,
          "speed": 70
        }
      },
      {
        "id": "hz30_5",
        "x": 8910,
        "y": 720,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv30_1",
        "x": 1140,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv30_2",
        "x": 3180,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv30_3",
        "x": 4800,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv30_4",
        "x": 6420,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv30_5",
        "x": 8040,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv30_6",
        "x": 9660,
        "y": 480,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "stars": [
      {
        "id": "s30_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s30_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s30_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s30_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s30_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s30_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s30_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s30_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s30_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s30_10",
        "x": 5600,
        "y": 375
      },
      {
        "id": "s30_11",
        "x": 6170,
        "y": 305
      },
      {
        "id": "s30_12",
        "x": 6680,
        "y": 375
      },
      {
        "id": "s30_13",
        "x": 7220,
        "y": 305
      },
      {
        "id": "s30_14",
        "x": 7790,
        "y": 375
      },
      {
        "id": "s30_15",
        "x": 8300,
        "y": 305
      },
      {
        "id": "s30_16",
        "x": 8840,
        "y": 375
      },
      {
        "id": "s30_17",
        "x": 9410,
        "y": 305
      },
      {
        "id": "s30_18",
        "x": 9920,
        "y": 375
      }
    ],
    "portals": [
      {
        "id": "pt30_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu30_1",
        "type": "slow_mo",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu30_2",
        "type": "slow_mo",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu30_3",
        "type": "slow_mo",
        "x": 5650,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu30_4",
        "type": "slow_mo",
        "x": 7840,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      },
      {
        "id": "pu30_5",
        "type": "slow_mo",
        "x": 9970,
        "y": 350,
        "radius": 18,
        "durationSeconds": 6
      }
    ]
  },
  {
    "id": 31,
    "title": "Laser Grid Sector 1",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 10800,
    "deathY": 880,
    "parTimeSeconds": 40,
    "pins": [
      {
        "id": "p31_1",
        "x": 260,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 65
        }
      },
      {
        "id": "p31_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p31_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p31_4",
        "x": 1070,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 65
        }
      },
      {
        "id": "p31_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p31_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p31_7",
        "x": 1880,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 65
        }
      },
      {
        "id": "p31_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p31_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p31_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p31_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p31_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p31_13",
        "x": 3920,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 65
        }
      },
      {
        "id": "p31_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p31_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p31_16",
        "x": 4730,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 65
        }
      },
      {
        "id": "p31_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p31_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p31_19",
        "x": 5540,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 65
        }
      },
      {
        "id": "p31_20",
        "x": 5810,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p31_21",
        "x": 6110,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p31_22",
        "x": 6350,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 65
        }
      },
      {
        "id": "p31_23",
        "x": 6620,
        "y": 265
      },
      {
        "id": "p31_24",
        "x": 6920,
        "y": 160
      },
      {
        "id": "p31_25",
        "x": 7160,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 65
        }
      },
      {
        "id": "p31_26",
        "x": 7430,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 65
        }
      },
      {
        "id": "p31_27",
        "x": 7730,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p31_28",
        "x": 7970,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 65
        }
      },
      {
        "id": "p31_29",
        "x": 8240,
        "y": 195
      },
      {
        "id": "p31_30",
        "x": 8540,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 65
        }
      },
      {
        "id": "p31_31",
        "x": 8780,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 65
        }
      },
      {
        "id": "p31_32",
        "x": 9050,
        "y": 160
      },
      {
        "id": "p31_33",
        "x": 9350,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p31_34",
        "x": 9590,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 65
        }
      },
      {
        "id": "p31_35",
        "x": 9860,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p31_36",
        "x": 10160,
        "y": 160
      },
      {
        "id": "p31_37",
        "x": 10400,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 65
        }
      }
    ],
    "trampolines": [
      {
        "id": "t31_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t31_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t31_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t31_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t31_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t31_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t31_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t31_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t31_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t31_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t31_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t31_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t31_fin",
        "x": 10580,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr31_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr31_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr31_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr31_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr31_5",
        "x": 6220,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr31_6",
        "x": 7270,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr31_7",
        "x": 8350,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr31_8",
        "x": 9460,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr31_9",
        "x": 10510,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz31_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz31_2",
        "x": 3240,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz31_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz31_4",
        "x": 7050,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz31_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv31_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv31_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv31_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv31_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv31_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv31_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l31_1",
        "x": 630,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l31_2",
        "x": 1980,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l31_3",
        "x": 3780,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l31_4",
        "x": 5100,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l31_5",
        "x": 6450,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l31_6",
        "x": 7830,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l31_7",
        "x": 9150,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l31_8",
        "x": 10500,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s31_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s31_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s31_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s31_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s31_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s31_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s31_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s31_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s31_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s31_10",
        "x": 5600,
        "y": 375
      },
      {
        "id": "s31_11",
        "x": 6170,
        "y": 305
      },
      {
        "id": "s31_12",
        "x": 6680,
        "y": 375
      },
      {
        "id": "s31_13",
        "x": 7220,
        "y": 305
      },
      {
        "id": "s31_14",
        "x": 7790,
        "y": 375
      },
      {
        "id": "s31_15",
        "x": 8300,
        "y": 305
      },
      {
        "id": "s31_16",
        "x": 8840,
        "y": 375
      },
      {
        "id": "s31_17",
        "x": 9410,
        "y": 305
      },
      {
        "id": "s31_18",
        "x": 9920,
        "y": 375
      },
      {
        "id": "s31_19",
        "x": 10460,
        "y": 305
      }
    ],
    "portals": [
      {
        "id": "pt31_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu31_1",
        "type": "speed_boost",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu31_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu31_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu31_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu31_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      }
    ]
  },
  {
    "id": 32,
    "title": "Crimson Beam Corridor",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 11160,
    "deathY": 880,
    "parTimeSeconds": 41,
    "pins": [
      {
        "id": "p32_1",
        "x": 260,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 80
        }
      },
      {
        "id": "p32_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p32_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p32_4",
        "x": 1070,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 80
        }
      },
      {
        "id": "p32_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p32_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p32_7",
        "x": 1880,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 80
        }
      },
      {
        "id": "p32_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p32_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p32_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p32_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p32_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p32_13",
        "x": 3920,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 80
        }
      },
      {
        "id": "p32_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p32_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p32_16",
        "x": 4730,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 80
        }
      },
      {
        "id": "p32_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p32_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p32_19",
        "x": 5540,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 80
        }
      },
      {
        "id": "p32_20",
        "x": 5810,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p32_21",
        "x": 6110,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p32_22",
        "x": 6350,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 80
        }
      },
      {
        "id": "p32_23",
        "x": 6620,
        "y": 275
      },
      {
        "id": "p32_24",
        "x": 6920,
        "y": 170
      },
      {
        "id": "p32_25",
        "x": 7160,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 80
        }
      },
      {
        "id": "p32_26",
        "x": 7430,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 80
        }
      },
      {
        "id": "p32_27",
        "x": 7730,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p32_28",
        "x": 7970,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 80
        }
      },
      {
        "id": "p32_29",
        "x": 8240,
        "y": 205
      },
      {
        "id": "p32_30",
        "x": 8540,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 80
        }
      },
      {
        "id": "p32_31",
        "x": 8780,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 80
        }
      },
      {
        "id": "p32_32",
        "x": 9050,
        "y": 170
      },
      {
        "id": "p32_33",
        "x": 9350,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p32_34",
        "x": 9590,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 80
        }
      },
      {
        "id": "p32_35",
        "x": 9860,
        "y": 275,
        "fragile": true
      },
      {
        "id": "p32_36",
        "x": 10160,
        "y": 170
      },
      {
        "id": "p32_37",
        "x": 10400,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 80
        }
      },
      {
        "id": "p32_38",
        "x": 10670,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 80
        }
      },
      {
        "id": "p32_39",
        "x": 10970,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      }
    ],
    "trampolines": [
      {
        "id": "t32_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t32_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t32_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t32_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t32_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t32_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t32_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t32_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t32_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t32_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t32_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t32_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t32_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t32_fin",
        "x": 10940,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr32_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr32_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr32_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr32_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr32_5",
        "x": 6220,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr32_6",
        "x": 7270,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr32_7",
        "x": 8350,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr32_8",
        "x": 9460,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr32_9",
        "x": 10510,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz32_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz32_2",
        "x": 3240,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz32_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz32_4",
        "x": 7050,
        "y": 310,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 190,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz32_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz32_6",
        "x": 10800,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv32_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv32_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv32_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv32_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv32_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv32_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l32_1",
        "x": 630,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l32_2",
        "x": 1980,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l32_3",
        "x": 3780,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l32_4",
        "x": 5100,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l32_5",
        "x": 6450,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l32_6",
        "x": 7830,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l32_7",
        "x": 9150,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l32_8",
        "x": 10500,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s32_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s32_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s32_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s32_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s32_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s32_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s32_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s32_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s32_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s32_10",
        "x": 5600,
        "y": 385
      },
      {
        "id": "s32_11",
        "x": 6170,
        "y": 315
      },
      {
        "id": "s32_12",
        "x": 6680,
        "y": 385
      },
      {
        "id": "s32_13",
        "x": 7220,
        "y": 315
      },
      {
        "id": "s32_14",
        "x": 7790,
        "y": 385
      },
      {
        "id": "s32_15",
        "x": 8300,
        "y": 315
      },
      {
        "id": "s32_16",
        "x": 8840,
        "y": 385
      },
      {
        "id": "s32_17",
        "x": 9410,
        "y": 315
      },
      {
        "id": "s32_18",
        "x": 9920,
        "y": 385
      },
      {
        "id": "s32_19",
        "x": 10460,
        "y": 315
      },
      {
        "id": "s32_20",
        "x": 11030,
        "y": 385
      }
    ],
    "portals": [
      {
        "id": "pt32_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu32_1",
        "type": "speed_boost",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu32_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu32_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu32_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu32_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      }
    ]
  },
  {
    "id": 33,
    "title": "Pendulum Blade Chamber",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 11520,
    "deathY": 880,
    "parTimeSeconds": 42,
    "pins": [
      {
        "id": "p33_1",
        "x": 260,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 95
        }
      },
      {
        "id": "p33_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 95
        }
      },
      {
        "id": "p33_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p33_4",
        "x": 1070,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 95
        }
      },
      {
        "id": "p33_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p33_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 95
        }
      },
      {
        "id": "p33_7",
        "x": 1880,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 95
        }
      },
      {
        "id": "p33_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p33_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p33_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 95
        }
      },
      {
        "id": "p33_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p33_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p33_13",
        "x": 3920,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 95
        }
      },
      {
        "id": "p33_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 95
        }
      },
      {
        "id": "p33_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p33_16",
        "x": 4730,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 95
        }
      },
      {
        "id": "p33_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p33_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 95
        }
      },
      {
        "id": "p33_19",
        "x": 5540,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 95
        }
      },
      {
        "id": "p33_20",
        "x": 5810,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p33_21",
        "x": 6110,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p33_22",
        "x": 6350,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 95
        }
      },
      {
        "id": "p33_23",
        "x": 6620,
        "y": 285
      },
      {
        "id": "p33_24",
        "x": 6920,
        "y": 180
      },
      {
        "id": "p33_25",
        "x": 7160,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 95
        }
      },
      {
        "id": "p33_26",
        "x": 7430,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 95
        }
      },
      {
        "id": "p33_27",
        "x": 7730,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p33_28",
        "x": 7970,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 95
        }
      },
      {
        "id": "p33_29",
        "x": 8240,
        "y": 215
      },
      {
        "id": "p33_30",
        "x": 8540,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 95
        }
      },
      {
        "id": "p33_31",
        "x": 8780,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 95
        }
      },
      {
        "id": "p33_32",
        "x": 9050,
        "y": 180
      },
      {
        "id": "p33_33",
        "x": 9350,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p33_34",
        "x": 9590,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 95
        }
      },
      {
        "id": "p33_35",
        "x": 9860,
        "y": 285,
        "fragile": true
      },
      {
        "id": "p33_36",
        "x": 10160,
        "y": 180
      },
      {
        "id": "p33_37",
        "x": 10400,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 95
        }
      },
      {
        "id": "p33_38",
        "x": 10670,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 95
        }
      },
      {
        "id": "p33_39",
        "x": 10970,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p33_40",
        "x": 11210,
        "y": 180,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11165,
          "max": 11255,
          "speed": 95
        }
      }
    ],
    "trampolines": [
      {
        "id": "t33_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t33_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t33_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t33_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t33_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t33_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t33_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t33_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t33_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t33_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t33_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t33_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t33_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t33_fin",
        "x": 11300,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr33_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr33_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr33_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr33_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr33_5",
        "x": 6220,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr33_6",
        "x": 7270,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr33_7",
        "x": 8350,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr33_8",
        "x": 9460,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr33_9",
        "x": 10510,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz33_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz33_2",
        "x": 3240,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz33_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz33_4",
        "x": 7050,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz33_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz33_6",
        "x": 10800,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv33_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv33_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv33_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv33_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv33_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv33_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv33_7",
        "x": 11280,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l33_1",
        "x": 630,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l33_2",
        "x": 1980,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l33_3",
        "x": 3780,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l33_4",
        "x": 5100,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l33_5",
        "x": 6450,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l33_6",
        "x": 7830,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l33_7",
        "x": 9150,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l33_8",
        "x": 10500,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s33_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s33_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s33_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s33_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s33_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s33_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s33_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s33_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s33_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s33_10",
        "x": 5600,
        "y": 395
      },
      {
        "id": "s33_11",
        "x": 6170,
        "y": 325
      },
      {
        "id": "s33_12",
        "x": 6680,
        "y": 395
      },
      {
        "id": "s33_13",
        "x": 7220,
        "y": 325
      },
      {
        "id": "s33_14",
        "x": 7790,
        "y": 395
      },
      {
        "id": "s33_15",
        "x": 8300,
        "y": 325
      },
      {
        "id": "s33_16",
        "x": 8840,
        "y": 395
      },
      {
        "id": "s33_17",
        "x": 9410,
        "y": 325
      },
      {
        "id": "s33_18",
        "x": 9920,
        "y": 395
      },
      {
        "id": "s33_19",
        "x": 10460,
        "y": 325
      },
      {
        "id": "s33_20",
        "x": 11030,
        "y": 395
      }
    ],
    "portals": [
      {
        "id": "pt33_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu33_1",
        "type": "speed_boost",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu33_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu33_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu33_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu33_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      }
    ]
  },
  {
    "id": 34,
    "title": "Laser Warp Junction",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 11880,
    "deathY": 880,
    "parTimeSeconds": 43,
    "pins": [
      {
        "id": "p34_1",
        "x": 260,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 110
        }
      },
      {
        "id": "p34_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 110
        }
      },
      {
        "id": "p34_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p34_4",
        "x": 1070,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 110
        }
      },
      {
        "id": "p34_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p34_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 110
        }
      },
      {
        "id": "p34_7",
        "x": 1880,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 110
        }
      },
      {
        "id": "p34_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p34_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p34_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 110
        }
      },
      {
        "id": "p34_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p34_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p34_13",
        "x": 3920,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 110
        }
      },
      {
        "id": "p34_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 110
        }
      },
      {
        "id": "p34_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p34_16",
        "x": 4730,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 110
        }
      },
      {
        "id": "p34_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p34_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 110
        }
      },
      {
        "id": "p34_19",
        "x": 5540,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 110
        }
      },
      {
        "id": "p34_20",
        "x": 5810,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p34_21",
        "x": 6110,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p34_22",
        "x": 6350,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 110
        }
      },
      {
        "id": "p34_23",
        "x": 6620,
        "y": 265
      },
      {
        "id": "p34_24",
        "x": 6920,
        "y": 160
      },
      {
        "id": "p34_25",
        "x": 7160,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 110
        }
      },
      {
        "id": "p34_26",
        "x": 7430,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 110
        }
      },
      {
        "id": "p34_27",
        "x": 7730,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p34_28",
        "x": 7970,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 110
        }
      },
      {
        "id": "p34_29",
        "x": 8240,
        "y": 195
      },
      {
        "id": "p34_30",
        "x": 8540,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 110
        }
      },
      {
        "id": "p34_31",
        "x": 8780,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 110
        }
      },
      {
        "id": "p34_32",
        "x": 9050,
        "y": 160
      },
      {
        "id": "p34_33",
        "x": 9350,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p34_34",
        "x": 9590,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 110
        }
      },
      {
        "id": "p34_35",
        "x": 9860,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p34_36",
        "x": 10160,
        "y": 160
      },
      {
        "id": "p34_37",
        "x": 10400,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 110
        }
      },
      {
        "id": "p34_38",
        "x": 10670,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 110
        }
      },
      {
        "id": "p34_39",
        "x": 10970,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p34_40",
        "x": 11210,
        "y": 160,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11165,
          "max": 11255,
          "speed": 110
        }
      },
      {
        "id": "p34_41",
        "x": 11480,
        "y": 195
      }
    ],
    "trampolines": [
      {
        "id": "t34_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t34_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t34_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t34_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t34_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t34_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t34_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t34_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t34_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t34_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t34_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t34_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t34_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t34_14",
        "x": 11520,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t34_fin",
        "x": 11660,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr34_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_5",
        "x": 6220,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_6",
        "x": 7270,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_7",
        "x": 8350,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_8",
        "x": 9460,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_9",
        "x": 10510,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr34_10",
        "x": 11590,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz34_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz34_2",
        "x": 3240,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz34_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz34_4",
        "x": 7050,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz34_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz34_6",
        "x": 10800,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv34_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv34_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv34_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv34_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv34_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv34_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv34_7",
        "x": 11280,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l34_1",
        "x": 630,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l34_2",
        "x": 1980,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l34_3",
        "x": 3780,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l34_4",
        "x": 5100,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l34_5",
        "x": 6450,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l34_6",
        "x": 7830,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l34_7",
        "x": 9150,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l34_8",
        "x": 10500,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s34_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s34_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s34_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s34_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s34_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s34_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s34_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s34_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s34_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s34_10",
        "x": 5600,
        "y": 375
      },
      {
        "id": "s34_11",
        "x": 6170,
        "y": 305
      },
      {
        "id": "s34_12",
        "x": 6680,
        "y": 375
      },
      {
        "id": "s34_13",
        "x": 7220,
        "y": 305
      },
      {
        "id": "s34_14",
        "x": 7790,
        "y": 375
      },
      {
        "id": "s34_15",
        "x": 8300,
        "y": 305
      },
      {
        "id": "s34_16",
        "x": 8840,
        "y": 375
      },
      {
        "id": "s34_17",
        "x": 9410,
        "y": 305
      },
      {
        "id": "s34_18",
        "x": 9920,
        "y": 375
      },
      {
        "id": "s34_19",
        "x": 10460,
        "y": 305
      },
      {
        "id": "s34_20",
        "x": 11030,
        "y": 375
      },
      {
        "id": "s34_21",
        "x": 11540,
        "y": 305
      }
    ],
    "portals": [
      {
        "id": "pt34_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu34_1",
        "type": "speed_boost",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu34_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu34_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu34_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu34_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      }
    ],
    "wreckingBalls": [
      {
        "id": "wb34_1",
        "pivotX": 1450,
        "pivotY": 40,
        "chainLength": 250,
        "radius": 28,
        "swingSpeed": 2.8,
        "maxAngle": 1
      }
    ]
  },
  {
    "id": 35,
    "title": "Fragile Core Walkway",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 12240,
    "deathY": 880,
    "parTimeSeconds": 44,
    "pins": [
      {
        "id": "p35_1",
        "x": 260,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 65
        }
      },
      {
        "id": "p35_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p35_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p35_4",
        "x": 1070,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 65
        }
      },
      {
        "id": "p35_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p35_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p35_7",
        "x": 1880,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 65
        }
      },
      {
        "id": "p35_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p35_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p35_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p35_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p35_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p35_13",
        "x": 3920,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 65
        }
      },
      {
        "id": "p35_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p35_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p35_16",
        "x": 4730,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 65
        }
      },
      {
        "id": "p35_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p35_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p35_19",
        "x": 5540,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 65
        }
      },
      {
        "id": "p35_20",
        "x": 5810,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p35_21",
        "x": 6110,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p35_22",
        "x": 6350,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 65
        }
      },
      {
        "id": "p35_23",
        "x": 6620,
        "y": 275
      },
      {
        "id": "p35_24",
        "x": 6920,
        "y": 170
      },
      {
        "id": "p35_25",
        "x": 7160,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 65
        }
      },
      {
        "id": "p35_26",
        "x": 7430,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 65
        }
      },
      {
        "id": "p35_27",
        "x": 7730,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p35_28",
        "x": 7970,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 65
        }
      },
      {
        "id": "p35_29",
        "x": 8240,
        "y": 205
      },
      {
        "id": "p35_30",
        "x": 8540,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 65
        }
      },
      {
        "id": "p35_31",
        "x": 8780,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 65
        }
      },
      {
        "id": "p35_32",
        "x": 9050,
        "y": 170
      },
      {
        "id": "p35_33",
        "x": 9350,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p35_34",
        "x": 9590,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 65
        }
      },
      {
        "id": "p35_35",
        "x": 9860,
        "y": 275,
        "fragile": true
      },
      {
        "id": "p35_36",
        "x": 10160,
        "y": 170
      },
      {
        "id": "p35_37",
        "x": 10400,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 65
        }
      },
      {
        "id": "p35_38",
        "x": 10670,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 65
        }
      },
      {
        "id": "p35_39",
        "x": 10970,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p35_40",
        "x": 11210,
        "y": 170,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11165,
          "max": 11255,
          "speed": 65
        }
      },
      {
        "id": "p35_41",
        "x": 11480,
        "y": 205
      },
      {
        "id": "p35_42",
        "x": 11780,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 11735,
          "max": 11825,
          "speed": 65
        }
      },
      {
        "id": "p35_43",
        "x": 12020,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 11975,
          "max": 12065,
          "speed": 65
        }
      }
    ],
    "trampolines": [
      {
        "id": "t35_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t35_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t35_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t35_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t35_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t35_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t35_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t35_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t35_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t35_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t35_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t35_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t35_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t35_14",
        "x": 11520,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t35_fin",
        "x": 12020,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr35_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_5",
        "x": 6220,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_6",
        "x": 7270,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_7",
        "x": 8350,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_8",
        "x": 9460,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_9",
        "x": 10510,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr35_10",
        "x": 11590,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz35_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz35_2",
        "x": 3240,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz35_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz35_4",
        "x": 7050,
        "y": 310,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 190,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz35_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz35_6",
        "x": 10800,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv35_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv35_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv35_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv35_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv35_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv35_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv35_7",
        "x": 11280,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l35_1",
        "x": 630,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l35_2",
        "x": 1980,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l35_3",
        "x": 3780,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l35_4",
        "x": 5100,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l35_5",
        "x": 6450,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l35_6",
        "x": 7830,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l35_7",
        "x": 9150,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l35_8",
        "x": 10500,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l35_9",
        "x": 11880,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s35_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s35_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s35_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s35_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s35_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s35_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s35_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s35_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s35_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s35_10",
        "x": 5600,
        "y": 385
      },
      {
        "id": "s35_11",
        "x": 6170,
        "y": 315
      },
      {
        "id": "s35_12",
        "x": 6680,
        "y": 385
      },
      {
        "id": "s35_13",
        "x": 7220,
        "y": 315
      },
      {
        "id": "s35_14",
        "x": 7790,
        "y": 385
      },
      {
        "id": "s35_15",
        "x": 8300,
        "y": 315
      },
      {
        "id": "s35_16",
        "x": 8840,
        "y": 385
      },
      {
        "id": "s35_17",
        "x": 9410,
        "y": 315
      },
      {
        "id": "s35_18",
        "x": 9920,
        "y": 385
      },
      {
        "id": "s35_19",
        "x": 10460,
        "y": 315
      },
      {
        "id": "s35_20",
        "x": 11030,
        "y": 385
      },
      {
        "id": "s35_21",
        "x": 11540,
        "y": 315
      },
      {
        "id": "s35_22",
        "x": 12080,
        "y": 385
      }
    ],
    "portals": [
      {
        "id": "pt35_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu35_1",
        "type": "speed_boost",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu35_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu35_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu35_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu35_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu35_6",
        "type": "speed_boost",
        "x": 12130,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      }
    ],
    "bungeeWebs": [
      {
        "id": "bw35_1",
        "x": 1750,
        "y": 560,
        "width": 160,
        "launchVy": -900,
        "launchVx": 740
      }
    ]
  },
  {
    "id": 36,
    "title": "Crossfire Cavern",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 12600,
    "deathY": 880,
    "parTimeSeconds": 45,
    "pins": [
      {
        "id": "p36_1",
        "x": 260,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 80
        }
      },
      {
        "id": "p36_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p36_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p36_4",
        "x": 1070,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 80
        }
      },
      {
        "id": "p36_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p36_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p36_7",
        "x": 1880,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 80
        }
      },
      {
        "id": "p36_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p36_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p36_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p36_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p36_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p36_13",
        "x": 3920,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 80
        }
      },
      {
        "id": "p36_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p36_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p36_16",
        "x": 4730,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 80
        }
      },
      {
        "id": "p36_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p36_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p36_19",
        "x": 5540,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 80
        }
      },
      {
        "id": "p36_20",
        "x": 5810,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p36_21",
        "x": 6110,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p36_22",
        "x": 6350,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 80
        }
      },
      {
        "id": "p36_23",
        "x": 6620,
        "y": 285
      },
      {
        "id": "p36_24",
        "x": 6920,
        "y": 180
      },
      {
        "id": "p36_25",
        "x": 7160,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 80
        }
      },
      {
        "id": "p36_26",
        "x": 7430,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 80
        }
      },
      {
        "id": "p36_27",
        "x": 7730,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p36_28",
        "x": 7970,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 80
        }
      },
      {
        "id": "p36_29",
        "x": 8240,
        "y": 215
      },
      {
        "id": "p36_30",
        "x": 8540,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 80
        }
      },
      {
        "id": "p36_31",
        "x": 8780,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 80
        }
      },
      {
        "id": "p36_32",
        "x": 9050,
        "y": 180
      },
      {
        "id": "p36_33",
        "x": 9350,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p36_34",
        "x": 9590,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 80
        }
      },
      {
        "id": "p36_35",
        "x": 9860,
        "y": 285,
        "fragile": true
      },
      {
        "id": "p36_36",
        "x": 10160,
        "y": 180
      },
      {
        "id": "p36_37",
        "x": 10400,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 80
        }
      },
      {
        "id": "p36_38",
        "x": 10670,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 80
        }
      },
      {
        "id": "p36_39",
        "x": 10970,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p36_40",
        "x": 11210,
        "y": 180,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11165,
          "max": 11255,
          "speed": 80
        }
      },
      {
        "id": "p36_41",
        "x": 11480,
        "y": 215
      },
      {
        "id": "p36_42",
        "x": 11780,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 11735,
          "max": 11825,
          "speed": 80
        }
      },
      {
        "id": "p36_43",
        "x": 12020,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 11975,
          "max": 12065,
          "speed": 80
        }
      },
      {
        "id": "p36_44",
        "x": 12290,
        "y": 180
      }
    ],
    "trampolines": [
      {
        "id": "t36_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t36_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t36_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t36_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t36_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t36_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t36_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t36_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t36_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t36_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t36_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t36_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t36_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t36_14",
        "x": 11520,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t36_15",
        "x": 12330,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t36_fin",
        "x": 12380,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr36_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_5",
        "x": 6220,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_6",
        "x": 7270,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_7",
        "x": 8350,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_8",
        "x": 9460,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_9",
        "x": 10510,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr36_10",
        "x": 11590,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz36_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz36_2",
        "x": 3240,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz36_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz36_4",
        "x": 7050,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz36_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz36_6",
        "x": 10800,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv36_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv36_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv36_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv36_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv36_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv36_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv36_7",
        "x": 11280,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l36_1",
        "x": 630,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l36_2",
        "x": 1980,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l36_3",
        "x": 3780,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l36_4",
        "x": 5100,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l36_5",
        "x": 6450,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l36_6",
        "x": 7830,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l36_7",
        "x": 9150,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l36_8",
        "x": 10500,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l36_9",
        "x": 11880,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s36_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s36_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s36_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s36_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s36_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s36_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s36_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s36_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s36_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s36_10",
        "x": 5600,
        "y": 395
      },
      {
        "id": "s36_11",
        "x": 6170,
        "y": 325
      },
      {
        "id": "s36_12",
        "x": 6680,
        "y": 395
      },
      {
        "id": "s36_13",
        "x": 7220,
        "y": 325
      },
      {
        "id": "s36_14",
        "x": 7790,
        "y": 395
      },
      {
        "id": "s36_15",
        "x": 8300,
        "y": 325
      },
      {
        "id": "s36_16",
        "x": 8840,
        "y": 395
      },
      {
        "id": "s36_17",
        "x": 9410,
        "y": 325
      },
      {
        "id": "s36_18",
        "x": 9920,
        "y": 395
      },
      {
        "id": "s36_19",
        "x": 10460,
        "y": 325
      },
      {
        "id": "s36_20",
        "x": 11030,
        "y": 395
      },
      {
        "id": "s36_21",
        "x": 11540,
        "y": 325
      },
      {
        "id": "s36_22",
        "x": 12080,
        "y": 395
      }
    ],
    "portals": [
      {
        "id": "pt36_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu36_1",
        "type": "speed_boost",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu36_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu36_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu36_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu36_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu36_6",
        "type": "speed_boost",
        "x": 12130,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      }
    ]
  },
  {
    "id": 37,
    "title": "Sawmill Overdrive",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 12960,
    "deathY": 880,
    "parTimeSeconds": 46,
    "pins": [
      {
        "id": "p37_1",
        "x": 260,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 95
        }
      },
      {
        "id": "p37_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 95
        }
      },
      {
        "id": "p37_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p37_4",
        "x": 1070,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 95
        }
      },
      {
        "id": "p37_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p37_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 95
        }
      },
      {
        "id": "p37_7",
        "x": 1880,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 95
        }
      },
      {
        "id": "p37_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p37_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p37_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 95
        }
      },
      {
        "id": "p37_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p37_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p37_13",
        "x": 3920,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 95
        }
      },
      {
        "id": "p37_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 95
        }
      },
      {
        "id": "p37_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p37_16",
        "x": 4730,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 95
        }
      },
      {
        "id": "p37_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p37_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 95
        }
      },
      {
        "id": "p37_19",
        "x": 5540,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 95
        }
      },
      {
        "id": "p37_20",
        "x": 5810,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p37_21",
        "x": 6110,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p37_22",
        "x": 6350,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 95
        }
      },
      {
        "id": "p37_23",
        "x": 6620,
        "y": 265
      },
      {
        "id": "p37_24",
        "x": 6920,
        "y": 160
      },
      {
        "id": "p37_25",
        "x": 7160,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 95
        }
      },
      {
        "id": "p37_26",
        "x": 7430,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 95
        }
      },
      {
        "id": "p37_27",
        "x": 7730,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p37_28",
        "x": 7970,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 95
        }
      },
      {
        "id": "p37_29",
        "x": 8240,
        "y": 195
      },
      {
        "id": "p37_30",
        "x": 8540,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 95
        }
      },
      {
        "id": "p37_31",
        "x": 8780,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 95
        }
      },
      {
        "id": "p37_32",
        "x": 9050,
        "y": 160
      },
      {
        "id": "p37_33",
        "x": 9350,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p37_34",
        "x": 9590,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 95
        }
      },
      {
        "id": "p37_35",
        "x": 9860,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p37_36",
        "x": 10160,
        "y": 160
      },
      {
        "id": "p37_37",
        "x": 10400,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 95
        }
      },
      {
        "id": "p37_38",
        "x": 10670,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 95
        }
      },
      {
        "id": "p37_39",
        "x": 10970,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p37_40",
        "x": 11210,
        "y": 160,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11165,
          "max": 11255,
          "speed": 95
        }
      },
      {
        "id": "p37_41",
        "x": 11480,
        "y": 195
      },
      {
        "id": "p37_42",
        "x": 11780,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 11735,
          "max": 11825,
          "speed": 95
        }
      },
      {
        "id": "p37_43",
        "x": 12020,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 11975,
          "max": 12065,
          "speed": 95
        }
      },
      {
        "id": "p37_44",
        "x": 12290,
        "y": 160
      },
      {
        "id": "p37_45",
        "x": 12590,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      }
    ],
    "trampolines": [
      {
        "id": "t37_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t37_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t37_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t37_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t37_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t37_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t37_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t37_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t37_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t37_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t37_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t37_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t37_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t37_14",
        "x": 11520,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t37_15",
        "x": 12330,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t37_fin",
        "x": 12740,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr37_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_5",
        "x": 6220,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_6",
        "x": 7270,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_7",
        "x": 8350,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_8",
        "x": 9460,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_9",
        "x": 10510,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_10",
        "x": 11590,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr37_11",
        "x": 12700,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz37_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz37_2",
        "x": 3240,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz37_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz37_4",
        "x": 7050,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz37_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz37_6",
        "x": 10800,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz37_7",
        "x": 12720,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 12670,
          "max": 12780,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv37_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv37_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv37_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv37_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv37_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv37_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv37_7",
        "x": 11280,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l37_1",
        "x": 630,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l37_2",
        "x": 1980,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l37_3",
        "x": 3780,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l37_4",
        "x": 5100,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l37_5",
        "x": 6450,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l37_6",
        "x": 7830,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l37_7",
        "x": 9150,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l37_8",
        "x": 10500,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l37_9",
        "x": 11880,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s37_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s37_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s37_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s37_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s37_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s37_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s37_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s37_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s37_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s37_10",
        "x": 5600,
        "y": 375
      },
      {
        "id": "s37_11",
        "x": 6170,
        "y": 305
      },
      {
        "id": "s37_12",
        "x": 6680,
        "y": 375
      },
      {
        "id": "s37_13",
        "x": 7220,
        "y": 305
      },
      {
        "id": "s37_14",
        "x": 7790,
        "y": 375
      },
      {
        "id": "s37_15",
        "x": 8300,
        "y": 305
      },
      {
        "id": "s37_16",
        "x": 8840,
        "y": 375
      },
      {
        "id": "s37_17",
        "x": 9410,
        "y": 305
      },
      {
        "id": "s37_18",
        "x": 9920,
        "y": 375
      },
      {
        "id": "s37_19",
        "x": 10460,
        "y": 305
      },
      {
        "id": "s37_20",
        "x": 11030,
        "y": 375
      },
      {
        "id": "s37_21",
        "x": 11540,
        "y": 305
      },
      {
        "id": "s37_22",
        "x": 12080,
        "y": 375
      },
      {
        "id": "s37_23",
        "x": 12650,
        "y": 305
      }
    ],
    "portals": [
      {
        "id": "pt37_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu37_1",
        "type": "speed_boost",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu37_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu37_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu37_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu37_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu37_6",
        "type": "speed_boost",
        "x": 12130,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      }
    ]
  },
  {
    "id": 38,
    "title": "Inferno Gauntlet",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 13320,
    "deathY": 880,
    "parTimeSeconds": 47,
    "pins": [
      {
        "id": "p38_1",
        "x": 260,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 110
        }
      },
      {
        "id": "p38_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 110
        }
      },
      {
        "id": "p38_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p38_4",
        "x": 1070,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 110
        }
      },
      {
        "id": "p38_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p38_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 110
        }
      },
      {
        "id": "p38_7",
        "x": 1880,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 110
        }
      },
      {
        "id": "p38_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p38_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p38_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 110
        }
      },
      {
        "id": "p38_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p38_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p38_13",
        "x": 3920,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 110
        }
      },
      {
        "id": "p38_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 110
        }
      },
      {
        "id": "p38_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p38_16",
        "x": 4730,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 110
        }
      },
      {
        "id": "p38_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p38_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 110
        }
      },
      {
        "id": "p38_19",
        "x": 5540,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 110
        }
      },
      {
        "id": "p38_20",
        "x": 5810,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p38_21",
        "x": 6110,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p38_22",
        "x": 6350,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 110
        }
      },
      {
        "id": "p38_23",
        "x": 6620,
        "y": 275
      },
      {
        "id": "p38_24",
        "x": 6920,
        "y": 170
      },
      {
        "id": "p38_25",
        "x": 7160,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 110
        }
      },
      {
        "id": "p38_26",
        "x": 7430,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 110
        }
      },
      {
        "id": "p38_27",
        "x": 7730,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p38_28",
        "x": 7970,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 110
        }
      },
      {
        "id": "p38_29",
        "x": 8240,
        "y": 205
      },
      {
        "id": "p38_30",
        "x": 8540,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 110
        }
      },
      {
        "id": "p38_31",
        "x": 8780,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 110
        }
      },
      {
        "id": "p38_32",
        "x": 9050,
        "y": 170
      },
      {
        "id": "p38_33",
        "x": 9350,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p38_34",
        "x": 9590,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 110
        }
      },
      {
        "id": "p38_35",
        "x": 9860,
        "y": 275,
        "fragile": true
      },
      {
        "id": "p38_36",
        "x": 10160,
        "y": 170
      },
      {
        "id": "p38_37",
        "x": 10400,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 110
        }
      },
      {
        "id": "p38_38",
        "x": 10670,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 110
        }
      },
      {
        "id": "p38_39",
        "x": 10970,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p38_40",
        "x": 11210,
        "y": 170,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11165,
          "max": 11255,
          "speed": 110
        }
      },
      {
        "id": "p38_41",
        "x": 11480,
        "y": 205
      },
      {
        "id": "p38_42",
        "x": 11780,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 11735,
          "max": 11825,
          "speed": 110
        }
      },
      {
        "id": "p38_43",
        "x": 12020,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 11975,
          "max": 12065,
          "speed": 110
        }
      },
      {
        "id": "p38_44",
        "x": 12290,
        "y": 170
      },
      {
        "id": "p38_45",
        "x": 12590,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p38_46",
        "x": 12830,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 12785,
          "max": 12875,
          "speed": 110
        }
      },
      {
        "id": "p38_47",
        "x": 13100,
        "y": 275
      }
    ],
    "trampolines": [
      {
        "id": "t38_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t38_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t38_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t38_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t38_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t38_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t38_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t38_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t38_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t38_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t38_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t38_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t38_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t38_14",
        "x": 11520,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t38_15",
        "x": 12330,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t38_16",
        "x": 13140,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t38_fin",
        "x": 13100,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr38_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_5",
        "x": 6220,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_6",
        "x": 7270,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_7",
        "x": 8350,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_8",
        "x": 9460,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_9",
        "x": 10510,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_10",
        "x": 11590,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr38_11",
        "x": 12700,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz38_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz38_2",
        "x": 3240,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz38_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz38_4",
        "x": 7050,
        "y": 310,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 190,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz38_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz38_6",
        "x": 10800,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz38_7",
        "x": 12720,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 12670,
          "max": 12780,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv38_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv38_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv38_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv38_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv38_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv38_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv38_7",
        "x": 11280,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv38_8",
        "x": 12900,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l38_1",
        "x": 630,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l38_2",
        "x": 1980,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l38_3",
        "x": 3780,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l38_4",
        "x": 5100,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l38_5",
        "x": 6450,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l38_6",
        "x": 7830,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l38_7",
        "x": 9150,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l38_8",
        "x": 10500,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l38_9",
        "x": 11880,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l38_10",
        "x": 13200,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s38_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s38_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s38_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s38_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s38_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s38_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s38_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s38_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s38_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s38_10",
        "x": 5600,
        "y": 385
      },
      {
        "id": "s38_11",
        "x": 6170,
        "y": 315
      },
      {
        "id": "s38_12",
        "x": 6680,
        "y": 385
      },
      {
        "id": "s38_13",
        "x": 7220,
        "y": 315
      },
      {
        "id": "s38_14",
        "x": 7790,
        "y": 385
      },
      {
        "id": "s38_15",
        "x": 8300,
        "y": 315
      },
      {
        "id": "s38_16",
        "x": 8840,
        "y": 385
      },
      {
        "id": "s38_17",
        "x": 9410,
        "y": 315
      },
      {
        "id": "s38_18",
        "x": 9920,
        "y": 385
      },
      {
        "id": "s38_19",
        "x": 10460,
        "y": 315
      },
      {
        "id": "s38_20",
        "x": 11030,
        "y": 385
      },
      {
        "id": "s38_21",
        "x": 11540,
        "y": 315
      },
      {
        "id": "s38_22",
        "x": 12080,
        "y": 385
      },
      {
        "id": "s38_23",
        "x": 12650,
        "y": 315
      },
      {
        "id": "s38_24",
        "x": 13160,
        "y": 385
      }
    ],
    "portals": [
      {
        "id": "pt38_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu38_1",
        "type": "speed_boost",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu38_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu38_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu38_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu38_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu38_6",
        "type": "speed_boost",
        "x": 12130,
        "y": 360,
        "radius": 18,
        "durationSeconds": 5
      }
    ],
    "barriers": [
      {
        "id": "bar38_1",
        "x": 1150,
        "y": 190,
        "width": 24,
        "height": 180,
        "minSpeed": 500
      }
    ],
    "wreckingBalls": [
      {
        "id": "wb38_1",
        "pivotX": 1800,
        "pivotY": 40,
        "chainLength": 240,
        "radius": 26,
        "swingSpeed": 2.6,
        "maxAngle": 0.9
      }
    ]
  },
  {
    "id": 39,
    "title": "Laser Matrix Drift",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 13680,
    "deathY": 880,
    "parTimeSeconds": 48,
    "pins": [
      {
        "id": "p39_1",
        "x": 260,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 65
        }
      },
      {
        "id": "p39_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p39_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p39_4",
        "x": 1070,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 65
        }
      },
      {
        "id": "p39_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p39_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p39_7",
        "x": 1880,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 65
        }
      },
      {
        "id": "p39_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p39_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p39_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p39_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p39_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p39_13",
        "x": 3920,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 65
        }
      },
      {
        "id": "p39_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p39_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p39_16",
        "x": 4730,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 65
        }
      },
      {
        "id": "p39_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p39_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p39_19",
        "x": 5540,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 65
        }
      },
      {
        "id": "p39_20",
        "x": 5810,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p39_21",
        "x": 6110,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p39_22",
        "x": 6350,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 65
        }
      },
      {
        "id": "p39_23",
        "x": 6620,
        "y": 285
      },
      {
        "id": "p39_24",
        "x": 6920,
        "y": 180
      },
      {
        "id": "p39_25",
        "x": 7160,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 65
        }
      },
      {
        "id": "p39_26",
        "x": 7430,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 65
        }
      },
      {
        "id": "p39_27",
        "x": 7730,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p39_28",
        "x": 7970,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 65
        }
      },
      {
        "id": "p39_29",
        "x": 8240,
        "y": 215
      },
      {
        "id": "p39_30",
        "x": 8540,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 65
        }
      },
      {
        "id": "p39_31",
        "x": 8780,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 65
        }
      },
      {
        "id": "p39_32",
        "x": 9050,
        "y": 180
      },
      {
        "id": "p39_33",
        "x": 9350,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p39_34",
        "x": 9590,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 65
        }
      },
      {
        "id": "p39_35",
        "x": 9860,
        "y": 285,
        "fragile": true
      },
      {
        "id": "p39_36",
        "x": 10160,
        "y": 180
      },
      {
        "id": "p39_37",
        "x": 10400,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 65
        }
      },
      {
        "id": "p39_38",
        "x": 10670,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 65
        }
      },
      {
        "id": "p39_39",
        "x": 10970,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p39_40",
        "x": 11210,
        "y": 180,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11165,
          "max": 11255,
          "speed": 65
        }
      },
      {
        "id": "p39_41",
        "x": 11480,
        "y": 215
      },
      {
        "id": "p39_42",
        "x": 11780,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 11735,
          "max": 11825,
          "speed": 65
        }
      },
      {
        "id": "p39_43",
        "x": 12020,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 11975,
          "max": 12065,
          "speed": 65
        }
      },
      {
        "id": "p39_44",
        "x": 12290,
        "y": 180
      },
      {
        "id": "p39_45",
        "x": 12590,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p39_46",
        "x": 12830,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 12785,
          "max": 12875,
          "speed": 65
        }
      },
      {
        "id": "p39_47",
        "x": 13100,
        "y": 285
      },
      {
        "id": "p39_48",
        "x": 13400,
        "y": 180
      }
    ],
    "trampolines": [
      {
        "id": "t39_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t39_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t39_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t39_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t39_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t39_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t39_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t39_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t39_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t39_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t39_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t39_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t39_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t39_14",
        "x": 11520,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t39_15",
        "x": 12330,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t39_16",
        "x": 13140,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t39_fin",
        "x": 13460,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr39_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_5",
        "x": 6220,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_6",
        "x": 7270,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_7",
        "x": 8350,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_8",
        "x": 9460,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_9",
        "x": 10510,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_10",
        "x": 11590,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr39_11",
        "x": 12700,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz39_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz39_2",
        "x": 3240,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz39_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz39_4",
        "x": 7050,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz39_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz39_6",
        "x": 10800,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz39_7",
        "x": 12720,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 12670,
          "max": 12780,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv39_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv39_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv39_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv39_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv39_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv39_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv39_7",
        "x": 11280,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv39_8",
        "x": 12900,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l39_1",
        "x": 630,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l39_2",
        "x": 1980,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l39_3",
        "x": 3780,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l39_4",
        "x": 5100,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l39_5",
        "x": 6450,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l39_6",
        "x": 7830,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l39_7",
        "x": 9150,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l39_8",
        "x": 10500,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l39_9",
        "x": 11880,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l39_10",
        "x": 13200,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s39_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s39_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s39_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s39_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s39_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s39_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s39_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s39_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s39_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s39_10",
        "x": 5600,
        "y": 395
      },
      {
        "id": "s39_11",
        "x": 6170,
        "y": 325
      },
      {
        "id": "s39_12",
        "x": 6680,
        "y": 395
      },
      {
        "id": "s39_13",
        "x": 7220,
        "y": 325
      },
      {
        "id": "s39_14",
        "x": 7790,
        "y": 395
      },
      {
        "id": "s39_15",
        "x": 8300,
        "y": 325
      },
      {
        "id": "s39_16",
        "x": 8840,
        "y": 395
      },
      {
        "id": "s39_17",
        "x": 9410,
        "y": 325
      },
      {
        "id": "s39_18",
        "x": 9920,
        "y": 395
      },
      {
        "id": "s39_19",
        "x": 10460,
        "y": 325
      },
      {
        "id": "s39_20",
        "x": 11030,
        "y": 395
      },
      {
        "id": "s39_21",
        "x": 11540,
        "y": 325
      },
      {
        "id": "s39_22",
        "x": 12080,
        "y": 395
      },
      {
        "id": "s39_23",
        "x": 12650,
        "y": 325
      },
      {
        "id": "s39_24",
        "x": 13160,
        "y": 395
      }
    ],
    "portals": [
      {
        "id": "pt39_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu39_1",
        "type": "speed_boost",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu39_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu39_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu39_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu39_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu39_6",
        "type": "speed_boost",
        "x": 12130,
        "y": 370,
        "radius": 18,
        "durationSeconds": 5
      }
    ]
  },
  {
    "id": 40,
    "title": "The Gauntlet of Fire",
    "chapter": 4,
    "theme": "hazard_foundry",
    "startX": 80,
    "startY": 280,
    "finishX": 14040,
    "deathY": 880,
    "parTimeSeconds": 49,
    "pins": [
      {
        "id": "p40_1",
        "x": 260,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 80
        }
      },
      {
        "id": "p40_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p40_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p40_4",
        "x": 1070,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 80
        }
      },
      {
        "id": "p40_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p40_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p40_7",
        "x": 1880,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 80
        }
      },
      {
        "id": "p40_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p40_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p40_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p40_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p40_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p40_13",
        "x": 3920,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 80
        }
      },
      {
        "id": "p40_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p40_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p40_16",
        "x": 4730,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 80
        }
      },
      {
        "id": "p40_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p40_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p40_19",
        "x": 5540,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 5495,
          "max": 5585,
          "speed": 80
        }
      },
      {
        "id": "p40_20",
        "x": 5810,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p40_21",
        "x": 6110,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p40_22",
        "x": 6350,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6305,
          "max": 6395,
          "speed": 80
        }
      },
      {
        "id": "p40_23",
        "x": 6620,
        "y": 265
      },
      {
        "id": "p40_24",
        "x": 6920,
        "y": 160
      },
      {
        "id": "p40_25",
        "x": 7160,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7115,
          "max": 7205,
          "speed": 80
        }
      },
      {
        "id": "p40_26",
        "x": 7430,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7385,
          "max": 7475,
          "speed": 80
        }
      },
      {
        "id": "p40_27",
        "x": 7730,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p40_28",
        "x": 7970,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 7925,
          "max": 8015,
          "speed": 80
        }
      },
      {
        "id": "p40_29",
        "x": 8240,
        "y": 195
      },
      {
        "id": "p40_30",
        "x": 8540,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8495,
          "max": 8585,
          "speed": 80
        }
      },
      {
        "id": "p40_31",
        "x": 8780,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 8735,
          "max": 8825,
          "speed": 80
        }
      },
      {
        "id": "p40_32",
        "x": 9050,
        "y": 160
      },
      {
        "id": "p40_33",
        "x": 9350,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p40_34",
        "x": 9590,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9545,
          "max": 9635,
          "speed": 80
        }
      },
      {
        "id": "p40_35",
        "x": 9860,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p40_36",
        "x": 10160,
        "y": 160
      },
      {
        "id": "p40_37",
        "x": 10400,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 10355,
          "max": 10445,
          "speed": 80
        }
      },
      {
        "id": "p40_38",
        "x": 10670,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 10625,
          "max": 10715,
          "speed": 80
        }
      },
      {
        "id": "p40_39",
        "x": 10970,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p40_40",
        "x": 11210,
        "y": 160,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11165,
          "max": 11255,
          "speed": 80
        }
      },
      {
        "id": "p40_41",
        "x": 11480,
        "y": 195
      },
      {
        "id": "p40_42",
        "x": 11780,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 11735,
          "max": 11825,
          "speed": 80
        }
      },
      {
        "id": "p40_43",
        "x": 12020,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 11975,
          "max": 12065,
          "speed": 80
        }
      },
      {
        "id": "p40_44",
        "x": 12290,
        "y": 160
      },
      {
        "id": "p40_45",
        "x": 12590,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p40_46",
        "x": 12830,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 12785,
          "max": 12875,
          "speed": 80
        }
      },
      {
        "id": "p40_47",
        "x": 13100,
        "y": 265
      },
      {
        "id": "p40_48",
        "x": 13400,
        "y": 160
      },
      {
        "id": "p40_49",
        "x": 13640,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 13595,
          "max": 13685,
          "speed": 80
        }
      }
    ],
    "trampolines": [
      {
        "id": "t40_1",
        "x": 570,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t40_2",
        "x": 1380,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t40_3",
        "x": 2190,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t40_4",
        "x": 3420,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t40_5",
        "x": 4230,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t40_6",
        "x": 5040,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t40_7",
        "x": 5850,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t40_8",
        "x": 6660,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t40_9",
        "x": 7470,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t40_10",
        "x": 8280,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t40_11",
        "x": 9090,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t40_12",
        "x": 9900,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t40_13",
        "x": 10710,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t40_14",
        "x": 11520,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t40_15",
        "x": 12330,
        "y": 620,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t40_16",
        "x": 13140,
        "y": 620,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t40_fin",
        "x": 13820,
        "y": 630,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr40_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_5",
        "x": 6220,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_6",
        "x": 7270,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_7",
        "x": 8350,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_8",
        "x": 9460,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_9",
        "x": 10510,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_10",
        "x": 11590,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_11",
        "x": 12700,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr40_12",
        "x": 13750,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz40_1",
        "x": 960,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz40_2",
        "x": 3240,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz40_3",
        "x": 5130,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz40_4",
        "x": 7050,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 7050,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz40_5",
        "x": 8910,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 8860,
          "max": 8970,
          "speed": 70
        }
      },
      {
        "id": "hz40_6",
        "x": 10800,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 10800,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz40_7",
        "x": 12720,
        "y": 740,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 12670,
          "max": 12780,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv40_1",
        "x": 1140,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv40_2",
        "x": 3180,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv40_3",
        "x": 4800,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv40_4",
        "x": 6420,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv40_5",
        "x": 8040,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv40_6",
        "x": 9660,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv40_7",
        "x": 11280,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv40_8",
        "x": 12900,
        "y": 500,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l40_1",
        "x": 630,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l40_2",
        "x": 1980,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l40_3",
        "x": 3780,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l40_4",
        "x": 5100,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l40_5",
        "x": 6450,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l40_6",
        "x": 7830,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l40_7",
        "x": 9150,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l40_8",
        "x": 10500,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l40_9",
        "x": 11880,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l40_10",
        "x": 13200,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s40_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s40_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s40_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s40_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s40_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s40_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s40_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s40_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s40_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s40_10",
        "x": 5600,
        "y": 375
      },
      {
        "id": "s40_11",
        "x": 6170,
        "y": 305
      },
      {
        "id": "s40_12",
        "x": 6680,
        "y": 375
      },
      {
        "id": "s40_13",
        "x": 7220,
        "y": 305
      },
      {
        "id": "s40_14",
        "x": 7790,
        "y": 375
      },
      {
        "id": "s40_15",
        "x": 8300,
        "y": 305
      },
      {
        "id": "s40_16",
        "x": 8840,
        "y": 375
      },
      {
        "id": "s40_17",
        "x": 9410,
        "y": 305
      },
      {
        "id": "s40_18",
        "x": 9920,
        "y": 375
      },
      {
        "id": "s40_19",
        "x": 10460,
        "y": 305
      },
      {
        "id": "s40_20",
        "x": 11030,
        "y": 375
      },
      {
        "id": "s40_21",
        "x": 11540,
        "y": 305
      },
      {
        "id": "s40_22",
        "x": 12080,
        "y": 375
      },
      {
        "id": "s40_23",
        "x": 12650,
        "y": 305
      },
      {
        "id": "s40_24",
        "x": 13160,
        "y": 375
      },
      {
        "id": "s40_25",
        "x": 13700,
        "y": 305
      }
    ],
    "portals": [
      {
        "id": "pt40_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu40_1",
        "type": "speed_boost",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu40_2",
        "type": "speed_boost",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu40_3",
        "type": "speed_boost",
        "x": 5650,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu40_4",
        "type": "speed_boost",
        "x": 7840,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu40_5",
        "type": "speed_boost",
        "x": 9970,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      },
      {
        "id": "pu40_6",
        "type": "speed_boost",
        "x": 12130,
        "y": 350,
        "radius": 18,
        "durationSeconds": 5
      }
    ]
  },
  {
    "id": 41,
    "title": "Cosmic Threshold",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 14600,
    "deathY": 900,
    "parTimeSeconds": 51,
    "pins": [
      {
        "id": "p41_1",
        "x": 260,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 65
        }
      },
      {
        "id": "p41_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p41_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p41_4",
        "x": 1070,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 65
        }
      },
      {
        "id": "p41_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p41_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p41_7",
        "x": 1880,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 65
        }
      },
      {
        "id": "p41_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p41_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p41_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p41_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p41_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p41_13",
        "x": 3920,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 65
        }
      },
      {
        "id": "p41_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p41_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p41_16",
        "x": 4730,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 65
        }
      },
      {
        "id": "p41_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p41_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p41_19",
        "x": 5960,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 65
        }
      },
      {
        "id": "p41_20",
        "x": 6230,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p41_21",
        "x": 6530,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p41_22",
        "x": 6770,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 65
        }
      },
      {
        "id": "p41_23",
        "x": 7040,
        "y": 265
      },
      {
        "id": "p41_24",
        "x": 7340,
        "y": 160
      },
      {
        "id": "p41_25",
        "x": 7580,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 65
        }
      },
      {
        "id": "p41_26",
        "x": 7850,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 65
        }
      },
      {
        "id": "p41_27",
        "x": 8150,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p41_28",
        "x": 8390,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 65
        }
      },
      {
        "id": "p41_29",
        "x": 8660,
        "y": 195
      },
      {
        "id": "p41_30",
        "x": 8960,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 65
        }
      },
      {
        "id": "p41_31",
        "x": 9200,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 65
        }
      },
      {
        "id": "p41_32",
        "x": 9470,
        "y": 160
      },
      {
        "id": "p41_33",
        "x": 9770,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p41_34",
        "x": 10010,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 65
        }
      },
      {
        "id": "p41_35",
        "x": 10280,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p41_36",
        "x": 10580,
        "y": 160
      },
      {
        "id": "p41_37",
        "x": 10820,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 65
        }
      },
      {
        "id": "p41_38",
        "x": 11090,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 65
        }
      },
      {
        "id": "p41_39",
        "x": 11390,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p41_40",
        "x": 11630,
        "y": 160,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 65
        }
      },
      {
        "id": "p41_41",
        "x": 11900,
        "y": 195
      },
      {
        "id": "p41_42",
        "x": 12200,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 65
        }
      },
      {
        "id": "p41_43",
        "x": 12440,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 65
        }
      },
      {
        "id": "p41_44",
        "x": 12710,
        "y": 160
      },
      {
        "id": "p41_45",
        "x": 13010,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p41_46",
        "x": 13250,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 65
        }
      },
      {
        "id": "p41_47",
        "x": 13520,
        "y": 265
      },
      {
        "id": "p41_48",
        "x": 13820,
        "y": 160
      },
      {
        "id": "p41_49",
        "x": 14060,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 65
        }
      },
      {
        "id": "p41_50",
        "x": 14330,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 65
        }
      }
    ],
    "trampolines": [
      {
        "id": "t41_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t41_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t41_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t41_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t41_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t41_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t41_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t41_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t41_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t41_fin",
        "x": 14380,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr41_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_5",
        "x": 6640,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_6",
        "x": 7690,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_7",
        "x": 8770,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_8",
        "x": 9880,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_9",
        "x": 10930,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_10",
        "x": 12010,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_11",
        "x": 13120,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr41_12",
        "x": 14170,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz41_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz41_2",
        "x": 3240,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz41_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz41_4",
        "x": 7470,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz41_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz41_6",
        "x": 11220,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz41_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv41_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv41_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv41_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv41_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv41_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv41_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv41_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv41_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l41_1",
        "x": 630,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l41_2",
        "x": 1980,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l41_3",
        "x": 3780,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l41_4",
        "x": 5100,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l41_5",
        "x": 6870,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l41_6",
        "x": 8250,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l41_7",
        "x": 9570,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l41_8",
        "x": 10920,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l41_9",
        "x": 12300,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l41_10",
        "x": 13620,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s41_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s41_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s41_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s41_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s41_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s41_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s41_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s41_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s41_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s41_10",
        "x": 6020,
        "y": 375
      },
      {
        "id": "s41_11",
        "x": 6590,
        "y": 305
      },
      {
        "id": "s41_12",
        "x": 7100,
        "y": 375
      },
      {
        "id": "s41_13",
        "x": 7640,
        "y": 305
      },
      {
        "id": "s41_14",
        "x": 8210,
        "y": 375
      },
      {
        "id": "s41_15",
        "x": 8720,
        "y": 305
      },
      {
        "id": "s41_16",
        "x": 9260,
        "y": 375
      },
      {
        "id": "s41_17",
        "x": 9830,
        "y": 305
      },
      {
        "id": "s41_18",
        "x": 10340,
        "y": 375
      },
      {
        "id": "s41_19",
        "x": 10880,
        "y": 305
      },
      {
        "id": "s41_20",
        "x": 11450,
        "y": 375
      },
      {
        "id": "s41_21",
        "x": 11960,
        "y": 305
      },
      {
        "id": "s41_22",
        "x": 12500,
        "y": 375
      },
      {
        "id": "s41_23",
        "x": 13070,
        "y": 305
      },
      {
        "id": "s41_24",
        "x": 13580,
        "y": 375
      },
      {
        "id": "s41_25",
        "x": 14120,
        "y": 305
      }
    ],
    "portals": [
      {
        "id": "pt41_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      },
      {
        "id": "pt41_2",
        "inX": 5390,
        "inY": 290,
        "outX": 5760,
        "outY": 210,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu41_1",
        "type": "magnet",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu41_2",
        "type": "magnet",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu41_3",
        "type": "magnet",
        "x": 6070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu41_4",
        "type": "magnet",
        "x": 8260,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu41_5",
        "type": "magnet",
        "x": 10390,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu41_6",
        "type": "magnet",
        "x": 12550,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      }
    ],
    "barriers": [
      {
        "id": "bar41_1",
        "x": 1300,
        "y": 190,
        "width": 24,
        "height": 200,
        "minSpeed": 520
      }
    ]
  },
  {
    "id": 42,
    "title": "Nebula Glider",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 15020,
    "deathY": 900,
    "parTimeSeconds": 52,
    "pins": [
      {
        "id": "p42_1",
        "x": 260,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 80
        }
      },
      {
        "id": "p42_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p42_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p42_4",
        "x": 1070,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 80
        }
      },
      {
        "id": "p42_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p42_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p42_7",
        "x": 1880,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 80
        }
      },
      {
        "id": "p42_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p42_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p42_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p42_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p42_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p42_13",
        "x": 3920,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 80
        }
      },
      {
        "id": "p42_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p42_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p42_16",
        "x": 4730,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 80
        }
      },
      {
        "id": "p42_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p42_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p42_19",
        "x": 5960,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 80
        }
      },
      {
        "id": "p42_20",
        "x": 6230,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p42_21",
        "x": 6530,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p42_22",
        "x": 6770,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 80
        }
      },
      {
        "id": "p42_23",
        "x": 7040,
        "y": 275
      },
      {
        "id": "p42_24",
        "x": 7340,
        "y": 170
      },
      {
        "id": "p42_25",
        "x": 7580,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 80
        }
      },
      {
        "id": "p42_26",
        "x": 7850,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 80
        }
      },
      {
        "id": "p42_27",
        "x": 8150,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p42_28",
        "x": 8390,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 80
        }
      },
      {
        "id": "p42_29",
        "x": 8660,
        "y": 205
      },
      {
        "id": "p42_30",
        "x": 8960,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 80
        }
      },
      {
        "id": "p42_31",
        "x": 9200,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 80
        }
      },
      {
        "id": "p42_32",
        "x": 9470,
        "y": 170
      },
      {
        "id": "p42_33",
        "x": 9770,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p42_34",
        "x": 10010,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 80
        }
      },
      {
        "id": "p42_35",
        "x": 10280,
        "y": 275,
        "fragile": true
      },
      {
        "id": "p42_36",
        "x": 10580,
        "y": 170
      },
      {
        "id": "p42_37",
        "x": 10820,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 80
        }
      },
      {
        "id": "p42_38",
        "x": 11090,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 80
        }
      },
      {
        "id": "p42_39",
        "x": 11390,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p42_40",
        "x": 11630,
        "y": 170,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 80
        }
      },
      {
        "id": "p42_41",
        "x": 11900,
        "y": 205
      },
      {
        "id": "p42_42",
        "x": 12200,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 80
        }
      },
      {
        "id": "p42_43",
        "x": 12440,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 80
        }
      },
      {
        "id": "p42_44",
        "x": 12710,
        "y": 170
      },
      {
        "id": "p42_45",
        "x": 13010,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p42_46",
        "x": 13250,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 80
        }
      },
      {
        "id": "p42_47",
        "x": 13520,
        "y": 275
      },
      {
        "id": "p42_48",
        "x": 13820,
        "y": 170
      },
      {
        "id": "p42_49",
        "x": 14060,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 80
        }
      },
      {
        "id": "p42_50",
        "x": 14330,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 80
        }
      },
      {
        "id": "p42_51",
        "x": 14630,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      }
    ],
    "trampolines": [
      {
        "id": "t42_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t42_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t42_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t42_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t42_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t42_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t42_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t42_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t42_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t42_fin",
        "x": 14800,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr42_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_5",
        "x": 6640,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_6",
        "x": 7690,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_7",
        "x": 8770,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_8",
        "x": 9880,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_9",
        "x": 10930,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_10",
        "x": 12010,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_11",
        "x": 13120,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr42_12",
        "x": 14170,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz42_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz42_2",
        "x": 3240,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz42_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz42_4",
        "x": 7470,
        "y": 310,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 190,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz42_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz42_6",
        "x": 11220,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz42_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv42_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv42_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv42_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv42_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv42_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv42_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv42_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv42_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l42_1",
        "x": 630,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l42_2",
        "x": 1980,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l42_3",
        "x": 3780,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l42_4",
        "x": 5100,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l42_5",
        "x": 6870,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l42_6",
        "x": 8250,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l42_7",
        "x": 9570,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l42_8",
        "x": 10920,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l42_9",
        "x": 12300,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l42_10",
        "x": 13620,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s42_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s42_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s42_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s42_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s42_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s42_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s42_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s42_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s42_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s42_10",
        "x": 6020,
        "y": 385
      },
      {
        "id": "s42_11",
        "x": 6590,
        "y": 315
      },
      {
        "id": "s42_12",
        "x": 7100,
        "y": 385
      },
      {
        "id": "s42_13",
        "x": 7640,
        "y": 315
      },
      {
        "id": "s42_14",
        "x": 8210,
        "y": 385
      },
      {
        "id": "s42_15",
        "x": 8720,
        "y": 315
      },
      {
        "id": "s42_16",
        "x": 9260,
        "y": 385
      },
      {
        "id": "s42_17",
        "x": 9830,
        "y": 315
      },
      {
        "id": "s42_18",
        "x": 10340,
        "y": 385
      },
      {
        "id": "s42_19",
        "x": 10880,
        "y": 315
      },
      {
        "id": "s42_20",
        "x": 11450,
        "y": 385
      },
      {
        "id": "s42_21",
        "x": 11960,
        "y": 315
      },
      {
        "id": "s42_22",
        "x": 12500,
        "y": 385
      },
      {
        "id": "s42_23",
        "x": 13070,
        "y": 315
      },
      {
        "id": "s42_24",
        "x": 13580,
        "y": 385
      },
      {
        "id": "s42_25",
        "x": 14120,
        "y": 315
      },
      {
        "id": "s42_26",
        "x": 14690,
        "y": 385
      }
    ],
    "portals": [
      {
        "id": "pt42_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      },
      {
        "id": "pt42_2",
        "inX": 5390,
        "inY": 300,
        "outX": 5760,
        "outY": 220,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu42_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu42_2",
        "type": "magnet",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu42_3",
        "type": "magnet",
        "x": 6070,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu42_4",
        "type": "magnet",
        "x": 8260,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu42_5",
        "type": "magnet",
        "x": 10390,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu42_6",
        "type": "magnet",
        "x": 12550,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu42_7",
        "type": "magnet",
        "x": 14740,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 43,
    "title": "Starlight Portal Chain",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 15440,
    "deathY": 900,
    "parTimeSeconds": 53,
    "pins": [
      {
        "id": "p43_1",
        "x": 260,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 95
        }
      },
      {
        "id": "p43_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 95
        }
      },
      {
        "id": "p43_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p43_4",
        "x": 1070,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 95
        }
      },
      {
        "id": "p43_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p43_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 95
        }
      },
      {
        "id": "p43_7",
        "x": 1880,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 95
        }
      },
      {
        "id": "p43_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p43_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p43_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 95
        }
      },
      {
        "id": "p43_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p43_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p43_13",
        "x": 3920,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 95
        }
      },
      {
        "id": "p43_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 95
        }
      },
      {
        "id": "p43_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p43_16",
        "x": 4730,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 95
        }
      },
      {
        "id": "p43_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p43_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 95
        }
      },
      {
        "id": "p43_19",
        "x": 5960,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 95
        }
      },
      {
        "id": "p43_20",
        "x": 6230,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p43_21",
        "x": 6530,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p43_22",
        "x": 6770,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 95
        }
      },
      {
        "id": "p43_23",
        "x": 7040,
        "y": 285
      },
      {
        "id": "p43_24",
        "x": 7340,
        "y": 180
      },
      {
        "id": "p43_25",
        "x": 7580,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 95
        }
      },
      {
        "id": "p43_26",
        "x": 7850,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 95
        }
      },
      {
        "id": "p43_27",
        "x": 8150,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p43_28",
        "x": 8390,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 95
        }
      },
      {
        "id": "p43_29",
        "x": 8660,
        "y": 215
      },
      {
        "id": "p43_30",
        "x": 8960,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 95
        }
      },
      {
        "id": "p43_31",
        "x": 9200,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 95
        }
      },
      {
        "id": "p43_32",
        "x": 9470,
        "y": 180
      },
      {
        "id": "p43_33",
        "x": 9770,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p43_34",
        "x": 10010,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 95
        }
      },
      {
        "id": "p43_35",
        "x": 10280,
        "y": 285,
        "fragile": true
      },
      {
        "id": "p43_36",
        "x": 10580,
        "y": 180
      },
      {
        "id": "p43_37",
        "x": 10820,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 95
        }
      },
      {
        "id": "p43_38",
        "x": 11090,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 95
        }
      },
      {
        "id": "p43_39",
        "x": 11390,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p43_40",
        "x": 11630,
        "y": 180,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 95
        }
      },
      {
        "id": "p43_41",
        "x": 11900,
        "y": 215
      },
      {
        "id": "p43_42",
        "x": 12200,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 95
        }
      },
      {
        "id": "p43_43",
        "x": 12440,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 95
        }
      },
      {
        "id": "p43_44",
        "x": 12710,
        "y": 180
      },
      {
        "id": "p43_45",
        "x": 13010,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p43_46",
        "x": 13250,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 95
        }
      },
      {
        "id": "p43_47",
        "x": 13520,
        "y": 285
      },
      {
        "id": "p43_48",
        "x": 13820,
        "y": 180
      },
      {
        "id": "p43_49",
        "x": 14060,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 95
        }
      },
      {
        "id": "p43_50",
        "x": 14330,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 95
        }
      },
      {
        "id": "p43_51",
        "x": 14630,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p43_52",
        "x": 14870,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 14825,
          "max": 14915,
          "speed": 95
        }
      },
      {
        "id": "p43_53",
        "x": 15140,
        "y": 215
      }
    ],
    "trampolines": [
      {
        "id": "t43_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t43_18",
        "x": 15180,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t43_fin",
        "x": 15220,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr43_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_5",
        "x": 6640,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_6",
        "x": 7690,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_7",
        "x": 8770,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_8",
        "x": 9880,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_9",
        "x": 10930,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_10",
        "x": 12010,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_11",
        "x": 13120,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_12",
        "x": 14170,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr43_13",
        "x": 15250,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz43_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz43_2",
        "x": 3240,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz43_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz43_4",
        "x": 7470,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz43_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz43_6",
        "x": 11220,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz43_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      },
      {
        "id": "hz43_8",
        "x": 15000,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 15000,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv43_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv43_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv43_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv43_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv43_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv43_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv43_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv43_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv43_9",
        "x": 14940,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l43_1",
        "x": 630,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l43_2",
        "x": 1980,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l43_3",
        "x": 3780,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l43_4",
        "x": 5100,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l43_5",
        "x": 6870,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l43_6",
        "x": 8250,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l43_7",
        "x": 9570,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l43_8",
        "x": 10920,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l43_9",
        "x": 12300,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l43_10",
        "x": 13620,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l43_11",
        "x": 14970,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s43_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s43_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s43_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s43_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s43_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s43_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s43_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s43_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s43_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s43_10",
        "x": 6020,
        "y": 395
      },
      {
        "id": "s43_11",
        "x": 6590,
        "y": 325
      },
      {
        "id": "s43_12",
        "x": 7100,
        "y": 395
      },
      {
        "id": "s43_13",
        "x": 7640,
        "y": 325
      },
      {
        "id": "s43_14",
        "x": 8210,
        "y": 395
      },
      {
        "id": "s43_15",
        "x": 8720,
        "y": 325
      },
      {
        "id": "s43_16",
        "x": 9260,
        "y": 395
      },
      {
        "id": "s43_17",
        "x": 9830,
        "y": 325
      },
      {
        "id": "s43_18",
        "x": 10340,
        "y": 395
      },
      {
        "id": "s43_19",
        "x": 10880,
        "y": 325
      },
      {
        "id": "s43_20",
        "x": 11450,
        "y": 395
      },
      {
        "id": "s43_21",
        "x": 11960,
        "y": 325
      },
      {
        "id": "s43_22",
        "x": 12500,
        "y": 395
      },
      {
        "id": "s43_23",
        "x": 13070,
        "y": 325
      },
      {
        "id": "s43_24",
        "x": 13580,
        "y": 395
      },
      {
        "id": "s43_25",
        "x": 14120,
        "y": 325
      },
      {
        "id": "s43_26",
        "x": 14690,
        "y": 395
      },
      {
        "id": "s43_27",
        "x": 15200,
        "y": 325
      }
    ],
    "portals": [
      {
        "id": "pt43_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      },
      {
        "id": "pt43_2",
        "inX": 5390,
        "inY": 310,
        "outX": 5760,
        "outY": 230,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu43_1",
        "type": "magnet",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu43_2",
        "type": "magnet",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu43_3",
        "type": "magnet",
        "x": 6070,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu43_4",
        "type": "magnet",
        "x": 8260,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu43_5",
        "type": "magnet",
        "x": 10390,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu43_6",
        "type": "magnet",
        "x": 12550,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu43_7",
        "type": "magnet",
        "x": 14740,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 44,
    "title": "Asteroid Field Slingshot",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 15860,
    "deathY": 900,
    "parTimeSeconds": 54,
    "pins": [
      {
        "id": "p44_1",
        "x": 260,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 110
        }
      },
      {
        "id": "p44_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 110
        }
      },
      {
        "id": "p44_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p44_4",
        "x": 1070,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 110
        }
      },
      {
        "id": "p44_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p44_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 110
        }
      },
      {
        "id": "p44_7",
        "x": 1880,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 110
        }
      },
      {
        "id": "p44_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p44_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p44_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 110
        }
      },
      {
        "id": "p44_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p44_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p44_13",
        "x": 3920,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 110
        }
      },
      {
        "id": "p44_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 110
        }
      },
      {
        "id": "p44_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p44_16",
        "x": 4730,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 110
        }
      },
      {
        "id": "p44_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p44_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 110
        }
      },
      {
        "id": "p44_19",
        "x": 5960,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 110
        }
      },
      {
        "id": "p44_20",
        "x": 6230,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p44_21",
        "x": 6530,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p44_22",
        "x": 6770,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 110
        }
      },
      {
        "id": "p44_23",
        "x": 7040,
        "y": 265
      },
      {
        "id": "p44_24",
        "x": 7340,
        "y": 160
      },
      {
        "id": "p44_25",
        "x": 7580,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 110
        }
      },
      {
        "id": "p44_26",
        "x": 7850,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 110
        }
      },
      {
        "id": "p44_27",
        "x": 8150,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p44_28",
        "x": 8390,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 110
        }
      },
      {
        "id": "p44_29",
        "x": 8660,
        "y": 195
      },
      {
        "id": "p44_30",
        "x": 8960,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 110
        }
      },
      {
        "id": "p44_31",
        "x": 9200,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 110
        }
      },
      {
        "id": "p44_32",
        "x": 9470,
        "y": 160
      },
      {
        "id": "p44_33",
        "x": 9770,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p44_34",
        "x": 10010,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 110
        }
      },
      {
        "id": "p44_35",
        "x": 10280,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p44_36",
        "x": 10580,
        "y": 160
      },
      {
        "id": "p44_37",
        "x": 10820,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 110
        }
      },
      {
        "id": "p44_38",
        "x": 11090,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 110
        }
      },
      {
        "id": "p44_39",
        "x": 11390,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p44_40",
        "x": 11630,
        "y": 160,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 110
        }
      },
      {
        "id": "p44_41",
        "x": 11900,
        "y": 195
      },
      {
        "id": "p44_42",
        "x": 12200,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 110
        }
      },
      {
        "id": "p44_43",
        "x": 12440,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 110
        }
      },
      {
        "id": "p44_44",
        "x": 12710,
        "y": 160
      },
      {
        "id": "p44_45",
        "x": 13010,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p44_46",
        "x": 13250,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 110
        }
      },
      {
        "id": "p44_47",
        "x": 13520,
        "y": 265
      },
      {
        "id": "p44_48",
        "x": 13820,
        "y": 160
      },
      {
        "id": "p44_49",
        "x": 14060,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 110
        }
      },
      {
        "id": "p44_50",
        "x": 14330,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 110
        }
      },
      {
        "id": "p44_51",
        "x": 14630,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p44_52",
        "x": 14870,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 14825,
          "max": 14915,
          "speed": 110
        }
      },
      {
        "id": "p44_53",
        "x": 15140,
        "y": 195
      },
      {
        "id": "p44_54",
        "x": 15440,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 15395,
          "max": 15485,
          "speed": 110
        }
      }
    ],
    "trampolines": [
      {
        "id": "t44_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t44_18",
        "x": 15180,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t44_fin",
        "x": 15640,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr44_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_5",
        "x": 6640,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_6",
        "x": 7690,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_7",
        "x": 8770,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_8",
        "x": 9880,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_9",
        "x": 10930,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_10",
        "x": 12010,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_11",
        "x": 13120,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_12",
        "x": 14170,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr44_13",
        "x": 15250,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz44_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz44_2",
        "x": 3240,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz44_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz44_4",
        "x": 7470,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz44_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz44_6",
        "x": 11220,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz44_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      },
      {
        "id": "hz44_8",
        "x": 15000,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 15000,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv44_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv44_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv44_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv44_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv44_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv44_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv44_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv44_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv44_9",
        "x": 14940,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l44_1",
        "x": 630,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l44_2",
        "x": 1980,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l44_3",
        "x": 3780,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l44_4",
        "x": 5100,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l44_5",
        "x": 6870,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l44_6",
        "x": 8250,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l44_7",
        "x": 9570,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l44_8",
        "x": 10920,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l44_9",
        "x": 12300,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l44_10",
        "x": 13620,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l44_11",
        "x": 14970,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s44_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s44_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s44_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s44_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s44_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s44_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s44_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s44_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s44_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s44_10",
        "x": 6020,
        "y": 375
      },
      {
        "id": "s44_11",
        "x": 6590,
        "y": 305
      },
      {
        "id": "s44_12",
        "x": 7100,
        "y": 375
      },
      {
        "id": "s44_13",
        "x": 7640,
        "y": 305
      },
      {
        "id": "s44_14",
        "x": 8210,
        "y": 375
      },
      {
        "id": "s44_15",
        "x": 8720,
        "y": 305
      },
      {
        "id": "s44_16",
        "x": 9260,
        "y": 375
      },
      {
        "id": "s44_17",
        "x": 9830,
        "y": 305
      },
      {
        "id": "s44_18",
        "x": 10340,
        "y": 375
      },
      {
        "id": "s44_19",
        "x": 10880,
        "y": 305
      },
      {
        "id": "s44_20",
        "x": 11450,
        "y": 375
      },
      {
        "id": "s44_21",
        "x": 11960,
        "y": 305
      },
      {
        "id": "s44_22",
        "x": 12500,
        "y": 375
      },
      {
        "id": "s44_23",
        "x": 13070,
        "y": 305
      },
      {
        "id": "s44_24",
        "x": 13580,
        "y": 375
      },
      {
        "id": "s44_25",
        "x": 14120,
        "y": 305
      },
      {
        "id": "s44_26",
        "x": 14690,
        "y": 375
      },
      {
        "id": "s44_27",
        "x": 15200,
        "y": 305
      }
    ],
    "portals": [
      {
        "id": "pt44_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      },
      {
        "id": "pt44_2",
        "inX": 5390,
        "inY": 290,
        "outX": 5760,
        "outY": 210,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu44_1",
        "type": "magnet",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu44_2",
        "type": "magnet",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu44_3",
        "type": "magnet",
        "x": 6070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu44_4",
        "type": "magnet",
        "x": 8260,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu44_5",
        "type": "magnet",
        "x": 10390,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu44_6",
        "type": "magnet",
        "x": 12550,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu44_7",
        "type": "magnet",
        "x": 14740,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      }
    ],
    "bungeeWebs": [
      {
        "id": "bw44_1",
        "x": 1650,
        "y": 550,
        "width": 160,
        "launchVy": -920,
        "launchVx": 760
      }
    ]
  },
  {
    "id": 45,
    "title": "Event Horizon Leap",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 16280,
    "deathY": 900,
    "parTimeSeconds": 56,
    "pins": [
      {
        "id": "p45_1",
        "x": 260,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 65
        }
      },
      {
        "id": "p45_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p45_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p45_4",
        "x": 1070,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 65
        }
      },
      {
        "id": "p45_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p45_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p45_7",
        "x": 1880,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 65
        }
      },
      {
        "id": "p45_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p45_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p45_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p45_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p45_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p45_13",
        "x": 3920,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 65
        }
      },
      {
        "id": "p45_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p45_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p45_16",
        "x": 4730,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 65
        }
      },
      {
        "id": "p45_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p45_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p45_19",
        "x": 5960,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 65
        }
      },
      {
        "id": "p45_20",
        "x": 6230,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p45_21",
        "x": 6530,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p45_22",
        "x": 6770,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 65
        }
      },
      {
        "id": "p45_23",
        "x": 7040,
        "y": 275
      },
      {
        "id": "p45_24",
        "x": 7340,
        "y": 170
      },
      {
        "id": "p45_25",
        "x": 7580,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 65
        }
      },
      {
        "id": "p45_26",
        "x": 7850,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 65
        }
      },
      {
        "id": "p45_27",
        "x": 8150,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p45_28",
        "x": 8390,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 65
        }
      },
      {
        "id": "p45_29",
        "x": 8660,
        "y": 205
      },
      {
        "id": "p45_30",
        "x": 8960,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 65
        }
      },
      {
        "id": "p45_31",
        "x": 9200,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 65
        }
      },
      {
        "id": "p45_32",
        "x": 9470,
        "y": 170
      },
      {
        "id": "p45_33",
        "x": 9770,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p45_34",
        "x": 10010,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 65
        }
      },
      {
        "id": "p45_35",
        "x": 10280,
        "y": 275,
        "fragile": true
      },
      {
        "id": "p45_36",
        "x": 10580,
        "y": 170
      },
      {
        "id": "p45_37",
        "x": 10820,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 65
        }
      },
      {
        "id": "p45_38",
        "x": 11090,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 65
        }
      },
      {
        "id": "p45_39",
        "x": 11390,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p45_40",
        "x": 11630,
        "y": 170,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 65
        }
      },
      {
        "id": "p45_41",
        "x": 11900,
        "y": 205
      },
      {
        "id": "p45_42",
        "x": 12200,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 65
        }
      },
      {
        "id": "p45_43",
        "x": 12440,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 65
        }
      },
      {
        "id": "p45_44",
        "x": 12710,
        "y": 170
      },
      {
        "id": "p45_45",
        "x": 13010,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p45_46",
        "x": 13250,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 65
        }
      },
      {
        "id": "p45_47",
        "x": 13520,
        "y": 275
      },
      {
        "id": "p45_48",
        "x": 13820,
        "y": 170
      },
      {
        "id": "p45_49",
        "x": 14060,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 65
        }
      },
      {
        "id": "p45_50",
        "x": 14330,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 65
        }
      },
      {
        "id": "p45_51",
        "x": 14630,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p45_52",
        "x": 14870,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 14825,
          "max": 14915,
          "speed": 65
        }
      },
      {
        "id": "p45_53",
        "x": 15140,
        "y": 205
      },
      {
        "id": "p45_54",
        "x": 15440,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 15395,
          "max": 15485,
          "speed": 65
        }
      },
      {
        "id": "p45_55",
        "x": 15680,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 15635,
          "max": 15725,
          "speed": 65
        }
      },
      {
        "id": "p45_56",
        "x": 15950,
        "y": 170
      }
    ],
    "trampolines": [
      {
        "id": "t45_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_18",
        "x": 15180,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t45_19",
        "x": 15990,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t45_fin",
        "x": 16060,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr45_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_5",
        "x": 6640,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_6",
        "x": 7690,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_7",
        "x": 8770,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_8",
        "x": 9880,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_9",
        "x": 10930,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_10",
        "x": 12010,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_11",
        "x": 13120,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_12",
        "x": 14170,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr45_13",
        "x": 15250,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz45_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz45_2",
        "x": 3240,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz45_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz45_4",
        "x": 7470,
        "y": 310,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 190,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz45_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz45_6",
        "x": 11220,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz45_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      },
      {
        "id": "hz45_8",
        "x": 15000,
        "y": 310,
        "radius": 20,
        "pendulum": {
          "originX": 15000,
          "originY": 190,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv45_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv45_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv45_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv45_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv45_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv45_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv45_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv45_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv45_9",
        "x": 14940,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l45_1",
        "x": 630,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l45_2",
        "x": 1980,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l45_3",
        "x": 3780,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l45_4",
        "x": 5100,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l45_5",
        "x": 6870,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l45_6",
        "x": 8250,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l45_7",
        "x": 9570,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l45_8",
        "x": 10920,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l45_9",
        "x": 12300,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l45_10",
        "x": 13620,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l45_11",
        "x": 14970,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s45_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s45_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s45_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s45_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s45_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s45_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s45_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s45_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s45_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s45_10",
        "x": 6020,
        "y": 385
      },
      {
        "id": "s45_11",
        "x": 6590,
        "y": 315
      },
      {
        "id": "s45_12",
        "x": 7100,
        "y": 385
      },
      {
        "id": "s45_13",
        "x": 7640,
        "y": 315
      },
      {
        "id": "s45_14",
        "x": 8210,
        "y": 385
      },
      {
        "id": "s45_15",
        "x": 8720,
        "y": 315
      },
      {
        "id": "s45_16",
        "x": 9260,
        "y": 385
      },
      {
        "id": "s45_17",
        "x": 9830,
        "y": 315
      },
      {
        "id": "s45_18",
        "x": 10340,
        "y": 385
      },
      {
        "id": "s45_19",
        "x": 10880,
        "y": 315
      },
      {
        "id": "s45_20",
        "x": 11450,
        "y": 385
      },
      {
        "id": "s45_21",
        "x": 11960,
        "y": 315
      },
      {
        "id": "s45_22",
        "x": 12500,
        "y": 385
      },
      {
        "id": "s45_23",
        "x": 13070,
        "y": 315
      },
      {
        "id": "s45_24",
        "x": 13580,
        "y": 385
      },
      {
        "id": "s45_25",
        "x": 14120,
        "y": 315
      },
      {
        "id": "s45_26",
        "x": 14690,
        "y": 385
      },
      {
        "id": "s45_27",
        "x": 15200,
        "y": 315
      },
      {
        "id": "s45_28",
        "x": 15740,
        "y": 385
      }
    ],
    "portals": [
      {
        "id": "pt45_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      },
      {
        "id": "pt45_2",
        "inX": 5390,
        "inY": 300,
        "outX": 5760,
        "outY": 220,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu45_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu45_2",
        "type": "magnet",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu45_3",
        "type": "magnet",
        "x": 6070,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu45_4",
        "type": "magnet",
        "x": 8260,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu45_5",
        "type": "magnet",
        "x": 10390,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu45_6",
        "type": "magnet",
        "x": 12550,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu45_7",
        "type": "magnet",
        "x": 14740,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 46,
    "title": "Singularity Springs",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 16700,
    "deathY": 900,
    "parTimeSeconds": 57,
    "pins": [
      {
        "id": "p46_1",
        "x": 260,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 80
        }
      },
      {
        "id": "p46_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p46_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p46_4",
        "x": 1070,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 80
        }
      },
      {
        "id": "p46_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p46_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p46_7",
        "x": 1880,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 80
        }
      },
      {
        "id": "p46_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p46_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p46_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p46_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p46_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p46_13",
        "x": 3920,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 80
        }
      },
      {
        "id": "p46_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p46_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p46_16",
        "x": 4730,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 80
        }
      },
      {
        "id": "p46_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p46_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p46_19",
        "x": 5960,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 80
        }
      },
      {
        "id": "p46_20",
        "x": 6230,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p46_21",
        "x": 6530,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p46_22",
        "x": 6770,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 80
        }
      },
      {
        "id": "p46_23",
        "x": 7040,
        "y": 285
      },
      {
        "id": "p46_24",
        "x": 7340,
        "y": 180
      },
      {
        "id": "p46_25",
        "x": 7580,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 80
        }
      },
      {
        "id": "p46_26",
        "x": 7850,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 80
        }
      },
      {
        "id": "p46_27",
        "x": 8150,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p46_28",
        "x": 8390,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 80
        }
      },
      {
        "id": "p46_29",
        "x": 8660,
        "y": 215
      },
      {
        "id": "p46_30",
        "x": 8960,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 80
        }
      },
      {
        "id": "p46_31",
        "x": 9200,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 80
        }
      },
      {
        "id": "p46_32",
        "x": 9470,
        "y": 180
      },
      {
        "id": "p46_33",
        "x": 9770,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p46_34",
        "x": 10010,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 80
        }
      },
      {
        "id": "p46_35",
        "x": 10280,
        "y": 285,
        "fragile": true
      },
      {
        "id": "p46_36",
        "x": 10580,
        "y": 180
      },
      {
        "id": "p46_37",
        "x": 10820,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 80
        }
      },
      {
        "id": "p46_38",
        "x": 11090,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 80
        }
      },
      {
        "id": "p46_39",
        "x": 11390,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p46_40",
        "x": 11630,
        "y": 180,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 80
        }
      },
      {
        "id": "p46_41",
        "x": 11900,
        "y": 215
      },
      {
        "id": "p46_42",
        "x": 12200,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 80
        }
      },
      {
        "id": "p46_43",
        "x": 12440,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 80
        }
      },
      {
        "id": "p46_44",
        "x": 12710,
        "y": 180
      },
      {
        "id": "p46_45",
        "x": 13010,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p46_46",
        "x": 13250,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 80
        }
      },
      {
        "id": "p46_47",
        "x": 13520,
        "y": 285
      },
      {
        "id": "p46_48",
        "x": 13820,
        "y": 180
      },
      {
        "id": "p46_49",
        "x": 14060,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 80
        }
      },
      {
        "id": "p46_50",
        "x": 14330,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 80
        }
      },
      {
        "id": "p46_51",
        "x": 14630,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p46_52",
        "x": 14870,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 14825,
          "max": 14915,
          "speed": 80
        }
      },
      {
        "id": "p46_53",
        "x": 15140,
        "y": 215
      },
      {
        "id": "p46_54",
        "x": 15440,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 15395,
          "max": 15485,
          "speed": 80
        }
      },
      {
        "id": "p46_55",
        "x": 15680,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 15635,
          "max": 15725,
          "speed": 80
        }
      },
      {
        "id": "p46_56",
        "x": 15950,
        "y": 180
      },
      {
        "id": "p46_57",
        "x": 16250,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p46_58",
        "x": 16490,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 16445,
          "max": 16535,
          "speed": 80
        }
      }
    ],
    "trampolines": [
      {
        "id": "t46_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_18",
        "x": 15180,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t46_19",
        "x": 15990,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t46_fin",
        "x": 16480,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr46_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_5",
        "x": 6640,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_6",
        "x": 7690,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_7",
        "x": 8770,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_8",
        "x": 9880,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_9",
        "x": 10930,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_10",
        "x": 12010,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_11",
        "x": 13120,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_12",
        "x": 14170,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_13",
        "x": 15250,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr46_14",
        "x": 16360,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz46_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz46_2",
        "x": 3240,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz46_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz46_4",
        "x": 7470,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz46_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz46_6",
        "x": 11220,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz46_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      },
      {
        "id": "hz46_8",
        "x": 15000,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 15000,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      }
    ],
    "windVents": [
      {
        "id": "wv46_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_9",
        "x": 14940,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv46_10",
        "x": 16560,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l46_1",
        "x": 630,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l46_2",
        "x": 1980,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l46_3",
        "x": 3780,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l46_4",
        "x": 5100,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l46_5",
        "x": 6870,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l46_6",
        "x": 8250,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l46_7",
        "x": 9570,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l46_8",
        "x": 10920,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l46_9",
        "x": 12300,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l46_10",
        "x": 13620,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l46_11",
        "x": 14970,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l46_12",
        "x": 16350,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s46_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s46_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s46_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s46_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s46_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s46_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s46_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s46_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s46_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s46_10",
        "x": 6020,
        "y": 395
      },
      {
        "id": "s46_11",
        "x": 6590,
        "y": 325
      },
      {
        "id": "s46_12",
        "x": 7100,
        "y": 395
      },
      {
        "id": "s46_13",
        "x": 7640,
        "y": 325
      },
      {
        "id": "s46_14",
        "x": 8210,
        "y": 395
      },
      {
        "id": "s46_15",
        "x": 8720,
        "y": 325
      },
      {
        "id": "s46_16",
        "x": 9260,
        "y": 395
      },
      {
        "id": "s46_17",
        "x": 9830,
        "y": 325
      },
      {
        "id": "s46_18",
        "x": 10340,
        "y": 395
      },
      {
        "id": "s46_19",
        "x": 10880,
        "y": 325
      },
      {
        "id": "s46_20",
        "x": 11450,
        "y": 395
      },
      {
        "id": "s46_21",
        "x": 11960,
        "y": 325
      },
      {
        "id": "s46_22",
        "x": 12500,
        "y": 395
      },
      {
        "id": "s46_23",
        "x": 13070,
        "y": 325
      },
      {
        "id": "s46_24",
        "x": 13580,
        "y": 395
      },
      {
        "id": "s46_25",
        "x": 14120,
        "y": 325
      },
      {
        "id": "s46_26",
        "x": 14690,
        "y": 395
      },
      {
        "id": "s46_27",
        "x": 15200,
        "y": 325
      },
      {
        "id": "s46_28",
        "x": 15740,
        "y": 395
      },
      {
        "id": "s46_29",
        "x": 16310,
        "y": 325
      }
    ],
    "portals": [
      {
        "id": "pt46_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      },
      {
        "id": "pt46_2",
        "inX": 5390,
        "inY": 310,
        "outX": 5760,
        "outY": 230,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu46_1",
        "type": "magnet",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu46_2",
        "type": "magnet",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu46_3",
        "type": "magnet",
        "x": 6070,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu46_4",
        "type": "magnet",
        "x": 8260,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu46_5",
        "type": "magnet",
        "x": 10390,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu46_6",
        "type": "magnet",
        "x": 12550,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu46_7",
        "type": "magnet",
        "x": 14740,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      }
    ],
    "wreckingBalls": [
      {
        "id": "wb46_1",
        "pivotX": 1500,
        "pivotY": 30,
        "chainLength": 260,
        "radius": 30,
        "swingSpeed": 3,
        "maxAngle": 1.05
      }
    ]
  },
  {
    "id": 47,
    "title": "Supernova Runway",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 17120,
    "deathY": 900,
    "parTimeSeconds": 58,
    "pins": [
      {
        "id": "p47_1",
        "x": 260,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 95
        }
      },
      {
        "id": "p47_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 95
        }
      },
      {
        "id": "p47_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p47_4",
        "x": 1070,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 95
        }
      },
      {
        "id": "p47_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p47_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 95
        }
      },
      {
        "id": "p47_7",
        "x": 1880,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 95
        }
      },
      {
        "id": "p47_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p47_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p47_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 95
        }
      },
      {
        "id": "p47_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p47_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p47_13",
        "x": 3920,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 95
        }
      },
      {
        "id": "p47_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 95
        }
      },
      {
        "id": "p47_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p47_16",
        "x": 4730,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 95
        }
      },
      {
        "id": "p47_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p47_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 95
        }
      },
      {
        "id": "p47_19",
        "x": 5960,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 95
        }
      },
      {
        "id": "p47_20",
        "x": 6230,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p47_21",
        "x": 6530,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p47_22",
        "x": 6770,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 95
        }
      },
      {
        "id": "p47_23",
        "x": 7040,
        "y": 265
      },
      {
        "id": "p47_24",
        "x": 7340,
        "y": 160
      },
      {
        "id": "p47_25",
        "x": 7580,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 95
        }
      },
      {
        "id": "p47_26",
        "x": 7850,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 95
        }
      },
      {
        "id": "p47_27",
        "x": 8150,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p47_28",
        "x": 8390,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 95
        }
      },
      {
        "id": "p47_29",
        "x": 8660,
        "y": 195
      },
      {
        "id": "p47_30",
        "x": 8960,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 95
        }
      },
      {
        "id": "p47_31",
        "x": 9200,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 95
        }
      },
      {
        "id": "p47_32",
        "x": 9470,
        "y": 160
      },
      {
        "id": "p47_33",
        "x": 9770,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p47_34",
        "x": 10010,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 95
        }
      },
      {
        "id": "p47_35",
        "x": 10280,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p47_36",
        "x": 10580,
        "y": 160
      },
      {
        "id": "p47_37",
        "x": 10820,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 95
        }
      },
      {
        "id": "p47_38",
        "x": 11090,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 95
        }
      },
      {
        "id": "p47_39",
        "x": 11390,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p47_40",
        "x": 11630,
        "y": 160,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 95
        }
      },
      {
        "id": "p47_41",
        "x": 11900,
        "y": 195
      },
      {
        "id": "p47_42",
        "x": 12200,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 95
        }
      },
      {
        "id": "p47_43",
        "x": 12440,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 95
        }
      },
      {
        "id": "p47_44",
        "x": 12710,
        "y": 160
      },
      {
        "id": "p47_45",
        "x": 13010,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p47_46",
        "x": 13250,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 95
        }
      },
      {
        "id": "p47_47",
        "x": 13520,
        "y": 265
      },
      {
        "id": "p47_48",
        "x": 13820,
        "y": 160
      },
      {
        "id": "p47_49",
        "x": 14060,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 95
        }
      },
      {
        "id": "p47_50",
        "x": 14330,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 95
        }
      },
      {
        "id": "p47_51",
        "x": 14630,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p47_52",
        "x": 14870,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 14825,
          "max": 14915,
          "speed": 95
        }
      },
      {
        "id": "p47_53",
        "x": 15140,
        "y": 195
      },
      {
        "id": "p47_54",
        "x": 15440,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 15395,
          "max": 15485,
          "speed": 95
        }
      },
      {
        "id": "p47_55",
        "x": 15680,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 15635,
          "max": 15725,
          "speed": 95
        }
      },
      {
        "id": "p47_56",
        "x": 15950,
        "y": 160
      },
      {
        "id": "p47_57",
        "x": 16250,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p47_58",
        "x": 16490,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 16445,
          "max": 16535,
          "speed": 95
        }
      },
      {
        "id": "p47_59",
        "x": 16760,
        "y": 265
      }
    ],
    "trampolines": [
      {
        "id": "t47_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_18",
        "x": 15180,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_19",
        "x": 15990,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t47_20",
        "x": 16800,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t47_fin",
        "x": 16900,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr47_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_5",
        "x": 6640,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_6",
        "x": 7690,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_7",
        "x": 8770,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_8",
        "x": 9880,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_9",
        "x": 10930,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_10",
        "x": 12010,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_11",
        "x": 13120,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_12",
        "x": 14170,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_13",
        "x": 15250,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr47_14",
        "x": 16360,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz47_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz47_2",
        "x": 3240,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz47_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz47_4",
        "x": 7470,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz47_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz47_6",
        "x": 11220,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz47_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      },
      {
        "id": "hz47_8",
        "x": 15000,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 15000,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz47_9",
        "x": 16890,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 16840,
          "max": 16950,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv47_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_9",
        "x": 14940,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv47_10",
        "x": 16560,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l47_1",
        "x": 630,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l47_2",
        "x": 1980,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l47_3",
        "x": 3780,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l47_4",
        "x": 5100,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l47_5",
        "x": 6870,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l47_6",
        "x": 8250,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l47_7",
        "x": 9570,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l47_8",
        "x": 10920,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l47_9",
        "x": 12300,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l47_10",
        "x": 13620,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l47_11",
        "x": 14970,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l47_12",
        "x": 16350,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s47_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s47_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s47_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s47_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s47_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s47_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s47_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s47_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s47_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s47_10",
        "x": 6020,
        "y": 375
      },
      {
        "id": "s47_11",
        "x": 6590,
        "y": 305
      },
      {
        "id": "s47_12",
        "x": 7100,
        "y": 375
      },
      {
        "id": "s47_13",
        "x": 7640,
        "y": 305
      },
      {
        "id": "s47_14",
        "x": 8210,
        "y": 375
      },
      {
        "id": "s47_15",
        "x": 8720,
        "y": 305
      },
      {
        "id": "s47_16",
        "x": 9260,
        "y": 375
      },
      {
        "id": "s47_17",
        "x": 9830,
        "y": 305
      },
      {
        "id": "s47_18",
        "x": 10340,
        "y": 375
      },
      {
        "id": "s47_19",
        "x": 10880,
        "y": 305
      },
      {
        "id": "s47_20",
        "x": 11450,
        "y": 375
      },
      {
        "id": "s47_21",
        "x": 11960,
        "y": 305
      },
      {
        "id": "s47_22",
        "x": 12500,
        "y": 375
      },
      {
        "id": "s47_23",
        "x": 13070,
        "y": 305
      },
      {
        "id": "s47_24",
        "x": 13580,
        "y": 375
      },
      {
        "id": "s47_25",
        "x": 14120,
        "y": 305
      },
      {
        "id": "s47_26",
        "x": 14690,
        "y": 375
      },
      {
        "id": "s47_27",
        "x": 15200,
        "y": 305
      },
      {
        "id": "s47_28",
        "x": 15740,
        "y": 375
      },
      {
        "id": "s47_29",
        "x": 16310,
        "y": 305
      },
      {
        "id": "s47_30",
        "x": 16820,
        "y": 375
      }
    ],
    "portals": [
      {
        "id": "pt47_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      },
      {
        "id": "pt47_2",
        "inX": 5390,
        "inY": 290,
        "outX": 5760,
        "outY": 210,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu47_1",
        "type": "magnet",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu47_2",
        "type": "magnet",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu47_3",
        "type": "magnet",
        "x": 6070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu47_4",
        "type": "magnet",
        "x": 8260,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu47_5",
        "type": "magnet",
        "x": 10390,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu47_6",
        "type": "magnet",
        "x": 12550,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu47_7",
        "type": "magnet",
        "x": 14740,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu47_8",
        "type": "magnet",
        "x": 16870,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 48,
    "title": "Galaxy Core Odyssey",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 17540,
    "deathY": 900,
    "parTimeSeconds": 59,
    "pins": [
      {
        "id": "p48_1",
        "x": 260,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 110
        }
      },
      {
        "id": "p48_2",
        "x": 530,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 110
        }
      },
      {
        "id": "p48_3",
        "x": 830,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p48_4",
        "x": 1070,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 110
        }
      },
      {
        "id": "p48_5",
        "x": 1340,
        "y": 205,
        "fragile": true
      },
      {
        "id": "p48_6",
        "x": 1640,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 110
        }
      },
      {
        "id": "p48_7",
        "x": 1880,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 110
        }
      },
      {
        "id": "p48_8",
        "x": 2150,
        "y": 170
      },
      {
        "id": "p48_9",
        "x": 2870,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p48_10",
        "x": 3110,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 110
        }
      },
      {
        "id": "p48_11",
        "x": 3380,
        "y": 275
      },
      {
        "id": "p48_12",
        "x": 3680,
        "y": 170
      },
      {
        "id": "p48_13",
        "x": 3920,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 110
        }
      },
      {
        "id": "p48_14",
        "x": 4190,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 110
        }
      },
      {
        "id": "p48_15",
        "x": 4490,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p48_16",
        "x": 4730,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 110
        }
      },
      {
        "id": "p48_17",
        "x": 5000,
        "y": 205
      },
      {
        "id": "p48_18",
        "x": 5300,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 110
        }
      },
      {
        "id": "p48_19",
        "x": 5960,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 110
        }
      },
      {
        "id": "p48_20",
        "x": 6230,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p48_21",
        "x": 6530,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p48_22",
        "x": 6770,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 110
        }
      },
      {
        "id": "p48_23",
        "x": 7040,
        "y": 275
      },
      {
        "id": "p48_24",
        "x": 7340,
        "y": 170
      },
      {
        "id": "p48_25",
        "x": 7580,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 110
        }
      },
      {
        "id": "p48_26",
        "x": 7850,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 110
        }
      },
      {
        "id": "p48_27",
        "x": 8150,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p48_28",
        "x": 8390,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 110
        }
      },
      {
        "id": "p48_29",
        "x": 8660,
        "y": 205
      },
      {
        "id": "p48_30",
        "x": 8960,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 110
        }
      },
      {
        "id": "p48_31",
        "x": 9200,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 110
        }
      },
      {
        "id": "p48_32",
        "x": 9470,
        "y": 170
      },
      {
        "id": "p48_33",
        "x": 9770,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p48_34",
        "x": 10010,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 110
        }
      },
      {
        "id": "p48_35",
        "x": 10280,
        "y": 275,
        "fragile": true
      },
      {
        "id": "p48_36",
        "x": 10580,
        "y": 170
      },
      {
        "id": "p48_37",
        "x": 10820,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 110
        }
      },
      {
        "id": "p48_38",
        "x": 11090,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 110
        }
      },
      {
        "id": "p48_39",
        "x": 11390,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p48_40",
        "x": 11630,
        "y": 170,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 110
        }
      },
      {
        "id": "p48_41",
        "x": 11900,
        "y": 205
      },
      {
        "id": "p48_42",
        "x": 12200,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 110
        }
      },
      {
        "id": "p48_43",
        "x": 12440,
        "y": 275,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 110
        }
      },
      {
        "id": "p48_44",
        "x": 12710,
        "y": 170
      },
      {
        "id": "p48_45",
        "x": 13010,
        "y": 205,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p48_46",
        "x": 13250,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 110
        }
      },
      {
        "id": "p48_47",
        "x": 13520,
        "y": 275
      },
      {
        "id": "p48_48",
        "x": 13820,
        "y": 170
      },
      {
        "id": "p48_49",
        "x": 14060,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 110
        }
      },
      {
        "id": "p48_50",
        "x": 14330,
        "y": 240,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 110
        }
      },
      {
        "id": "p48_51",
        "x": 14630,
        "y": 275,
        "moving": {
          "axis": "y",
          "min": 235,
          "max": 315,
          "speed": 75
        }
      },
      {
        "id": "p48_52",
        "x": 14870,
        "y": 170,
        "moving": {
          "axis": "x",
          "min": 14825,
          "max": 14915,
          "speed": 110
        }
      },
      {
        "id": "p48_53",
        "x": 15140,
        "y": 205
      },
      {
        "id": "p48_54",
        "x": 15440,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 15395,
          "max": 15485,
          "speed": 110
        }
      },
      {
        "id": "p48_55",
        "x": 15680,
        "y": 275,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 15635,
          "max": 15725,
          "speed": 110
        }
      },
      {
        "id": "p48_56",
        "x": 15950,
        "y": 170
      },
      {
        "id": "p48_57",
        "x": 16250,
        "y": 205,
        "moving": {
          "axis": "y",
          "min": 165,
          "max": 245,
          "speed": 75
        }
      },
      {
        "id": "p48_58",
        "x": 16490,
        "y": 240,
        "moving": {
          "axis": "x",
          "min": 16445,
          "max": 16535,
          "speed": 110
        }
      },
      {
        "id": "p48_59",
        "x": 16760,
        "y": 275
      },
      {
        "id": "p48_60",
        "x": 17060,
        "y": 170,
        "fragile": true
      },
      {
        "id": "p48_61",
        "x": 17300,
        "y": 205,
        "moving": {
          "axis": "x",
          "min": 17255,
          "max": 17345,
          "speed": 110
        }
      }
    ],
    "trampolines": [
      {
        "id": "t48_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_18",
        "x": 15180,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_19",
        "x": 15990,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t48_20",
        "x": 16800,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t48_fin",
        "x": 17320,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr48_1",
        "x": 1450,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_2",
        "x": 2980,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_3",
        "x": 4030,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_4",
        "x": 5110,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_5",
        "x": 6640,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_6",
        "x": 7690,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_7",
        "x": 8770,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_8",
        "x": 9880,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_9",
        "x": 10930,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_10",
        "x": 12010,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_11",
        "x": 13120,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_12",
        "x": 14170,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_13",
        "x": 15250,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_14",
        "x": 16360,
        "y": 185,
        "radius": 22
      },
      {
        "id": "sr48_15",
        "x": 17410,
        "y": 185,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz48_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz48_2",
        "x": 3240,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz48_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz48_4",
        "x": 7470,
        "y": 310,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 190,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz48_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz48_6",
        "x": 11220,
        "y": 380,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 260,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz48_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      },
      {
        "id": "hz48_8",
        "x": 15000,
        "y": 310,
        "radius": 20,
        "pendulum": {
          "originX": 15000,
          "originY": 190,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz48_9",
        "x": 16890,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 16840,
          "max": 16950,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv48_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_9",
        "x": 14940,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv48_10",
        "x": 16560,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l48_1",
        "x": 630,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l48_2",
        "x": 1980,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l48_3",
        "x": 3780,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l48_4",
        "x": 5100,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l48_5",
        "x": 6870,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l48_6",
        "x": 8250,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l48_7",
        "x": 9570,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l48_8",
        "x": 10920,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l48_9",
        "x": 12300,
        "y": 310,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l48_10",
        "x": 13620,
        "y": 345,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l48_11",
        "x": 14970,
        "y": 240,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l48_12",
        "x": 16350,
        "y": 275,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s48_1",
        "x": 320,
        "y": 315
      },
      {
        "id": "s48_2",
        "x": 890,
        "y": 385
      },
      {
        "id": "s48_3",
        "x": 1400,
        "y": 315
      },
      {
        "id": "s48_4",
        "x": 1940,
        "y": 385
      },
      {
        "id": "s48_5",
        "x": 2930,
        "y": 315
      },
      {
        "id": "s48_6",
        "x": 3440,
        "y": 385
      },
      {
        "id": "s48_7",
        "x": 3980,
        "y": 315
      },
      {
        "id": "s48_8",
        "x": 4550,
        "y": 385
      },
      {
        "id": "s48_9",
        "x": 5060,
        "y": 315
      },
      {
        "id": "s48_10",
        "x": 6020,
        "y": 385
      },
      {
        "id": "s48_11",
        "x": 6590,
        "y": 315
      },
      {
        "id": "s48_12",
        "x": 7100,
        "y": 385
      },
      {
        "id": "s48_13",
        "x": 7640,
        "y": 315
      },
      {
        "id": "s48_14",
        "x": 8210,
        "y": 385
      },
      {
        "id": "s48_15",
        "x": 8720,
        "y": 315
      },
      {
        "id": "s48_16",
        "x": 9260,
        "y": 385
      },
      {
        "id": "s48_17",
        "x": 9830,
        "y": 315
      },
      {
        "id": "s48_18",
        "x": 10340,
        "y": 385
      },
      {
        "id": "s48_19",
        "x": 10880,
        "y": 315
      },
      {
        "id": "s48_20",
        "x": 11450,
        "y": 385
      },
      {
        "id": "s48_21",
        "x": 11960,
        "y": 315
      },
      {
        "id": "s48_22",
        "x": 12500,
        "y": 385
      },
      {
        "id": "s48_23",
        "x": 13070,
        "y": 315
      },
      {
        "id": "s48_24",
        "x": 13580,
        "y": 385
      },
      {
        "id": "s48_25",
        "x": 14120,
        "y": 315
      },
      {
        "id": "s48_26",
        "x": 14690,
        "y": 385
      },
      {
        "id": "s48_27",
        "x": 15200,
        "y": 315
      },
      {
        "id": "s48_28",
        "x": 15740,
        "y": 385
      },
      {
        "id": "s48_29",
        "x": 16310,
        "y": 315
      },
      {
        "id": "s48_30",
        "x": 16820,
        "y": 385
      },
      {
        "id": "s48_31",
        "x": 17360,
        "y": 315
      }
    ],
    "portals": [
      {
        "id": "pt48_1",
        "inX": 2240,
        "inY": 230,
        "outX": 2610,
        "outY": 150,
        "radius": 24
      },
      {
        "id": "pt48_2",
        "inX": 5390,
        "inY": 300,
        "outX": 5760,
        "outY": 220,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu48_1",
        "type": "magnet",
        "x": 940,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu48_2",
        "type": "magnet",
        "x": 3490,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu48_3",
        "type": "magnet",
        "x": 6070,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu48_4",
        "type": "magnet",
        "x": 8260,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu48_5",
        "type": "magnet",
        "x": 10390,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu48_6",
        "type": "magnet",
        "x": 12550,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu48_7",
        "type": "magnet",
        "x": 14740,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu48_8",
        "type": "magnet",
        "x": 16870,
        "y": 360,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  },
  {
    "id": 49,
    "title": "Stargate Continuum",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 17960,
    "deathY": 900,
    "parTimeSeconds": 60,
    "pins": [
      {
        "id": "p49_1",
        "x": 260,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 65
        }
      },
      {
        "id": "p49_2",
        "x": 530,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 65
        }
      },
      {
        "id": "p49_3",
        "x": 830,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p49_4",
        "x": 1070,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 65
        }
      },
      {
        "id": "p49_5",
        "x": 1340,
        "y": 215,
        "fragile": true
      },
      {
        "id": "p49_6",
        "x": 1640,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 65
        }
      },
      {
        "id": "p49_7",
        "x": 1880,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 65
        }
      },
      {
        "id": "p49_8",
        "x": 2150,
        "y": 180
      },
      {
        "id": "p49_9",
        "x": 2870,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p49_10",
        "x": 3110,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 65
        }
      },
      {
        "id": "p49_11",
        "x": 3380,
        "y": 285
      },
      {
        "id": "p49_12",
        "x": 3680,
        "y": 180
      },
      {
        "id": "p49_13",
        "x": 3920,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 65
        }
      },
      {
        "id": "p49_14",
        "x": 4190,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 65
        }
      },
      {
        "id": "p49_15",
        "x": 4490,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p49_16",
        "x": 4730,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 65
        }
      },
      {
        "id": "p49_17",
        "x": 5000,
        "y": 215
      },
      {
        "id": "p49_18",
        "x": 5300,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 65
        }
      },
      {
        "id": "p49_19",
        "x": 5960,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 65
        }
      },
      {
        "id": "p49_20",
        "x": 6230,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p49_21",
        "x": 6530,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p49_22",
        "x": 6770,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 65
        }
      },
      {
        "id": "p49_23",
        "x": 7040,
        "y": 285
      },
      {
        "id": "p49_24",
        "x": 7340,
        "y": 180
      },
      {
        "id": "p49_25",
        "x": 7580,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 65
        }
      },
      {
        "id": "p49_26",
        "x": 7850,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 65
        }
      },
      {
        "id": "p49_27",
        "x": 8150,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p49_28",
        "x": 8390,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 65
        }
      },
      {
        "id": "p49_29",
        "x": 8660,
        "y": 215
      },
      {
        "id": "p49_30",
        "x": 8960,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 65
        }
      },
      {
        "id": "p49_31",
        "x": 9200,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 65
        }
      },
      {
        "id": "p49_32",
        "x": 9470,
        "y": 180
      },
      {
        "id": "p49_33",
        "x": 9770,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p49_34",
        "x": 10010,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 65
        }
      },
      {
        "id": "p49_35",
        "x": 10280,
        "y": 285,
        "fragile": true
      },
      {
        "id": "p49_36",
        "x": 10580,
        "y": 180
      },
      {
        "id": "p49_37",
        "x": 10820,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 65
        }
      },
      {
        "id": "p49_38",
        "x": 11090,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 65
        }
      },
      {
        "id": "p49_39",
        "x": 11390,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p49_40",
        "x": 11630,
        "y": 180,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 65
        }
      },
      {
        "id": "p49_41",
        "x": 11900,
        "y": 215
      },
      {
        "id": "p49_42",
        "x": 12200,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 65
        }
      },
      {
        "id": "p49_43",
        "x": 12440,
        "y": 285,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 65
        }
      },
      {
        "id": "p49_44",
        "x": 12710,
        "y": 180
      },
      {
        "id": "p49_45",
        "x": 13010,
        "y": 215,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p49_46",
        "x": 13250,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 65
        }
      },
      {
        "id": "p49_47",
        "x": 13520,
        "y": 285
      },
      {
        "id": "p49_48",
        "x": 13820,
        "y": 180
      },
      {
        "id": "p49_49",
        "x": 14060,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 65
        }
      },
      {
        "id": "p49_50",
        "x": 14330,
        "y": 250,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 65
        }
      },
      {
        "id": "p49_51",
        "x": 14630,
        "y": 285,
        "moving": {
          "axis": "y",
          "min": 245,
          "max": 325,
          "speed": 90
        }
      },
      {
        "id": "p49_52",
        "x": 14870,
        "y": 180,
        "moving": {
          "axis": "x",
          "min": 14825,
          "max": 14915,
          "speed": 65
        }
      },
      {
        "id": "p49_53",
        "x": 15140,
        "y": 215
      },
      {
        "id": "p49_54",
        "x": 15440,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 15395,
          "max": 15485,
          "speed": 65
        }
      },
      {
        "id": "p49_55",
        "x": 15680,
        "y": 285,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 15635,
          "max": 15725,
          "speed": 65
        }
      },
      {
        "id": "p49_56",
        "x": 15950,
        "y": 180
      },
      {
        "id": "p49_57",
        "x": 16250,
        "y": 215,
        "moving": {
          "axis": "y",
          "min": 175,
          "max": 255,
          "speed": 90
        }
      },
      {
        "id": "p49_58",
        "x": 16490,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 16445,
          "max": 16535,
          "speed": 65
        }
      },
      {
        "id": "p49_59",
        "x": 16760,
        "y": 285
      },
      {
        "id": "p49_60",
        "x": 17060,
        "y": 180,
        "fragile": true
      },
      {
        "id": "p49_61",
        "x": 17300,
        "y": 215,
        "moving": {
          "axis": "x",
          "min": 17255,
          "max": 17345,
          "speed": 65
        }
      },
      {
        "id": "p49_62",
        "x": 17570,
        "y": 250,
        "moving": {
          "axis": "x",
          "min": 17525,
          "max": 17615,
          "speed": 65
        }
      }
    ],
    "trampolines": [
      {
        "id": "t49_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_18",
        "x": 15180,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_19",
        "x": 15990,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_20",
        "x": 16800,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t49_21",
        "x": 17610,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t49_fin",
        "x": 17740,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr49_1",
        "x": 1450,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_2",
        "x": 2980,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_3",
        "x": 4030,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_4",
        "x": 5110,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_5",
        "x": 6640,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_6",
        "x": 7690,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_7",
        "x": 8770,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_8",
        "x": 9880,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_9",
        "x": 10930,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_10",
        "x": 12010,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_11",
        "x": 13120,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_12",
        "x": 14170,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_13",
        "x": 15250,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_14",
        "x": 16360,
        "y": 195,
        "radius": 22
      },
      {
        "id": "sr49_15",
        "x": 17410,
        "y": 195,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz49_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz49_2",
        "x": 3240,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz49_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz49_4",
        "x": 7470,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz49_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz49_6",
        "x": 11220,
        "y": 390,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 270,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz49_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      },
      {
        "id": "hz49_8",
        "x": 15000,
        "y": 320,
        "radius": 20,
        "pendulum": {
          "originX": 15000,
          "originY": 200,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz49_9",
        "x": 16890,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 16840,
          "max": 16950,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv49_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_9",
        "x": 14940,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv49_10",
        "x": 16560,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l49_1",
        "x": 630,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l49_2",
        "x": 1980,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l49_3",
        "x": 3780,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l49_4",
        "x": 5100,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l49_5",
        "x": 6870,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l49_6",
        "x": 8250,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l49_7",
        "x": 9570,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l49_8",
        "x": 10920,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l49_9",
        "x": 12300,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l49_10",
        "x": 13620,
        "y": 355,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l49_11",
        "x": 14970,
        "y": 250,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l49_12",
        "x": 16350,
        "y": 285,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l49_13",
        "x": 17670,
        "y": 320,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s49_1",
        "x": 320,
        "y": 325
      },
      {
        "id": "s49_2",
        "x": 890,
        "y": 395
      },
      {
        "id": "s49_3",
        "x": 1400,
        "y": 325
      },
      {
        "id": "s49_4",
        "x": 1940,
        "y": 395
      },
      {
        "id": "s49_5",
        "x": 2930,
        "y": 325
      },
      {
        "id": "s49_6",
        "x": 3440,
        "y": 395
      },
      {
        "id": "s49_7",
        "x": 3980,
        "y": 325
      },
      {
        "id": "s49_8",
        "x": 4550,
        "y": 395
      },
      {
        "id": "s49_9",
        "x": 5060,
        "y": 325
      },
      {
        "id": "s49_10",
        "x": 6020,
        "y": 395
      },
      {
        "id": "s49_11",
        "x": 6590,
        "y": 325
      },
      {
        "id": "s49_12",
        "x": 7100,
        "y": 395
      },
      {
        "id": "s49_13",
        "x": 7640,
        "y": 325
      },
      {
        "id": "s49_14",
        "x": 8210,
        "y": 395
      },
      {
        "id": "s49_15",
        "x": 8720,
        "y": 325
      },
      {
        "id": "s49_16",
        "x": 9260,
        "y": 395
      },
      {
        "id": "s49_17",
        "x": 9830,
        "y": 325
      },
      {
        "id": "s49_18",
        "x": 10340,
        "y": 395
      },
      {
        "id": "s49_19",
        "x": 10880,
        "y": 325
      },
      {
        "id": "s49_20",
        "x": 11450,
        "y": 395
      },
      {
        "id": "s49_21",
        "x": 11960,
        "y": 325
      },
      {
        "id": "s49_22",
        "x": 12500,
        "y": 395
      },
      {
        "id": "s49_23",
        "x": 13070,
        "y": 325
      },
      {
        "id": "s49_24",
        "x": 13580,
        "y": 395
      },
      {
        "id": "s49_25",
        "x": 14120,
        "y": 325
      },
      {
        "id": "s49_26",
        "x": 14690,
        "y": 395
      },
      {
        "id": "s49_27",
        "x": 15200,
        "y": 325
      },
      {
        "id": "s49_28",
        "x": 15740,
        "y": 395
      },
      {
        "id": "s49_29",
        "x": 16310,
        "y": 325
      },
      {
        "id": "s49_30",
        "x": 16820,
        "y": 395
      },
      {
        "id": "s49_31",
        "x": 17360,
        "y": 325
      }
    ],
    "portals": [
      {
        "id": "pt49_1",
        "inX": 2240,
        "inY": 240,
        "outX": 2610,
        "outY": 160,
        "radius": 24
      },
      {
        "id": "pt49_2",
        "inX": 5390,
        "inY": 310,
        "outX": 5760,
        "outY": 230,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu49_1",
        "type": "magnet",
        "x": 940,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu49_2",
        "type": "magnet",
        "x": 3490,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu49_3",
        "type": "magnet",
        "x": 6070,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu49_4",
        "type": "magnet",
        "x": 8260,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu49_5",
        "type": "magnet",
        "x": 10390,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu49_6",
        "type": "magnet",
        "x": 12550,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu49_7",
        "type": "magnet",
        "x": 14740,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu49_8",
        "type": "magnet",
        "x": 16870,
        "y": 370,
        "radius": 18,
        "durationSeconds": 7
      }
    ],
    "bungeeWebs": [
      {
        "id": "bw49_1",
        "x": 1100,
        "y": 550,
        "width": 160,
        "launchVy": -900,
        "launchVx": 750
      }
    ],
    "barriers": [
      {
        "id": "bar49_1",
        "x": 1600,
        "y": 190,
        "width": 24,
        "height": 200,
        "minSpeed": 520
      }
    ],
    "wreckingBalls": [
      {
        "id": "wb49_1",
        "pivotX": 2100,
        "pivotY": 40,
        "chainLength": 250,
        "radius": 28,
        "swingSpeed": 2.7,
        "maxAngle": 0.95
      }
    ]
  },
  {
    "id": 50,
    "title": "The Grand Finale: Olympic Horizon",
    "chapter": 5,
    "theme": "cosmic_void",
    "startX": 80,
    "startY": 280,
    "finishX": 18380,
    "deathY": 900,
    "parTimeSeconds": 61,
    "pins": [
      {
        "id": "p50_1",
        "x": 260,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 215,
          "max": 305,
          "speed": 80
        }
      },
      {
        "id": "p50_2",
        "x": 530,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 485,
          "max": 575,
          "speed": 80
        }
      },
      {
        "id": "p50_3",
        "x": 830,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p50_4",
        "x": 1070,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 1025,
          "max": 1115,
          "speed": 80
        }
      },
      {
        "id": "p50_5",
        "x": 1340,
        "y": 195,
        "fragile": true
      },
      {
        "id": "p50_6",
        "x": 1640,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 1595,
          "max": 1685,
          "speed": 80
        }
      },
      {
        "id": "p50_7",
        "x": 1880,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 1835,
          "max": 1925,
          "speed": 80
        }
      },
      {
        "id": "p50_8",
        "x": 2150,
        "y": 160
      },
      {
        "id": "p50_9",
        "x": 2870,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p50_10",
        "x": 3110,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 3065,
          "max": 3155,
          "speed": 80
        }
      },
      {
        "id": "p50_11",
        "x": 3380,
        "y": 265
      },
      {
        "id": "p50_12",
        "x": 3680,
        "y": 160
      },
      {
        "id": "p50_13",
        "x": 3920,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 3875,
          "max": 3965,
          "speed": 80
        }
      },
      {
        "id": "p50_14",
        "x": 4190,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 4145,
          "max": 4235,
          "speed": 80
        }
      },
      {
        "id": "p50_15",
        "x": 4490,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p50_16",
        "x": 4730,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 4685,
          "max": 4775,
          "speed": 80
        }
      },
      {
        "id": "p50_17",
        "x": 5000,
        "y": 195
      },
      {
        "id": "p50_18",
        "x": 5300,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 5255,
          "max": 5345,
          "speed": 80
        }
      },
      {
        "id": "p50_19",
        "x": 5960,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 5915,
          "max": 6005,
          "speed": 80
        }
      },
      {
        "id": "p50_20",
        "x": 6230,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p50_21",
        "x": 6530,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p50_22",
        "x": 6770,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 6725,
          "max": 6815,
          "speed": 80
        }
      },
      {
        "id": "p50_23",
        "x": 7040,
        "y": 265
      },
      {
        "id": "p50_24",
        "x": 7340,
        "y": 160
      },
      {
        "id": "p50_25",
        "x": 7580,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 7535,
          "max": 7625,
          "speed": 80
        }
      },
      {
        "id": "p50_26",
        "x": 7850,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 7805,
          "max": 7895,
          "speed": 80
        }
      },
      {
        "id": "p50_27",
        "x": 8150,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p50_28",
        "x": 8390,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 8345,
          "max": 8435,
          "speed": 80
        }
      },
      {
        "id": "p50_29",
        "x": 8660,
        "y": 195
      },
      {
        "id": "p50_30",
        "x": 8960,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 8915,
          "max": 9005,
          "speed": 80
        }
      },
      {
        "id": "p50_31",
        "x": 9200,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 9155,
          "max": 9245,
          "speed": 80
        }
      },
      {
        "id": "p50_32",
        "x": 9470,
        "y": 160
      },
      {
        "id": "p50_33",
        "x": 9770,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p50_34",
        "x": 10010,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 9965,
          "max": 10055,
          "speed": 80
        }
      },
      {
        "id": "p50_35",
        "x": 10280,
        "y": 265,
        "fragile": true
      },
      {
        "id": "p50_36",
        "x": 10580,
        "y": 160
      },
      {
        "id": "p50_37",
        "x": 10820,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 10775,
          "max": 10865,
          "speed": 80
        }
      },
      {
        "id": "p50_38",
        "x": 11090,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 11045,
          "max": 11135,
          "speed": 80
        }
      },
      {
        "id": "p50_39",
        "x": 11390,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p50_40",
        "x": 11630,
        "y": 160,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 11585,
          "max": 11675,
          "speed": 80
        }
      },
      {
        "id": "p50_41",
        "x": 11900,
        "y": 195
      },
      {
        "id": "p50_42",
        "x": 12200,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 12155,
          "max": 12245,
          "speed": 80
        }
      },
      {
        "id": "p50_43",
        "x": 12440,
        "y": 265,
        "moving": {
          "axis": "x",
          "min": 12395,
          "max": 12485,
          "speed": 80
        }
      },
      {
        "id": "p50_44",
        "x": 12710,
        "y": 160
      },
      {
        "id": "p50_45",
        "x": 13010,
        "y": 195,
        "fragile": true,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p50_46",
        "x": 13250,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 13205,
          "max": 13295,
          "speed": 80
        }
      },
      {
        "id": "p50_47",
        "x": 13520,
        "y": 265
      },
      {
        "id": "p50_48",
        "x": 13820,
        "y": 160
      },
      {
        "id": "p50_49",
        "x": 14060,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 14015,
          "max": 14105,
          "speed": 80
        }
      },
      {
        "id": "p50_50",
        "x": 14330,
        "y": 230,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 14285,
          "max": 14375,
          "speed": 80
        }
      },
      {
        "id": "p50_51",
        "x": 14630,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p50_52",
        "x": 14870,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 14825,
          "max": 14915,
          "speed": 80
        }
      },
      {
        "id": "p50_53",
        "x": 15140,
        "y": 195
      },
      {
        "id": "p50_54",
        "x": 15440,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 15395,
          "max": 15485,
          "speed": 80
        }
      },
      {
        "id": "p50_55",
        "x": 15680,
        "y": 265,
        "fragile": true,
        "moving": {
          "axis": "x",
          "min": 15635,
          "max": 15725,
          "speed": 80
        }
      },
      {
        "id": "p50_56",
        "x": 15950,
        "y": 160
      },
      {
        "id": "p50_57",
        "x": 16250,
        "y": 195,
        "moving": {
          "axis": "y",
          "min": 155,
          "max": 235,
          "speed": 60
        }
      },
      {
        "id": "p50_58",
        "x": 16490,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 16445,
          "max": 16535,
          "speed": 80
        }
      },
      {
        "id": "p50_59",
        "x": 16760,
        "y": 265
      },
      {
        "id": "p50_60",
        "x": 17060,
        "y": 160,
        "fragile": true
      },
      {
        "id": "p50_61",
        "x": 17300,
        "y": 195,
        "moving": {
          "axis": "x",
          "min": 17255,
          "max": 17345,
          "speed": 80
        }
      },
      {
        "id": "p50_62",
        "x": 17570,
        "y": 230,
        "moving": {
          "axis": "x",
          "min": 17525,
          "max": 17615,
          "speed": 80
        }
      },
      {
        "id": "p50_63",
        "x": 17870,
        "y": 265,
        "moving": {
          "axis": "y",
          "min": 225,
          "max": 305,
          "speed": 60
        }
      },
      {
        "id": "p50_64",
        "x": 18110,
        "y": 160,
        "moving": {
          "axis": "x",
          "min": 18065,
          "max": 18155,
          "speed": 80
        }
      }
    ],
    "trampolines": [
      {
        "id": "t50_1",
        "x": 570,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_2",
        "x": 1380,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_3",
        "x": 2190,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_4",
        "x": 3420,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_5",
        "x": 4230,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_6",
        "x": 5040,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_7",
        "x": 6270,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_8",
        "x": 7080,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_9",
        "x": 7890,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_10",
        "x": 8700,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_11",
        "x": 9510,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_12",
        "x": 10320,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_13",
        "x": 11130,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_14",
        "x": 11940,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_15",
        "x": 12750,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_16",
        "x": 13560,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_17",
        "x": 14370,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_18",
        "x": 15180,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_19",
        "x": 15990,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_20",
        "x": 16800,
        "y": 640,
        "width": 95,
        "height": 16,
        "bouncePower": 780
      },
      {
        "id": "t50_21",
        "x": 17610,
        "y": 640,
        "width": 110,
        "height": 16,
        "bouncePower": 1150,
        "superSpring": true
      },
      {
        "id": "t50_fin",
        "x": 18160,
        "y": 650,
        "width": 120,
        "height": 16,
        "bouncePower": 820
      }
    ],
    "speedRings": [
      {
        "id": "sr50_1",
        "x": 1450,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_2",
        "x": 2980,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_3",
        "x": 4030,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_4",
        "x": 5110,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_5",
        "x": 6640,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_6",
        "x": 7690,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_7",
        "x": 8770,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_8",
        "x": 9880,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_9",
        "x": 10930,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_10",
        "x": 12010,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_11",
        "x": 13120,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_12",
        "x": 14170,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_13",
        "x": 15250,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_14",
        "x": 16360,
        "y": 175,
        "radius": 22
      },
      {
        "id": "sr50_15",
        "x": 17410,
        "y": 175,
        "radius": 22
      }
    ],
    "hazards": [
      {
        "id": "hz50_1",
        "x": 960,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 910,
          "max": 1020,
          "speed": 70
        }
      },
      {
        "id": "hz50_2",
        "x": 3240,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 3240,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz50_3",
        "x": 5130,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 5080,
          "max": 5190,
          "speed": 70
        }
      },
      {
        "id": "hz50_4",
        "x": 7470,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 7470,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz50_5",
        "x": 9330,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 9280,
          "max": 9390,
          "speed": 70
        }
      },
      {
        "id": "hz50_6",
        "x": 11220,
        "y": 370,
        "radius": 20,
        "pendulum": {
          "originX": 11220,
          "originY": 250,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz50_7",
        "x": 13140,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 13090,
          "max": 13200,
          "speed": 70
        }
      },
      {
        "id": "hz50_8",
        "x": 15000,
        "y": 300,
        "radius": 20,
        "pendulum": {
          "originX": 15000,
          "originY": 180,
          "length": 120,
          "speed": 2.2,
          "angle": 0
        }
      },
      {
        "id": "hz50_9",
        "x": 16890,
        "y": 760,
        "radius": 18,
        "moving": {
          "axis": "x",
          "min": 16840,
          "max": 16950,
          "speed": 70
        }
      }
    ],
    "windVents": [
      {
        "id": "wv50_1",
        "x": 1140,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_2",
        "x": 3180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_3",
        "x": 4800,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_4",
        "x": 6840,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_5",
        "x": 8460,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_6",
        "x": 10080,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_7",
        "x": 11700,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_8",
        "x": 13320,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_9",
        "x": 14940,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_10",
        "x": 16560,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      },
      {
        "id": "wv50_11",
        "x": 18180,
        "y": 520,
        "width": 80,
        "height": 360,
        "pushY": -680
      }
    ],
    "lasers": [
      {
        "id": "l50_1",
        "x": 630,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l50_2",
        "x": 1980,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l50_3",
        "x": 3780,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l50_4",
        "x": 5100,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l50_5",
        "x": 6870,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l50_6",
        "x": 8250,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l50_7",
        "x": 9570,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l50_8",
        "x": 10920,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l50_9",
        "x": 12300,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l50_10",
        "x": 13620,
        "y": 335,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 3200,
        "active": true
      },
      {
        "id": "l50_11",
        "x": 14970,
        "y": 230,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 2800,
        "active": true
      },
      {
        "id": "l50_12",
        "x": 16350,
        "y": 265,
        "length": 90,
        "orientation": "vertical",
        "periodMs": 2400,
        "active": true
      },
      {
        "id": "l50_13",
        "x": 17670,
        "y": 300,
        "length": 90,
        "orientation": "horizontal",
        "periodMs": 3200,
        "active": true
      }
    ],
    "stars": [
      {
        "id": "s50_1",
        "x": 320,
        "y": 305
      },
      {
        "id": "s50_2",
        "x": 890,
        "y": 375
      },
      {
        "id": "s50_3",
        "x": 1400,
        "y": 305
      },
      {
        "id": "s50_4",
        "x": 1940,
        "y": 375
      },
      {
        "id": "s50_5",
        "x": 2930,
        "y": 305
      },
      {
        "id": "s50_6",
        "x": 3440,
        "y": 375
      },
      {
        "id": "s50_7",
        "x": 3980,
        "y": 305
      },
      {
        "id": "s50_8",
        "x": 4550,
        "y": 375
      },
      {
        "id": "s50_9",
        "x": 5060,
        "y": 305
      },
      {
        "id": "s50_10",
        "x": 6020,
        "y": 375
      },
      {
        "id": "s50_11",
        "x": 6590,
        "y": 305
      },
      {
        "id": "s50_12",
        "x": 7100,
        "y": 375
      },
      {
        "id": "s50_13",
        "x": 7640,
        "y": 305
      },
      {
        "id": "s50_14",
        "x": 8210,
        "y": 375
      },
      {
        "id": "s50_15",
        "x": 8720,
        "y": 305
      },
      {
        "id": "s50_16",
        "x": 9260,
        "y": 375
      },
      {
        "id": "s50_17",
        "x": 9830,
        "y": 305
      },
      {
        "id": "s50_18",
        "x": 10340,
        "y": 375
      },
      {
        "id": "s50_19",
        "x": 10880,
        "y": 305
      },
      {
        "id": "s50_20",
        "x": 11450,
        "y": 375
      },
      {
        "id": "s50_21",
        "x": 11960,
        "y": 305
      },
      {
        "id": "s50_22",
        "x": 12500,
        "y": 375
      },
      {
        "id": "s50_23",
        "x": 13070,
        "y": 305
      },
      {
        "id": "s50_24",
        "x": 13580,
        "y": 375
      },
      {
        "id": "s50_25",
        "x": 14120,
        "y": 305
      },
      {
        "id": "s50_26",
        "x": 14690,
        "y": 375
      },
      {
        "id": "s50_27",
        "x": 15200,
        "y": 305
      },
      {
        "id": "s50_28",
        "x": 15740,
        "y": 375
      },
      {
        "id": "s50_29",
        "x": 16310,
        "y": 305
      },
      {
        "id": "s50_30",
        "x": 16820,
        "y": 375
      },
      {
        "id": "s50_31",
        "x": 17360,
        "y": 305
      },
      {
        "id": "s50_32",
        "x": 17930,
        "y": 375
      }
    ],
    "portals": [
      {
        "id": "pt50_1",
        "inX": 2240,
        "inY": 220,
        "outX": 2610,
        "outY": 140,
        "radius": 24
      },
      {
        "id": "pt50_2",
        "inX": 5390,
        "inY": 290,
        "outX": 5760,
        "outY": 210,
        "radius": 24
      }
    ],
    "powerUps": [
      {
        "id": "pu50_1",
        "type": "magnet",
        "x": 940,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu50_2",
        "type": "magnet",
        "x": 3490,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu50_3",
        "type": "magnet",
        "x": 6070,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu50_4",
        "type": "magnet",
        "x": 8260,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu50_5",
        "type": "magnet",
        "x": 10390,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu50_6",
        "type": "magnet",
        "x": 12550,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu50_7",
        "type": "magnet",
        "x": 14740,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      },
      {
        "id": "pu50_8",
        "type": "magnet",
        "x": 16870,
        "y": 350,
        "radius": 18,
        "durationSeconds": 7
      }
    ]
  }
];
