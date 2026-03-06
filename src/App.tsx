import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppRoutes } from "./AppRoutes";
import { Theme } from "./shared/themes/Theme";

SplashScreen.preventAutoHideAsync();

export function App() {
  const [loaded, error] = useFonts({
    InterRegular: Inter_400Regular,
    InterBold: Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hide();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Theme.colors.backgground }}
    >
      <StatusBar style="light" />
      <AppRoutes />
    </SafeAreaView>
  );
}
