import React from "react";
import { View,TouchableOpacity } from "react-native";
import { Searchbar,IconButton } from "react-native-paper";
import { lightTheme, primaryColor } from "../styles/GlobalStyles";
import Icon from 'react-native-vector-icons/Ionicons';

const Search = ({ placeholder, value, onChangeText, onSubmit,onFilterPress  }) => {
	return (
		<>
			<View style={{ width: "100%", marginTop: 10,}}>
				<Searchbar
					placeholder={placeholder}
					value={value}
					onChangeText={onChangeText}
					onIconPress={onSubmit}
					onSubmitEditing={onSubmit}
					style={{
						backgroundColor: lightTheme.colors.primaryContainer, 
						color: primaryColor,
						flexDirection: 'row',
						
					}}
					
					
				/>
				 <IconButton icon="filter" onPress={onFilterPress} color="#5B81FA" />
			
			</View> 
		</>
	);
};

export default Search;
