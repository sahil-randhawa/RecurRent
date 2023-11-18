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
	Input
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
import styles from "../../styles/AuthStyles";
import { auth, db,firebase } from "../../../firebaseConfig";

import { signOut,sendPasswordResetEmail,EmailAuthProvider,reauthenticateWithCredential,updatePassword } from "firebase/auth";
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
	
	return (
		<>
			<View style={spacing.container}>
					<Text>Settings</Text>
			</View>
		</>
	);
};

export default Settings;
