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
import Btn, { primaryBtnStyle } from "../../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card, Title, Paragraph, Button } from "react-native-paper";
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
	return (
		<>
			<View style={[spacing.container, { justifyContent: "space-evenly" }]}>
				{/* <View style={{ flexDirection: "row" }}>
                    <Text style={typography.title}>RecurRent Home</Text>
                </View> */}
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
						/>

							// <Card style={styles.card}>
							// 	<Card.Cover source={{ uri: rowData.item["productPhoto"] }} />
							// 	<Card.Content>
							// 		<Title style={styles.cardTitle}>{rowData.item.name}</Title>
							// 		<Paragraph>Duration : {rowData.item.duration}</Paragraph>
							// 	</Card.Content>
							// 	<Card.Actions>
							// 		<Button
							// 			style={styles.moreDetailsButton}
							// 			onPress={() => moreDetailsClicked(rowData)}
							// 		>
							// 			<Text>More Details</Text>
							// 		</Button>
							// 	</Card.Actions>
							// </Card>


						);

					}}
					// ItemSeparatorComponent={ () => {
					//     return (<View style={ styles.separator }/>)
					// }}
				/>
				{/* create item listing button */}
				<TouchableOpacity
					style={{
						marginVertical: 10,
					}}
					onPress={getProductListings}
				>
					<Text
						style={{
							fontSize: 20,
							color: primaryColor,
						}}
					>
						Refresh
					</Text>
				</TouchableOpacity>
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
							color: "white",
						},
					]}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	card: {
		margin: 16,
		width: 300,
		height: 400,
	},

	moreDetailsButton: {
		position: "absolute",
		top: 0, // Adjust top and left values to position the button as needed
		left: 0,
		zIndex: 1,
	},
	cardTitle: {
		height: 60,
	},
});
export default MainTab;
