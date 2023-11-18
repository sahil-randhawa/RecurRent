import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	FlatList,
	ScrollView,
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
} from "../../styles/GlobalStyles";
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
} from "../../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../../firebaseConfig";
import { signOut,sendPasswordResetEmail } from "firebase/auth";
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from "firebase/firestore";

const Settings = ({ navigation }) => {

	const changePassword = () =>{
		
		sendPasswordResetEmail(auth, auth.currentUser.email)
		.then(() => {
			// Password reset email sent!
			console.log("Password Link sent successfully!")
			alert("Password Link sent successfully. Please check your emial!")
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			// ..
		});

	}
	return (
		<>
			<View style={spacing.container}>
			<Btn
						title="Change Password"
						onPress={changePassword}
						mode="contained"
						style={[
							primaryBtnStyle,
							{
								width: "100%",
								alignSelf: "center",
								marginBottom: 15,
								color: lightTheme.colors.onPrimary,
							},
						]}
					/>
			</View>
		</>
	);
};

export default Settings;
