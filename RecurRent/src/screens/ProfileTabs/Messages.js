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
import { signOut } from "firebase/auth";
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from "firebase/firestore";

const Messages = ({ navigation }) => {
	return (
		<>
			<View style={spacing.container}>
				<Text style={typography.body}>No Messages</Text>
			</View>
		</>
	);
};

export default Messages;
