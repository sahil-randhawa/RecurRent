import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	Image,
} from 'react-native';
import {
	primaryColor,
	secondaryColor,
	tertiaryColor,
	textColor,
	backgroundColor,
	typography,
	spacing,
	border,
	lightTheme,
	darkTheme,
	formStyles,
} from '../../styles/GlobalStyles';
import WishlistCard from '../../components/WishlistCard';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../../../firebaseConfig';
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	updateDoc,
	arrayRemove,
} from 'firebase/firestore';

const Wishlist = ({ navigation }) => {
	const [user, setUser] = useState({});
	const [wishList, setWishList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchFromDB();
	}, []);

	useEffect(() => {
		if (user.favlist) {
			getFavList();
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

	const getFavList = async () => {
		const resultsFromFirestore = [];
		await Promise.all(
			user.favlist.map(async (value) => {
				try {
					const docRef = doc(db, 'Products', value);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						const data = docSnap.data();
						const documentId = docSnap.id; // Get the document ID
						const itemWithId = { ...data, id: documentId }; // Include the ID in the item object
						console.log(
							'Document data :\n',
							JSON.stringify(itemWithId, null, 4)
						);

						resultsFromFirestore.push(itemWithId);
					} else {
						console.log('Document does not exist.');
					}
				} catch (error) {
					console.error('Error fetching document:', error);
				}
			})
		);
		setWishList(resultsFromFirestore);

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
				// docSnap.data() will be undefined in this case
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

	const handleRemove = async (item) => {
		//Remove the product from favlist array in Firebase
		try {
			const docRef = doc(db, 'userProfiles', auth.currentUser.uid);

			await updateDoc(docRef, {
				favlist: arrayRemove(item.id),
			});

			console.log('String removed from array in Firebase.');
			fetchFromDB();
		} catch (error) {
			console.error('Error removing string from array in Firebase:', error);
		}
	};

	return (
		<>
			<View style={spacing.container}>
				{loading ? (
					<ActivityIndicator
						size="large"
						color={primaryColor}
					/>
				) : wishList.length === 0 ? (
					<View style={styles.emptyWishlist}>
						<Image
							source={require('../../../assets/images/no-wishlist.png')} 
							style={styles.image}
						/>
						<Text style={[typography.bodyHeading, { textAlign: 'center' }]}>
							View all your favorite items here{'\n'} by adding to your
							Wishlist!
						</Text>
					</View>
				) : (
					<View style={styles.container}>
						<SwipeListView
							data={wishList}
							renderItem={({ item, index }) => (
								<View style={index === wishList.length - 1 && styles.lastItem}>
									<WishlistCard
										item={item}
										handlePress={handlePress}
										handleRemove={handleRemove}
									/>
								</View>
							)}
							renderHiddenItem={({ item }) => (
								<View style={styles.rowBack}>
									<Icon
										name="trash-outline"
										color={lightTheme.colors.error}
										size={30}
										onPress={() => handleRemove(item)}
									/>
								</View>
							)}
							rightOpenValue={-75}
							leftOpenValue={0}
							disableLeftSwipe={false}
							disableRightSwipe={false}
						/>
					</View>
				)}
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
	emptyWishlist: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 200,
		height: 200,
	},
	lastItem: {
		marginBottom: 20,
	},
	rowBack: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
		padding: 20,
	},
});

export default Wishlist;
