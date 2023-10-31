import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	TextInput,
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
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import * as Location from "expo-location";

const CreateNewListing = ({ navigation, route }) => {
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

	const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

	useEffect(() => {
		// get location
		console.log("Getting location...");
		getLocationPermissions();
	}, []);

	const getLocationPermissions = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			console.log("Permission to access location was denied");
			return;
		} else if (status === "granted") {
			console.log("Permission to access location granted");
		}

		let location = await Location.getCurrentPositionAsync({});
		setCoordinates({
			lat: location.coords.latitude,
			lng: location.coords.longitude,
		});
	};

	const createButtonHandler = async () => {
		if (pickUpAddress == "") {
			alert("Please enter a pickup location");
			return;
		} else if (duration == "") {
			alert("Please select a duration to rent");
			return;
		}
		const geoCodedLocation = await Location.geocodeAsync(pickUpAddress);
		const location = geoCodedLocation[0];
		if (location === undefined) {
			alert("Location not found, Please provide a valid address!");
			return;
		}
		setCoordinates({ lat: location.latitude, lng: location.longitude });
		console.log("Coordinates: ", coordinates);

		console.log("Creating new listing...");

		// code to create new listing in firebase here:

		if (coordinates.lat != 0 && coordinates.lng != 0) {
			const listingToBeSaved = {
				name: name,
				description: description,
				price: price,
				pickUpAddress: pickUpAddress,
				duration: duration,
				category: category,
				productPhoto: "https://source.unsplash.com/600x500/?" + name,
				coordinates: coordinates,
				owner: auth.currentUser.email,
				status: "Available",
				userID: auth.currentUser.uid,
			};

			console.log("Listing to be saved: ", listingToBeSaved);

			try {
				const docRef = await addDoc(
					collection(db, "Products"),
					listingToBeSaved
				);
				console.log("New Listing Document written with ID: ", docRef.id);
				alert("Listing created successfully!");
				navigation.navigate("HomeScreen");
			} catch (e) {
				console.error("Error adding listing document: ", e);
			}
		} else {
			alert("Invalid Location, Please provide a valid address!");
			return;
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

						{/* <TextInput
							style={formStyles.input}
							onChangeText={(text) => setName(text)}
							value={name}
						/> */}
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Description</Text>
						<Input
							placeholder="eg. Good quality fan."
							onChangeText={(text) => setDescription(text)}
							value={description}
							style={formStyles.input}
						/>

						{/* <TextInput
							style={formStyles.input}
							onChangeText={(text) => setDescription(text)}
							value={description}
						/> */}
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Price ($)</Text>
						<Input
							placeholder="eg. 20."
							onChangeText={(text) => setPrice(text)}
							value={price}
							style={formStyles.input}
						/>

						{/* <TextInput
							style={formStyles.input}
							onChangeText={(text) => setPrice(text)}
							value={price}
						/> */}
					</View>

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Pickup Location</Text>
						<Input
							placeholder="eg. 160 Kendal Ave."
							onChangeText={(text) => setpickUpAddress(text)}
							value={pickUpAddress}
							style={formStyles.input}
						/>

						{/* <TextInput
							style={formStyles.input}
							onChangeText={(text) => setpickUpAddress(text)}
							value={pickUpAddress}
						/> */}
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

					{/* <View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Duration</Text>
						<Picker
							selectedValue={duration}
							style={{ flex:1, height: 100, width: 200 }}
							onValueChange={(itemValue, itemIndex) => setDuration(itemValue)}
						>
							<Picker.Item label="Select" value="" />
							<Picker.Item label="1 week" value="1 week" />
							<Picker.Item label="2 weeks" value="2 weeks" />
							<Picker.Item label="1 month" value="1 month" />
							<Picker.Item label="2 months" value="2 months" />
						</Picker>
					</View> */}

					{/* <View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Category</Text>
						<TextInput
							style={formStyles.input}
							onChangeText={(text) => setCategory(text)}
							value={category}
						/>
					</View> */}

					<View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Image</Text>
						<Input
							placeholder="eg.Fan"
							onChangeText={(text) => setImage(text)}
							value={image}
							style={formStyles.input}
						/>

						{/* <TextInput
							style={formStyles.input}
							onChangeText={(text) => setImage(text)}
							value={image}
						/> */}
					</View>

					<Btn
						title="Submit Listing"
						onPress={createButtonHandler}
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

export default CreateNewListing;
