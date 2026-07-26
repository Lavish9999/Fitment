import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect } from "react-native-svg";

import type { CatalogVariant, CompatibilityEvaluation } from "@fitment/domain";

import { categoryLabel, statusPresentation } from "../presentation";
import { colors, fontFamily, radius, spacing } from "../theme";

interface FirearmCanvasProps {
  host: CatalogVariant;
  accessory: CatalogVariant;
  evaluation: CompatibilityEvaluation;
  requiredProducts: CatalogVariant[];
  onSelectFirearm: () => void;
  onSelectComponent: () => void;
}

export function FirearmCanvas({
  host,
  accessory,
  evaluation,
  requiredProducts,
  onSelectFirearm,
  onSelectComponent,
}: FirearmCanvasProps) {
  const status = statusPresentation(evaluation);
  const isOptic = accessory.category === "RED_DOT_OPTIC";
  const isLight = accessory.category === "WEAPON_LIGHT";
  const hasAdapter = requiredProducts.some((product) => product.category === "PISTOL_OPTIC_PLATE");
  const compactGrip = host.family === "P365";

  function selectFirearm() {
    void Haptics.selectionAsync();
    onSelectFirearm();
  }

  function selectComponent() {
    void Haptics.selectionAsync();
    onSelectComponent();
  }

  return (
    <View style={styles.shell}>
      <View style={styles.topRow}>
        <View style={styles.hostCopy}>
          <Text style={styles.eyebrow}>{host.manufacturer}</Text>
          <Text style={styles.hostName} numberOfLines={1}>{host.exactModel}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: status.foreground }]} />
      </View>

      <View style={styles.canvas}>
        <Svg width="100%" height="100%" viewBox="0 0 420 220">
          <Rect x="0" y="0" width="420" height="220" rx="22" fill="#EEEAE2" />
          {[70, 140, 210, 280, 350].map((x) => (
            <Line key={`v-${x}`} x1={x} y1="0" x2={x} y2="220" stroke="#E2DED5" strokeWidth="1" />
          ))}
          {[55, 110, 165].map((y) => (
            <Line key={`h-${y}`} x1="0" y1={y} x2="420" y2={y} stroke="#E2DED5" strokeWidth="1" />
          ))}

          <G opacity="0.98">
            <Rect x="76" y="78" width="246" height="48" rx="9" fill="#292925" />
            <Path d="M88 72 L310 72 L326 82 L82 82 Z" fill="#3A3933" />
            <Rect x="96" y="89" width="90" height="5" rx="2.5" fill="#55544C" />
            <Rect x="285" y="88" width="24" height="16" rx="4" fill="#1E1E1B" />
            <Circle cx="298" cy="96" r="4" fill="#77756C" />
            <Path
              d={compactGrip
                ? "M203 121 L258 121 L276 198 Q267 207 249 207 L213 158 Z"
                : "M198 121 L264 121 L282 203 Q273 211 252 211 L209 158 Z"}
              fill="#262622"
            />
            <Path d="M147 121 L209 121 L221 146 L202 164 L172 149 Z" fill="#33332E" />
            <Rect x="104" y="125" width="82" height="11" rx="4" fill="#23231F" />
            <Rect x="122" y="136" width="55" height="9" rx="3" fill="#4B4A43" />
            <Path d="M159 131 Q180 129 191 145 Q184 158 168 161" stroke="#C1BEB5" strokeWidth="3" fill="none" />
            <Rect x="72" y="89" width="18" height="28" rx="4" fill="#1C1C19" />
          </G>

          {isOptic ? (
            <G>
              {hasAdapter ? <Rect x="244" y="65" width="49" height="8" rx="3" fill={colors.accent} /> : null}
              <Path d="M248 42 L293 42 L300 66 L241 66 Z" fill="#181815" />
              <Rect x="257" y="48" width="27" height="12" rx="5" fill="#494840" />
              <Circle cx="271" cy="54" r="4" fill={status.foreground} opacity="0.9" />
            </G>
          ) : null}

          {isLight ? (
            <G>
              <Rect x="112" y="137" width="67" height="23" rx="8" fill="#181815" />
              <Circle cx="119" cy="149" r="8" fill="#5B5A52" />
              <Rect x="166" y="142" width="18" height="12" rx="4" fill="#30302B" />
            </G>
          ) : null}

          <Circle cx="267" cy="61" r="25" fill="none" stroke={isOptic ? colors.accent : "#A7A49A"} strokeWidth="2" strokeDasharray="5 5" />
          <Circle cx="145" cy="147" r="25" fill="none" stroke={isLight ? colors.accent : "#A7A49A"} strokeWidth="2" strokeDasharray="5 5" />
        </Svg>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose optic"
          onPress={selectComponent}
          style={({ pressed }) => [styles.opticHotspot, pressed ? styles.hotspotPressed : null]}
        >
          <Ionicons name={isOptic ? "checkmark" : "add"} size={13} color={isOptic ? colors.white : colors.inkSoft} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose rail component"
          onPress={selectComponent}
          style={({ pressed }) => [styles.railHotspot, pressed ? styles.hotspotPressed : null]}
        >
          <Ionicons name={isLight ? "checkmark" : "add"} size={13} color={isLight ? colors.white : colors.inkSoft} />
        </Pressable>
      </View>

      <View style={styles.bottomRow}>
        <Pressable
          accessibilityRole="button"
          onPress={selectFirearm}
          style={({ pressed }) => [styles.control, pressed ? styles.controlPressed : null]}
        >
          <Ionicons name="barcode-outline" size={15} color={colors.inkSoft} />
          <Text style={styles.controlText}>Change firearm</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={selectComponent}
          style={({ pressed }) => [styles.control, styles.controlPrimary, pressed ? styles.controlPressed : null]}
        >
          <Ionicons name="cube-outline" size={15} color={colors.white} />
          <Text style={styles.controlPrimaryText}>{categoryLabel(accessory.category)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: 2 },
  hostCopy: { flex: 1 },
  eyebrow: { color: colors.inkFaint, fontFamily, fontSize: 11, fontWeight: "600", letterSpacing: 0.4 },
  hostName: { color: colors.ink, fontFamily, fontSize: 16, lineHeight: 20, fontWeight: "600", marginTop: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  canvas: { width: "100%", aspectRatio: 1.9, position: "relative", overflow: "hidden", borderRadius: radius.md },
  opticHotspot: {
    position: "absolute",
    left: "62%",
    top: "15%",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.white,
  },
  railHotspot: {
    position: "absolute",
    left: "30%",
    top: "62%",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.white,
  },
  hotspotPressed: { transform: [{ scale: 0.92 }], opacity: 0.8 },
  bottomRow: { flexDirection: "row", gap: spacing.xs },
  control: {
    flex: 1,
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  controlPrimary: { backgroundColor: colors.ink },
  controlPressed: { opacity: 0.68 },
  controlText: { color: colors.inkSoft, fontFamily, fontSize: 12, fontWeight: "600" },
  controlPrimaryText: { color: colors.white, fontFamily, fontSize: 12, fontWeight: "600" },
});
