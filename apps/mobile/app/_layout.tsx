import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CatalogProvider } from "../src/catalog/CatalogProvider";
import { AppQueryProvider } from "../src/query/QueryProvider";
import { FitmentProvider } from "../src/state/FitmentProvider";
import { colors } from "../src/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppQueryProvider>
        <CatalogProvider>
          <FitmentProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "fade",
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="select-firearm"
                options={{ presentation: "modal", animation: "slide_from_bottom" }}
              />
              <Stack.Screen
                name="select-component"
                options={{ presentation: "modal", animation: "slide_from_bottom" }}
              />
              <Stack.Screen
                name="compatibility-details"
                options={{ presentation: "modal", animation: "slide_from_bottom" }}
              />
            </Stack>
          </FitmentProvider>
        </CatalogProvider>
      </AppQueryProvider>
    </SafeAreaProvider>
  );
}
