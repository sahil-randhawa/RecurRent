import * as React from "react";
import { useState } from "react";
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
} from "react-native";
import CheckBox from "react-native-check-box";
import { Image } from "expo-image";
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

const LogIn = ({ navigation, route }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [toggleCheckBox, setToggleCheckBox] = useState(false);

	const onSignUpClicked = () => {
		navigation.navigate("SignUp");
	};

	const onLoginClicked = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
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
						console.log("Log in clicked!");
						console.log("User: ", auth.currentUser.uid);
						navigation.navigate("Home");
						// navigation.navigate("OpenningScreen");
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
			alert("Invalid Credential!");
		}
	};

	return (
		<View style={styles.logIn}>
			<View style={[styles.welcomeBackParent, styles.parentPosition]}>
				<Text style={[typography.heading, styles.welcomeBack]}>
					Welcome Back!
				</Text>
				<View style={styles.input}>
					<Text style={[styles.title, styles.titleLayout]}>Email address</Text>
					<View style={[styles.inputField, styles.inputBorder]}>
						<TextInput
							style={[styles.text, styles.textLayout]}
							value={email}
							onChangeText={setEmail}
							placeholder="example@gmail.com"
						/>
						{/* <Image
              style={[styles.icon, styles.iconLayout]}
              contentFit="cover"
              source={require("../assets/icon.png")}
            /> */}
					</View>
					<Text style={[typography.caption, styles.error, styles.errorTypo]}>Error</Text>
				</View>
				<View style={styles.input1}>
					<Text style={[styles.title, styles.titleLayout]}>Password</Text>
					<View style={[styles.inputField, styles.inputBorder]}>
						<TextInput
							style={[styles.text, styles.textLayout]}
							value={password}
							onChangeText={setPassword}
							placeholder="must be 8 characters"
							secureTextEntry={true}
						/>
						{/* <Image
              style={styles.iconLayout}
              contentFit="cover"
              source={require("../assets/icon1.png")}
            /> */}
					</View>
					<Text style={[typography.caption, styles.error, styles.errorTypo]}>Error</Text>
				</View>
			</View>
			<Image
				style={styles.logInChild}
				contentFit="cover"
				source={require("../../assets/images/star-8.png")}
			/>
			<View style={[styles.instanceParent, styles.parentFlexBox]}>
				<View style={[styles.checkboxOnParent, styles.parentFlexBox]}>
					{/* <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={()=>{
                  this.setState({
                      isChecked:!toggleCheckBox
                  })
                }}
                isChecked={toggleCheckBox}
                leftText={"CheckBox"}
            /> */}
					{/* <Text style={[styles.rememberMe, styles.titleLayout]}>
            Remember me
          </Text> */}
				</View>
				{/* <Text style={[styles.forgotPassword, styles.titleLayout]}>
          Forgot password?
        </Text> */}
			</View>
			<TouchableOpacity
				style={[styles.buttonPrimary, styles.parentFlexBox]}
				onPress={onLoginClicked}
			>
				<Text style={[styles.button, styles.buttonTypo]}>Log in</Text>
			</TouchableOpacity>
			<View style={[styles.frameParent, styles.parentPosition]}>
				<View>
					<View style={styles.component3}>
						<Text style={[typography.caption, styles.orWith, styles.titleLayout]}>Or with</Text>
						<View style={[styles.component3Child, styles.component3Position]} />
						<View style={[styles.component3Item, styles.component3Position]} />
					</View>
					<View style={[styles.buttonWithCenteredIcon, styles.inputBorder]}>
						<View style={[styles.checkboxOnParent, styles.parentFlexBox]}>
							<Image
								style={[styles.socialIconGoogle, styles.checkboxOnLayout]}
								contentFit="cover"
								source={require("../../assets/images/social-icon--google.png")}
							/>
							<Text style={[styles.google, styles.errorTypo]}>Google</Text>
						</View>
					</View>
				</View>
				<Text style={[styles.dontHaveAnContainer, styles.titleLayout]}>
					<Text style={styles.dontHaveAnAccount}>
						<Text style={styles.dontHaveAn}>Don’t have an account?</Text>
						<Text style={styles.text2}>{` `}</Text>
					</Text>
					<TouchableOpacity
						// style={styles.text2}
						onPress={onSignUpClicked}>
						<Text
						// style={typography.subheading}
						>Sign up</Text>
					</TouchableOpacity>
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	parentPosition: {
		// left: 20,
		// position: "absolute",
		position: "absolute",
		width: "100%",
		flex: 1,
		alignItems: "center",
	},
	titleLayout: {
		lineHeight: 18,
	},
	inputBorder: {
		// paddingVertical: spacing.p_lg,
		borderWidth: 1,
		borderColor: textColor,
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
	errorTypo: {
		textAlign: "left",
	},
	parentFlexBox: {
		flexDirection: "row",
		alignItems: "center",
	},
	component3Position: {
		borderTopWidth: 1,
		bottom: "47.22%",
		top: "47.22%",
		width: "37.68%",
		height: "5.56%",
		borderColor: lightTheme.colors.elevation,
		borderStyle: "solid",
		position: "absolute",
	},
	checkboxOnLayout: {
		height: 20,
		width: 20,
	},
	welcomeBack: {
		letterSpacing: -0.3,
		lineHeight: 39,
		textAlign: "left",
		color: primaryColor,
	},
	title: {
		textAlign: "left",
		color: primaryColor,
	},
	text: {
		color: textColor,
		textAlign: "left",
		flex: 1,
	},
	icon: {
		display: "none",
	},
	inputField: {
		marginTop: 6,
		alignItems: "center",
		// paddingHorizontal: spacing.padding,
		// paddingVertical: spacing.p_lg,
		paddingHorizontal: 18,
		paddingVertical: 18,
		flexDirection: "row",
		borderWidth: 1,
		borderColor: lightTheme.colors.onPrimaryContainer,
		borderStyle: "solid",
	},
	error: {
		lineHeight: 16,
		color: lightTheme.colors.error,
		display: "none",
		marginTop: 6,
	},
	input: {
		marginTop: 30,
	},
	inputField1: {
		justifyContent: "flex-end",
		marginTop: 6,
		alignItems: "center",
		paddingHorizontal: spacing.padding,
		paddingVertical: spacing.p_lg,
		flexDirection: "row",
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
		borderStyle: "solid",
	},
	input1: {
		justifyContent: "center",
		marginTop: 30,
	},
	welcomeBackParent: {
		top: 145,
	},
	logInChild: {
		top: 47,
		left: 320,
		width: 46,
		height: 44,
		position: "absolute",
	},
	rememberMe: {
		marginLeft: 8,
		textAlign: "left",
		color: secondaryColor,
	},
	checkboxOnParent: {
		alignItems: "center",
	},
	forgotPassword: {
		marginLeft: 110,
		textAlign: "left",
		color: secondaryColor,
	},
	instanceParent: {
		top: 424,
		alignItems: "center",
		left: 20,
		position: "absolute",
	},
	button: {
		color: backgroundColor,
		textAlign: "center",
		lineHeight: 20,
		fontSize: baseFontSize,
	},
	buttonPrimary: {
		top: 474,
		backgroundColor: lightTheme.colors.outline,
		height: 56,
		paddingVertical: spacing.p_mid,
		justifyContent: "center",
		alignItems: "center",
		width: 353,
		borderRadius: border.br_3xs,
		flexDirection: "row",
		left: 35,
		position: "absolute",
	},
	orWith: {
		top: "0%",
		left: "43.34%",
		color: primaryColor,
		textAlign: "left",
		position: "absolute",
	},
	component3Child: {
		right: "-0.14%",
		left: "62.46%",
	},
	component3Item: {
		right: "62.46%",
		left: "-0.14%",
	},
	component3: {
		height: 18,
		width: 353,
	},
	socialIconGoogle: {
		overflow: "hidden",
	},
	google: {
		marginLeft: 12,
		lineHeight: 18,
		fontSize: baseFontSize,
		color: textColor,
	},
	buttonWithCenteredIcon: {
		height: 54,
		paddingHorizontal: spacing.p_26xl,
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: spacing.p_lg,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
		borderStyle: "solid",
	},
	dontHaveAn: {
		color: lightTheme.colors.outline,
	},
	text2: {
		color: textColor,
	},
	dontHaveAnContainer: {
		marginTop: 50,
		textAlign: "left",
	},
	frameParent: {
		top: 638,
		alignItems: "center",
	},
	logIn: {
		width: "100%",
		height: 852,
		overflow: "hidden",
		flex: 1,
		backgroundColor: backgroundColor,
	},
});

export default LogIn;
