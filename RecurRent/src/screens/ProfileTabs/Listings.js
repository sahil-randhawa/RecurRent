import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ActivityIndicator,
	FlatList
} from 'react-native';
import {
	primaryColor,
	secondaryColor,
	textColor,
	backgroundColor,
	typography,
	spacing,
	border,
	lightTheme,
	darkTheme,
} from '../../styles/GlobalStyles';
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
} from '../../components/Button';
import { StatusBar } from 'expo-status-bar';
import UserListingCard from '../../components/UserListingCard';
import { auth, db } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from 'firebase/firestore';

const Listings = ({ navigation }) => {
	const [userListings, setUserListings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUserListings();
	}, []);

	const getUserListings = async () => {
		try {
			const q = query(collection(db, "Products"), where("userID", "==", auth.currentUser.uid));
			const querySnapshot = await getDocs(q);
	  
			const allUserListings = [];
			querySnapshot.forEach((doc) => {
				allUserListings.push(doc.data()); // Push each document's data to the array
			});
	  
			setUserListings(allUserListings); // Set the state with the array of documents
		  } catch (error) {
			console.error("Error fetching data from Firestore:", error);
		}

		try {
		} finally {
			setLoading(false);
		}
	};

	const handlePress = async (item) => {
		//Navigate to ProductDetailsScreen
		try {
			const ownerID = item.userID;
			console.log(ownerID);
			const selectedProductData = {
				item: item,
			};
			const docRef = doc(db, 'userProfiles', ownerID);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log('Document data:', docSnap.data());

				const combinedData = {
					selectedProduct: selectedProductData,
					ownerData: docSnap.data(),
				};
				console.log('combine', combinedData);
				navigation.navigate('ProductDetails', { combinedData: combinedData });
			} else {
				console.log('No such document!');
				const combinedData = {
					selectedProduct: selectedProductData,
					ownerData: {},
				};
				console.log('combine', combinedData);
				navigation.navigate('ProductDetails', { combinedData: combinedData });
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
		<View style={spacing.container}>
			<View style={styles.container}>
				{loading ? (
					<ActivityIndicator
					size="large"
					color={primaryColor}
					style={styles.centerContent}
					/>
				) : userListings.length === 0 ? (
					<View style={styles.centerContent}>
					<Image
						source={require('../../../assets/images/space.png')}
						style={styles.image}
					/>
					<Text style={typography.heading}>
						Let's Turn Your Space into Cash!
					</Text>
					<Text style={typography.bodyHeading}>
						Once you get started, use Your Listings
						to manage all your activities.
					</Text>
					</View>
				) : (
					<FlatList
					data={userListings}
					renderItem={({ item }) => (
						<UserListingCard 
							item={item} 
							handlePress={handlePress}
						/>
					)}
					/>
				)}
			</View>

			<Btn
				title="Create New Listing"
				onPress={() => {
					navigation.navigate('CreateNewListing');
				}}
				mode="contained"
				style={[
					primaryBtnStyle,
					{
						width: '100%',
						alignSelf: 'center',
						marginBottom: 40,
						color: lightTheme.colors.onPrimary,
					},
				]}
			/>

		</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingBottom: 30,
	},
	centerContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 250,
		height: 250,
		marginBottom: 20
	}
});

export default Listings;
