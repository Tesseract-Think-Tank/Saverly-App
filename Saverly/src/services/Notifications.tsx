import { Platform} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
export async function SendNotification() {
    console.log("Sending push Notification..");
    const expoPushToken = await getExpoPushToken();
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "test mesaj",
        body: "test sa vad daca merge",
    }
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
        },
        body: JSON.stringify(message),
    });
}
async function schedulePushNotification() {
    // Specify the date and time for the notification
    const notificationDate = new Date(2024, 1, 26, 15, 0, 0); // Year, Month (0-indexed), Day, Hour, Minute, Second

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Scheduled Notification",
            body: 'This notification is scheduled for February 27, 2024',
        },
        trigger: { date: notificationDate },
    });
}

  // Function to get Expo push token
    async function getExpoPushToken() {
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        });
    }
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }
        if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: 'd26dbd6f-05d3-4fcc-a070-e25fedd3476a' })).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }
    return token;
}