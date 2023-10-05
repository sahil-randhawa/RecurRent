import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput } from "react-native";
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
	const [duration, setDuration] = useState("1 month");
	const [category, setCategory] = useState("furniture");
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
				navigation.navigate("Home");
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
			<View style={[spacing.container]}>
				<View style={formStyles.formContainer}>
					<View style={formStyles.formRow}>
						<Text style={formStyles.label}>Name</Text>
						<TextInput
							style={formStyles.input}
							onChangeText={(text) => setName(text)}
							value={name}
						/>
					</View>
					<View style={formStyles.formRow}>
						<Text style={formStyles.label}>Description</Text>
						<TextInput
							style={formStyles.input}
							onChangeText={(text) => setDescription(text)}
							value={description}
						/>
					</View>
					<View style={formStyles.formRow}>
						<Text style={formStyles.label}>Price</Text>
						<TextInput
							style={formStyles.input}
							onChangeText={(text) => setPrice(text)}
							value={price}
						/>
					</View>
					<View style={formStyles.formRow}>
						<Text style={formStyles.label}>Pickup Location</Text>
						<TextInput
							style={formStyles.input}
							onChangeText={(text) => setpickUpAddress(text)}
							value={pickUpAddress}
						/>
					</View>
					<View style={formStyles.formRow}>
						<Text style={formStyles.label}>Duration</Text>
						<TextInput
							style={formStyles.input}
							onChangeText={(text) => setDuration(text)}
							value={duration}
						/>
					</View>
					<View style={formStyles.formRow}>
						<Text style={formStyles.label}>Category</Text>
						<TextInput
							style={formStyles.input}
							onChangeText={(text) => setCategory(text)}
							value={category}
						/>
					</View>
					<View style={formStyles.formRow}>
						<Text style={formStyles.label}>Image</Text>
						<TextInput
							style={formStyles.input}
							onChangeText={(text) => setImage(text)}
							value={image}
						/>
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
			</View>
		</>
	);
};
export default CreateNewListing;
