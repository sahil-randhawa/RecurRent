import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	Alert,
} from 'react-native';
import {
	primaryColor,
	secondaryColor,
	textColor,
	backgroundColor,
	typography,
	spacing,
	border,
	lightTheme,
	darkTheme,
	tertiaryColor,
} from '../styles/GlobalStyles';
import Btn, { primaryBtnStyle } from '../components/Button';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeTab from './HomeTabs/HomeTab';
import MapTab from './HomeTabs/MapTab';
import BookingRequestTab from './HomeTabs/BookingRequestTab';
import ProfileTab from './HomeTabs/ProfileTab';
import CreateNewListing from './CreateNewListing';
import NotificationsScreen from './NotificationsScreen';
import Icon from 'react-native-vector-icons/Ionicons';

import messaging from '@react-native-firebase/messaging';

const Tab = createBottomTabNavigator();

// Style for navigation header
const NavigationHeader = ({ title, showNotification }) => {
	return (
		<View>
			<Text style={typography.navHeading}>{title}</Text>
		</View>
	);
};

const HomeScreen = ({ navigation, route }) => {

	const requestUserPermission = async () => {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {
			console.log('Authorization status (Messaging):', authStatus);
		}
	};

	useEffect(() => {
		if (requestUserPermission()) {
			// return fcm token for the device
			messaging().getToken().then((token) => {
				console.log("Token: ", token)
			});
		} else {
			console.log("Failed token status : ", authStatus)
		}

		// Check whether an initial notification is available
		messaging()
			.getInitialNotification()
			.then(async (remoteMessage) => {
				if (remoteMessage) {
					console.log(
						'Notification caused app to open from quit state:',
						remoteMessage.notification,
					);
				}
			});

		// Assume a message-notification contains a "type" property in the data payload of the screen to open
		messaging().onNotificationOpenedApp(remoteMessage => {
			console.log(
				'Notification caused app to open from background state:',
				remoteMessage.notification,
			);
		});

		// Register background handler
		messaging().setBackgroundMessageHandler(async remoteMessage => {
			console.log('Message handled in the background!', remoteMessage);
		});

		const unsubscribe = messaging().onMessage(async remoteMessage => {
			Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
		});

		return unsubscribe;

	}, []);

	return (
		<>
			<View
				style={{
					flex: 1,
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
					backgroundColor: lightTheme.colors.onPrimary,
				}}
			>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							if (route.name === 'Home') {
								iconName = focused ? 'home' : 'home-outline';
							} else if (route.name === 'Profile') {
								iconName = focused ? 'person' : 'person-outline';
							} else if (route.name === 'Explore') {
								iconName = focused ? 'map' : 'map-outline';
							} else if (route.name === 'Requests') {
								iconName = focused ? 'list' : 'list-outline';
							}
							return (
								<Icon
									name={iconName}
									size={28}
									color={color}
									style={{ paddingTop: 5 }}
								/>
							);
						},
						tabBarLabel: ({ focused, color }) => {
							if (focused) {
								return (
									<Text style={{ color: primaryColor, fontSize: 12 }}>{route.name}</Text>
								);
							}
							return null; // Hide label when not focused
						},
						tabBarStyle: {
							position: 'absolute',
							bottom: 0,
							right: 0,
							left: 0,
							elevation: 0,
							height: Platform.OS === 'ios' ? 85 : 70,
							paddingBottom: Platform.OS === 'ios' ? 30 : 10,
						},
						tabBarActiveTintColor: primaryColor,
						tabBarInactiveTintColor: tertiaryColor,
						tabBarHideOnKeyboard: true,
					})}
				>
					{/* Home */}
					<Tab.Screen
						name="Home"
						component={HomeTab}
						options={{
							headerTitle: () => (
								<NavigationHeader
									title="RecurRent"
									showNotification
								/>
							),
							headerTitleAlign: 'center',
							headerStyle: {
								shadowColor: lightTheme.colors.shadow,
							},
							headerRight: () => (
								<TouchableOpacity
									style={{ paddingRight: 20 }}
									onPress={() => navigation.navigate('NotificationsScreen')}
								>
									<Icon
										name="notifications-outline"
										size={26}
										color={primaryColor}
									/>
								</TouchableOpacity>
							),
						}}
					/>

					{/* Explore */}
					<Tab.Screen
						name="Explore"
						component={MapTab}
						options={{
							headerTitle: () => <NavigationHeader title="Explore" />,
							headerTitleAlign: 'center',
							headerStyle: {
								// backgroundColor: lightTheme.colors.primaryContainer,
								shadowColor: lightTheme.colors.shadow,
							},
						}}
					/>

					{/* Create Listing */}
					<Tab.Screen
						name=" "
						component={CreateNewListing}
						options={{
							tabBarIcon: ({ focused }) => {
								return (
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											backgroundColor: focused
												? lightTheme.colors.onPrimaryContainer
												: primaryColor,
											height: Platform.OS == 'ios' ? 70 : 65,
											width: Platform.OS == 'ios' ? 70 : 65,
											top: -20,
											borderRadius: Platform.OS == 'ios' ? 40 : 35,
											borderWidth: 2,
											borderColor: focused
												? lightTheme.colors.onPrimaryContainer
												: primaryColor,
										}}
									>
										<Icon
											name="add"
											size={24}
											color={backgroundColor}
										/>
									</View>
								);
							},
							headerTitle: () => <NavigationHeader title="Create Listing" />,
							headerTitleAlign: 'center',
							headerStyle: {
								// backgroundColor: lightTheme.colors.primaryContainer,
								shadowColor: lightTheme.colors.shadow,
							},
						}}
					/>

					{/* Requests */}
					<Tab.Screen
						name="Requests"
						component={BookingRequestTab}
						options={{
							headerTitle: () => <NavigationHeader title="Booking Requests" />,
							headerTitleAlign: 'center',
							headerStyle: {
								// backgroundColor: lightTheme.colors.primaryContainer,
								shadowColor: lightTheme.colors.shadow,
							},
						}}
					/>

					{/* Profile */}
					<Tab.Screen
						name="Profile"
						component={ProfileTab}
						options={{
							headerTitle: () => <NavigationHeader title="Profile" />,
							headerTitleAlign: 'center',
							headerStyle: {
								// backgroundColor: lightTheme.colors.primaryContainer,
								shadowColor: lightTheme.colors.shadow,
							},
						}}
					/>
				</Tab.Navigator>
			</View>
		</>
	);
};

export default HomeScreen;
