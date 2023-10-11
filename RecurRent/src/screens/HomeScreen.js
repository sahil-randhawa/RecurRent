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
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

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
							headerTitle: "RecurRent Home",
							headerTitleAlign: "center",
						}}
					/>
					<Tab.Screen
						name="Profile"
						component={ProfileTab}
						options={{
							headerTitle: "Profile",
							headerTitleAlign: "center",
						}}
					/>
				</Tab.Navigator>
			</View>
		</>
	);
};
const styles = StyleSheet.create({});
export default HomeScreen;
