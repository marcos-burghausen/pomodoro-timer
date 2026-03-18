import notifee, { AuthorizationStatus } from "@notifee/react-native";
import { Alert } from "react-native";

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
