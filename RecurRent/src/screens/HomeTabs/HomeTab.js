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
	ActivityIndicator,
	Image,
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
import Icon from 'react-native-vector-icons/Fontisto';
import { signOut } from "firebase/auth";
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from "firebase/firestore";
import Search from "../../components/SearchBar";
import ProductCard from "../../components/ProductCard";
import { useFocusEffect } from "@react-navigation/native";

const HomeTab = ({ navigation, route }) => {
	const [productsListings, setProductsListings] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isCategoryActive, setCategoryActive] = useState(false);
	const [isFilterActive, setFilterActive] = useState(false);

	useEffect(() => {
		getProductListings();
	}, []);

	// Use useFocusEffect to refresh data when the tab screen is focused
	useFocusEffect(
		React.useCallback(() => {
		  getProductListings();
		}, [])
	  );
	  
	const getProductListings = async () => {
		setIsLoading(true); // Show loader while fetching data
		try {
			const q = query(
				collection(db, "Products")
				// where("status", "==", "Available")
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
			setIsLoading(false); // Hide loader after fetching data

			// Reset the search bar to an empty string, in case "Refresh" button is pressed
			setSearchQuery("");
		} catch (err) {
			console.log(err);
		}
	};

	const moreDetailsClicked = async (selectedProductData) => {
		// alert(`Product : ${selectedProductData.item.name}`)
		try {
			const ownerID = selectedProductData.item.userID;
			console.log(ownerID);
			const docRef = doc(db, "userProfiles", ownerID);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log("Document data:", docSnap.data());
				// const data = docSnap.data();
				//     // const documentId = ownerID; // Get the document ID

				const combinedData = {
					selectedProduct: selectedProductData,
					ownerData: docSnap.data(),
				};
				console.log("combine", combinedData);
				navigation.navigate("ProductDetails", { combinedData: combinedData });
			} else {
				// docSnap.data() will be undefined in this case
				console.log("No such document!");
				// setOwnerDetails(null)
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

		// console.log("final" , ownerDetails)
		// const combinedData = {
		//     selectedProduct: selectedProductData,
		//     ownerData: ownerDetails,
		//   };
		//   console.log("combine", combinedData)
		// navigation.navigate("ProductDetails",{combinedData:combinedData})
	};

	const handleSearch = (searchText) => {
		setSearchQuery(searchText);
		if(isCategoryActive == true){
		// 	const q = query(collection(db, "category"));
		// 	let categoryId=""
		// 	setIsLoading(true); 
		// 	getDocs(q)
		//   .then((querySnapshot) => {
			
		// 	querySnapshot.forEach((doc) => {
		// 	  const category = doc.data();
		// 	  if (
		// 		category.name.toLowerCase().includes(searchText.toLowerCase())
		// 	  ) {
		// 		categoryId = doc.id
		// 		return;
		// 	  }
		// 	});
		// 	const productQuery = query(collection(db, "Products"),where("categoryID" ,"==", categoryId));
		// 	getDocs(productQuery)
		// 	.then((querySnapshot) => {
		// 	  const filteredResults = [];
		// 	  querySnapshot.forEach((doc) => {
		// 		const product = doc.data();
			   
		// 		  filteredResults.push({ id: doc.id, ...product });
				
		// 	  });
		// 	  setProductsListings(filteredResults);
		// 	  setIsLoading(false); // Hide loader after searching
		// 	})
		// 	.catch((error) => {
		// 	  console.error("Error filtering products category wise:", error);
		// 	  setIsLoading(false); // Hide loader on error
		// 	});
			
		//   })
		//   .catch((error) => {
		// 	console.error("Error filtering category ID:", error);
		// 	 // Hide loader on error
		//   });
		const q = query(collection(db, "Products"));
		setIsLoading(true); // Show loader while searching
	
		getDocs(q)
		  .then((querySnapshot) => {
			const filteredResults = [];
			querySnapshot.forEach((doc) => {
			  const product = doc.data();
			  if (
				product.category.toLowerCase().includes(searchText.toLowerCase())
			  ) {
				filteredResults.push({ id: doc.id, ...product });
			  }
			});
			setProductsListings(filteredResults);
			setIsLoading(false); // Hide loader after searching
		  })
		  .catch((error) => {
			console.error("Error filtering products:", error);
			setIsLoading(false); // Hide loader on error
		  });
		}
		else
		{
		const q = query(collection(db, "Products"));
		setIsLoading(true); // Show loader while searching
	
		getDocs(q)
		  .then((querySnapshot) => {
			const filteredResults = [];
			querySnapshot.forEach((doc) => {
			  const product = doc.data();
			  if (
				product.name.toLowerCase().includes(searchText.toLowerCase()) ||
				product.description.toLowerCase().includes(searchText.toLowerCase())
			  ) {
				filteredResults.push({ id: doc.id, ...product });
			  }
			});
			setProductsListings(filteredResults);
			setIsLoading(false); // Hide loader after searching
		  })
		  .catch((error) => {
			console.error("Error filtering products:", error);
			setIsLoading(false); // Hide loader on error
		  });
		}
	};

	const handleCategoryPress = () => {
		setCategoryActive(!isCategoryActive);
	  };
	  
	const handleFilterPress = () => {
		setFilterActive(!isFilterActive);
		// Add your logic here for handling the category press
	
	  };

	return (
		<>
			<ScrollView
				style={{ paddingVertical: 10, backgroundColor: backgroundColor }}
			>
				<View style={[spacing.container, { justifyContent: "space-evenly" }]}>
					
					<Search
						placeholder={"Search here"}
						value={searchQuery}
						onChangeText={(text) => handleSearch(text)}
						onFilterPress={handleFilterPress}
					/>

					{ isFilterActive && 
					(<View>
						<TouchableOpacity
							style={{
								// flex: 1,
								textAlign: 'center',
								marginTop: 10,
								alignContent:'flex-start',
								paddingVertical: 10,
								paddingVertical: Platform.OS === 'android' && 3,
								padding: 10,
								flexDirection:"row"
							}}
							onPress={handleCategoryPress}
						>
							<Icon
								name={isCategoryActive ? 'checkbox-active' : 'checkbox-passive'}
								size={20}
								style={{ color: "black" }}
							/> 
							<Text style={{marginLeft:10}}>Catergory</Text>
						</TouchableOpacity>
						
					</View>)
					}
						
				

					{isLoading ? (
						<ActivityIndicator size="large" color={primaryColor} style={styles.commonContainerStyle} />
					) : productsListings.length > 0 ? (
						<FlatList
							data={productsListings}
							horizontal={true}
							renderItem={(rowData) => {
								return (
									<ProductCard
										coverUri={rowData.item["productPhoto"]}
										title={rowData.item.name}
										duration={rowData.item.duration}
										productId={rowData.item.id}
										buttonLabel={"More Details"}
										// if onPress function is added it pops up too much of alert messages.
										onPressAction={() => {
											moreDetailsClicked(rowData);
										}}
									/>
								);
							}}
							contentContainerStyle={{
								padding: 5,
							}}
						/>
					) : (
						// Display a message when no results are found
						<View style={styles.commonContainerStyle}>
						<Image
							source={require('../../../assets/images/no-wishlist.png')}
							style={styles.image}
						/>
						<Text style={[typography.bodyHeading, { textAlign: 'center' }]}>
							Oops! No matched products.{'\n'}Try another search.
						</Text>
						</View>
					)}

					{/* create item listing button */}
					<Btn
						title="Refresh"
						onPress={getProductListings}
						mode="text"
						style={[{ textAlign: "center", color: primaryColor }]}
					/>

					{/* <Btn
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
					/> */}
				</View>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 200,
		height: 200,
	},
	commonContainerStyle: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: 300,
		height: 400,
		marginTop: 30,
		marginRight: 10,
		borderRadius: 10,
		padding: 10,
	},
});
export default HomeTab;
