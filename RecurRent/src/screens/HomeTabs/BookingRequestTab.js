import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	Alert,
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
import Toast from 'react-native-toast-message';
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
	getDocFromCache,
	runTransaction,
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
	// const getRequestedProductListings = async () => {
	// 	console.log('user id', auth.currentUser.uid);
	// 	try {
	// 		const q = query(
	// 			collection(db, 'Bookings'),
	// 			where('ownerID', '==', auth.currentUser.uid)
	// 		);
	// 		const querySnapshot = await getDocs(q);
	// 		const resultsFromFirestore = [];

	// 		querySnapshot.forEach(async (docc) => {
	// 			console.log(docc.id, ' => ', docc.data());
	// 			const currentDoc = docc.data();
	// 			console.log(currentDoc.productID);
	// 			const documentRef = doc(db, 'Products', currentDoc.productID);
	// 			const documentRefRenter = doc(db, 'userProfiles', currentDoc.renterID);

	// 			getDoc(documentRefRenter)
	// 				.then((docSnapshotrenter) => {
	// 					if (docSnapshotrenter.exists()) {
	// 						const renter = docSnapshotrenter.data();
	// 						console.log('Requested Renter', renter);
	// 						getDoc(documentRef)
	// 							.then((docSnapshot) => {
	// 								if (docSnapshot.exists()) {
	// 									const documentData = docSnapshot.data();
	// 									console.log('Requested product', documentData);
	// 									const itemToAdd = {
	// 										renterName: renter.name,
	// 										renterEmail: renter.email,
	// 										renterMobileNumber: renter.mobileNumber,
	// 										id: docc.id,
	// 										...docSnapshot.data(),
	// 									};
	// 									console.log('Item to Add', itemToAdd);
	// 									resultsFromFirestore.push(itemToAdd);
	// 								} else {
	// 									console.log('Document does not exist');
	// 								}
	// 							})
	// 							.catch((error) => {
	// 								console.error('Error getting document:', error);
	// 							});
	// 					} else {
	// 						console.log('Renter Document does not exist');
	// 					}
	// 				})
	// 				.catch((error) => {
	// 					console.error('Error getting document:', error);
	// 				});
	// 		});

	// 		console.log('requets for owner', resultsFromFirestore);
	// 		setOwnerRequestsListings(resultsFromFirestore);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// 	try {
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const getRequestedProductListings = async () => {
		try {
		  const q = query(
			collection(db, 'Bookings'),
			where('ownerID', '==', auth.currentUser.uid)
		  );
		  const querySnapshot = await getDocs(q);
		  const resultsFromFirestore = [];
	  
		  const fetchPromises = querySnapshot.docs.map(async (docc) => {
			const currentDoc = docc.data();
			const documentRef = doc(db, 'Products', currentDoc.productID);
			const documentRefRenter = doc(db, 'userProfiles', currentDoc.renterID);
	  
			const [docSnapshot, docSnapshotRenter] = await Promise.all([
			  getDoc(documentRef),
			  getDoc(documentRefRenter),
			]);
	  
			if (docSnapshot.exists() && docSnapshotRenter.exists()) {
			  const renter = docSnapshotRenter.data();
			  const itemToAdd = {
				renterName: renter.name,
				renterEmail: renter.email,
				renterMobileNumber: renter.mobileNumber,
				id: docc.id,
				...docSnapshot.data(),
			  };
			  resultsFromFirestore.push(itemToAdd);
			}
		  });
	  
		  await Promise.all(fetchPromises);
	  
		  setOwnerRequestsListings(resultsFromFirestore);
		} catch (err) {
		  console.log(err);
		} finally {
		  setLoading(false);
		}
	  };
	  

	const chatClicked = (bookingRequestId) => {
		console.log("Chat",bookingRequestId)
		navigation.navigate("Chat",{
			chatId:bookingRequestId
		})
	}

	const declineClicked = (item) =>{
		
		Alert.alert('Decline Request', 'Are you sure you want to decline this request?', [
			{
				text: 'Cancel',
				onPress: () => {
					declineAction(item,"Cancel")
				},
				style: 'cancel'
			},
			{
				text: 'OK', 
				onPress: () => {
					declineAction(item,"Ok")
				}
			},], { cancelable: false }
		);
	}

	const declineAction = async(item,actionStatus) =>{
		console.log('Decline Action: ' + JSON.stringify(item, null, 2));
		const idDocRef = doc(db, "Bookings", item.id);
		const productDocRef = doc(db, "Products", item.productId);
		console.log("update id", JSON.stringify(idDocRef, null, 2));
		console.log(" product update id", JSON.stringify(productDocRef, null, 2));
		try {
			const newStatus = await runTransaction(
				db,
				async (transaction) => {
					const idDoc = await transaction.get(idDocRef);
					const productIdDoc = await transaction.get(productDocRef);
					if (!idDoc.exists() && !productIdDoc.exists()) {
						throw "Document does not exist!";
					} else {
						if(actionStatus == "Ok"){
							transaction.update(idDocRef, {
								status: "Decline",
							});
							transaction.update(productDocRef, {
								status: "Available",
							});
							// Display a toast
							Toast.show({
								type: 'success',
								position: 'bottom',
								text1: 'Request Declined Sucessfully!',
								visibilityTime: 3000,
								autoHide: true,
							});
						}
						else if(actionStatus == "Cancel"){
							// Display a toast
							Toast.show({
								type: 'success',
								position: 'bottom',
								text1: 'No action has been performed!',
								visibilityTime: 3000,
								autoHide: true,
							});
						}
					}
				}
			);
			console.log("Status Updated to Requested");
		} catch (error) {
			console.log("Error in updation: ", error);
			alert(`Error : ${error}`);
		}
	}

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
						renderItem={(rowData) => <RequestCard rowData={rowData} 
						handleChat={()=>
							{chatClicked(rowData.item.id)}
						}
						handleDecline={()=>{declineClicked(rowData.item)}}
							/>}
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
