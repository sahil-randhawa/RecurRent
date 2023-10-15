import React, { useState } from "react";
import { Image } from "expo-image";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
} from "react-native";
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
} from "../styles/GlobalStyles";
import Btn, { primaryBtnStyle } from "../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MainTab from "./HomeTabs/MainTab";
import ProfileTab from "./HomeTabs/ProfileTab";
import MapTab from "./HomeTabs/MapTab";
import BookingRequestTab from "./HomeTabs/BookingRequestTab";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

// Style for navigation header
const NavigationHeader = ({ title }) => {
	return (
		<View style={{
			paddingLeft: 10,
		}}>
			<Text style={[
				typography.navHeading
			]}>{title}</Text>
		</View>
	);
};

const HomeScreen = ({ navigation, route }) => {
	return (
		<>
			<View
				style={{
					flex: 1,
					paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
					backgroundColor: lightTheme.colors.onPrimary,
				}}
			>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							if (route.name === "Main") {
								iconName = focused ? "home" : "home-outline";
							} else if (route.name === "Profile") {
								iconName = focused ? "person" : "person-outline";
							} else if (route.name === "Explore") {
								iconName = focused ? "map" : "map-outline";
							} else if (route.name === "Requests") {
								iconName = focused ? "list" : "list-outline";
							}
							return (
								<Icon
									name={iconName}
									size={28}
									color={color}
									style={{ paddingTop: 8 }}
								/>
							);
						},
						tabBarLabelStyle: {
							fontSize: 12,
						},
						tabBarStyle: {
							height: 85,
						},
						tabBarActiveTintColor: primaryColor,
						tabBarInactiveTintColor: tertiaryColor,
					})}
				>
					<Tab.Screen
						name="Main"
						component={MainTab}
						options={{
							headerTitle: () => <NavigationHeader title="RecurRent" />,
							headerTitleAlign: "center",
							headerStyle: {
								// backgroundColor: lightTheme.colors.primaryContainer,
								shadowColor: lightTheme.colors.shadow,
							},
						}}
					/>
					<Tab.Screen
						name="Explore"
						component={MapTab}
						options={{
							headerTitle: () => <NavigationHeader title="Explore" />,
							headerTitleAlign: "center",
							headerStyle: {
								// backgroundColor: lightTheme.colors.primaryContainer,
								shadowColor: lightTheme.colors.shadow,
							},
						}}
					/>

					<Tab.Screen
						name="Requests"
						component={BookingRequestTab}
						options={{
							headerTitle: () => <NavigationHeader title="Booking Requests" />,
							headerTitleAlign: "center",
							headerStyle: {
								// backgroundColor: lightTheme.colors.primaryContainer,
								shadowColor: lightTheme.colors.shadow,
							},
						}}
					/>

					<Tab.Screen
						name="Profile"
						component={ProfileTab}
						options={{
							headerTitle: () => <NavigationHeader title="Profile" />,
							headerTitleAlign: "center",
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
