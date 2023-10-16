import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
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
				<Image
					source={require('../../../assets/images/noMessage.png')}
					style={styles.image}
				/>
				<Text
					style={[
						typography.bodyHeading,
						{ textAlign: 'center', marginTop: 30 },
					]}
				>
					We'll notify you when {'\n'}
					you get new messages.
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 100,
		height: 100,
	},
});

export default Messages;
