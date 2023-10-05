import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { Card, IconButton, Button } from "react-native-paper";
import {
	primaryColor,
	lightTheme,
	typography,
	backgroundColor,
} from "../styles/GlobalStyles";
import Icon from "react-native-vector-icons/Ionicons";
import Btn, { secondaryBtnStyle } from "./Button";

const ProductCard = ({ coverUri, title, duration, buttonLabel, onPress }) => {
	const [isHeartFilled, setIsHeartFilled] = useState(false);

	const toggleHeart = () => {
		setIsHeartFilled(!isHeartFilled);
	};

	return (
		<>
			<Card style={styles.card}>
				<Card.Cover source={{ uri: coverUri }} />

				<Card.Title
					title={title}
					titleStyle={[typography.heading, styles.title]}
					titleNumberOfLines={3}
					right={(props) => (
						<IconButton
							{...props}
							icon={({ color, size }) => (
								<Icon
									name={isHeartFilled ? "heart" : "heart-outline"}
									size={size}
									iconColor={color}
								/>
							)}
							onPress={toggleHeart}
							color={primaryColor}
							size={24}
							style={styles.heartIcon}
						/>
					)}
				/>

				<Card.Content>
					<Text style={{ fontSize: 16, marginBottom: 20, }}>Duration: {duration}</Text>
				</Card.Content>

				<Card.Actions>
					<Btn
						title={buttonLabel}
						onPress={onPress}
						mode="outlined"
						style={[secondaryBtnStyle, styles.button]}
					/>
				</Card.Actions>
			</Card>
		</>
	);
};

const styles = {
	card: {
		width: 300,
		height: 450,
		marginTop: 20,
		marginRight: 10,
		borderRadius: 10,
		backgroundColor: lightTheme.colors.onPrimary,
		padding: 10,
	},
	cover: {
		height: "60%", 
	},

	heartIcon: {
		backgroundColor: lightTheme.colors.primaryContainer,
		borderRadius: 50,
		marginRight: 10,
	},
	title: {
		fontSize: 20,
		paddingTop: 20,
	},

	button: {
		flex: 1,
		textAlign: "center",
		paddingVertical: 5,
	},
};

export default ProductCard;

{
	/* <View style={{ position: "absolute", top: 10, right: 10 }}>
					<IconButton
						icon={({ color, size }) => (
							<Icon
								name={isHeartFilled ? "heart" : "heart-outline"}
								size={size}
								iconColor={color}
							/>
						)}
						onPress={toggleHeart}
						color={primaryColor} // You can customize the color
						size={24} // You can customize the size
						style={styles.heartIcon}
					/>
				</View> */
}
