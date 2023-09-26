import React from "react";
import { Button } from "react-native-paper";

const PrimaryButton = ({ title, onPress, mode, style }) => {
	return (
		<>
			<Button mode={mode || "contained"} onPress={onPress}>
				{title}
			</Button>
		</>
	);
};

export default PrimaryButton;

// title: The text to display on the button.
// onPress: The function to be called when the button is pressed.
// mode: The mode of the button (optional). You can set it to 'contained', 'outlined', or 'text' depending on your design requirements.