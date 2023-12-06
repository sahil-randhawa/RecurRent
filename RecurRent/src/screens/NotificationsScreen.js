import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	Alert,
} from 'react-native';
import { Card } from 'react-native-paper';
import {
	lightTheme,
	secondaryColor,
	typography,
	primaryColor,
	tertiaryColor,
	spacing,
} from '../styles/GlobalStyles';
import { auth, db } from '../../firebaseConfig';
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	runTransaction,
	doc,
	getDoc,
} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import Btn, { primaryBtnStyle, secondaryBtnStyle } from '../components/Button';

const NotificationsScreen = () => {
	const [notificationsList, setNotificationsList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchNotifications();
	}, []);

	const fetchNotifications = async () => {
		console.log('fetching notifications');
		try {
			const docRef = doc(db, 'userProfiles', auth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists) {
				if (docSnap.data().notifications) {
					const notifications = docSnap.data().notifications;
					console.log(JSON.stringify(notifications, null, 2));
					// sort the notifications by date in descending order
					notifications.sort(
						(a, b) => b.notificationDate.toDate() - a.notificationDate.toDate()
					);
					setNotificationsList(notifications);
				} else {
					console.log('No notifications found');
				}
				setLoading(false);
			} else {
				console.log('No such user document!');
			}
		} catch (error) {
			console.log('Error getting document:', error);
		}
	};

	const handleRemove = async (item) => {
		// popup to confirm
		Alert.alert(
			'Delete Notification',
			'Are you sure you want to remove this notification?',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{
					text: 'OK',
					onPress: () => {
						console.log('OK Pressed');
						removeNotification(item);
					},
				},
			],
			{ cancelable: false }
		);
	};

	const removeNotification = async (item) => {
		console.log('removing notification');
		try {
			const docRef = doc(db, 'userProfiles', auth.currentUser.uid);
			await runTransaction(db, async (transaction) => {
				const docSnap = await transaction.get(docRef);
				if (!docSnap.exists()) {
					throw 'Document does not exist!';
				}
				const notifications = docSnap.data().notifications;
				const newNotifications = notifications.filter(
					(notification) => notification.notificationID !== item.notificationID
				);
				transaction.update(docRef, { notifications: newNotifications });
				// sort the notifications by date in descending order
				newNotifications.sort(
					(a, b) => b.notificationDate.toDate() - a.notificationDate.toDate()
				);
				setNotificationsList(newNotifications);
			});
		} catch (error) {
			console.log('Transaction failed: ', error);
		}
	};

	const handleMarkRead = async (item) => {
		console.log('Marking notification as read');
		try {
			const docRef = doc(db, 'userProfiles', auth.currentUser.uid);
			await runTransaction(db, async (transaction) => {
				const docSnap = await transaction.get(docRef);
				if (!docSnap.exists()) {
					throw 'Document does not exist!';
				}
				const notifications = docSnap.data().notifications;
				const newNotifications = notifications.map((notification) => {
					if (notification.notificationID === item.notificationID) {
						notification.notificationUnreadStatus = false;
					}
					return notification;
				});
				transaction.update(docRef, { notifications: newNotifications });
				// sort the notifications by date in descending order
				newNotifications.sort(
					(a, b) => b.notificationDate.toDate() - a.notificationDate.toDate()
				);
				setNotificationsList(newNotifications);
			});
			console.log('Marked as read : ' + JSON.stringify(item, null, 2));
			// Display a toast
			Toast.show({
				type: 'success',
				position: 'bottom',
				text1: 'Notification marked as read.',
				visibilityTime: 3000,
				autoHide: true,
			});
		} catch (error) {
			console.log('Transaction failed: ', error);
		}
	};

	// function to create 3 dummy entries in the notifications array
	// const createDummyEntries = async () => {
	// 	console.log('creating dummy entries');
	// 	try {
	// 		const docRef = doc(db, 'userProfiles', auth.currentUser.uid);
	// 		await runTransaction(db, async (transaction) => {
	// 			const docSnap = await transaction.get(docRef);
	// 			if (!docSnap.exists()) {
	// 				throw "Document does not exist!";
	// 			}
	// 			const notifications = docSnap.data().notifications;
	// 			const newNotifications = [
	// 				{
	// 					notificationID: '1',
	// 					notificationType: 'Booking Request',
	// 					notificationMessage: 'Camping Chair : You have a new booking request.',
	// 					notificationDate: new Date(),
	// 					notificationUnreadStatus: true,
	// 				},
	// 				{
	// 					notificationID: '2',
	// 					notificationType: 'Reminder',
	// 					notificationMessage: 'Your lising renew is due tomorrow : Fan',
	// 					notificationDate: new Date(),
	// 					notificationUnreadStatus: true,
	// 				},
	// 				{
	// 					notificationID: '3',
	// 					notificationType: 'Booking Request',
	// 					notificationMessage: 'Study Table has been booked.',
	// 					notificationDate: new Date(),
	// 					notificationUnreadStatus: true,
	// 				},
	// 				...notifications,
	// 			];
	// 			transaction.update(docRef, { notifications: newNotifications });
	// 			setNotificationsList(newNotifications);
	// 		});
	// 		console.log('Created dummy entries');
	// 		// Display a toast
	// 		Toast.show({
	// 			type: 'success',
	// 			position: 'bottom',
	// 			text1: 'Created dummy entries.',
	// 			visibilityTime: 5000,
	// 			autoHide: true,
	// 		});
	// 	} catch (error) {
	// 		console.log("Transaction failed: ", error);
	// 	}
	// }

	return (
		<>
			<View
				style={[
					spacing.container,
					{
						marginHorizontal: 0,
						paddingHorizontal: 0,
					},
				]}
			>
				{loading ? (
					<ActivityIndicator
						size="large"
						color={primaryColor}
					/>
				) : notificationsList.length === 0 ? (
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Image
							source={require('../../assets/images/notification.png')}
							style={styles.image}
						/>
						<Text
							style={[
								typography.bodyHeading,
								{ textAlign: 'center', marginTop: 30 },
							]}
						>
							We'll notify you when {'\n'}
							something new arrives.
						</Text>
						{/* <Btn
							title="Create Dummy Entries in DB"
							onPress={createDummyEntries}
							mode="text"
							style={[{ textAlign: "center", color: primaryColor }]}
						/> */}
					</View>
				) : (
					<FlatList
						data={notificationsList}
						keyExtractor={(item) => item.notificationID}
						contentContainerStyle={styles.flatListContainer}
						showsVerticalScrollIndicator={false}
						renderItem={({ item }) => (
							<Card style={styles.card}>
								<Card.Content>
									<View style={styles.cardContent}>
										<View style={[styles.cardText,
										{ width: '85%' }
										]}>
											{/* heading */}
											<Text
												style={[
													typography.bodyHeading,
													{ marginBottom: 5 },
													Platform.OS === 'android' && styles.androidHeading,
												]}
											>
												{item.notificationType}
											</Text>

											{/* subheading */}
											<Text
												style={[
													typography.bodyText,
													{ marginBottom: 5 },
													Platform.OS === 'android' && styles.androidSubHeading,
												]}
												numberOfLines={2}
											>
												{item.notificationMessage}
											</Text>

											{/* date */}
											<Text style={typography.caption}>
												{item.notificationDate.toDate().toDateString()}
											</Text>
										</View>

										<View style={{ marginRight: 5 }}>
											{item.notificationUnreadStatus ? (
												<Icon
													name="star"
													color={lightTheme.colors.info}
													size={30}
													onPress={() => handleMarkRead(item)}
												/>
											) : (
												<Icon
													name="minuscircleo"
													color={lightTheme.colors.errorContainer}
													size={30}
													onPress={() => handleRemove(item)}
												/>
											)}
										</View>
									</View>
								</Card.Content>
							</Card>
						)}
					/>
				)}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	flatListContainer: {
		paddingVertical: 10,
	},

	card: {
		maxWidth: '100%',
		margin: 10,
	},

	cardContent: {
		maxWidth: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	cardText: {
		paddingHorizontal: 5,
	},

	androidHeading: {
		fontSize: 16,
	},

	androidSubHeading: {
		fontSize: 12,
	},
	image: {
		width: 100,
		height: 100,
	}
});

export default NotificationsScreen;
