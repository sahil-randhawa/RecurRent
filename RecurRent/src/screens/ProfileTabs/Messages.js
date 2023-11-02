import React, { useState, useEffect } from "react";
import { Card } from 'react-native-paper';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	FlatList,
	ScrollView,
	ActivityIndicator,
} from "react-native";
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
	tertiaryColor
} from "../../styles/GlobalStyles";
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
} from "../../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from "firebase/firestore";

const Messages = ({ navigation,route }) => {

	const [userRequestListings, setUserRequestListings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUserListings();
	}, []);


	
	const getUserListings = async () => {
		try {
		  const q = query(
			collection(db, "Bookings"),
			where("renterID", "==", auth.currentUser.uid),
			where("bookingStatus", "==", "Requested")
		  );
		  const querySnapshot = await getDocs(q);
	  
		  const allUserRequestListings = [];
		  for (const docr of querySnapshot.docs) {
			const docData = docr.data();
			console.log("Product data:", docr.id);
	  
			try {
			  const productDocRef = doc(db, "Products", docData.productID);
			  const productDoc = await getDoc(productDocRef);
			  console.log("Booking Id:", docr.id);
	  
			  if (productDoc.exists()) {
				const productData = productDoc.data();
	  
				const itemWithBookingID = {
				  id: docr.id,
				  ...productData,
				};
				console.log("Document data:", itemWithBookingID);
				allUserRequestListings.push(itemWithBookingID);
			  } else {
				console.log("No such document for product ID:", docData.productID);
			  }
			} catch (error) {
			  console.error("Error getting product document:", error);
			}
		  }
	  
		  setUserRequestListings(allUserRequestListings);
		} catch (error) {
		  console.error("Error fetching data from Firestore:", error);
		} finally {
		  setLoading(false);
		}
	  };
	  
	const chatClicked = (bookingRequestId) => {
		console.log("Chat",bookingRequestId)
		// alert(bookingRequestId)
		navigation.navigate("Chat",{
			chatId:bookingRequestId
		})
	}

	return (
		<>
			
			<View style={spacing.container}>
				{loading ? (
					<ActivityIndicator
						size="large"
						color={primaryColor}
					/>
				) : userRequestListings.length === 0 ? (
					<View style={styles.emptyWishlist}>
						<Image
							source={require('../../../assets/images/noMessage.png')}
							style={styles.image}
						/>
						<Text style={[typography.bodyHeading, { textAlign: 'center' }]}>
							View all your requests here{'\n'} by requesting Products!
						</Text>
					</View>
				) : (
					<View style={styles.container}>
						<SwipeListView
							data={userRequestListings}
							renderItem={({ item, index }) => (
								<View style={index === userRequestListings.length - 1 && styles.lastItem}>
									<Card style={styles.card}>
									<Card.Content style={{ flexDirection: 'column' }}>
										<View style={{ flexDirection: 'row' }}>
											<Image
												source={{ uri: item['productPhoto'] }}
												style={styles.profileImage}
											/>
											<View style={{ flex: 1 }}>
												<Card.Title
													title={item.name}
													titleNumberOfLines={2}
													titleStyle={[typography.bodyHeading, { color: secondaryColor }]}
													style={{ marginLeft: 0 }}
													subtitle={item.pickUpAddress}
													subtitleNumberOfLines={2}
													subtitleStyle={[
														typography.caption,
														{ marginTop: 5, color: tertiaryColor },
													]}
							
												/>
												<Card.Content>
													<Text style={[typography.body, styles.text]}>
														Status: {item.status}
													</Text>
													<Text style={[typography.captionHeading, styles.text]}>
														Price: CAD {item.price}
													</Text>
												</Card.Content>
												
											</View>
										</View>

										<View style={styles.buttonContainer}>
										<TouchableOpacity 
											style={{ 
													// flex: 1,
													textAlign: 'center',
													// marginTop: 10,
													alignContent:'center',
													paddingVertical: 10, 
													padding:10
													}}
													onPress={()=>{chatClicked(item.id)}}>
												<Icon name="chatbubbles" size={30} style={{color: primaryColor,}} /> 
											</TouchableOpacity>
											
											
										</View>
									</Card.Content>
								</Card>
								</View>
							)}
							renderHiddenItem={({ item }) => (
								<View style={styles.rowBack}>
									<Icon
										name="trash-outline"
										color={lightTheme.colors.error}
										size={30}
										onPress={() => alert("Remove")}
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
	image: {
		width: 100,
		height: 100,
	},
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

	lastItem: {
		marginBottom: 20,
	},
	rowBack: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
		padding: 20,
	},
	card: {
		marginTop: 15,
		borderRadius: 8,
		backgroundColor: lightTheme.colors.onPrimary,
		marginHorizontal: 2,
	},

	profileImage: {
		width: 120,
		borderRadius: 5,
		height:120,
	},

	textContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 5,
	},

	buttonContainer: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		// marginTop: 15,
	},
});

export default Messages;


