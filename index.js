/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    await notifee.createChannel({
        id: 'defaultchannel',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH
    });
    await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
            channelId: 'defaultchannel',
            smallIcon: 'ic_launcher_round',
            largeIcon: 'https://cdn.pixabay.com/photo/2016/02/28/12/55/boy-1226964_1280.jpg',
            style: {
                picture: 'https://cdn.pixabay.com/photo/2016/02/28/12/55/boy-1226964_1280.jpg',
                type: AndroidStyle.BIGPICTURE
            },
            actions: [
                {
                    pressAction: {
                        id: 'default'
                    },
                    title: 'Watch Now'
                }
            ]
        },
    });
});
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {

        console.log('in onBackgroundEvent', notification)
        await notifee.cancelNotification(notification.id);
    }
    console.log('out onBackgroundEvent', notification)
});
function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }

    return <App />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);
