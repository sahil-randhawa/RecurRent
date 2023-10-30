import * as React from "react";
import { useState } from "react";
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
} from "react-native";
import Input from "../components/Input";
import Btn, { primaryBtnStyle, secondaryBtnStyle } from "../components/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "expo-image";
import styles from "../styles/AuthStyles";
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
	baseFontSize,
} from "../styles/GlobalStyles";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const LogInScreen = ({ navigation, route }) => {
	const [email, setEmail] = useState("james@gmail.com");
	const [password, setPassword] = useState("james123");
	const [toggleCheckBox, setToggleCheckBox] = useState(false);

	const onSignUpClicked = () => {
		navigation.navigate("SignUp");
	};

	const onLoginClicked = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email.toLowerCase(),
				password
			);
			if (userCredential === null) {
				console.log("Error: userCredential is null!");
				alert("Invalid Credential!");
			} else {
				const docRef = doc(db, "userProfiles", auth.currentUser.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const profileInfo = docSnap.data();
					if (profileInfo.typeUser === "user") {
						console.log("Login Success: " + auth.currentUser.email);
						navigation.navigate("HomeScreen");
					} else {
						console.log("Error: Type of user does not match!");
						alert("Invalid Credential!");
					}
				} else {
					console.log("Error: DocSanp Does not exist!");
					alert("Invalid Credential!");
				}
			}
		} catch (err) {
			console.log(err);
			alert("Login failed!\n" + err.message);
		}
	};

	return (
		<>
			<View
				style={[
					spacing.container,
					{ position: "relative", justifyContent: "space-evenly" },
				]}
			>
				<View style={styles.imageContainer}>
					<Image
						style={styles.starIcon}
						source={require("../../assets/images/star.svg")}
					/>
				</View>

				<View style={styles.formContainer}>
					<Text
						style={[typography.title, { marginBottom: 30, color: textColor }]}
					>
						Welcome Back!
					</Text>
					<View style={styles.inputContainer}>
						<View>
							<Input
								label="Email"
								placeholder="eg. john@example.com"
								value={email}
								onChangeText={setEmail}
							/>
							<Text style={styles.error}>Error</Text>
						</View>
						<View>
							<Input
								label="Password"
								placeholder="Please enter your password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={true}
							/>
							<Text style={styles.error}>Error</Text>
						</View>
					</View>
					<View
						style={[
							styles.buttonsContainer,
							{ marginBottom: 15, flexDirection: "row" },
						]}
					>
						<Btn
							title="Sign In"
							onPress={onLoginClicked}
							mode="contained"
							style={[
								primaryBtnStyle,
								{ flex: 1, textAlign: "center", marginTop: 30 },
							]}
						/>
					</View>
				</View>

				{/* TODO: Change onPress */}
				<View style={{ width: "100%" }}>
					<View style={styles.dividerContainer}>
						<View style={[styles.line, { marginRight: 10 }]} />
						<Text style={[typography.body, styles.onOr]}>or</Text>
						<View style={[styles.line, { marginLeft: 10 }]} />
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<Btn
							title="Continue with Google"
							onPress={onSignUpClicked}
							mode="outlined"
							icon={() => (
								<Icon
									name="google"
									size={25}
									color={primaryColor}
									style={{ marginRight: 8 }}
								/>
							)}
							style={[secondaryBtnStyle, { flex: 1, textAlign: "center" }]}
						/>
					</View>
				</View>

				<View style={{ flexDirection: "row", marginTop: 20, }}>
					<Text style={[typography.body, { marginRight: 10 }]}>
						Don't have an account?
					</Text>
					<TouchableOpacity onPress={onSignUpClicked}>
						<Text style={[typography.bodyHeading, { color: primaryColor }]}>
							Create Account
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

export default LogInScreen;
