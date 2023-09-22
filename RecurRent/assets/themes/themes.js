import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const lightTheme = {
	...MD3LightTheme,

	colors: {
		...MD3LightTheme.colors,

      text: "#1F1F1F",

		primary: "#5B81FA",
		onPrimary: "#F8F9FC",
		primaryContainer: "#DCE1FF",
		onPrimaryContainer: "#374D96",

		secondary: "#2b308a",
		onSecondary: "#F3F4FF",
		secondaryContainer: "#BFC1DC",
		onSecondaryContainer: "#22266E",

		error: "#CC2936",
		onError: "#FFFFFF",
		errorContainer: "#F5D4D7",
		onErrorContainer: "#DB6972",

      info: "##FFC247",
      onInfo: "#FFF8EB",
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

