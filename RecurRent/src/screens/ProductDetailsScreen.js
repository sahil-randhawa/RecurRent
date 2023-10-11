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
import Btn, { primaryBtnStyle } from "../components/Button";
import { auth, db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, query, where, runTransaction, doc } from "firebase/firestore";
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
		const q = query(collection(db, "Bookings"), firstCondition, secondCondition, thirdCondition);
		getDocs(q)
			.then(async (querySnapshot) => {
				const count = querySnapshot.size;
				if (count > 0) {
					alert("You alredy Requested for this listing!!")
					return
				}
				else {
					try {
						const bookingRequestToInsert = {
							productID: selectedProduct.item.id,
							renterID: auth.currentUser.uid,
							ownerID: selectedProduct.item.userID,
							duration: selectedProduct.item.duration,
							bookingStatus: "Requested",
						};
						// check if there is already a booking request with same productid, ownerid, renterid
						const q = query(collection(db, "Bookings"), where("productID", "==", selectedProduct.item.id), where("ownerID", "==", selectedProduct.item.userID), where("renterID", "==", auth.currentUser.uid));
						const querySnapshot = await getDocs(q);
						if (!querySnapshot.empty) {
							alert("You alredy Requested for this Product!\n Requested duration: " + querySnapshot.docs[0].data().duration);
							return;
						}
						console.log("Booking Request to insert", bookingRequestToInsert);
						const docRef = await addDoc(collection(db, "Bookings"), bookingRequestToInsert);
						const idDocRef = doc(db, "Products", selectedProduct.item.id);
						console.log("update id", idDocRef)
						try {
							const newStatus = await runTransaction(db, async (transaction) => {
								const idDoc = await transaction.get(idDocRef);
								if (!idDoc.exists()) {
									throw "Document does not exist!";
								}
								else {
									transaction.update(idDocRef, { status: "Requested for Booking" });
								}
							});
							console.log("Status Updated to Requested");
						} catch (error) {
							console.log("Error in updation: ", error);
							alert(`Error : ${error}`);
						}
						console.log("Booking Request sent successfully with ID: ", docRef.id);
						alert("Booking Request sent successfully!");
					} catch (error) {
						console.log("Error: ", error);
						alert(`Error : ${error}`);
					}
				}
			})
			.catch((error) => {
				console.error('Error getting documents: ', error);
			});
	}

	return (
		<>
			<ScrollView>
				<View style={[spacing.container, { justifyContent: "space-evenly" }]}>
					<View style={{ paddingVertical: 10, }}>
						<Image
							source={{ uri: selectedProduct.item["productPhoto"] }}
							style={{ width: 300, height: 300, }}
						/>
					</View>
					<View>
						<Text
							style={[typography.title, { marginBottom: 10, color: textColor }]}
						>
							{selectedProduct.item.name}
						</Text>
						<Text
							style={[typography.body, { marginBottom: 10, color: textColor }]}
						>
							{selectedProduct.item.description}
						</Text>
						<Text
							style={[
								typography.body,
								{ marginBottom: 10, color: primaryColor },
							]}
						>
							Duration :
							<Text
								style={[
									typography.body,
									{ marginBottom: 10, color: textColor },
								]}
							>
								{selectedProduct.item.duration}
							</Text>
						</Text>
						<Text
							style={[
								typography.body,
								{ marginBottom: 10, color: primaryColor },
							]}
						>
							Price : $
							<Text
								style={[
									typography.body,
									{ marginBottom: 10, color: textColor },
								]}
							>
								{selectedProduct.item.price}
							</Text>
						</Text>
						<Text
							style={[
								typography.body,
								{ marginBottom: 10, color: primaryColor },
							]}
						>
							Status :
							<Text
								style={[
									typography.body,
									{ marginBottom: 10, color: textColor },
								]}
							>
								{selectedProduct.item.status}
							</Text>
						</Text>
						<Text
							style={[
								typography.body,
								{ marginBottom: 10, color: primaryColor },
							]}
						>
							Pickup Address :
							<Text
								style={[
									typography.body,
									{ marginBottom: 10, color: textColor },
								]}
							>
								{selectedProduct.item.pickUpAddress}
							</Text>
						</Text>
						<Text
							style={[
								typography.heading,
								{ marginBottom: 10, color: textColor },
							]}
						>
							Owner Details
						</Text>
						<Text
							style={[
								typography.body,
								{ marginBottom: 10, color: primaryColor },
							]}
						>
							Owner Name :
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
							Owner Email Address :
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
							Owner Contact Number :
							<Text
								style={[
									typography.body,
									{ marginBottom: 10, color: textColor },
								]}
							>
								{ownerDetails.mobileNumber}
							</Text>
						</Text>
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

const styles = StyleSheet.create({});
export default ProductDetailsScreen;
