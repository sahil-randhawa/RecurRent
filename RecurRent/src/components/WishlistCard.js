import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import {
	lightTheme,
	secondaryColor,
	typography,
	primaryColor,
	tertiaryColor,
} from '../styles/GlobalStyles';

const WishlistCard = ({ item, handlePress, handleRemove }) => {
	return (
		<TouchableOpacity onPress={() => handlePress(item)}>
			<Card style={styles.card}>
				<Card.Content style={{ flexDirection: 'row' }}>
					<Image
						source={{ uri: item.productPhoto }}
						style={styles.image}
					/>
					<View style={{ flex: 1 }}>
						<Card.Title
							title={item.name}
							titleNumberOfLines={2}
							titleStyle={[typography.bodyHeading, { color: secondaryColor }, Platform.OS === 'android' && styles.androidTitle]}
							subtitle={item.pickUpAddress}
							subtitleNumberOfLines={2}
							subtitleStyle={[
								typography.caption,
								{ marginTop: 5, color: tertiaryColor },
								Platform.OS === 'android' && styles.androidSubTitle
							]}
							style={{ marginLeft: 0 }}
						/>
						<Card.Content>
							<Text style={[typography.body, styles.text, Platform.OS === 'android' && styles.androidSubTitle]}>
								Status: {item.status}
							</Text>
							<Text style={[typography.captionHeading, styles.text]}>
								Price: CAD {item.price}
							</Text>
						</Card.Content>
					</View>
				</Card.Content>
			</Card>
		</TouchableOpacity>
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
		width: 100,
		borderRadius: 5,
	},

	androidTitle: {
		fontSize: 16,
	},

	androidSubTitle: {
		fontSize: 12,
	},

	text: {
		fontSize: 14,
		marginTop: 5,
	},
});

export default WishlistCard;
