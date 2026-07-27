import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { getExactProductVisual } from "../visuals/exactProductVisuals";
import { colors, fontFamily, radius, spacing } from "../theme";

interface ExactProductVisualProps {
  productVariantId: string;
  productName: string;
  manufacturer: string;
  onPress?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export function ExactProductVisual({
  productVariantId,
  productName,
  manufacturer,
  onPress,
  compact = false,
  style,
  imageStyle,
}: ExactProductVisualProps) {
  const visual = getExactProductVisual(productVariantId);
  const [loading, setLoading] = useState(Boolean(visual));
  const [failed, setFailed] = useState(false);

  const content = (
    <View style={[styles.container, compact ? styles.containerCompact : null, style]}>
      <View style={styles.header}>
        <View style={styles.titleCopy}>
          <Text style={styles.manufacturer}>{manufacturer}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
        </View>
        {onPress ? <Ionicons name="chevron-forward" size={17} color={colors.inkFaint} /> : null}
      </View>

      <View
        style={[
          styles.stage,
          compact ? styles.stageCompact : null,
          visual?.background === "BLACK" ? styles.stageDark : styles.stageLight,
        ]}
      >
        {visual && !failed ? (
          <>
            <Image
              accessibilityLabel={`${manufacturer} ${productName} exact manufacturer product image`}
              source={{ uri: visual.imageUri }}
              resizeMode="contain"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setFailed(true);
              }}
              style={[styles.image, imageStyle]}
            />
            {loading ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color={colors.inkSoft} />
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.fallback}>
            <Ionicons name="image-outline" size={24} color={colors.inkFaint} />
            <Text style={styles.fallbackTitle}>Exact visual unavailable</Text>
            <Text style={styles.fallbackBody}>
              Compatibility checks remain available for this exact variant.
            </Text>
          </View>
        )}
      </View>

      {visual ? (
        <Text style={styles.sourceText} numberOfLines={1}>
          {visual.sourceLabel} · preview use
        </Text>
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: "hidden",
  },
  containerCompact: {
    borderRadius: radius.md,
  },
  header: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  titleCopy: { flex: 1 },
  manufacturer: {
    color: colors.inkFaint,
    fontFamily,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  productName: {
    color: colors.ink,
    fontFamily,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "600",
    marginTop: 2,
  },
  stage: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  stageCompact: { height: 120 },
  stageLight: { backgroundColor: "#FFFFFF" },
  stageDark: { backgroundColor: "#050505" },
  image: { width: "100%", height: "100%" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  fallbackTitle: {
    color: colors.ink,
    fontFamily,
    fontSize: 15,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  fallbackBody: {
    color: colors.inkSoft,
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginTop: spacing.xxs,
  },
  sourceText: {
    color: colors.inkFaint,
    fontFamily,
    fontSize: 11,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pressed: { opacity: 0.78 },
});
