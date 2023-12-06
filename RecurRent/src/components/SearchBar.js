import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, IconButton } from 'react-native-paper';
import {
	lightTheme,
	textColor,
} from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const Search = ({
	placeholder,
	value,
	onChangeText,
	onSubmit,
	onFilterPress,
}) => {
	return (
		<>
			<View style={styles.container}>
				<Searchbar
					placeholder={placeholder}
					placeholderTextColor={textColor}
					value={value}
					onChangeText={onChangeText}
					onIconPress={onSubmit}
					onSubmitEditing={onSubmit}
					style={styles.searchBar}
				/>
				<IconButton
					icon={() => (
						<Icon
							name="filter"
							size={22}
							color={textColor}
							style={{ padding: 15 }}
						/>
					)}
					mode="outlined"
					size={38}
					onPress={onFilterPress}
					style={styles.filterIcon}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		marginTop: 15,
	},
	searchBar: {
		flex: 1,
		backgroundColor: lightTheme.colors.onPrimary,
		borderWidth: 2,
		borderColor: lightTheme.colors.primaryContainer,
	},
	filterIcon: {
		marginLeft: 10,
		borderWidth: 2,
		backgroundColor: lightTheme.colors.onPrimary,
		borderColor: lightTheme.colors.primaryContainer,
	},
});

export default Search;
