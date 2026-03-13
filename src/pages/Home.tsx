import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TNavigationScreenProps } from "../AppRoutes";
import { updateStateByElapsedTime } from "../shared/helpers/UpdateStateByElapsedTime";
import { Theme } from "../shared/themes/Theme";

export const Home = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  const [appRinningState, setAppRunningState] = useState(AppState.currentState);
  useEffect(() => {
    const listener = AppState.addEventListener("change", setAppRunningState);
    return () => listener.remove();
  }, []);

  const [currentStatus, setCurrentStatus] = useState<
    "focus" | "long_break" | "short_break"
  >("focus");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [currentShortBreakCircleTime, setCurrentShortBreakCircleTime] =
    useState(5 * 60);
  const [currentLongBreakCircleTime, setCurrentLongBreakCircleTime] = useState(
    15 * 60,
  );
  const [currentFocusCircleTime, setCurrentFocusCircleTime] = useState(25 * 60);
  const [counterCircleTime, setCounterCircleTime] = useState(25 * 60);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        AsyncStorage.getItem("SHORT_BREAK_PERIOD"),
        AsyncStorage.getItem("LONG_BREAK_PERIOD"),
        AsyncStorage.getItem("FOCUS_PERIOD"),
      ]).then(([shortBreakValue, longBreakValue, focusValue]) => {
        if (shortBreakValue)
          setCurrentShortBreakCircleTime(
            JSON.parse(shortBreakValue || "5") * 60,
          );
        if (longBreakValue)
          setCurrentLongBreakCircleTime(
            JSON.parse(longBreakValue || "15") * 60,
          );
        if (focusValue)
          setCurrentFocusCircleTime(JSON.parse(focusValue || "25") * 60);
      });
    }, []),
  );

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const ref = setInterval(() => {
      setCounterCircleTime((old) => (old <= 0 ? old : old - 1));
    }, 1000);

    return () => {
      clearInterval(ref);
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    switch (currentStatus) {
      case "focus": {
        if (counterCircleTime > 0) break;
        if (step < 4) {
          setStep((old) => (old + 1) as 1);
          setCurrentStatus("short_break");
          setCounterCircleTime(currentShortBreakCircleTime);
        } else {
          setStep(1);
          setCurrentStatus("long_break");
          setCounterCircleTime(currentLongBreakCircleTime);
        }
        break;
      }
      case "short_break":
      case "long_break": {
        if (counterCircleTime <= 0) {
          setCurrentStatus("focus");
          setCounterCircleTime(currentFocusCircleTime);
        }
        break;
      }
      default:
        break;
    }
  }, [
    counterCircleTime,
    currentStatus,
    isRunning,
    isPaused,
    step,
    currentShortBreakCircleTime,
    currentFocusCircleTime,
    currentLongBreakCircleTime,
  ]);

  const isShouldUpdate = useRef(true);
  useEffect(() => {
    if (isShouldUpdate.current) {
      isShouldUpdate.current = false;
      AsyncStorage.getItem("APP_STATE").then((value) => {
        if (!value) return;
        const appState = JSON.parse(value);

        const apdatedAppState = updateStateByElapsedTime(appState);
        setStep(apdatedAppState.step);
        setIsPaused(apdatedAppState.isPaused);
        setIsRunning(apdatedAppState.isRunning);
        setCurrentStatus(apdatedAppState.currentStatus);
        setCounterCircleTime(apdatedAppState.counterCircleTime);
      });
    }

    if (appRinningState === "background") {
      isShouldUpdate.current = true;
    }
  }, [appRinningState]);

  const handleStart = () => {
    setIsRunning(true);

    AsyncStorage.setItem(
      "APP_STATE",
      JSON.stringify({
        step,
        isPaused,
        isRunning: true,
        currentStatus,
        time: Date.now(),
        counterCircleTime,
        currentFocusCircleTime,
        currentLongBreakCircleTime,
        currentShortBreakCircleTime,
      }),
    );
  };

  const handlePause = () => {
    setIsPaused(true);

    AsyncStorage.setItem(
      "APP_STATE",
      JSON.stringify({
        step,
        isPaused: true,
        isRunning,
        currentStatus,
        time: Date.now(),
        counterCircleTime,
        currentFocusCircleTime,
        currentLongBreakCircleTime,
        currentShortBreakCircleTime,
      }),
    );
  };

  const handleStop = () => {
    setStep(1);
    setIsPaused(false);
    setIsRunning(false);
    setCurrentStatus("focus");
    setCounterCircleTime(currentFocusCircleTime);

    AsyncStorage.setItem(
      "APP_STATE",
      JSON.stringify({
        step: 1,
        isPaused: false,
        isRunning: false,
        currentStatus: "focus",
        time: Date.now(),
        counterCircleTime,
        currentFocusCircleTime,
        currentLongBreakCircleTime,
        currentShortBreakCircleTime,
      }),
    );
  };

  const handleContinue = () => {
    setIsPaused(false);

    AsyncStorage.setItem(
      "APP_STATE",
      JSON.stringify({
        step,
        isPaused: false,
        isRunning,
        currentStatus,
        time: Date.now(),
        counterCircleTime,
        currentFocusCircleTime,
        currentLongBreakCircleTime,
        currentShortBreakCircleTime,
      }),
    );
  };

  const timeProgress = useMemo(() => {
    switch (currentStatus) {
      case "focus":
        return 100 - (counterCircleTime / currentFocusCircleTime) * 100;
      case "short_break":
        return 100 - (counterCircleTime / currentShortBreakCircleTime) * 100;
      case "long_break":
        return 100 - (counterCircleTime / currentLongBreakCircleTime) * 100;
      default:
        return 0;
    }
  }, [
    counterCircleTime,
    currentStatus,
    currentFocusCircleTime,
    currentShortBreakCircleTime,
    currentLongBreakCircleTime,
  ]);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        disabled={isRunning}
        onPress={() => navigation.navigate("Settings")}
        style={{ ...styles.settingsButton, opacity: isRunning ? 0 : 1 }}
      >
        <MaterialIcons name="settings" size={28} color={Theme.colors.divider} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.titleGroup}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Pomodoro</Text>
          </View>

          <View style={styles.stateContainer}>
            {!isRunning && (
              <Text style={styles.stateText}>Vamos nos concentrar?</Text>
            )}

            {isRunning && (
              <>
                {!isPaused && currentStatus === "focus" && (
                  <Text style={styles.stateText}>Hora de se concentrar</Text>
                )}

                {!isPaused && currentStatus === "short_break" && (
                  <Text style={styles.stateText}>Pausa curta</Text>
                )}

                {!isPaused && currentStatus === "long_break" && (
                  <Text style={styles.stateText}>Pausa longa</Text>
                )}

                {isPaused && (
                  <Text style={styles.stateText}>Cronômetro em pausa</Text>
                )}
              </>
            )}
          </View>

          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={160}
              width={7}
              fill={timeProgress}
              tintColor={Theme.colors.divider}
              backgroundColor={Theme.colors.primary}
              rotation={0}
              children={() => (
                <Text style={styles.progressText}>
                  {Math.floor(counterCircleTime / 60)}:
                  {String(counterCircleTime % 60).padStart(2, "0")}
                </Text>
              )}
            />
          </View>
        </View>

        {!isRunning && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStart}
            >
              <Text style={styles.primaryButtonText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        )}

        {isRunning && !isPaused && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePause}
            >
              <Text style={styles.primaryButtonText}>Pausar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleStop}
            >
              <Text style={styles.secondaryButtonText}>Parar</Text>
            </TouchableOpacity>
          </View>
        )}

        {isRunning && isPaused && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
            >
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleStop}
            >
              <Text style={styles.secondaryButtonText}>Parar</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.pomodoroContainer}>
          <Text style={styles.pomodoroText}>Pomodoros completos:</Text>

          <View
            style={
              step >= 2 || currentStatus === "long_break"
                ? styles.pomodoroIndicatorComplete
                : styles.pomodoroIndicator
            }
          />

          <View
            style={
              step >= 3 || currentStatus === "long_break"
                ? styles.pomodoroIndicatorComplete
                : styles.pomodoroIndicator
            }
          />

          <View
            style={
              step >= 4 || currentStatus === "long_break"
                ? styles.pomodoroIndicatorComplete
                : styles.pomodoroIndicator
            }
          />

          <View
            style={
              currentStatus === "long_break"
                ? styles.pomodoroIndicatorComplete
                : styles.pomodoroIndicator
            }
          />
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
  titleGroup: {
    gap: 24,
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 55,
  },
  primaryButtonText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body,
  },
  secondaryButton: {
    borderColor: Theme.colors.primary,
    borderWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 55,
  },
  secondaryButtonText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interBold,
    fontSize: Theme.fontSizes.title,
  },
  titleContainer: {
    alignItems: "center",
  },
  titleText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interBold,
    fontSize: Theme.fontSizes.title,
  },
  stateContainer: {
    alignItems: "center",
  },
  stateText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body,
  },
  pomodoroContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  pomodoroText: {
    color: Theme.colors.text,
    fontFamily: Theme.fonts.interRegular,
    fontSize: Theme.fontSizes.body,
  },
  pomodoroIndicator: {
    width: 20,
    height: 20,
    borderRadius: "100%",
    backgroundColor: Theme.colors.divider,
  },
  pomodoroIndicatorComplete: {
    width: 20,
    height: 20,
    borderRadius: "100%",
    backgroundColor: Theme.colors.primary,
  },
});
