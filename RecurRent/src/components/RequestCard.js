import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import {
	lightTheme,
	secondaryColor,
	typography,
	primaryColor,
	tertiaryColor,
	textColor,
} from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const RequestCard = ({ rowData, handleConfirm, handleDecline }) => {
	return (
		<>
			<Card style={styles.card}>
				<Card.Content style={{ flexDirection: 'column' }}>
					<View style={{ flexDirection: 'row' }}>
						<Image
							source={{ uri: rowData.item['productPhoto'] }}
							style={styles.image}
						/>
						<View style={{ flex: 1 }}>
							<Card.Title
								title={rowData.item.name}
								titleNumberOfLines={2}
								titleStyle={[typography.bodyHeading, { color: secondaryColor, }]}
								subtitle={`Renter: ${rowData.item.renterName}`}
								subtitleStyle={[
									typography.caption,
									{ color: tertiaryColor, marginBottom: 10 },
								]}
								style={{ marginLeft: 0 }}
							/>
							<Card.Content>
								<View style={styles.textContainer}>
									<Icon
										name="mail-outline"
										size={20}
										color={textColor}
										style={{ paddingRight: 8 }}
									/>
									<Text style={typography.label}>
										{rowData.item.renterEmail}
									</Text>
								</View>

								<View style={styles.textContainer}>
									<Icon
										name="call-outline"
										size={20}
										color={textColor}
										style={{ paddingRight: 8 }}
									/>
									<Text style={typography.label}>
										{rowData.item.renterMobileNumber}
									</Text>
								</View>
							</Card.Content>
						</View>
					</View>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[styles.btn, { backgroundColor: lightTheme.colors.error }]}
							onPress={() => alert('Declined')}
						>
							<Text style={[typography.captionHeading, styles.buttonText]}>
								Decline
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.btn,
								{ backgroundColor: lightTheme.colors.onSuccessContainer },
							]}
							onPress={() => alert('Confirmed')}
						>
							<Text style={[typography.captionHeading, styles.buttonText]}>
								Confirm
							</Text>
						</TouchableOpacity>
					</View>
				</Card.Content>
			</Card>
		</>
	);
};

const styles = StyleSheet.create({
	card: {
		marginTop: 15,
		borderRadius: 8,
		backgroundColor: lightTheme.colors.onPrimary,
		marginHorizontal: 2,
	},

	image: {
		width: 120,
		borderRadius: 5,
	},

	textContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 5,
	},

	buttonContainer: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		marginTop: 15,
	},

	btn: {
		width: '49%',
		padding: 12,
		borderRadius: 5,
	},
	buttonText: {
		color: lightTheme.colors.onPrimary,
		textAlign: 'center',
	},
});

export default RequestCard;
