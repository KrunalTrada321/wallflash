// screens/GamesScreen.js
import React, { useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList,
  Pressable, Animated, Dimensions, StatusBar,
} from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import {
  Brain, Zap, Palette, Crosshair, Grid2x2,
  Gamepad2, Layers, Target, Wind,
} from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - scale(48)) / 2;

const GAMES = [
  { id: "MemoryCardGame",   title: "Memory Match",  description: "Flip cards & find matching pairs",            Icon: Brain,     badge: "CLASSIC", badgeColor: "#00ffff", accentColor: "#00ffff", difficulty: "Easy"   },
  { id: "ReactionRush",     title: "Reaction Rush", description: "Tap the flash before time runs out!",         Icon: Zap,       badge: "REFLEX",  badgeColor: "#ffd700", accentColor: "#ffd700", difficulty: "Medium" },
  { id: "ColorTrap",        title: "Color Trap",    description: "Tap the INK color — don't read the word!",    Icon: Palette,   badge: "TRICKY",  badgeColor: "#ff00ff", accentColor: "#ff00ff", difficulty: "Hard"   },
  { id: "WhackAMoji",       title: "Whack-a-Moji",  description: "Smash emojis before they disappear!",         Icon: Crosshair, badge: "ACTION",  badgeColor: "#4caf50", accentColor: "#4caf50", difficulty: "Medium" },
  { id: "TwentyFortyEight", title: "2048",          description: "Merge tiles & reach the golden 2048!",        Icon: Grid2x2,   badge: "PUZZLE",  badgeColor: "#ffd700", accentColor: "#ffd700", difficulty: "Hard"   },
  { id: "SnakeGame",        title: "Snake",         description: "Eat, grow, survive — walls wrap around!",     Icon: Wind,      badge: "ARCADE",  badgeColor: "#00ffff", accentColor: "#00ffff", difficulty: "Medium" },
  { id: "StackTower",       title: "Stack Tower",   description: "Tap to stack blocks. Perfect tap = no loss!", Icon: Layers,    badge: "REFLEX",  badgeColor: "#a78bfa", accentColor: "#a78bfa", difficulty: "Medium" },
  { id: "BallBlast",        title: "Ball Blast",    description: "Drag to aim. Blast blocks before they drop!", Icon: Target,    badge: "ACTION",  badgeColor: "#ff6600", accentColor: "#ff6600", difficulty: "Medium" },
];
 
const DIFF_COLORS = { Easy: "#4caf50", Medium: "#ff9800", Hard: "#ff4081" };

/** Layered glow icon — outer ring + inner tinted bg + icon */
function GlowIcon({ Icon, color, size = scale(26) }) {
  return (
    <View style={[styles.iconOuter, { borderColor: color + "30", shadowColor: color }]}>
      {/* mid glow ring */}
      <View style={[styles.iconMid, { backgroundColor: color + "18", borderColor: color + "50" }]}>
        {/* inner core */}
        <View style={[styles.iconInner, { backgroundColor: color + "22" }]}>
          <Icon size={size} color={color} strokeWidth={1.8} />
        </View>
      </View>
    </View>
  );
}

function GameCard({ item, index, onPress }) {
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressAnim   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim,   { toValue: 1, delay: index * 80, tension: 60, friction: 8,  useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, delay: index * 80, duration: 350,              useNativeDriver: true }),
    ]).start();
  }, []);

  const diffColor = DIFF_COLORS[item.difficulty] || "#9e86b8";

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: Animated.multiply(scaleAnim, pressAnim) }] }}>
      <Pressable
        style={[styles.card, { borderColor: item.accentColor + "40" }]}
        onPress={() => onPress(item)}
        onPressIn={() =>
          Animated.spring(pressAnim, { toValue: 0.93, tension: 200, friction: 10, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(pressAnim, { toValue: 1,   tension: 200, friction: 10, useNativeDriver: true }).start()
        }
      >
        {/* top accent bar */}
        <View style={[styles.cardAccentLine, { backgroundColor: item.accentColor }]} />

        {/* badges row */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: item.badgeColor + "22", borderColor: item.badgeColor + "88" }]}>
            <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
          </View>
          <View style={[styles.diffPill, { backgroundColor: diffColor + "22" }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{item.difficulty}</Text>
          </View>
        </View>

        {/* layered glow icon */}
        <GlowIcon Icon={item.Icon} color={item.accentColor} />

        <Text style={[styles.cardTitle, { color: item.accentColor }]}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>

        <View style={[styles.playBtn, { borderColor: item.accentColor + "88", backgroundColor: item.accentColor + "14" }]}>
          <Text style={[styles.playBtnText, { color: item.accentColor }]}>▶  PLAY</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function GamesScreen() {
  const navigation    = useNavigation();
  const headerAnim    = useRef(new Animated.Value(-40)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim,    { toValue: 0, tension: 50, friction: 9,  useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 500,              useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0118" />

      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerAnim }], opacity: headerOpacity }]}
      >
        {/* Icon + title side by side */}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0118" },

  /* ── Header ── */
  header: {
    paddingTop: scale(10),
    paddingHorizontal: scale(20),
    paddingBottom: scale(4),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  headerIconWrap: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(12),
    backgroundColor: "#d946ef18",
    borderWidth: 1,
    borderColor: "#d946ef40",
    justifyContent: "center",
    alignItems: "center",
    // subtle glow on Android via elevation, iOS via shadow
    shadowColor: "#d946ef",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.55,
    // shadowRadius: 8,
    // elevation: 6,
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  divider: {
    height: 1,
    marginHorizontal: scale(20),
    marginTop: scale(10),
    backgroundColor: "#ffffff10",
  },

  /* ── List ── */
  listContent: {
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(30),
  },
  row: { justifyContent: "space-between", marginBottom: scale(14) },

  /* ── Card ── */
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#160728",
    borderRadius: scale(16),
    borderWidth: 1,
    paddingHorizontal: scale(14),
    paddingBottom: scale(16),
    paddingTop: 0,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#9c27b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  cardAccentLine: {
    height: 3,
    borderRadius: 99,
    marginBottom: scale(10),
    marginHorizontal: -scale(14),
    opacity: 0.85,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    marginBottom: scale(10),
  },
  badge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: scale(5),
    paddingVertical: scale(2),
  },
  badgeText: { fontSize: scale(7), fontWeight: "900", letterSpacing: 1.5 },
  diffPill: { borderRadius: 6, paddingHorizontal: scale(5), paddingVertical: scale(2) },
  diffText: { fontSize: scale(7), fontWeight: "700" },

  /* ── Layered glow icon ── */
  iconOuter: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(18),
    borderWidth: 1,
    marginBottom: scale(10),
    justifyContent: "center",
    alignItems: "center",
  
  },
  iconMid: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(14),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(10),
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Card text & play btn ── */
  cardTitle: {
    fontSize: scale(13),
    fontWeight: "800",
    marginBottom: scale(4),
    letterSpacing: 0.3,
  },
  cardDesc: {
    fontSize: scale(10),
    color: "#9e86b8",
    lineHeight: scale(14),
    marginBottom: scale(12),
    fontWeight: "400",
  },
  playBtn: {
    borderWidth: 1,
    borderRadius: scale(8),
    paddingVertical: scale(7),
    alignItems: "center",
  },
  playBtnText: { fontSize: scale(10), fontWeight: "800", letterSpacing: 2 },
});