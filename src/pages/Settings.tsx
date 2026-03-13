import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TNavigationScreenProps } from "../AppRoutes";
import { Theme } from "../shared/themes/Theme";

export const Settings = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  const [loaded, setLoaded] = useState(false);

  const [notificationActivated, setNotificationActivated] = useState(true);
  const [shortBreakPeriod, setShortBreakPeriod] = useState(5);
  const [longBreakPeriod, setLongBreakPeriod] = useState(15);
  const [focusPeriod, setFocusPeriod] = useState(25);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem("NOTIFICATION_ACTIVATED"),
      AsyncStorage.getItem("SHORT_BREAK_PERIOD"),
      AsyncStorage.getItem("LONG_BREAK_PERIOD"),
      AsyncStorage.getItem("FOCUS_PERIOD"),
    ])
      .then(
        ([notificationValue, shortBreakValue, longBreakValue, focusValue]) => {
          if (notificationValue)
            setNotificationActivated(JSON.parse(notificationValue || "true"));
          if (shortBreakValue)
            setShortBreakPeriod(JSON.parse(shortBreakValue || "5"));
          if (longBreakValue)
            setLongBreakPeriod(JSON.parse(longBreakValue || "15"));
          if (focusValue) setFocusPeriod(JSON.parse(focusValue || "25"));
        },
      )
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      "NOTIFICATION_ACTIVATED",
      JSON.stringify(notificationActivated),
    );
  }, [notificationActivated, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      "SHORT_BREAK_PERIOD",
      JSON.stringify(shortBreakPeriod),
    );
  }, [shortBreakPeriod, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem("LONG_BREAK_PERIOD", JSON.stringify(longBreakPeriod));
  }, [longBreakPeriod, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem("FOCUS_PERIOD", JSON.stringify(focusPeriod));
  }, [focusPeriod, loaded]);

  console.log(focusPeriod);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="close" size={28} color={Theme.colors.divider} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Configurações</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldLabel}>Periodo de foco</Text>

            <View style={styles.formFieldButtons}>
              <TouchableOpacity
                style={
                  focusPeriod === 15
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setFocusPeriod(15)}
              >
                <Text style={styles.primaryButtonText}>15 min</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  focusPeriod === 25
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setFocusPeriod(25)}
              >
                <Text style={styles.primaryButtonText}>25 min</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  focusPeriod === 35
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setFocusPeriod(35)}
              >
                <Text style={styles.primaryButtonText}>35 min</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldLabel}>Pausa curta</Text>

            <View style={styles.formFieldButtons}>
              <TouchableOpacity
                style={
                  shortBreakPeriod === 3
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setShortBreakPeriod(3)}
              >
                <Text style={styles.primaryButtonText}>3 min</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  shortBreakPeriod === 5
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setShortBreakPeriod(5)}
              >
                <Text style={styles.primaryButtonText}>5 min</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  shortBreakPeriod === 7
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setShortBreakPeriod(7)}
              >
                <Text style={styles.primaryButtonText}>7 min</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldLabel}>Pausa longa</Text>

            <View style={styles.formFieldButtons}>
              <TouchableOpacity
                style={
                  longBreakPeriod === 10
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setLongBreakPeriod(10)}
              >
                <Text style={styles.primaryButtonText}>10 min</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  longBreakPeriod === 15
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setLongBreakPeriod(15)}
              >
                <Text style={styles.primaryButtonText}>15 min</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  longBreakPeriod === 20
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setLongBreakPeriod(20)}
              >
                <Text style={styles.primaryButtonText}>20 min</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formFieldContainer}>
            <Text style={styles.formFieldLabel}>Notificações</Text>

            <View style={styles.formFieldButtons}>
              <TouchableOpacity
                style={
                  notificationActivated
                    ? styles.secondaryButton
                    : styles.primaryButton
                }
                onPress={() => setNotificationActivated(!notificationActivated)}
              >
                <Text style={styles.primaryButtonText}>Desativado</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  notificationActivated
                    ? styles.primaryButton
                    : styles.secondaryButton
                }
                onPress={() => setNotificationActivated(!notificationActivated)}
              >
                <Text style={styles.primaryButtonText}>Ativado</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  container: {
    gap: 36,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    alignSelf: "flex-end",
  },
  primaryButton: {
    borderWidth: 2,
    borderRadius: 55,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: Theme.colors.divider,
    backgroundColor: Theme.colors.primary,
  },
  primaryButtonText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body,
  },
  secondaryButton: {
    borderWidth: 2,
    borderRadius: 55,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: Theme.colors.divider,
    backgroundColor: Theme.colors.divider,
  },
  secondaryButtonText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body,
  },
  formContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
    width: "100%",
    maxWidth: 300,
  },
  titleContainer: {
    alignItems: "center",
  },
  titleText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interBold,
    fontSize: Theme.fontSizes.title,
  },
  formFieldContainer: {
    gap: 8,
    width: "100%",
  },
  formFieldLabel: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.label,
  },
  formFieldButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});
