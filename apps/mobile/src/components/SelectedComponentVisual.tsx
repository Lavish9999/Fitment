import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { categoryLabel, money } from "../presentation";
import { colors, fontFamily, radius, spacing } from "../theme";
import { getExactProductVisual } from "../visuals/exactProductVisuals";

interface SelectedComponentVisualProps {
  productVariantId: string;
  manufacturer: string;
  productName: string;
  category: string;
  priceCents?: number;
  onPress: () => void;
}

export function SelectedComponentVisual({
  productVariantId,
  manufacturer,
  productName,
  category,
  priceCents,
  onPress,
}: SelectedComponentVisualProps) {
  const visual = getExactProductVisual(productVariantId);
  const [loading, setLoading] = useState(Boolean(visual));
  const [failed, setFailed] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <View style={[styles.thumb, visual?.background === "BLACK" ? styles.thumbDark : styles.thumbLight]}>
        {visual && !failed ? (
          <>
            <Image
              accessibilityLabel={`${manufacturer} ${productName} exact product image`}
              source={{ uri: visual.imageUri }}
              resizeMode="contain"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setFailed(true);
              }}
              style={styles.image}
            />
            {loading ? <ActivityIndicator size="small" color={colors.inkSoft} style={styles.spinner} /> : null}
          </>
        ) : (
          <Ionicons name="image-outline" size={20} color={colors.inkFaint} />
        )}
      </View>

      <View style={styles.copy}>
        <Text style={styles.eyebrow} numberOfLines={1}>
          {manufacturer} · {categoryLabel(category)}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {productName}
        </Text>
        <Text style={styles.price}>{money(priceCents)}</Text>
      </View>

      <Ionicons name="chevron-forward" size={17} color={colors.inkFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 102,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  pressed: { opacity: 0.74 },
  thumb: {
    width: 92,
    height: 76,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbLight: { backgroundColor: "#FFFFFF" },
  thumbDark: { backgroundColor: "#050505" },
  image: { width: "100%", height: "100%" },
  spinner: { ...StyleSheet.absoluteFillObject },
  copy: { flex: 1 },
  eyebrow: { color: colors.inkFaint, fontFamily, fontSize: 11, fontWeight: "600" },
  title: { color: colors.ink, fontFamily, fontSize: 15, lineHeight: 19, fontWeight: "600", marginTop: 3 },
  price: { color: colors.inkSoft, fontFamily, fontSize: 13, marginTop: 5 },
});
