import {
  DefaultTheme,
  NavigationContainer,
  NavigationProp,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";
import { Theme } from "./shared/themes/Theme";

type TScreenDefinitions = {
  Home: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<TScreenDefinitions>();

export function AppRoutes() {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        fonts: {
          ...DefaultTheme.fonts,
          bold: {
            fontWeight: "700",
            fontFamily: Theme.fonts.interBold,
          },
          regular: {
            fontWeight: "500",
            fontFamily: Theme.fonts.interRegular,
          },
        },
        colors: {
          ...DefaultTheme.colors,
          background: Theme.colors.backgground,
          primary: Theme.colors.primary,
          card: Theme.colors.divider,
          text: Theme.colors.text,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export type TNavigationScreenProps = NavigationProp<TScreenDefinitions>;
