import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	FlatList,
	ScrollView,
	Image,
	Pressable,
	ActivityIndicator,
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
	getDocFromCache,
} from 'firebase/firestore';
import RequestCard from '../../components/RequestCard';

const BookingRequestTab = ({ navigation, route }) => {
	useEffect(() => {
		getRequestedProductListings();
	}, []);

	const [ownerRequestsListings, setOwnerRequestsListings] = useState([]);
	// const [ownerInfo, setOwnerInfo] = useState()
	// const [renterInfo, setRenterInfo] = useState()
	const [loading, setLoading] = useState(true);
	const getRequestedProductListings = async () => {
		console.log('user id', auth.currentUser.uid);
		try {
			const q = query(
				collection(db, 'Bookings'),
				where('ownerID', '==', auth.currentUser.uid)
			);
			const querySnapshot = await getDocs(q);
			const resultsFromFirestore = [];

			querySnapshot.forEach(async (docc) => {
				console.log(docc.id, ' => ', docc.data());
				const currentDoc = docc.data();
				console.log(currentDoc.productID);
				const documentRef = doc(db, 'Products', currentDoc.productID);
				const documentRefRenter = doc(db, 'userProfiles', currentDoc.renterID);

				getDoc(documentRefRenter)
					.then((docSnapshotrenter) => {
						if (docSnapshotrenter.exists()) {
							const renter = docSnapshotrenter.data();
							console.log('Requested Renter', renter);
							getDoc(documentRef)
								.then((docSnapshot) => {
									if (docSnapshot.exists()) {
										const documentData = docSnapshot.data();
										console.log('Requested product', documentData);
										const itemToAdd = {
											renterName: renter.name,
											renterEmail: renter.email,
											renterMobileNumber: renter.mobileNumber,
											id: docc.id,
											...docSnapshot.data(),
										};
										console.log('Item to Add', itemToAdd);
										resultsFromFirestore.push(itemToAdd);
									} else {
										console.log('Document does not exist');
									}
								})
								.catch((error) => {
									console.error('Error getting document:', error);
								});
						} else {
							console.log('Renter Document does not exist');
						}
					})
					.catch((error) => {
						console.error('Error getting document:', error);
					});
			});

			console.log('requets for owner', resultsFromFirestore);
			setOwnerRequestsListings(resultsFromFirestore);
		} catch (err) {
			console.log(err);
		}
		try {
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={spacing.container}>
			{loading ? (
				<ActivityIndicator
					size="large"
					color={primaryColor}
				/>
			) : (
				<View style={styles.listContainer}>
					<FlatList
						data={ownerRequestsListings}
						renderItem={(rowData) => <RequestCard rowData={rowData} />}
						contentContainerStyle={{ paddingVertical: 10 }}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	listContainer: {
		width: '100%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingBottom: 30,
	},
});
export default BookingRequestTab;
