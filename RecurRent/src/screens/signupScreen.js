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
	cd,
} from "../styles/GlobalStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth, db } from "../../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
	doc,
	setDoc,
	getDocs,
	query,
	where,
	collection,
} from "firebase/firestore";

const SignUpScreen = ({ navigation, route }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userName, setUserName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const onLogInClicked = () => {
		navigation.navigate("LogIn");
	};

	const onCreateAccountClicked = async () => {
		try {
			const q = query(
				collection(db, "userProfiles"),
				where("email", "==", email)
			);
			const querySnapshot = await getDocs(q);
			if (!querySnapshot.empty) {
				alert("This email address is alredy exsits!");
			} else {
				if (password === confirmPassword) {
					try {
						const auth = getAuth();
						const userCredential = await createUserWithEmailAndPassword(
							auth,
							email,
							password
						);
						const user = userCredential.user;
						const userToInsert = {
							typeUser: "user",
							email: email,
							name: userName,
							mobileNumber: mobileNumber,
							favlist: [],
						};

						console.log("user to insert", userToInsert);

						await setDoc(doc(db, "userProfiles", user.uid), userToInsert);

						console.log(`user uid ${user.uid}`);
						console.log("User account created & signed in!");
						navigation.navigate("Home");
					} catch (error) {
						if (error.code === "auth/email-already-in-use") {
							console.log("That email address is already in use!");
						} else if (error.code === "auth/invalid-email") {
							console.log("That email address is invalid!");
						} else {
							console.error(error);
						}
					}
				} else {
					alert("Password and Confirm Password should match!");
				}
			}
		} catch (error) {
			console.log(error);
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

				<View style={[styles.formContainer, { paddingTop: 50 }]}>
					<Text style={typography.title}>Hola! Welcome</Text>
					<View style={styles.inputContainer}>
						<View>
							<Input
								label="Name"
								placeholder="eg. John Doe"
								value={userName}
								onChangeText={setUserName}
							/>
							<Text style={styles.error}>Error</Text>
						</View>
						<View>
							<Input
								label="Mobile Number"
								placeholder="eg. +1(513)456-6789"
								value={mobileNumber}
								onChangeText={setMobileNumber}
							/>
							<Text style={styles.error}>Error</Text>
						</View>
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
					<View style={{ marginBottom: 10, flexDirection: "row" }}>
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
						<Text style={[typography.bodyHeading, { color: primaryColor }]}>
							Log In
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

export default SignUpScreen;
