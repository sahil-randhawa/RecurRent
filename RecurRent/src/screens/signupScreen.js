import React, { useState } from "react";
import { Image } from "expo-image";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
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
    baseFontSize,
} from "../styles/GlobalStyles";
import { auth, db } from "../../";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const SignUp = ({ navigation, route }) => {
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
		<View style={styles.signUp}>
			<Image
				style={styles.signUpChild}
				contentFit="cover"
				source={require("../../assets/images/star-8.png")}
			/>
			<View style={[styles.holaWelcomeParent, styles.parentPosition]}>
				<Text style={[typography.heading, styles.holaWelcome]}>Hola! Welcome</Text>

				<View style={styles.input}>
					<Text style={[typography.heading, styles.title, styles.textTypo]}>Email</Text>
					<View style={[styles.inputField, styles.inputLayout]}>
						<TextInput
							style={[typography.body, styles.text, styles.textLayout]}
							value={email}
							onChangeText={setEmail}
							placeholder="example@gmail.com"
						/>
					</View>
					<Text style={[typography.body, styles.error]}>Error</Text>
				</View>

				<View style={styles.input1}>
					<Text style={[typography.heading, styles.title, styles.textTypo]}>Password</Text>
					<View style={[styles.inputField1, styles.inputLayout]}>
						<TextInput
							style={[typography.body, styles.text, styles.textLayout]}
							value={password}
							onChangeText={setPassword}
							placeholder="must be 8 characters"
							secureTextEntry={true}
						/>
					</View>
					<Text style={styles.error}>Error</Text>
				</View>

				<View style={styles.input1}>
					<Text style={[typography.heading, styles.title, styles.textTypo]}>Confirm Password</Text>
					<View style={[styles.inputField1, styles.inputLayout]}>
						<TextInput
							style={[typography.body, styles.text, styles.textLayout]}
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							placeholder="re-enter password"
							secureTextEntry={true}
						/>
					</View>
					<Text style={styles.error}>Error</Text>
				</View>

				<TouchableOpacity
					style={[styles.buttonPrimary, styles.buttonPrimaryFlexBox]}
					onPress={onCreateAccountClicked}
				>
					<Text style={[typography.subheading, styles.button, styles.logInTypo]}>Create Account</Text>
				</TouchableOpacity>
			</View>

			<View style={[styles.frameParent, styles.parentPosition]}>
				<View>
					<View style={styles.component2}>
						<Text style={[typography.caption, styles.orRegisterWith, styles.alreadyHaveAnClr]}>
							Or Register with
						</Text>
						<View style={[styles.component2Child, styles.component2Position]} />
						<View style={[styles.component2Item, styles.component2Position]} />
					</View>

					<TouchableOpacity
						style={[styles.buttonWithCenteredIcon, styles.inputLayout]}
					>
						<View
							style={[
								styles.socialIconGoogleParent,
								styles.buttonPrimaryFlexBox,
							]}
						>
							<Image
								style={styles.socialIconGoogle}
								contentFit="cover"
								source={require("../../assets/images/social-icon--google.png")}
							/>
							<Text style={[styles.google, styles.logInTypo]}>Google</Text>
						</View>
					</TouchableOpacity>

				</View>

				<Text style={[typography.subheading, styles.alreadyHaveAnContainer, styles.titleLayout]}>
					<Text
						style={styles.alreadyHaveAnClr}
					>{`Already have an account? `}</Text>
					<TouchableOpacity onPress={onLogInClicked}>
						<Text style={[styles.logIn, styles.logInTypo]}>Log in</Text>
					</TouchableOpacity>
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	parentPosition: {
		// left: 20,
		position: "absolute",
		width: "100%",
		flex: 1,
		alignItems: "center",
	},
	textTypo: {
		textAlign: "left",
	},
	inputLayout: {
		paddingVertical: spacing.p_lg,
		borderWidth: 1,
		borderStyle: "solid",
		alignItems: "center",
		width: 353,
		borderRadius: border.br_3xs,
		backgroundColor: backgroundColor,
	},
	textLayout: {
		lineHeight: 20,
		fontSize: baseFontSize,
	},
	iconLayout: {
		marginLeft: 10,
		height: 20,
		width: 20,
		overflow: "hidden",
	},
	buttonPrimaryFlexBox: {
		flexDirection: "row",
		alignItems: "center",
	},
	logInTypo: {
		fontWeight: "600",
	},
	alreadyHaveAnClr: {
		color: lightTheme.colors.primaryContainer,
	},
	component2Position: {
		borderTopWidth: 1,
		bottom: "47.22%",
		top: "47.22%",
		width: "32.29%",
		height: "5.56%",
		borderColor: lightTheme.colors.onBackground,
		borderStyle: "solid",
		position: "absolute",
	},
	titleLayout: {
		lineHeight: 18,
	},
	signUpChild: {
		top: 47,
		left: 320,
		width: 46,
		height: 44,
		position: "absolute",
	},
	holaWelcome: {
		letterSpacing: -0.3,
		lineHeight: 39,
		width: 339,
		textAlign: "left",
		color: primaryColor,
	},
	title: {
		lineHeight: 18,
		color: lightTheme.colors.backdrop,
	},
	text: {
		color: lightTheme.colors.backdrop,
		textAlign: "left",
		flex: 1,
		lineHeight: 20,
	},
	icon: {
		display: "none",
	},
	inputField: {
		marginTop: 6,
		alignItems: "center",
		paddingHorizontal: spacing.padding,
		borderColor: lightTheme.colors.outline,
		paddingVertical: spacing.p_lg,
		flexDirection: "row",
		borderWidth: 1,
		borderStyle: "solid",
	},
	error: {
		lineHeight: 16,
		color: lightTheme.colors.error,
		display: "none",
		marginTop: 6,
		textAlign: "left",
	},
	input: {
		marginTop: 30,
	},
	inputField1: {
		justifyContent: "flex-end",
		marginTop: 6,
		alignItems: "center",
		paddingHorizontal: spacing.padding,
		borderColor: lightTheme.colors.outline,
		paddingVertical: spacing.p_lg,
		flexDirection: "row",
		borderWidth: 1,
		borderStyle: "solid",
	},
	input1: {
		justifyContent: "center",
		marginTop: 30,
	},
	button: {
		color: backgroundColor,
		textAlign: "center",
		lineHeight: 20,
	},
	buttonPrimary: {
		backgroundColor: primaryColor,
		height: 56,
		// paddingHorizontal: Padding.p_133xl,
		paddingVertical: spacing.p_mid,
		justifyContent: "center",
		alignItems: "center",
		width: 353,
		borderRadius: border.br_3xs,
		flexDirection: "row",
		marginTop: 30,
	},
	holaWelcomeParent: {
		top: 145,
	},
	orRegisterWith: {
		top: "0%",
		left: "34.84%",
		lineHeight: 18,
		fontSize: 18,
		textAlign: "left",
		position: "absolute",
	},
	component2Child: {
		right: "-0.14%",
		left: "67.85%",
	},
	component2Item: {
		right: "67.85%",
		left: "-0.14%",
	},
	component2: {
		height: 18,
		width: 353,
	},
	socialIconGoogle: {
		height: 20,
		width: 20,
		overflow: "hidden",
	},
	google: {
		color: textColor,
		marginLeft: 12,
		lineHeight: 20,
		fontSize: baseFontSize,
		textAlign: "left",
	},
	socialIconGoogleParent: {
		alignItems: "center",
	},
	buttonWithCenteredIcon: {
		borderColor: lightTheme.colors.outline,
		height: 54,
		paddingHorizontal: spacing.p_26xl,
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: spacing.p_lg,
		borderWidth: 1,
		borderStyle: "solid",
	},
	logIn: {
		color: lightTheme.colors.backdrop,
	},
	alreadyHaveAnContainer: {
		marginTop: 50,
		// textAlign: "left",
	},
	frameParent: {
		top: 638,
		alignItems: "center",
	},
	signUp: {
		width: "100%",
		height: 852,
		overflow: "hidden",
		backgroundColor: backgroundColor,
		flex: 1,
	},
});

export default SignUp;
