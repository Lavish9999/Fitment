import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { colors, fontFamily, radius } from "../../src/theme";

const icons = {
  explore: ["compass-outline", "compass"] as const,
  builder: ["add-circle-outline", "add-circle"] as const,
  armory: ["albums-outline", "albums"] as const,
  profile: ["person-outline", "person"] as const,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: "#A9A89F",
        tabBarActiveBackgroundColor: colors.navActive,
        tabBarLabelStyle: {
          fontFamily,
          fontSize: 10,
          fontWeight: "600",
          marginTop: 1,
        },
        tabBarItemStyle: {
          borderRadius: 26,
          marginHorizontal: 3,
          marginVertical: 7,
        },
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 14,
          height: 70,
          paddingHorizontal: 5,
          borderRadius: 35,
          borderTopWidth: 0,
          backgroundColor: colors.nav,
          shadowColor: "#000000",
          shadowOpacity: 0.2,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const key = route.name as keyof typeof icons;
          const pair = icons[key] ?? icons.explore;
          return <Ionicons name={focused ? pair[1] : pair[0]} size={size ?? 21} color={color} />;
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
