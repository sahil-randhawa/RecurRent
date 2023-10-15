import React from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import { lightTheme, primaryColor } from "../styles/GlobalStyles";

const Search = ({ placeholder, value, onChangeText, onSubmit }) => {
	return (
		<>
			<View style={{ width: "100%", marginTop: 10, }}>
				<Searchbar
					placeholder={placeholder}
					value={value}
					onChangeText={onChangeText}
					onIconPress={onSubmit}
					onSubmitEditing={onSubmit}
					style={{
						backgroundColor: lightTheme.colors.primaryContainer, 
						color: primaryColor, 
					}}
				/>
			</View> 
		</>
	);
};

export default Search;
