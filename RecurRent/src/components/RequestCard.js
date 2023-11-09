import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import {
	lightTheme,
	secondaryColor,
	typography,
	primaryColor,
	tertiaryColor,
	textColor,
} from '../styles/GlobalStyles';
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
	logoutBtnStyle,
} from '../components/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const RequestCard = ({ rowData, handleConfirm, handleDecline, handleChat }) => {
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
								titleStyle={[
									typography.bodyHeading,
									{ color: secondaryColor },
									Platform.OS === 'android' && styles.androidBodyHeading,
								]}
								subtitle={`Renter: ${rowData.item.renterName}`}
								subtitleStyle={[
									typography.caption,
									{ color: tertiaryColor, marginBottom: 10 },
									Platform.OS === 'android' && styles.androidSubHeading,
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
							style={{
								// flex: 1,
								textAlign: 'center',
								marginTop: 10,
								alignContent: 'center',
								paddingVertical: 10,
								paddingVertical: Platform.OS === 'android' && 3,
								padding: 10,
							}}
							onPress={handleChat}
						>
							<Icon
								name="chatbubbles"
								size={40}
								style={{ color: primaryColor }}
							/>
						</TouchableOpacity>
						<Btn
							title="DECLINE"
							onPress={handleDecline}
							mode="outlined"
							style={{
								flex: 1,
								textAlign: 'center',
								marginTop: 10,
								borderRadius: 10,
								backgroundColor: 'transparent',
								paddingVertical: 10,
								paddingVertical: Platform.OS === 'android' && 3,
								marginRight: 5,
							}}
						/>
						<Btn
							title="CONFIRM"
							onPress={handleConfirm}
							mode="contained"
							style={{
								flex: 1,
								textAlign: 'center',
								marginTop: 10,
								borderRadius: 10,
								backgroundColor: primaryColor,
								paddingVertical: 10,
								paddingVertical: Platform.OS === 'android' && 3,  
							}}
						/>
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

	androidBodyHeading: {
		fontSize: 16,
	},

	androidSubHeading: {
		fontSize: 12,
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
		marginTop: Platform.OS === 'android' && 7,
	},
});

export default RequestCard;
