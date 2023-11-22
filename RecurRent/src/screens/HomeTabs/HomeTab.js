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
	ActivityIndicator,
	Image,
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
	tertiaryColor,
} from '../../styles/GlobalStyles';
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
} from '../../components/Button';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../../../firebaseConfig';
import Icon from 'react-native-vector-icons/Fontisto';
import { signOut } from 'firebase/auth';
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from 'firebase/firestore';
import Search from '../../components/SearchBar';
import Category from '../../components/Category';
import ProductCard from '../../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native';

const HomeTab = ({ navigation, route }) => {
	const [productsListings, setProductsListings] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isCategoryActive, setCategoryActive] = useState(false);
	const [isFilterActive, setFilterActive] = useState(false);

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');

	useEffect(() => {
		getProductListings();

		const fetchCategories = async () => {
			try {
				const categoriesQuery = query(collection(db, 'Products'));
				const categoriesSnapshot = await getDocs(categoriesQuery);
				const uniqueCategories = new Set();

				categoriesSnapshot.forEach((doc) => {
					const product = doc.data();
					uniqueCategories.add(product.category);
				});

				setCategories(Array.from(uniqueCategories));
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

		fetchCategories();
	}, []);

	// useFocusEffect: refresh data when the tab screen is focused
	useFocusEffect(
		React.useCallback(() => {
			getProductListings();
		}, [])
	);

	// getProductListings: fetches product listings from the Firestore database
	const getProductListings = async () => {
		setIsLoading(true); // Show loader while fetching data
		try {
			const q = query(
				collection(db, 'Products')
				// where("status", "==", "Available")
			);
			const querySnapshot = await getDocs(q);
			const resultsFromFirestore = [];
			querySnapshot.forEach((doc) => {
				console.log(doc.id, ' => ', doc.data());

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
			setSearchQuery('');
		} catch (err) {
			console.log(err);
		}
	};

	// moreDetailsClicked: more information on selected product
	const moreDetailsClicked = async (selectedProductData) => {
		// alert(`Product : ${selectedProductData.item.name}`)
		try {
			const ownerID = selectedProductData.item.userID;
			console.log(ownerID);
			const docRef = doc(db, 'userProfiles', ownerID);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log('Document data:', docSnap.data());
				// const data = docSnap.data();
				//     // const documentId = ownerID; // Get the document ID

				const combinedData = {
					selectedProduct: selectedProductData,
					ownerData: docSnap.data(),
				};
				console.log('combine', combinedData);
				navigation.navigate('ProductDetails', { combinedData: combinedData });
			} else {
				// docSnap.data() will be undefined in this case
				console.log('No such document!');
				// setOwnerDetails(null)
				const combinedData = {
					selectedProduct: selectedProductData,
					ownerData: {},
				};
				console.log('combine', combinedData);
				navigation.navigate('ProductDetails', { combinedData: combinedData });
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

	// handleSearch: based on the entered searchText
	const handleSearch = (searchText,searchType) => {
		
		if (searchType == "category"){
			setSelectedCategory(searchText);
		}

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

		const q = query(collection(db, 'Products'));
		setIsLoading(true);
		console.log("category selected", selectedCategory)

		if (searchType == "name") {
			setSearchQuery(searchText);
			// Case 1: User typed in the search bar
			getDocs(q)
				.then((querySnapshot) => {
					const filteredResults = [];
					querySnapshot.forEach((doc) => {
						const product = doc.data();
						if (
							product.name.toLowerCase().includes(searchText.toLowerCase()) ||
							product.description
								.toLowerCase()
								.includes(searchText.toLowerCase())
						) {
							filteredResults.push({ id: doc.id, ...product });
						}
					});
					setProductsListings(filteredResults);
					setIsLoading(false); // Hide loader after searching
				})
				.catch((error) => {
					console.error('Error filtering products:', error);
					setIsLoading(false); // Hide loader on error
				});
		} else if (searchType == "category") {
			// Case 2: User selected a category
			setSearchQuery("")
			
			getDocs(query(q, where('category', '==', searchText)))
				.then((querySnapshot) => {
					const filteredResults = [];
					querySnapshot.forEach((doc) => {
						const product = doc.data();
						filteredResults.push({ id: doc.id, ...product });
					});
					setProductsListings(filteredResults);
					setIsLoading(false); // Hide loader after searching
				})
				.catch((error) => {
					console.error('Error filtering products by category:', error);
					setIsLoading(false); // Hide loader on error
				});
		} else {
			// No search text or category selected, reset the product listings
			setProductsListings([]);
			setIsLoading(false);
		}
	};

	// Category Press
	const handleCategoryPress = (category) => {
		selectedCategory(category)
		// setCategoryActive(!isCategoryActive);
		handleSearch("","category");
	};

	const handleFilterPress = () => {
		setFilterActive(!isFilterActive);
		// Add your logic here for handling the category press
	};

	return (
		<>
			<View style={styles.container}>
				<View>
					{/* Search and Filter View */}
					<View>
						<Search
							placeholder={'Search here'}
							value={searchQuery}
							onChangeText={(text) => handleSearch(text,"name")}
							onFilterPress={handleFilterPress}
							style={{ flex: 1 }}
						/>

						{isFilterActive && (
							<View>
								<TouchableOpacity
									style={{
										// flex: 1,
										textAlign: 'center',
										marginTop: 10,
										alignContent: 'flex-start',
										paddingVertical: 10,
										paddingVertical: Platform.OS === 'android' && 3,
										padding: 10,
										flexDirection: 'row',
									}}
									onPress={handleCategoryPress}
								>
									<ScrollView
										horizontal
										showsHorizontalScrollIndicator={false}
										contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 8,}}
									>
										{categories.map((category) => (
											<Category
												key={category}
												name={category}
												// onPress={() => handleCategoryPress(category)}
												onPress={() => handleSearch(category,"category")}
												isActive={selectedCategory===category}
											/>
										))}
									</ScrollView>

									{/* <Icon
										name={
											isCategoryActive ? 'checkbox-active' : 'checkbox-passive'
										}
										size={20}
										style={{ color: tertiaryColor }}
									/>
									<Text style={{ marginLeft: 10 }}>Category</Text> */}
								</TouchableOpacity>
							</View>
						)}
					</View>

					{/* Product Listings ScrollView */}
					{isLoading ? (
						<ActivityIndicator
							size="large"
							color={primaryColor}
							style={styles.productContainer}
						/>
					) : productsListings.length > 0 ? (
						<View style={{marginBottom: Platform.OS === 'ios' ? 320 : 300,}}>
							<FlatList
							data={productsListings.filter((product) =>
								isCategoryActive
									? product.category.toLowerCase() ===
									  selectedCategory.toLowerCase()
									: true
							)}
							contentContainerStyle={{
								padding: 5,
							}}
							vertical={true}
							showsVerticalScrollIndicator={false}
							renderItem={(rowData) => {
								return (
									<View style={{ flex: 1, paddingHorizontal: 5 }}>
										<ProductCard
											coverUri={rowData.item['productPhoto']}
											title={rowData.item.name}
											price={rowData.item.price}
											duration={rowData.item.duration}
											productId={rowData.item.id}
											buttonLabel={'More Details'}
											onPressAction={() => {
												moreDetailsClicked(rowData);
											}}
										/>
									</View>
								);
							}}
						/>
						</View>
					) : (
						// Display a message when no results are found
						<View style={styles.imgContainer}>
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
						style={[{ textAlign: 'center', color: primaryColor }]}
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
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		paddingHorizontal: 10,
		backgroundColor: backgroundColor,
	},
	productContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 200,
		height: 200,
	},
	imgContainer: {
		paddingTop: 70,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
export default HomeTab;
