import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { Card, IconButton, Button } from "react-native-paper";
import {
	primaryColor,
	lightTheme,
	typography,
	backgroundColor,
} from "../styles/GlobalStyles";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Btn, { secondaryBtnStyle } from "./Button";

const ProductCard = ({ coverUri, title, duration, productId, buttonLabel, onPressAction }) => {
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
			const q = query(collection(db, "userProfiles"), where("email", "==", auth.currentUser.email));
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
			setIsHeartFilled(true)
		} 
		else {
			setIsHeartFilled(false)
		}
	}

	const toggleHeart = async () => {
		// Check if the product is already in the user's favList
		if (user.favlist.includes(String(productId))) {
			// Remove the product from the user's favList
			console.log("Remove");
			removeProductFromArray("userProfiles", auth.currentUser.uid, productId)
		  } else {
			// Add the product to the user's favList
			console.log("Add");
			addProductToArray("userProfiles", auth.currentUser.uid, productId)
		  }
	};

	const addProductToArray = async (collectionName, documentId, newArrayElement) => {
		try {
		  const docRef = doc(db, collectionName, documentId);
	  
		  await updateDoc(docRef, {
			favlist: arrayUnion(newArrayElement), 
		  });
	  
		  console.log('String added to array in Firebase.');
		  fetchFromDB()
		} catch (error) {
		  console.error('Error adding string to array in Firebase:', error);
		}
	  };

	  const removeProductFromArray = async (collectionName, documentId, stringToRemove) => {
		try {
		  const docRef = doc(db, collectionName, documentId);
	  
		  await updateDoc(docRef, {
			favlist: arrayRemove(stringToRemove), 
		  });
	  
		  console.log('String removed from array in Firebase.');
		  fetchFromDB()
		} catch (error) {
		  console.error('Error removing string from array in Firebase:', error);
		}
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
					<Text style={{ fontSize: 14, marginBottom: 20, }}>Duration: {duration}</Text>
				</Card.Content>

				<Card.Actions>
					<Btn
						title={buttonLabel}
						onPress={onPressAction}
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
		height: 400,
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
		fontSize: 18,
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
