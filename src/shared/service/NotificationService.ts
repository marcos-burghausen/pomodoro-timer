import notifee, { AuthorizationStatus, EventType } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { updateStateByElapsedTime } from "../helpers/UpdateStateByElapsedTime";

notifee.onBackgroundEvent(async (event) => {
  if (event.type !== EventType.DISMISSED && event.type !== EventType.DELIVERED)
    return;

  await new Promise((resolve) => setTimeout(() => resolve({}), 1000));

  const appState = await AsyncStorage.getItem("APP_STATE").then((value) =>
    JSON.parse(value || "null"),
  );
  if (!appState) return;

  const upadatedAppState = updateStateByElapsedTime(appState);

  const getMaxTime = () => {
    switch (upadatedAppState.currentStatus) {
      case "focus":
        return upadatedAppState.currentFocusCircleTime;
      case "long_break":
        return upadatedAppState.currentLongBreakCircleTime;
      case "short_break":
        return upadatedAppState.currentShortBreakCircleTime;
      default:
        return upadatedAppState.currentFocusCircleTime;
    }
  };

  const getTitle = () => {
    switch (upadatedAppState.currentStatus) {
      case "focus":
        return "Hora de se concentrar!";
      case "long_break":
        return "Pausa Longa";
      case "short_break":
        return "Pausa Curta";
      default:
        return "Iniciando a notificação";
    }
  };

  const maxTime = getMaxTime();

  await notifee.displayNotification({
    id: "pomodoro_progress",
    title: getTitle(),
    body: `Tempo restante: ${Math.floor(upadatedAppState.counterCircleTime / 60)}:${(upadatedAppState.counterCircleTime % 60).toString().padStart(2, "0")}`,

    android: {
      ongoing: true,
      channelId: "default",
      progress: {
        max: maxTime,
        current: maxTime - upadatedAppState.counterCircleTime,
      },
    },
  });
});

const requestPermission = async () => {
  const { authorizationStatus } = await notifee.requestPermission();

  if (authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
    Alert.alert(
      "Permissão negada",
      "A permissão para mostrar notificações foi negada.",
    );
  }
};
const activateNotification = async () => {
  await notifee.createChannel({
    id: "default",
    name: "Pomodoro",
  });

  await notifee.displayNotification({
    id: "pomodoro_progress",
    title: "Pomodoro",
    body: "Iniciando notificação",

    android: {
      ongoing: true,
      timeoutAfter: 1000,
      channelId: "default",
      progress: {
        max: 1,
        current: 1,
        indeterminate: true,
      },
    },
  });
};
const deactivateNotification = async () => {
  await notifee.cancelNotification("pomodoro_progress");
};

export const NotificationService = {
  requestPermission,
  activateNotification,
  deactivateNotification,
};
