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
import { useIsFocused } from '@react-navigation/native';
import UserListingCard from '../../components/UserListingCard';
import { auth, db } from '../../../firebaseConfig';
import {collection, getDocs, query, where} from 'firebase/firestore';

const Listings = ({ navigation }) => {
	const [userListings, setUserListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			getUserListings();
		}
	  }, [isFocused]);

	const getUserListings = async () => {
		try {
			const q = query(collection(db, "Products"), where("userID", "==", auth.currentUser.uid));
			const querySnapshot = await getDocs(q);
	  
			const allUserListings = [];
			querySnapshot.forEach((doc) => {
				allUserListings.push(doc.data());
			});
	  
			setUserListings(allUserListings);
		  } catch (error) {
			console.error("Error fetching data from Firestore:", error);
		}

		try {
		} finally {
			setLoading(false);
		}
	};

	const handlePress = async (item) => {
		//Navigate to EditListingScreen

		//How to send Document id of the selected product
		try {
			const selectedProductData = {
				item: item,
			};

			const combinedData = {
				selectedProduct: selectedProductData,
			};
			console.log(combinedData)
			navigation.navigate('EditListing', { combinedData: combinedData });
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
					<Text
							style={[
								typography.heading,
								{ textAlign: 'center', marginTop: 20, fontSize: 20},
							]}
						>
						Let's Turn Your Space {'\n'} into Cash!
					</Text>
					<Text
							style={[
								typography.bodyHeading,
								{ textAlign: 'center', marginTop: 10, fontSize: 16, paddingHorizontal: 45, },
							]}
						>
						Once you get started, manage all your activities here.
					</Text>
					</View>
				) : (
					<FlatList
					data={userListings}
					showsVerticalScrollIndicator={false}
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
		width: 150,
		height: 150,
		marginBottom: 20
	}
});

export default Listings;
