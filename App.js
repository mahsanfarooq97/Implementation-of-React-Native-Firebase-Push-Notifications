/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  Platform,
  Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';


const App = () => {
  async function onDisplayNotification(remoteMessage) {
    if (Platform.OS === 'ios') {
      await notifee.requestPermission()
    }

    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH
    });
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      ios: { sound: 'bell.mp3' },
      android: {
        sound: 'bell',
        channelId: 'default',
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
  }
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    checkPermission()
  }, [])
  const checkPermission = async () => {
    messaging()
      .requestPermission({
        sound: true,
        badge: true,
      })
      .then((authStatus) => {
        enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          getFcmToken()
        }
        else {
          checkPermission()
        }
      });
  }
  const getFcmToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token here', token)
    if (token) {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('hi')
        onDisplayNotification(remoteMessage)
      });
      return unsubscribe;
    }

  }
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      // navigation.navigate(remoteMessage.data.type);
    });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
    return unsubscribe
  }, []);


  return (
    <SafeAreaView style={backgroundStyle}>
      <Button title="Display Notification" onPress={() => onDisplayNotification()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
