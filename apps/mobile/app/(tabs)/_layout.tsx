import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontFamily, tabBarBottom, tabBarMetrics } from "../../src/theme";

const icons = {
  explore: ["compass-outline", "compass"] as const,
  builder: ["construct-outline", "construct"] as const,
  armory: ["albums-outline", "albums"] as const,
  profile: ["person-outline", "person"] as const,
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          void Haptics.selectionAsync();
        },
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: "#898880",
        tabBarLabelStyle: {
          fontFamily,
          fontSize: 9.5,
          lineHeight: 11,
          fontWeight: "600",
          marginTop: 0,
        },
        tabBarIconStyle: { marginTop: 0 },
        tabBarItemStyle: {
          height: tabBarMetrics.height,
          paddingTop: 4,
          paddingBottom: 5,
        },
        tabBarStyle: {
          position: "absolute",
          left: tabBarMetrics.horizontalInset,
          right: tabBarMetrics.horizontalInset,
          bottom: tabBarBottom(insets.bottom),
          height: tabBarMetrics.height,
          paddingHorizontal: 6,
          paddingTop: 0,
          paddingBottom: 0,
          borderRadius: tabBarMetrics.height / 2,
          borderTopWidth: 0,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(255,255,255,0.08)",
          backgroundColor: colors.nav,
          shadowColor: "#000000",
          shadowOpacity: 0.18,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          const key = route.name as keyof typeof icons;
          const pair = icons[key] ?? icons.explore;
          return (
            <View style={[styles.iconShell, focused ? styles.iconShellActive : null]}>
              <Ionicons name={focused ? pair[1] : pair[0]} size={18} color={color} />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="builder" options={{ title: "Builder" }} />
      <Tabs.Screen name="armory" options={{ title: "Armory" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconShell: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconShellActive: {
    backgroundColor: "rgba(255,255,255,0.10)",
  },
});
