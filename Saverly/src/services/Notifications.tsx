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
export async function SendNotification(notificationMessage) {
    console.log("Sending push Notification..");
    const expoPushToken = await getExpoPushToken();
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "Monthly payment in the next day",
        body: "Don't forget that you have to pay for"+notificationMessage, 
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


export async function schedulePushNotification(ScheduleDate, notificationMessage) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Scheduled Notification",
            body: "Don't forget that you have to pay for "+notificationMessage,
        },
        trigger: { date: ScheduleDate },
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
//You can call clearInterval(intervalId) to stop scheduling notifications.
export async function scheduleMonthlyNotifications(initialNotificationDate, notificationMessage) {
    // Schedule the initial notification
    await schedulePushNotification(notificationMessage, initialNotificationDate);

    // Schedule subsequent notifications every 1 month
    const intervalId = setInterval(async () => {
        const nextNotificationDate = new Date(initialNotificationDate + 30 * 24 * 60 * 60 * 1000); // Calculate the date for the next notification (1 month from now)
        await schedulePushNotification(notificationMessage, nextNotificationDate);
    }, 30 * 24 * 60 * 60 * 1000); // Interval of 1 month

    // Return the intervalId so it can be cleared if needed
    return intervalId;
}