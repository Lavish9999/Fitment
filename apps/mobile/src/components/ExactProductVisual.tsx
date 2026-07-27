import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  getExactProductVisual,
  getMountedProductPlacement,
} from "../visuals/exactProductVisuals";
import { colors, fontFamily, radius, spacing } from "../theme";

interface ExactProductVisualProps {
  productVariantId: string;
  productName: string;
  manufacturer: string;
  onPress?: () => void;
  compact?: boolean;
  installedComponentIds?: string[];
  previewComponentId?: string;
  previewRequiredComponentIds?: string[];
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export function ExactProductVisual({
  productVariantId,
  productName,
  manufacturer,
  onPress,
  compact = false,
  installedComponentIds = [],
  previewComponentId,
  previewRequiredComponentIds = [],
  style,
  imageStyle,
}: ExactProductVisualProps) {
  const visual = getExactProductVisual(productVariantId);
  const [loading, setLoading] = useState(Boolean(visual));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoading(Boolean(visual));
  }, [productVariantId, visual?.imageUri]);

  const componentIds = useMemo(() => {
    const ids = new Set(installedComponentIds);
    if (previewComponentId) ids.add(previewComponentId);
    for (const id of previewRequiredComponentIds) ids.add(id);
    return [...ids];
  }, [installedComponentIds, previewComponentId, previewRequiredComponentIds]);

  const renderedLayers = componentIds
    .map((componentId) => {
      const componentVisual = getExactProductVisual(componentId);
      const placement = getMountedProductPlacement(productVariantId, componentId);
      if (!componentVisual || !placement) return null;
      return {
        componentId,
        componentVisual,
        placement,
        preview: componentId === previewComponentId && !installedComponentIds.includes(componentId),
      };
    })
    .filter((layer): layer is NonNullable<typeof layer> => Boolean(layer))
    .sort((a, b) => a.placement.zIndex - b.placement.zIndex);

  const transform = visual?.firearmTransform ?? { scale: 1, translateX: 0, translateY: 0 };

  const content = (
    <View style={[styles.container, compact ? styles.containerCompact : null, style]}>
      <View style={styles.header}>
        <View style={styles.titleCopy}>
          <Text style={styles.manufacturer}>{manufacturer}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
        </View>
        {renderedLayers.length > 0 ? (
          <View style={styles.layerCount}>
            <Ionicons name="layers-outline" size={13} color={colors.inkSoft} />
            <Text style={styles.layerCountText}>{renderedLayers.length}</Text>
          </View>
        ) : null}
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
              style={[
                styles.firearmImage,
                {
                  transform: [
                    { scale: transform.scale },
                    { translateX: transform.translateX },
                    { translateY: transform.translateY },
                  ],
                },
                imageStyle,
              ]}
            />

            {renderedLayers.map(({ componentId, componentVisual, placement, preview }) => (
              <View
                key={componentId}
                pointerEvents="none"
                style={[
                  styles.mountedLayer,
                  {
                    left: percent(placement.leftPercent),
                    top: percent(placement.topPercent),
                    width: percent(placement.widthPercent),
                    height: percent(placement.heightPercent),
                    zIndex: placement.zIndex,
                    transform: [{ rotate: `${placement.rotationDeg}deg` }],
                    opacity: preview ? 0.78 : 1,
                  },
                ]}
              >
                <Image
                  accessibilityLabel={`${componentId} mounted visual`}
                  source={{ uri: componentVisual.imageUri }}
                  resizeMode="contain"
                  style={styles.mountedImage}
                />
                {preview ? <View style={styles.previewDot} /> : null}
              </View>
            ))}

            {loading ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color={colors.inkSoft} />
              </View>
            ) : null}

            {previewComponentId && renderedLayers.some((layer) => layer.preview) ? (
              <View style={styles.previewLabel}>
                <Text style={styles.previewLabelText}>PREVIEW</Text>
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
        <View style={styles.footer}>
          <Text style={styles.sourceText} numberOfLines={1}>
            {visual.sourceLabel} · preview use
          </Text>
          {componentIds.length > 0 && renderedLayers.length === 0 ? (
            <Text style={styles.unavailableText}>Selected part has no mounted visual yet</Text>
          ) : null}
        </View>
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

function percent(value: number): DimensionValue {
  return `${value}%`;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: "hidden",
  },
  containerCompact: { borderRadius: radius.md },
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
  layerCount: {
    minWidth: 34,
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  layerCountText: { color: colors.inkSoft, fontFamily, fontSize: 12, fontWeight: "600" },
  stage: {
    height: 250,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  stageCompact: { height: 120 },
  stageLight: { backgroundColor: "#FFFFFF" },
  stageDark: { backgroundColor: "#050505" },
  firearmImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%", zIndex: 10 },
  mountedLayer: { position: "absolute", overflow: "hidden" },
  mountedImage: { width: "100%", height: "100%" },
  previewDot: {
    position: "absolute",
    right: 1,
    top: 1,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  previewLabel: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 70,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(26,25,21,0.82)",
  },
  previewLabelText: { color: colors.white, fontFamily, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  fallback: { alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  fallbackTitle: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600", marginTop: spacing.xs },
  fallbackBody: { color: colors.inkSoft, fontFamily, fontSize: 13, lineHeight: 18, textAlign: "center", marginTop: spacing.xxs },
  footer: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, gap: 2 },
  sourceText: { color: colors.inkFaint, fontFamily, fontSize: 11 },
  unavailableText: { color: colors.warning, fontFamily, fontSize: 11, fontWeight: "600" },
  pressed: { opacity: 0.78 },
});
