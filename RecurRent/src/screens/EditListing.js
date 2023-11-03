import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
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
	formStyles,
} from "../styles/GlobalStyles";
import Input from "../components/Input";
import Btn, { primaryBtnStyle } from "../components/Button";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

const EditListing = ({ navigation, route }) => {
	const [name, setName] = useState("StudyTable");
	const [description, setDescription] = useState(
		"Good condition study table from IKEA. Color: Black."
	);
	const [price, setPrice] = useState("30");
	const [pickUpAddress, setpickUpAddress] = useState(
		"1 Younge Street, Toronto, Canada"
	);
	const [duration, setDuration] = useState("");
	const [category, setCategory] = useState("");
	const [image, setImage] = useState("table");

	useEffect(() => {
		// Update state variables with values from route.params when the screen loads
        const selectedProduct = route.params.combinedData.selectedProduct;
        setName(selectedProduct.item.name);
        setDescription(selectedProduct.item.description);
        setPrice(selectedProduct.item.price);
        setpickUpAddress(selectedProduct.item.pickUpAddress);
		setDuration(selectedProduct.item.duration);
		setCategory(selectedProduct.item.category);
		setImage(selectedProduct.item.name); //Need to change
	}, []);

	//Route Data
	const [selectedProduct, setSelectedProduct] = useState(
		route.params.combinedData.selectedProduct
	);

	const updateButtonHandler = async () => {
		const docRef = doc(db, "Products", selectedProduct.item.productId);
	  
		const updatedData = {
		  name: name,
		  description: description,
		  price: price,
		  pickUpAddress: pickUpAddress,
		  duration: duration,
		  category: category,
		  productPhoto: "https://source.unsplash.com/600x500/?" + image,
		};
	  
		try {
		  await setDoc(docRef, updatedData, { merge: true });
		  console.log("Document updated successfully");
		  alert("Listing updated successfully!");
		  navigation.navigate("Listings");
		} catch (error) {
		  console.error("Error updating document: ", error);
		}
	  };
	  
	  

	return (
		<>
			<ScrollView>
				<View style={styles.container}>
					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Product Name</Text>
						<Input
							placeholder="eg. Fan"
							onChangeText={(text) => setName(text)}
							value={name}
							style={formStyles.input}
						/>
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Description</Text>
						<Input
							placeholder="eg. Good quality fan."
							onChangeText={(text) => setDescription(text)}
							value={description}
							style={formStyles.input}
						/>
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Price ($)</Text>
						<Input
							placeholder="eg. 20."
							onChangeText={(text) => setPrice(text)}
							value={price}
							style={formStyles.input}
						/>
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Pickup Location</Text>
						<Input
							placeholder="eg. 160 Kendal Ave."
							onChangeText={(text) => setpickUpAddress(text)}
							value={pickUpAddress}
							style={formStyles.input}
						/>
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Duration</Text>
						<RNPickerSelect
							onValueChange={(itemValue) => setDuration(itemValue)}
							items={[
								{ label: "1 week", value: "1 week" },
								{ label: "2 weeks", value: "2 weeks" },
								{ label: "1 month", value: "1 month" },
								{ label: "2 months", value: "2 months" },
							]}
							value={duration}
							style={{
								inputIOS: {
									marginTop: 8,
									backgroundColor: "#fff",
									padding: 10,
									fontSize: 16,
									borderRadius: 5,
									height: 40,
									borderColor: primaryColor,
									borderWidth: 1,
								},
								inputAndroid: {
									marginTop: 8,
									backgroundColor: "#fff",
									padding: 10,
									fontSize: 16,
									borderRadius: 5,
									height: 40,
									borderColor: primaryColor,
									borderWidth: 1,
								},
							}}
						/>
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Category</Text>
						<RNPickerSelect
							onValueChange={(itemValue) => setCategory(itemValue)}
							items={[
								{ label: "Furniture", value: "Furniture" },
								{ label: "Electronics", value: "Electronics" },
							]}
							value={category}
							style={{
								inputIOS: {
									marginTop: 8,
									backgroundColor: "#fff",
									padding: 10,
									fontSize: 16,
									borderRadius: 5,
									height: 40,
									borderColor: primaryColor,
									borderWidth: 1,
								},
								inputAndroid: {
									marginTop: 8,
									backgroundColor: "#fff",
									padding: 10,
									fontSize: 16,
									borderRadius: 5,
									height: 40,
									borderColor: primaryColor,
									borderWidth: 1,
								},
							}}
						/>
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Image</Text>
						<Input
							placeholder="eg.Fan"
							onChangeText={(text) => setImage(text)}
							value={image} //Need to change
							style={formStyles.input}
						/>
					</View>

					<Btn
						title="Save Listing"
						onPress={updateButtonHandler}
						mode="contained"
						style={[
							primaryBtnStyle,
							{
								textAlign: "center",
							},
						]}
					/>
				</View>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: backgroundColor,
	},
});

export default EditListing;
