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
import FavoritesTab from "./HomeTabs/FavoritesTab";
import CartTab from "./HomeTabs/CartTab";
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
					backgroundColor: "white",
				}}
			>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							if (route.name === "Home") {
								iconName = focused ? "home" : "home-outline";
							} else if (route.name === "Favorites") {
								iconName = focused ? "heart" : "heart-outline";
							} else if (route.name === "Cart") {
								iconName = focused ? "cart" : "cart-outline";
							} else if (route.name === "Profile") {
								iconName = focused ? "person" : "person-outline";
							}
							return (
								<Icon
									name={iconName}
									color={color}
									style={{ paddingTop: 8, fontSize: 24 }}
									size={28}
								/>
							);
						},
						tabBarActiveTintColor: primaryColor,
						tabBarInactiveTintColor: tertiaryColor,
					})}
				>
					<Tab.Screen
						name="Home"
						component={MainTab}
						options={{
							headerTitle: "RecurRent",
							headerTitleAlign: "center",
						}}
					/>
					<Tab.Screen
						name="Favorites"
						component={FavoritesTab}
						options={{
							headerTitle: "Favorites",
							headerTitleAlign: "center",
						}}
					/>
					<Tab.Screen
						name="Cart"
						component={CartTab}
						options={{
							headerTitle: "Cart",
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
