import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { TNavigationScreenProps } from "../AppRoutes";
import { Theme } from "../shared/themes/Theme";

export const Home = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  return (
    <View style={{ backgroundColor: Theme.colors.backgground }}>
      <Text
        style={{
          fontFamily: "InterRegular",
          fontSize: 52,
          color: Theme.colors.text,
        }}
      >
        Home Page
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Text style={{ color: Theme.colors.text }}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};
