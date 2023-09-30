import * as React from "react";
import { TextInput } from "react-native-paper";
import { primaryColor, lightTheme } from "../styles/GlobalStyles";

const Input = ({
	mode,
	label,
	value,
	onChangeText,
   placeholder,
	secureTextEntry = false,
   style,
}) => {
	return (
		<>
			<TextInput
				mode={mode || "outlined"}
				label={label}
				value={value}
            placeholder={placeholder}
				onChangeText={onChangeText}
				secureTextEntry={secureTextEntry}
            style={[inputStyle, style]}
				outlineColor={primaryColor}
				activeOutlineColor={lightTheme.colors.onPrimaryContainer}
			/>
		</>
	);
};

const inputStyle = {
	marginTop: 20,
}

export default Input;
