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
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { PrimaryButton } from "../components/PrimaryButton";

const Home = ({ navigation, route }) => {
	const onLogoutClicked = () => {
		signOut(auth)
			.then(() => {
				navigation.navigate("OpenningScreen");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const onPrimaryBtn = () => {
		console.log("Primary Button pressed!");
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={[styles.parentPosition]}>
				<Text style={[typography.heading, styles.holaWelcome]}>
					Hola! Welcome
				</Text>
			</View>

			<PrimaryButton
				title="Press Primary Button"
				onPress={onPrimaryBtn}
				mode="contained"
				style={{ margin: 10 }}
			/>

			{/* logout button */}
			<TouchableOpacity style={[styles.buttonlogout]} onPress={onLogoutClicked}>
				<Text style={[typography.body, styles.buttonTextLogout]}>Log Out</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: backgroundColor,
		alignItems: "center",
		justifyContent: "space-evenly",
		// paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
		// paddingVertical: '20%',
	},
	parentPosition: {
		// left: 20,
		// position: "absolute",
		width: "100%",
		// flex: 1,
		alignItems: "center",
		backgroundColor: backgroundColor,
	},
	holaWelcome: {
		textAlign: "left",
		color: primaryColor,
	},
	buttonlogout: {
		width: "80%",
		alignItems: "center",
		borderColor: primaryColor,
		borderWidth: 2,
		paddingVertical: spacing.p_lg,
		marginHorizontal: "10%",
		borderRadius: border.br_3xs,
	},
	buttonTextLogout: {
		color: primaryColor,
	},
});

export default Home;
