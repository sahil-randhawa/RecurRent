import React, { useState, useEffect, useLayoutEffect } from 'react';
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

	useLayoutEffect(() => {

		getRequestedProductListings()
		// console.log("messages on load",messages)
	}, [route])

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
				collection(db, "Bookings"),
				where("ownerID", "==", auth.currentUser.uid),
				where("bookingStatus", "==", "Requested")
			);
			const querySnapshot = await getDocs(q);
			const resultsFromFirestore = [];

			const fetchPromises = querySnapshot.docs.map(async (docc) => {
				const currentDoc = docc.data();
				const documentRef = doc(db, "Products", currentDoc.productID);
				const documentRefRenter = doc(db, "userProfiles", currentDoc.renterID);

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
		console.log("Chat", bookingRequestId)
		navigation.navigate("Chat", {
			chatId: bookingRequestId
		})
	}

	// create a notification entry for the requester
	const createRenterNotification = async (renterId, productName, status) => {
		// in the userprofiles collection, get the userprofile document for the owner, add a notification entry to the notifications array

		console.log('.\nCreating Notification for Renter...\n\n ...');


		// const bookingRequestDocRef = doc(db, "Bookings", bookingRequestId);
		// console.log("bookingRequestDocRef : ", JSON.stringify(bookingRequestDocRef, null, 2));
		const renterDocRef = doc(db, "userProfiles", renterId);
		// console.log("renterDocRef : ", JSON.stringify(renterDocRef, null, 2));
		const decision = status ? "Accepted" : "Declined";

		try {
			const newNotification = await runTransaction(
				db,
				async (transaction) => {
					const renterDoc = await transaction.get(renterDocRef);
					if (!renterDoc.exists()) {
						throw "Renter document does not exist!";
					} else {
						transaction.update(renterDocRef, {
							notifications: [
								...renterDoc.data().notifications ? renterDoc.data().notifications : [],
								{
									notificationID: `${renterDoc.data().notifications ? renterDoc.data().notifications.length + 1 : 1}`,
									notificationType: `${decision}! Booking Request`,
									notificationUnreadStatus: true,
									notificationMessage: `Your booking request for \n${productName} has been ${decision}`,
									notificationDate: new Date(),
								},
							],
						});
					}
				}
			);
			console.log("Notification added to user's profile");
		} catch (error) {
			console.log("Error in updating notifications: ", error);
			alert(`Error : ${error}`);
		}
	};

	const declineClicked = (item) => {

		Alert.alert('Decline Request', 'Are you sure you want to decline this request?', [
			{
				text: 'Cancel',
				onPress: () => {
					declineAction(item, "Cancel")
				},
				style: 'cancel'
			},
			{
				text: 'OK',
				onPress: () => {
					declineAction(item, "Ok")
				}
			},], { cancelable: false }
		);
	}

	const declineAction = async (item, actionStatus) => {
		console.log('Decline Action item: ' + JSON.stringify(item, null, 2));
		const idDocRef = doc(db, "Bookings", item.id);
		const productDocRef = doc(db, "Products", item.productId);
		// console.log("update id", JSON.stringify(idDocRef, null, 2));
		// console.log("product update id", JSON.stringify(productDocRef, null, 2));
		try {
			const newStatus = await runTransaction(
				db,
				async (transaction) => {
					const idDoc = await transaction.get(idDocRef);
					const productIdDoc = await transaction.get(productDocRef);
					console.log("productIDDoc", productIdDoc.data().name)
					if (!idDoc.exists() && !productIdDoc.exists()) {
						throw "Document does not exist!";
					} else {
						if (actionStatus == "Ok") {
							transaction.update(idDocRef, {
								bookingStatus: "Decline",
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
							createRenterNotification(idDoc.data().renterID, productIdDoc.data().name, false);
						}
						else if (actionStatus == "Cancel") {
							// Display a toast
							Toast.show({
								type: 'info',
								position: 'bottom',
								text1: 'Action canceled!',
								visibilityTime: 3000,
								autoHide: true,
							});
						}

					}
				}
			);
			getRequestedProductListings()
			console.log("Status Updated to Requested");
		} catch (error) {
			console.log("Error in updation: ", error);
			alert(`Error : ${error}`);
		}
	}

	const confirmClicked = (item) => {

		Alert.alert('Confirm Request', 'Are you sure you want to confirm this request?', [
			{
				text: 'Cancel',
				onPress: () => {
					confirmAction(item, "Cancel")
				},
				style: 'cancel'
			},
			{
				text: 'OK',
				onPress: () => {
					confirmAction(item, "Ok")
				}
			},], { cancelable: false }
		);
	}
	const confirmAction = async (item, actionStatus) => {
		console.log('Confirm Action: ' + JSON.stringify(item, null, 2));
		const durationString = item.duration;
		const parts = durationString.split(" "); // Split the string by space
		const durationNumber = parseInt(parts[0], 10); // Convert the first part to an integer

		const duartionTime = parts[1];

		// Get today's date
		const today = new Date();
		let addingDays = 0

		if (duartionTime == "weeks" || duartionTime == "week") {
			addingDays = durationNumber * 7;

		}
		else if (duartionTime == "months" || duartionTime == "month") {
			addingDays = durationNumber * 30.44;
		}
		else if (duartionTime == "days" || duartionTime == "day") {
			addingDays = durationNumber
		}

		const newAvailableDate = new Date(today);
		newAvailableDate.setDate(today.getDate() + Math.round(addingDays));

		// Format the new date as a string (e.g., YYYY-MM-DD)
		const newAvailableFormatted = newAvailableDate.toISOString().split('T')[0];



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
						if (actionStatus == "Ok") {
							transaction.update(idDocRef, {
								bookingStatus: "Confirm",

							});
							transaction.update(productDocRef, {
								status: "Confirm",
								nextAvailableDate: newAvailableFormatted
							});
							// Display a toast
							Toast.show({
								type: 'success',
								position: 'bottom',
								text1: 'Request Confirm Sucessfully!',
								visibilityTime: 3000,
								autoHide: true,
							});
							createRenterNotification(idDoc.data().renterID, productIdDoc.data().name, true);
						}
						else if (actionStatus == "Cancel") {
							// Display a toast
							Toast.show({
								type: 'info',
								position: 'bottom',
								text1: 'Action canceled!',
								visibilityTime: 3000,
								autoHide: true,
							});
						}

					}
				}
			);
			console.log("Status Updated to Requested");
			getRequestedProductListings()
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
							handleChat={() => { chatClicked(rowData.item.id) }
							}
							handleDecline={() => { declineClicked(rowData.item) }}
							handleConfirm={() => { confirmClicked(rowData.item) }}
						/>}
						contentContainerStyle={{ paddingVertical: 10 }}
						showsVerticalScrollIndicator={false}
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
