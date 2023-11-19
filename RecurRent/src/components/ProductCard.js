import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, IconButton, Button } from 'react-native-paper';
import {
	primaryColor,
	lightTheme,
	typography,
	backgroundColor,
} from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../../firebaseConfig';
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from 'firebase/firestore';
import Btn, { secondaryBtnStyle } from './Button';
import Toast from 'react-native-toast-message';

const ProductCard = ({
	coverUri,
	title,
	price,
	duration,
	productId,
	buttonLabel,
	onPressAction,
}) => {
	const [isHeartFilled, setIsHeartFilled] = useState(false);
	const [user, setUser] = useState({});

	useEffect(() => {
		fetchFromDB();
	}, []);

	useEffect(() => {
		// Check if the product is in the user's favlist whenever user data changes
		if (user.favlist) {
			isInFavList();
		}
	}, [user]);

	const fetchFromDB = async () => {
		try {
			const q = query(
				collection(db, 'userProfiles'),
				where('email', '==', auth.currentUser.email)
			);
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				setUser(doc.data());
			});
		} catch (error) {
			console.log(error);
		}
	};

	const isInFavList = () => {
		if (user.favlist.includes(String(productId))) {
			setIsHeartFilled(true);
		} else {
			setIsHeartFilled(false);
		}
	};

	const toggleHeart = async () => {
		// Check if the product is already in the user's favList
		if (user.favlist.includes(String(productId))) {
			// Remove the product from the user's favList
			removeProductFromArray('userProfiles', auth.currentUser.uid, productId);
		} else {
			// Add the product to the user's favList
			addProductToArray('userProfiles', auth.currentUser.uid, productId);
		}
	};

	const addProductToArray = async (
		collectionName,
		documentId,
		newArrayElement
	) => {
		try {
			const docRef = doc(db, collectionName, documentId);

			await updateDoc(docRef, {
				favlist: arrayUnion(newArrayElement),
			});

			console.log('String added to array in Firebase.');
			fetchFromDB();
			Toast.show({
				type: 'success',
				position: 'bottom',
				text1: 'Added to Favorites!',
				visibilityTime: 3000,
				autoHide: true,
			});
		} catch (error) {
			console.error('Error adding string to array in Firebase:', error);
		}
	};

	const removeProductFromArray = async (
		collectionName,
		documentId,
		stringToRemove
	) => {
		try {
			const docRef = doc(db, collectionName, documentId);

			await updateDoc(docRef, {
				favlist: arrayRemove(stringToRemove),
			});

			console.log('String removed from array in Firebase.');
			fetchFromDB();
			Toast.show({
				type: 'success',
				position: 'bottom',
				text1: 'Removed from Favorites!',
				visibilityTime: 3000,
				autoHide: true,
			});
		} catch (error) {
			console.error('Error removing string from array in Firebase:', error);
		}
	};

	return (
		<>
			<Card
				style={[styles.card, Platform.OS === 'android' && styles.androidCard]}
			>
				<Card.Cover
					source={{ uri: coverUri }}
					style={[
						styles.cover,
						Platform.OS === 'android' && styles.androidCover,
					]}
				/>

				<Card.Title
					title={title}
					titleStyle={[
						typography.heading,
						styles.title,
						Platform.OS === 'android' && styles.androidTitle,
						{},
					]}
					titleNumberOfLines={3}
					right={(props) => (
						<IconButton
							{...props}
							icon={({ color, size }) => (
								<Icon
									name={isHeartFilled ? 'heart' : 'heart-outline'}
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

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginBottom: 10,
					}}
				>
					<Card.Content>
						<Text style={[typography.bodyHeading, { fontSize: 14 }]}>
							Price: C${price}
						</Text>
					</Card.Content>

					<Card.Content>
						<Text style={[typography.bodyHeading, { fontSize: 14 }]}>
							Duration: {duration}
						</Text>
					</Card.Content>
				</View>

				<Card.Actions>
					<Btn
						title={buttonLabel}
						onPress={onPressAction}
						mode="outlined"
						style={[
							secondaryBtnStyle,
							styles.button,
							Platform.OS === 'android' && styles.androidButton,
						]}
					/>
				</Card.Actions>
			</Card>
		</>
	);
};

const styles = {
	card: {
		width: 350,
		height: 350,
		marginTop: 20,
		marginRight: 10,
		borderRadius: 10,
		backgroundColor: lightTheme.colors.onPrimary,
		padding: 10,
	},

	androidCard: {
		width: 370,
		height: 370,
	},

	cover: {
		height: '50%',
	},

	androidCover: {
		height: '50%',
	},

	heartIcon: {
		backgroundColor: lightTheme.colors.primaryContainer,
		borderRadius: 50,
		marginRight: 10,
	},

	title: {
		margin: 0,
		fontSize: 18,
		paddingTop: 15,
		marginBottom: 0,
	},

	androidTitle: {
		fontSize: 16,
	},

	button: {
		flex: 1,
		textAlign: 'center',
		paddingVertical: 5,
	},

	androidButton: {
		textAlign: 'center',
		paddingVertical: 2,
		marginBottom: 10,
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
