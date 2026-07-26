import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
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
        tabBarInactiveTintColor: "#8F8E86",
        tabBarLabelStyle: {
          fontFamily,
          fontSize: 10,
          lineHeight: 12,
          fontWeight: "600",
          marginTop: 1,
        },
        tabBarIconStyle: {
          marginTop: 1,
        },
        tabBarItemStyle: {
          height: tabBarMetrics.height,
          paddingTop: 7,
          paddingBottom: 7,
        },
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: tabBarBottom(insets.bottom),
          height: tabBarMetrics.height,
          paddingHorizontal: 8,
          paddingTop: 0,
          paddingBottom: 0,
          borderRadius: tabBarMetrics.height / 2,
          borderTopWidth: 0,
          backgroundColor: colors.nav,
          shadowColor: "#000000",
          shadowOpacity: 0.16,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        },
        tabBarIcon: ({ focused, color }) => {
          const key = route.name as keyof typeof icons;
          const pair = icons[key] ?? icons.explore;
          return <Ionicons name={focused ? pair[1] : pair[0]} size={20} color={color} />;
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
