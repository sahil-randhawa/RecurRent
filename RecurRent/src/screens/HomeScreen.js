import React, { useState } from 'react';
import { Image } from 'expo-image';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
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
						tabBarLabelStyle: {
							fontSize: 12,
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
						name="Create"
						component={CreateNewListing}
						options={{
							tabBarIcon: ({ focused }) => {
								return (
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											backgroundColor: focused ? backgroundColor : primaryColor,
											height: Platform.OS == 'ios' ? 60 : 65,
											width: Platform.OS == 'ios' ? 60 : 65,
											top: Platform.OS == 'ios' ? -20 : -25,
											borderRadius: Platform.OS == 'ios' ? 30 : 35,
											borderWidth: 2,
											borderColor: primaryColor,
										}}
									>
										<Icon
											name="add"
											size={24}
											color={focused ? primaryColor : backgroundColor}
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
const styles = StyleSheet.create({});
export default HomeScreen;
