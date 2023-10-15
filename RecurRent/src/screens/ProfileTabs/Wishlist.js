import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	Image,
} from "react-native";
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
} from "../../styles/GlobalStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import { auth, db } from "../../../firebaseConfig";
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	updateDoc,
	arrayRemove,
} from "firebase/firestore";

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
				collection(db, "userProfiles"),
				where("email", "==", auth.currentUser.email)
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
					const docRef = doc(db, "Products", value);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						const data = docSnap.data();
						const documentId = docSnap.id; // Get the document ID
						const itemWithId = { ...data, id: documentId }; // Include the ID in the item object
						console.log(
							"Document data :\n",
							JSON.stringify(itemWithId, null, 4)
						);

						resultsFromFirestore.push(itemWithId);
					} else {
						console.log("Document does not exist.");
					}
				} catch (error) {
					console.error("Error fetching document:", error);
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
			const docRef = doc(db, "userProfiles", ownerID);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log("Document data:", docSnap.data());

				const combinedData = {
					selectedProduct: selectedProductData,
					ownerData: docSnap.data(),
				};
				console.log("combine", combinedData);
				navigation.navigate("ProductDetails", { combinedData: combinedData });
			} else {
				// docSnap.data() will be undefined in this case
				console.log("No such document!");
				const combinedData = {
					selectedProduct: selectedProductData,
					ownerData: {},
				};
				console.log("combine", combinedData);
				navigation.navigate("ProductDetails", { combinedData: combinedData });
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleRemove = async (item) => {
		//Remove the product from favlist array in Firebase
		try {
			const docRef = doc(db, "userProfiles", auth.currentUser.uid);

			await updateDoc(docRef, {
				favlist: arrayRemove(item.id),
			});

			console.log("String removed from array in Firebase.");
			fetchFromDB();
		} catch (error) {
			console.error("Error removing string from array in Firebase:", error);
		}
	};

	return (
		<View style={spacing.container}>
			{loading ? (
				<ActivityIndicator size="large" color={primaryColor} />
			) : wishList.length === 0 ? (
				<Text style={{ textAlign: "center", alignSelf: "center" }}>
					Currently, your wishlist is empty.{"\n"}Keep Browsing!
				</Text>
			) : (
				<View
					style={{
						width: "100%",
						flex: 1,
					}}
				>
					<FlatList
						data={wishList}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.itemContainer}
								onPress={() => handlePress(item)}
							>
								<View style={styles.rowContainer}>
									<View style={styles.itemContainer}>
										<View style={styles.itemContent}>
											<Text style={styles.itemText}>{item.name}</Text>
										</View>
										<TouchableOpacity onPress={() => handleRemove(item)}>
											<AntDesign
												name="close"
												size={24}
												color={tertiaryColor}
												style={styles.removeIcon}
											/>
										</TouchableOpacity>
									</View>
									<View
										style={[
											styles.itemContainer,
											{
												justifyContent: "flex-start",
												gap: 10,
												alignItems: "flex-start",
											},
										]}
									>
										<Image
											source={{ uri: item.productPhoto }}
											style={{ width: 100, height: 100 }}
										/>
										<View
											style={{
												width: "65%",
												height: "100%",
												justifyContent: "space-between",
												gap: 5,
												flexDirection: "column",
												borderColor: secondaryColor,
											}}
										>
											<View
												style={{
													gap: 5,
												}}
											>
												<Text>{item.pickUpAddress}</Text>
												<Text
													style={{
														color:
															item.status === "Available"
																? "green"
																: item.status === "Unavailable"
																? "red"
																: "grey",
													}}
												>
													{item.status}
												</Text>
											</View>
											<Text
												style={{
													fontStyle: "italic",
													// fontSize: 12,
													color: secondaryColor,
												}}
											>
												C${item.price}
											</Text>
										</View>
									</View>
								</View>
							</TouchableOpacity>
						)}
						keyExtractor={(item) => item.name}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},

	itemContainer: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	rowContainer: {
		flex: 1,
		width: "100%",
		flexDirection: "column",
		gap: 10,
		alignItems: "flex-start",
		// justifyContent: "space-around",
		padding: 10,
		backgroundColor: "white",
		marginTop: 10,
		borderRadius: 10,
	},
	itemContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	itemText: {
		fontSize: 16,
		color: textColor.primary,
		fontWeight: "600",
	},
	arrowIcon: {
		marginLeft: 10,
	},
});

export default Wishlist;
