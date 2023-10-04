import { useEffect } from "react";
import {
	View,
	Image,
	StyleSheet,
	ActivityIndicator,
	Text,
	SafeAreaView,
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
} from "../styles/GlobalStyles";
import { Button } from "react-native-paper";

export default function Splash({ navigation, route }) {
	useEffect(() => {
		const timeout = setTimeout(() => {
			navigation.navigate("OnBoardingScreen");
		}, 1500);
		return () => clearTimeout(timeout);
	}, []);
	return (
		<SafeAreaView style={style.container}>
			{/* logo image here */}
			<Image
				source={require("../../assets/images/logoStars.png")}
				style={{
					width: "80%",
					height: 300,
					resizeMode: "contain",
					// borderWidth: 1,
					marginBottom: 20,
				}}
			/>
			<Text
				style={{
					fontWeight: "bold",
					fontSize: 24,
					marginBottom: 50,
					letterSpacing: 0.8,
					lineHeight: 33,
					color: primaryColor,
				}}
			>
				RecurRent
			</Text>
			<ActivityIndicator color={primaryColor} animating={true} size="large" />

			<Button
				onPress={() => navigation.navigate("OnBoardingScreen")}
				style={{
					marginTop: 20,
					// backgroundColor: primaryColor,
					width: 200,
					height: 50,
					justifyContent: "center",
					alignItems: "center",
					position: "absolute",
					bottom: 0,
					marginBottom: 20,
				}}
			>
				<Text
					style={{
						fontSize: 10,
					}}
				>
					Go to MainScreen
				</Text>
			</Button>
		</SafeAreaView>
	);
}
const style = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: backgroundColor,
	},
});
