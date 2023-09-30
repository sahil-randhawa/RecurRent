import React, { useState } from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Input from "../components/Input";
import Btn, { primaryBtnStyle, secondaryBtnStyle } from "../components/Button";
import styles from "../styles/AuthStyles";
import {
	primaryColor,
	textColor,
	typography,
	spacing,
	lightTheme,
} from "../styles/GlobalStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth, db } from "expo/AppEntry";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = ({ navigation, route }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const onLogInClicked = () => {
		navigation.navigate("LogIn");
	};

	const onCreateAccountClicked = async () => {
		if (password == confirmPassword) {
			const auth = getAuth();
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					const user = userCredential.user;
					const userToInsert = {
						typeUser: "user",
					};
					try {
						setDoc(doc(db, "userProfiles", user.uid), userToInsert);
						// db.collection("userProfiles").doc(user.uid).set(userToInsert)
					} catch (err) {
						console.log(err);
					}
					console.log(`user uid ${user.uid}`);
					console.log("User account created & signed in!");
					navigation.navigate("Home");
				})
				.catch((error) => {
					if (error.code === "auth/email-already-in-use") {
						console.log("That email address is already in use!");
					}

					if (error.code === "auth/invalid-email") {
						console.log("That email address is invalid!");
					}

					console.error(error);
				});
		} else {
			alert("Password and Confirm Password should be match!");
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
						Hola! Welcome
					</Text>
					<View style={styles.inputContainer}>
						{/* <View>
							<Input
								label="Name"
								placeholder="eg. John Doe"
								// value={name}
								// onChangeText={setName}
							/>
							<Text style={styles.error}>Error</Text>
						</View> */}
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
						<View>
							<Input
								label="Confirm Password"
								placeholder="Please re-enter your password"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry={true}
							/>
							<Text style={styles.error}>Error</Text>
						</View>
					</View>
					<View style={{ marginBottom: 15, flexDirection: "row" }}>
						<Btn
							title="Create Account"
							onPress={onCreateAccountClicked}
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
							onPress={onCreateAccountClicked}
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

				<View style={{ flexDirection: "row" }}>
					<Text style={[typography.body, { marginRight: 10 }]}>
						Already have an account?
					</Text>
					<TouchableOpacity onPress={onLogInClicked}>
						<Text style={[typography.body, { color: primaryColor }]}>
							Log In
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

export default SignUpScreen;
