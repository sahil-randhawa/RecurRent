import * as React from "react";
import { View, Text, Image } from "react-native";
import { Card, IconButton, Button } from "react-native-paper";
import { primaryColor, lightTheme, typography } from "../styles/GlobalStyles";
import Icon from "react-native-vector-icons/Ionicons";

const ProductCard = ({ coverUri, title, duration, buttonLabel }) => {
	return (
		<>
			<Card style={styles.card}>
				<Card.Cover source={{ uri: coverUri }} />

				<View style={{ position: "absolute", top: 10, right: 10 }}>
					<IconButton
						icon={({ color, size }) => (
							<Icon name="heart-outline" size={size} color={color} />
						)}
						onPress={() => {}}
						color={primaryColor} 
						size={28} 
					/>
				</View>

				<Card.Title
					title={title}
					titleStyle={[typography.heading, styles.title]}
					titleNumberOfLines={2} 
				/>

				<Card.Content>
					<Text style={{ fontSize: 16 }}>Duration: {duration}</Text>
				</Card.Content>

				<Card.Actions>
					<Button onPress={() => {}}>{buttonLabel}</Button>
				</Card.Actions>
			</Card>
		</>
	);
};

const styles = {
	card: {
		width: 300, // Customize the width as needed
		height: 400, // Customize the height as needed
		margin: 10,
		borderRadius: 10,
		elevation: 5, // Adds shadow
	},
	cover: {
		height: "70%", // Adjust the cover height as needed
	},
	heartIconContainer: {
		position: "absolute",
		top: 10,
		right: 10,
	},
	heartIcon: {
		backgroundColor: "white", // Customize the background color
		borderRadius: 50, // Make it circular
	},
	title: {
		fontSize: 20,
		paddingTop: 20,
	},
	button: {
		marginTop: 10,
	},
};

export default ProductCard;
