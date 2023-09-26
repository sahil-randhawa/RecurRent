import { StyleSheet, Platform } from "react-native";
import { MD3LightTheme } from "react-native-paper";
import { MD3DarkTheme } from "react-native-paper";

// ---------------  Colors  ---------------
const primaryColor = "#5B81FA";
const secondaryColor = "#2B308A";
const textColor = "#1F1F1F";
const backgroundColor = "#F2F5FF";

// ---------------  Typography  ---------------
const baseFontSize = Platform.OS === "ios" ? 16 : 18;

const typography = StyleSheet.create({
	heading: {
		fontSize: baseFontSize + 8,
		fontFamily: "Montserrat-Bold",
		color: textColor,
		marginBottom: 16,
	},
	subheading: {
		fontSize: baseFontSize + 4,
		fontFamily: "Montserrat-Regular",
		color: textColor,
		marginBottom: 12,
	},
	body: {
		fontSize: baseFontSize,
		fontFamily: "Manrope-Regular",
		color: textColor,
		lineHeight: 24,
	},
	caption: {
		fontSize: baseFontSize - 2,
		fontFamily: "Manrope-Regular",
		color: textColor,
	},
});

// ---------------  Spacing  ---------------
const spacing = StyleSheet.create({
	margin: { margin: 16 },
	padding: { padding: 16 },
	p_26xl: { padding: 45 },
	p_lg: { padding: 18 },
	p_mid: { padding: 17 },
});

// ---------------  Border  ---------------
const border = {
	br_3xs: 10,
};

// ---------------  Light Theme  ---------------
const lightTheme = {
	...MD3LightTheme,

	colors: {
		...MD3LightTheme.colors,

		text: "#1F1F1F",

		primary: "#5B81FA",
		onPrimary: "#F8F9FC",
		primaryContainer: "#DCE1FF",
		onPrimaryContainer: "#374D96",

		secondary: "#2B308A",
		onSecondary: "#F3F4FF",
		secondaryContainer: "#BFC1DC",
		onSecondaryContainer: "#22266E",

		error: "#CC2936",
		onError: "#FFFFFF",
		errorContainer: "#F5D4D7",
		onErrorContainer: "#DB6972",

		info: "#FFC247",
		onInfo: "#FFE7B5",
		infoContainer: "#FFDD99",
		onInfoContainer: "#E6A82E",

		success: "#9FD85A",
		onSuccess: "#ECf7DE",
		successContainer: "#BCE48C",
		onSuccessContainer: "#7fad48",

		background: "#F2F5FF",
		onBackground: "#1F1F1F",

		surface: "#EFF2FF",
		onSurface: "#1F1F1F",

		surfaceVariant: "#CEDFFF",
		onSurfaceVariant: "#696E83",

		outline: "#A8B1CF",
		outlineVariant: "#E5E8F1",

		shadow: "#1F1F1F",
		scrim: "#1F1F1F",

		inverseSurface: "#8F9199",
		inverseOnSurface: "#F0F0F0",
		inversePrimary: "#B6C4FF",

		elevation: {
			level0: "transparent",
			level1: "#F3F3FC",
			level2: "#EDEEFB",
			level3: "#E7E9F9",
			level4: "#E4E7F9",
			level5: "#E0E4F8",
		},
		surfaceDisabled: "#1B1B1F",
		onSurfaceDisabled: "#D1D1D2",
		backdrop: "#2F3038",
	},
};

// ---------------  Dark Theme  ---------------
const darkTheme = {
	...MD3DarkTheme,

	colors: {
		...MD3DarkTheme.colors,

		text: "#F2F5FF",

		primary: "#5B81FA",
		onPrimary: "#BDCDFD",
		primaryContainer: "#DCE1FF",
		onPrimaryContainer: "#374D96",

		secondary: "#404596",
		onSecondary: "#F3F4FF",
		secondaryContainer: "#BFC1DC",
		onSecondaryContainer: "#22266E",

		error: "#CC2936",
		onError: "#F0BFC3",
		errorContainer: "#F5D4D7",
		onErrorContainer: "#DB6972",

		info: "#FFC247",
		onInfo: "#FFF8EB",
		infoContainer: "#FFDD99",
		onInfoContainer: "#E6A82E",

		success: "#9FD85A",
		onSuccess: "#ECF7DE",
		successContainer: "#BCE48C",
		onSuccessContainer: "#7FAD48",

		background: "#1F1F1F",
		onBackground: "#F2F5FF",

		surface: "#1F1F1F",
		onSurface: "#EFF2FF",

		surfaceVariant: "#CEDFFF",
		onSurfaceVariant: "#696E83",

		outline: "#A8B1CF",
		outlineVariant: "#E5E8F1",

		shadow: "#1F1F1F",
		scrim: "#1F1F1F",

		inverseSurface: "#8F9199",
		inverseOnSurface: "#F0F0F0",
		inversePrimary: "#B6C4FF",

		elevation: {
			level0: "transparent",
			level1: "#F3F3FC",
			level2: "#EDEEFB",
			level3: "#E7E9F9",
			level4: "#E4E7F9",
			level5: "#E0E4F8",
		},
		surfaceDisabled: "#1B1B1F",
		onSurfaceDisabled: "#D1D1D2",
		backdrop: "#2F3038",
	},
};

export {
	primaryColor,
	secondaryColor,
	textColor,
	backgroundColor,
   baseFontSize,
	typography,
	spacing,
	border,
	lightTheme,
	darkTheme,
};
