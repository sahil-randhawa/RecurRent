import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List, Button } from 'react-native-paper';
import Input from '../../components/Input';
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
	logoutBtnStyle,
} from '../../components/Button';
import {
	backgroundColor,
	primaryColor,
	spacing,
	typography,
} from '../../styles/GlobalStyles';

const AccountSettingsScreen = () => {
	const fields = [
		{ key: 'name', label: 'NAME', initialValue: 'John Doe' },
		{ key: 'email', label: 'EMAIL', initialValue: 'johndoe@example.com' },
		{ key: 'password', label: 'PASSWORD', initialValue: '********' },
		{
			key: 'mobileNumber',
			label: 'MOBILE NUMBER',
			initialValue: '123-456-7890',
		},
	];

	const [editingField, setEditingField] = useState(null);
	const fieldStates = {};

	fields.forEach((field) => {
		fieldStates[field.key] = useState(false);
	});

	const handleSaveChanges = (fieldKey) => {
		// Implement saving changes here for the specific field
		// Update user's information with the new values
		fieldStates[fieldKey][1](false); // Turn off editing for the specific field
	};

	const handleEditClick = (fieldKey) => {
		// Close the previously open edit field
		if (editingField) {
			fieldStates[editingField][1](false);
		}

		// Open the edit field for the clicked item
		setEditingField(fieldKey);
		fieldStates[fieldKey][1](true);
	};

	const renderField = (field) => {
		const [isEditing, setIsEditing] = fieldStates[field.key];
		const [newValue, setNewValue] = useState(field.initialValue);

		return (
			<View
				key={field.key}
				style={styles.infoRow}
			>
				<List.Item
					title={field.label}
					titleStyle={typography.captionHeading}
					description={
						isEditing ? (
							<View style={styles.inputRow}>
								<Input
									value={newValue}
									onChangeText={setNewValue}
									style={[{ width: '70%', marginRight: 2, marginTop: 0 }]}
								/>
								<Btn
									title="Save"
									titleStyle={typography.caption}
									onPress={() => {
										handleSaveChanges(field.key);
									}}
									mode="contained"
									style={{
										textAlign: 'center',
										margin: 0,
										borderRadius: 5,
										backgroundColor: primaryColor,
										padding: 0,
										width: '30%',
									}}
								/>
							</View>
						) : (
							<View style={styles.rowData}>
								<Text>{newValue}</Text>
								<Btn
									title="Edit"
									onPress={() => {
										handleEditClick(field.key);
									}}
									mode="contained"
									style={{
										textAlign: 'center',
										width: '25%',
										margin: 0,
										borderRadius: 5,
										backgroundColor: primaryColor,
										paddingVertical: 1,
									}}
								/>
							</View>
						)
					}
					descriptionStyle={styles.rowData}
				/>
			</View>
		);
	};

	return (
		<View style={[spacing.container, { alignItems: 'flex-start' }]}>
			{fields.map((field) => renderField(field))}
		</View>
	);
};

const styles = StyleSheet.create({
	infoRow: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	rowData: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	inputRow: {
		width: '100%',
		paddingTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default AccountSettingsScreen;
