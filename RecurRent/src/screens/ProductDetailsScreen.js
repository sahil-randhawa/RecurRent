import React, { useState, useEffect } from "react";
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
} from "../styles/GlobalStyles";
import { Avatar, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import Btn, { primaryBtnStyle } from "../components/Button";
import { auth, db } from "../../firebaseConfig";
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	runTransaction,
	doc,
} from "firebase/firestore";

const ProductDetailsScreen = ({ navigation, route }) => {

	useEffect(() => {
		console.log("Product Details Screen:");
		console.log("selectedProduct: ", selectedProduct);
		console.log("ownerDetails: ", ownerDetails);
	}, []);

	//Route Data
	const [selectedProduct, setSelectedProduct] = useState(
		route.params.combinedData.selectedProduct
	);

	const [ownerDetails, setOwnerDetails] = useState(
		route.params.combinedData.ownerData
	);

	const requestForBookingClicked = async () => {
		// alert("REquest for booking clicked")

		const firstCondition = where("rentterID", "==", auth.currentUser.uid);
		const secondCondition = where("productID", "==", selectedProduct.item.id);
		const thirdCondition = where("ownerID", "==", selectedProduct.item.userID);

		// Use statusMap to get the icon and color
		const { icon, color } = statusMap[status] || {
			icon: "checkmark-circle-outline",
			color: "green",
		};

		const q = query(
			collection(db, "Bookings"),
			firstCondition,
			secondCondition,
			thirdCondition
		);
		getDocs(q)
			.then(async (querySnapshot) => {
				const count = querySnapshot.size;
				if (count > 0) {
					alert("You already requested for this listing!!");
					return;
				} else {
					try {
						const bookingRequestToInsert = {
							productID: selectedProduct.item.id,
							renterID: auth.currentUser.uid,
							ownerID: selectedProduct.item.userID,
							duration: selectedProduct.item.duration,
							bookingStatus: "Requested",
						};
						// check if there is already a booking request with same productid, ownerid, renterid
						const q = query(
							collection(db, "Bookings"),
							where("productID", "==", selectedProduct.item.id),
							where("ownerID", "==", selectedProduct.item.userID),
							where("renterID", "==", auth.currentUser.uid)
						);
						const querySnapshot = await getDocs(q);
						if (!querySnapshot.empty) {
							alert(
								"You already requested for this Product!\n Requested duration: " +
								querySnapshot.docs[0].data().duration
							);
							return;
						}
						console.log("Booking Request to insert", bookingRequestToInsert);
						const docRef = await addDoc(
							collection(db, "Bookings"),
							bookingRequestToInsert
						);
						const idDocRef = doc(db, "Products", selectedProduct.item.id);
						console.log("update id", idDocRef);
						try {
							const newStatus = await runTransaction(
								db,
								async (transaction) => {
									const idDoc = await transaction.get(idDocRef);
									if (!idDoc.exists()) {
										throw "Document does not exist!";
									} else {
										transaction.update(idDocRef, {
											status: "Requested for Booking",
										});
									}
								}
							);
							console.log("Status Updated to Requested");
						} catch (error) {
							console.log("Error in updation: ", error);
							alert(`Error : ${error}`);
						}
						console.log(
							"Booking Request sent successfully with ID: ",
							docRef.id
						);
						alert("Booking Request sent successfully!");
					} catch (error) {
						console.log("Error: ", error);
						alert(`Error : ${error}`);
					}
				}
			})
			.catch((error) => {
				console.error("Error getting documents: ", error);
			});
	};

	// Dynamic mapping of status to icon and color
	const statusMap = {
		Available: {
			icon: "ellipsis-horizontal-circle-outline",
			color: primaryColor,
		},
		Requested: {
			icon: "information-circle-outline",
			color: lightTheme.colors.info,
		},
		"Requested for Booking": {
			icon: "information-circle-outline",
			color: lightTheme.colors.info,
		},
		"Not Available": {
			icon: "close-circle-outline",
			color: lightTheme.colors.error,
		},
		Approved: {
			icon: "checkmark-circle-outline",
			color: lightTheme.colors.success,
		},
	};

	const status = selectedProduct.item.status;

	return (
		<>
			<ScrollView>
				<View style={styles.mainContainer}>
					<View style={{
						width: "100%",
					}}>
						<Image
							source={{ uri: selectedProduct.item["productPhoto"] }}
							style={{
								height: 300,
								resizeMode: "cover",
							}}
						/>
					</View>
					<View style={{
						width: "100%",
					}}>
						<View style={styles.productDetails}>
							<Text style={[typography.heading, { color: textColor }]}>
								{selectedProduct.item.name}
							</Text>
							<Text
								style={[
									typography.body,
									{ marginBottom: 10, color: textColor },
								]}
							>
								{selectedProduct.item.description}
							</Text>

							<View>
								<View style={styles.productInfo}>
									<Icon
										name="time-outline"
										size={24}
										color={primaryColor}
										style={{ marginRight: 8 }}
									/>
									<Text
										style={[typography.bodyHeading, { color: primaryColor }]}
									>
										Duration : <Text style={[typography.body, { color: textColor }]}>
											{selectedProduct.item.duration}
										</Text>
									</Text>
								</View>
							</View>

							<View>
								<View style={styles.productInfo}>
									<Icon
										name="cash-outline"
										size={24}
										color={primaryColor}
										style={{ marginRight: 8 }}
									/>
									<Text
										style={[typography.bodyHeading, { color: primaryColor }]}
									>
										Price : <Text style={[typography.body, { color: textColor }]}>
											C${selectedProduct.item.price}
										</Text>
									</Text>
								</View>
							</View>

							<View>
								<View style={styles.productInfo}>
									{statusMap[status] ? (
										<Icon
											name={statusMap[status].icon}
											size={24}
											color={statusMap[status].color}
											style={{ marginRight: 8 }}
										/>
									) : null}
									<Text
										style={[typography.bodyHeading, { color: primaryColor }]}
									>
										Status : <Text style={[typography.body, { color: textColor }]}>
											{selectedProduct.item.status}
										</Text>
									</Text>
								</View>
							</View>



							{/* DON'T DELETE THIS */}

							{/* <View>
								<View style={styles.productInfo}>
									<Icon
										name="ellipsis-horizontal-circle-outline"
										size={24}
										color={primaryColor}
										style={{ marginRight: 8 }}
									/>
									<Text
										style={[typography.bodyHeading, { color: primaryColor }]}
									>
										Status :
										<Text style={[typography.body, { color: textColor }]}>
											{selectedProduct.item.status}
										</Text>
									</Text>
								</View>
							</View> */}

							<View>
								<View style={styles.productInfo}>
									<Icon
										name="location-outline"
										size={24}
										color={primaryColor}
										style={{ marginRight: 8 }}
									/>
									<Text
										style={[typography.bodyHeading, { color: primaryColor }]}
									>
										Pickup Address : <Text style={[typography.body, { color: textColor }]}>
											{selectedProduct.item.pickUpAddress}
										</Text>
									</Text>
								</View>
							</View>
						</View>

						<Divider />

						<View
							style={[styles.ownerDetails, { justifyContent: "flex-start" }]}
						>
							<Text style={[typography.subheading, { color: textColor }]}>
								Owner Information
							</Text>

							<View style={styles.ownerTab}>
								<View>
									<Avatar.Image
										size={50}
										source={{ uri: "https://i.pravatar.cc/300" }}
									/>
								</View>
								<View style={styles.ownerTxtContainer}>
									<Text style={[typography.bodyHeading, { marginBottom: 0 }]}>
										{ownerDetails.name}
									</Text>
									<Text style={typography.caption}>{ownerDetails.email}</Text>
								</View>
							</View>

							{/* <Text
								style={[
									typography.body,
									{ marginBottom: 10, color: primaryColor },
								]}
							>
								Name :
								<Text
									style={[
										typography.body,
										{ marginBottom: 10, color: textColor },
									]}
								>
									{ownerDetails.name}
								</Text>
							</Text>
							<Text
								style={[
									typography.body,
									{ marginBottom: 10, color: primaryColor },
								]}
							>
								Email Address :
								<Text
									style={[
										typography.body,
										{ marginBottom: 10, color: textColor },
									]}
								>
									{ownerDetails.email}
								</Text>
							</Text>
							<Text
								style={[
									typography.body,
									{ marginBottom: 10, color: primaryColor },
								]}
							>
								Contact Number :
								<Text
									style={[
										typography.body,
										{ marginBottom: 10, color: textColor },
									]}
								>
									{ownerDetails.mobileNumber}
								</Text>
							</Text> */}
						</View>
					</View>

					<Btn
						title="Request For Booking"
						onPress={requestForBookingClicked}
						mode="contained"
						style={[
							primaryBtnStyle,
							{
								textAlign: "center",
								margin: 30,
							},
						]}
					/>
				</View>
				{/* <View>
					<Text>Details page: {selectedProduct.name}</Text>
				</View> */}
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "space-evenly",
		alignItems: "center",
		// paddingHorizontal: 20,
		backgroundColor: backgroundColor,
	},

	productDetails: {
		paddingVertical: 15,
		paddingHorizontal: 20,
	},

	productInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},

	ownerDetails: {
		paddingTop: 15,
		paddingHorizontal: 20,
	},

	ownerTab: {
		flexDirection: "row",
		alignItems: "center",
	},

	ownerTxtContainer: {
		paddingLeft: 10,
	},
});
export default ProductDetailsScreen;
