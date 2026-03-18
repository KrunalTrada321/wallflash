// screens/GamesScreen.js
import React, { useRef, useEffect, useMemo } from "react";
import {
  View, Text, StyleSheet, FlatList,
  Pressable, Animated, Dimensions, StatusBar, Image,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { Gamepad2 } from "lucide-react-native";

const { width: SW, height: SH } = Dimensions.get("window");
const CARD_WIDTH = (SW - scale(48)) / 2;

// ─── Game image assets ────────────────────────────────────────────────────────
//  Place these images inside:  assets/games/<filename>.png
//  Recommended size: 256×256 px (or 512×512 for @2x/@3x quality)
const GAME_IMAGES = {
  memory_match:  require("../assets/game/memory_card.jpg"),
  reaction_rush: require("../assets/game/tapa_tap.jpg"),
  color_trap:    require("../assets/game/color_trap.jpg"),
  whack_a_moji:  require("../assets/game/whack_a_mojo.jpg"),
  two048:        require("../assets/game/2048.jpg"),
  snake:        require("../assets/game/snack.jpg"), 
  stack_tower:   require("../assets/game/stack_tower.jpg"),
  ball_blast:    require("../assets/game/ball_blast.jpg"), 
  flow_free:     require("../assets/game/flow_free.jpg"),
  tic_tac_toe:   require("../assets/game/tic_tac_toe.jpg"),
};

// ─── All 10 games ─────────────────────────────────────────────────────────────
const GAMES = [
    {
    id: "SnakeGame",
    title: "Snake",
    description: "Eat, grow, survive — walls wrap around!",
    image: GAME_IMAGES.snake,
    badge: "ARCADE",  badgeColor: "#b2ff59", accentColor: "#b2ff59",
    difficulty: "Medium",
  },
   {
    id: "WhackAMoji",
    title: "Whack-a-Moji",
    description: "Smash emojis before they disappear!",
    image: GAME_IMAGES.whack_a_moji,
    badge: "ACTION",  badgeColor: "#69f0ae", accentColor: "#69f0ae",
    difficulty: "Medium",
  },
   {
    id: "TwentyFortyEight",
    title: "2048",
    description: "Merge tiles & reach the golden 2048!",
    image: GAME_IMAGES.two048,
    badge: "PUZZLE",  badgeColor: "#ff6d00", accentColor: "#ff6d00",
    difficulty: "Hard",
  },
    {
    id: "FlowFreeGame",
    title: "Flow Free",
    description: "Connect dots with pipes. Fill every cell!",
    image: GAME_IMAGES.flow_free,
    badge: "PUZZLE",  badgeColor: "#e040fb", accentColor: "#e040fb",
    difficulty: "Medium",
  },

    {
    id: "TicTacToe",
    title: "Tic Tac Toe",
    description: "Beat the AI or challenge a friend!",
    image: GAME_IMAGES.tic_tac_toe,
    badge: "CLASSIC", badgeColor: "#40c4ff", accentColor: "#40c4ff",
    difficulty: "Easy",
  },

   {
    id: "BallBlast",
    title: "Ball Blast",
    description: "Drag to aim. Blast blocks before they drop!",
    image: GAME_IMAGES.ball_blast,
    badge: "ACTION",  badgeColor: "#ff1744", accentColor: "#ff1744",
    difficulty: "Medium",
  },
  {
    id: "MemoryCardGame",
    title: "Memory Match",
    description: "Flip cards & find matching pairs",
    image: GAME_IMAGES.memory_match,
    badge: "CLASSIC", badgeColor: "#00e5ff", accentColor: "#00e5ff",
    difficulty: "Easy",
  },
  {
    id: "ReactionRush",
    title: "Reaction Rush",
    description: "Tap the flash before time runs out!",
    image: GAME_IMAGES.reaction_rush,
    badge: "REFLEX",  badgeColor: "#ffd600", accentColor: "#ffd600",
    difficulty: "Medium",
  },
  {
    id: "ColorTrap",
    title: "Color Trap",
    description: "Tap the INK color — don't read the word!",
    image: GAME_IMAGES.color_trap,
    badge: "TRICKY",  badgeColor: "#ff4081", accentColor: "#ff4081",
    difficulty: "Hard",
  },
 
 

  {
    id: "StackTower",
    title: "Stack Tower",
    description: "Tap to stack blocks. Perfect tap = no loss!",
    image: GAME_IMAGES.stack_tower,
    badge: "REFLEX",  badgeColor: "#7c4dff", accentColor: "#7c4dff",
    difficulty: "Medium",
  },
 


];

const DIFF_COLORS = { Easy: "#4caf50", Medium: "#ff9800", Hard: "#ff4081" };

// ─── Star / background config ─────────────────────────────────────────────────
const STAR_COUNT      = 160;
const BRIGHT_COUNT    = 18;
const SHOOTING_COUNT  = 4;

const STAR_COLORS = [
  "#ffffff", "#ffffff", "#ffffff", "#ffffff",
  "#e8f0ff", "#d0e8ff", "#c8e0ff",
  "#fff8e8", "#ffe8c0",
  "#ffd6ff", "#e0d0ff",
  "#b0ffff",
];

function seededRand(seed) {
  let s = seed * 9301 + 49297;
  return ((s % 233280) / 233280);
}

function makeStars() {
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const r1 = seededRand(i * 3 + 1);
    const r2 = seededRand(i * 3 + 2);
    const r3 = seededRand(i * 3 + 3);
    const r4 = seededRand(i * 7 + 11);
    const r5 = seededRand(i * 5 + 7);
    const r6 = seededRand(i * 13 + 17);
    return {
      id: i,
      x: r1 * SW,
      y: r2 * (SH * 1.6),
      size: 0.8 + r3 * 2.2,
      color: STAR_COLORS[Math.floor(r4 * STAR_COLORS.length)],
      twinkleDuration: 1200 + r5 * 3000,
      twinkleDelay: r6 * 4000,
      minOpacity: 0.08 + r3 * 0.12,
      maxOpacity: 0.55 + r3 * 0.45,
    };
  });
}

function makeBrightStars() {
  return Array.from({ length: BRIGHT_COUNT }, (_, i) => {
    const r1 = seededRand(i * 17 + 100);
    const r2 = seededRand(i * 19 + 200);
    const r3 = seededRand(i * 23 + 300);
    const r4 = seededRand(i * 29 + 400);
    const r5 = seededRand(i * 31 + 500);
    const r6 = seededRand(i * 37 + 600);
    return {
      id: i,
      x: r1 * SW,
      y: r2 * (SH * 1.6),
      size: 2 + r3 * 3,
      color: i % 5 === 0 ? "#ffd6ff" : i % 5 === 1 ? "#b0ffff" : i % 5 === 2 ? "#ffe8a0" : "#ffffff",
      twinkleDuration: 1800 + r4 * 2500,
      twinkleDelay: r5 * 3500,
      floatDist: 4 + r6 * 8,
      floatDuration: 5000 + r6 * 6000,
    };
  });
}

function makeShootingStars() {
  return Array.from({ length: SHOOTING_COUNT }, (_, i) => {
    const r1 = seededRand(i * 41 + 700);
    const r2 = seededRand(i * 43 + 800);
    return {
      id: i,
      startX: r1 * SW * 0.6,
      startY: r2 * SH * 0.5,
      length: scale(55 + r1 * 50),
      delay: 2000 + i * 3500 + r2 * 4000,
      duration: 900 + r1 * 600,
    };
  });
}

// ─── Background components ────────────────────────────────────────────────────

function Star({ cfg }) {
  const opacAnim = useRef(new Animated.Value(cfg.minOpacity)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacAnim, {
          toValue: cfg.maxOpacity,
          duration: cfg.twinkleDuration / 2,
          delay: cfg.twinkleDelay,
          useNativeDriver: true,
        }),
        Animated.timing(opacAnim, {
          toValue: cfg.minOpacity,
          duration: cfg.twinkleDuration / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: cfg.x, top: cfg.y,
        width: cfg.size, height: cfg.size,
        borderRadius: cfg.size / 2,
        backgroundColor: cfg.color,
        opacity: opacAnim,
      }}
    />
  );
}

function BrightStar({ cfg }) {
  const opacAnim  = useRef(new Animated.Value(0.3)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacAnim, { toValue: 1,    duration: cfg.twinkleDuration / 2, delay: cfg.twinkleDelay, useNativeDriver: true }),
        Animated.timing(opacAnim, { toValue: 0.25, duration: cfg.twinkleDuration / 2,                          useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.3, duration: cfg.twinkleDuration * 0.6, delay: cfg.twinkleDelay * 0.3, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.7, duration: cfg.twinkleDuration * 0.6,                                useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -cfg.floatDist,      duration: cfg.floatDuration / 2, delay: cfg.twinkleDelay * 0.5, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue:  cfg.floatDist * 0.5, duration: cfg.floatDuration / 2,                               useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const s = cfg.size;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute", left: cfg.x - s * 3, top: cfg.y - s * 3,
        width: s * 6, height: s * 6, alignItems: "center", justifyContent: "center",
        opacity: opacAnim, transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
      }}
    >
      <View style={{ position: "absolute", width: s * 5, height: s * 5, borderRadius: s * 2.5, backgroundColor: cfg.color + "12" }} />
      <View style={{ position: "absolute", width: s * 3, height: s * 3, borderRadius: s * 1.5, backgroundColor: cfg.color + "25" }} />
      <View style={{ position: "absolute", width: s * 4.5, height: Math.max(1, s * 0.22), backgroundColor: cfg.color + "60", borderRadius: 2 }} />
      <View style={{ position: "absolute", width: Math.max(1, s * 0.22), height: s * 4.5, backgroundColor: cfg.color + "60", borderRadius: 2 }} />
      <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: cfg.color }} />
    </Animated.View>
  );
}

function ShootingStar({ cfg }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const run = () => {
      translateX.setValue(0); translateY.setValue(0); opacity.setValue(0);
      Animated.sequence([
        Animated.delay(cfg.delay),
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 1,                                             duration: 150,         useNativeDriver: true }),
          Animated.timing(translateX, { toValue: cfg.length * 1.2,                             duration: cfg.duration, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: cfg.length * 0.45,                            duration: cfg.duration, useNativeDriver: true }),
        ]),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.delay(6000 + Math.random() * 5000),
      ]).start(() => run());
    };
    run();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: "absolute", left: cfg.startX, top: cfg.startY, opacity, transform: [{ translateX }, { translateY }] }}
    >
      <View style={{ width: cfg.length, height: 1.5, borderRadius: 1, backgroundColor: "#ffffff", transform: [{ rotate: "20deg" }] }} />
      <View style={{ position: "absolute", right: 0, top: -2, width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#ffffff" }} />
    </Animated.View>
  );
}

function Nebula({ x, y, size, color, duration, delay }) {
  const opacAnim = useRef(new Animated.Value(0.025)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacAnim, { toValue: 0.07,  duration: duration / 2, delay, useNativeDriver: true }),
        Animated.timing(opacAnim, { toValue: 0.015, duration: duration / 2,        useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: opacAnim }}
    />
  );
}

function GalaxyBackground() {
  const stars         = useMemo(() => makeStars(), []);
  const brightStars   = useMemo(() => makeBrightStars(), []);
  const shootingStars = useMemo(() => makeShootingStars(), []);

  const nebulae = useMemo(() => [
    { x: SW * 0.2,  y: SH * 0.15, size: scale(220), color: "#7c3aed", duration: 9000,  delay: 0    },
    { x: SW * 0.82, y: SH * 0.38, size: scale(180), color: "#1d4ed8", duration: 11000, delay: 1500 },
    { x: SW * 0.45, y: SH * 0.7,  size: scale(200), color: "#0e7490", duration: 8000,  delay: 800  },
    { x: SW * 0.1,  y: SH * 0.85, size: scale(160), color: "#7e22ce", duration: 10000, delay: 2000 },
    { x: SW * 0.88, y: SH * 0.92, size: scale(190), color: "#be185d", duration: 12000, delay: 400  },
  ], []);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={styles.spaceBase} />
      {nebulae.map((n, i) => <Nebula key={`neb-${i}`} {...n} />)}
      {stars.map(s => <Star key={`st-${s.id}`} cfg={s} />)}
      {brightStars.map(s => <BrightStar key={`bs-${s.id}`} cfg={s} />)}
      {shootingStars.map(s => <ShootingStar key={`ss-${s.id}`} cfg={s} />)}
    </View>
  );
}

// ─── GlowImage: replaces GlowIcon — renders asset image with glow ring ────────
function GlowImage({ source, color }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.99, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.glowImageOuter, { borderColor: color + "45", shadowColor: color, transform: [{ scale: pulseAnim }] }]}>
      {/* Outer glow ring */}
      <View style={[styles.glowRingOuter, { backgroundColor: color + "12" }]} />
      {/* Inner glow ring */}
      <View style={[styles.glowRingInner, { backgroundColor: color + "22", borderColor: color + "55" }]}>
        {/* Image container */}
        <View style={[styles.glowImageWrap, { backgroundColor: color + "15" }]}>
          <Image
            source={source}
            style={styles.gameImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </Animated.View>
  );
}

// ─── GameCard ─────────────────────────────────────────────────────────────────
function GameCard({ item, index, onPress }) {
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressAnim   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim,   { toValue: 1, delay: index * 80, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, delay: index * 80, duration: 350,             useNativeDriver: true }),
    ]).start();
  }, []);

  const diffColor = DIFF_COLORS[item.difficulty] || "#9e86b8";

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: Animated.multiply(scaleAnim, pressAnim) }] }}>
      <Pressable
        style={[styles.card, { borderColor: item.accentColor + "45" }]}
        onPress={() => onPress(item)}
        onPressIn={() =>
          Animated.spring(pressAnim, { toValue: 0.93, tension: 200, friction: 10, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(pressAnim, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }).start()
        }
      >
        {/* Top accent line */}
        <View style={[styles.cardAccentLine, { backgroundColor: item.accentColor }]} />

        {/* Subtle inner glow */}
        <View style={[styles.cardInnerGlow, { backgroundColor: item.accentColor + "07" }]} />

        {/* Badge row */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: item.badgeColor + "22", borderColor: item.badgeColor + "88" }]}>
            <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
          </View>
          <View style={[styles.diffPill, { backgroundColor: diffColor + "22" }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{item.difficulty}</Text>
          </View>
        </View>

        {/* ── Game image with animated glow ── */}
        <GlowImage source={item.image} color={item.accentColor} />

        <Text style={[styles.cardTitle, { color: item.accentColor }]}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>

        <View style={[styles.playBtn, { borderColor: item.accentColor + "88", backgroundColor: item.accentColor + "14" }]}>
          <Text style={[styles.playBtnText, { color: item.accentColor }]}>▶  PLAY</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function GamesScreen() {
  const navigation    = useNavigation();
  const headerAnim    = useRef(new Animated.Value(-40)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim,    { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 500,            useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03010d" />

      <GalaxyBackground />

      <Animated.View style={[styles.header, { transform: [{ translateY: headerAnim }], opacity: headerOpacity }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconWrap}>
            <Gamepad2 size={scale(22)} color="#d946ef" strokeWidth={2} />
          </View>
          <Text style={styles.headerTitle}>Game Zone</Text>
        </View>
      </Animated.View>

      <View style={styles.divider} />

      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <GameCard item={item} index={index} onPress={(g) => navigation.navigate(g.id)} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: "#03010d" },
  spaceBase:  { ...StyleSheet.absoluteFillObject, backgroundColor: "#03010d" },

  // ── Header
  header:        { paddingTop: scale(10), paddingHorizontal: scale(20), paddingBottom: scale(4) },
  headerRow:     { flexDirection: "row", alignItems: "center", gap: scale(10) },
  headerIconWrap: {
    width: scale(38), height: scale(38), borderRadius: scale(12),
    backgroundColor: "#d946ef18", borderWidth: 1, borderColor: "#d946ef40",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#d946ef", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 12, elevation: 6,
  },
  headerTitle: {
    fontSize: scale(20), fontWeight: "900", color: "#ffffff", letterSpacing: 0.5,
    textShadowColor: "#d946ef44", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
  },

  divider: { height: 1, marginHorizontal: scale(20), marginTop: scale(10), backgroundColor: "#ffffff12" },

  // ── List
  listContent: { paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: scale(30) },
  row:         { justifyContent: "space-between", marginBottom: scale(14) },

  // ── Card
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#0d0520cc",
    borderRadius: scale(16),
    borderWidth: 1,
    paddingHorizontal: scale(14),
    paddingBottom: scale(16),
    paddingTop: 0,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
  },
  cardInnerGlow: { ...StyleSheet.absoluteFillObject, borderRadius: scale(16) },
  cardAccentLine: {
    height: 3, borderRadius: 99,
    marginBottom: scale(10), marginHorizontal: -scale(14), opacity: 0.9,
  },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: scale(5), marginBottom: scale(10) },
  badge:    { borderWidth: 1, borderRadius: 6, paddingHorizontal: scale(5), paddingVertical: scale(2) },
  badgeText:{ fontSize: scale(7), fontWeight: "900", letterSpacing: 1.5 },
  diffPill: { borderRadius: 6, paddingHorizontal: scale(5), paddingVertical: scale(2) },
  diffText: { fontSize: scale(7), fontWeight: "700" },

  // ── Glow image
  glowImageOuter: {
    width: scale(62),
    height: scale(62),
    borderRadius: scale(20),
    borderWidth: 1,
    marginBottom: scale(10),
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  glowRingOuter: {
    position: "absolute",
    width: scale(62),
    height: scale(62),
    borderRadius: scale(20),
  },
  glowRingInner: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(16),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glowImageWrap: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gameImage: {
    width: scale(50),
    height: scale(50),
  },

  // ── Card text / button
  cardTitle:   { fontSize: scale(13), fontWeight: "800", marginBottom: scale(4), letterSpacing: 0.3 },
  cardDesc:    { fontSize: scale(10), color: "#9e86b8", lineHeight: scale(14), marginBottom: scale(12), fontWeight: "400" },
  playBtn:     { borderWidth: 1, borderRadius: scale(8), paddingVertical: scale(7), alignItems: "center" },
  playBtnText: { fontSize: scale(10), fontWeight: "800", letterSpacing: 2 },
});