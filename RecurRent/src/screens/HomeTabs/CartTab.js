import React from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import {
	spacing,
	primaryColor,
	tertiaryColor,
	textColor,
} from "../../styles/GlobalStyles";
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
	logoutBtnStyle,
} from "../../components/Button";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";

const CartTab = ({ navigation, route }) => {
	return (
		<>
			<View style={spacing.container}>
				<Text>CartTab</Text>
			</View>
		</>
	);
};
export default CartTab;
