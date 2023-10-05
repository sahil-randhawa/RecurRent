import React, { useState, useEffect } from "react";
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
} from "../../styles/GlobalStyles";
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
} from "../../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import Search from "../../components/SearchBar";
import ProductCard from "../../components/Card";

const MainTab = ({ navigation, route }) => {
	useEffect(() => {
		getProductListings();
	}, []);

	const [productsListings, setProductsListings] = useState([]);
	const getProductListings = async () => {
		try {
			const q = query(
				collection(db, "Products"),
				where("status", "==", "Available")
			);
			const querySnapshot = await getDocs(q);
			const resultsFromFirestore = [];
			querySnapshot.forEach((doc) => {
				console.log(doc.id, " => ", doc.data());

				const itemToAdd = {
					id: doc.id,
					...doc.data(),
				};
				resultsFromFirestore.push(itemToAdd);
			});

			// console.log("What is in our final array")
			// console.log(resultsFromFirestore)

			setProductsListings(resultsFromFirestore);
		} catch (err) {
			console.log(err);
		}
	};

	const moreDetailsClicked = (selectedProduct) => {
		alert(`Product : ${selectedProduct.item.name}`);
	};

	// Search Button
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = () => {
		// Handle the search functionality here
		// You can perform actions based on the searchQuery
		// For example, fetch data from an API or filter a list of items
		console.log("Search query:", searchQuery);
	};
	return (
		<>
			<ScrollView style={{ paddingVertical: 10 }}>
				<View style={[spacing.container, { justifyContent: "space-evenly" }]}>
					<Search
						placeholder={"Search here"}
						value={searchQuery}
						onChangeText={setSearchQuery}
						onSubmit={handleSearch}
					/>
					<FlatList
						data={productsListings}
						horizontal={true}
						renderItem={(rowData) => {
							return (
								<ProductCard
									coverUri={rowData.item["productPhoto"]}
									title={rowData.item.name}
									duration={rowData.item.duration}
									buttonLabel={"More Details"}
									// if onPress function is added it pops up too much of alert messages.
									onPress={{}}
								/>
							);
						}}
						contentContainerStyle={{ paddingVertical: 10 }}
					/>

					{/* create item listing button */}
					<Btn
						title="Refresh"
						onPress={getProductListings}
						mode="text"
						style={[{ textAlign: "center", color: primaryColor }]}
					/>

					<Btn
						title="Create New Listing"
						onPress={() => {
							navigation.navigate("CreateNewListing");
						}}
						mode="contained"
						style={[
							primaryBtnStyle,
							{
								width: "100%",
								alignSelf: "center",
								marginBottom: 15,
								color: lightTheme.colors.onPrimary,
							},
						]}
					/>
				</View>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({});
export default MainTab;
