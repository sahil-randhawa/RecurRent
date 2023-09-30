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
} from "../styles/GlobalStyles";
import Btn, { primaryBtnStyle } from "../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

const Home = ({ navigation, route }) => {
	const onLogoutClicked = () => {
		signOut(auth)
			.then(() => {
				navigation.navigate("OnBoardingScreen");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<View style={[spacing.container, { justifyContent: "space-evenly" }]}>
				<View style={{ flexDirection: "row" }}>
					<Text style={typography.title}>RecurRent</Text>
				</View>

				<View style={{ marginBottom: 15, flexDirection: "row" }}>
					<Btn
						title="Log Out"
						onPress={onLogoutClicked}
						mode="contained"
						style={[primaryBtnStyle, { flex: 1, textAlign: "center" }]}
					/>
				</View>
			</View>
		</>
	);
};

export default Home;
