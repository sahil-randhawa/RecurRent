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
} from "./GlobalStyles";


const styles = {
   imageContainer: {
		position: "absolute",
		top: 80,
		right: 40,
	},

	starIcon: {
		width: 32,
		height: 32,
	},

	formContainer: {
		width: "100%",
	},

	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
	},

	line: {
		flex: 1,
		height: 1,
		borderBottomWidth: 1,
		borderBottomColor: lightTheme.colors.inversePrimary,
		width: "50%",
	},

	onOr: {
		color: lightTheme.colors.outline,
	},	
	
	error: {
		lineHeight: 16,
		color: lightTheme.colors.error,
		display: "none",
		marginTop: 8,
		textAlign: "left",
	},

}

export default styles