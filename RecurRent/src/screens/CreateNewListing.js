import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	TextInput,
	ScrollView,
	StyleSheet,
	Touchable,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
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
import { auth, db, firebase } from "../../firebaseConfig";
import { collection, addDoc, doc, getDocs, query, where, updateDoc } from "firebase/firestore";
import * as Location from "expo-location";
import Toast from 'react-native-toast-message';

const CreateNewListing = ({ navigation, route }) => {
	const [name, setName] = useState("Lawn Grass Seeds");
	const [description, setDescription] = useState(
		"Garden grass seeds for sale."
	);
	const [price, setPrice] = useState("30");
	const [pickUpAddress, setpickUpAddress] = useState(
		"512 Davenport Drive, Toronto, Canada"
	);
	const [duration, setDuration] = useState("");
	const [category, setCategory] = useState("");
	const [prodImage, setProdImage] = useState("https://ui-avatars.com/api/?name=NA&length=2&size=512");

	const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

	const [imageToUpload, setImageToUpload] = useState(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		// get location
		console.log("Getting location...");
		getLocationPermissions();
	}, []);

	const pickImage = async () => {
		console.log('Picking image...');
		try {
			// setImageToUpload(null);
			const result = await ImagePicker.launchImageLibraryAsync({
				// launchCameraAsync
				mediaTypes: ImagePicker.MediaTypeOptions.Images, // All, Images, Videos
				// mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
			// console.log('Selected result :' + JSON.stringify(result));
			if (!result.canceled) {
				// setImage(result.uri);
				setImageToUpload(result.assets[0].uri);
				console.log('Image selected!' + JSON.stringify(result, null, 2));
			}
		} catch (e) {
			console.error(e);
		}
	};

	const uploadImage = async (productDocId) => {
		try {
			// delete the old image from firebase storage - skip for now

			// upload the new image to firebase storage
			const { uri } = await FileSystem.getInfoAsync(imageToUpload);
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (e) {
					console.log(e);
					reject(new TypeError('Network request failed'));
				};
				xhr.responseType = 'blob';
				xhr.open('GET', uri, true);
				xhr.send(null);
			});

			const filename = imageToUpload.substring(
				imageToUpload.lastIndexOf('/') + 1
			);

			// const ref = firebase.storage().ref().child(uuid.v4());
			const ref = firebase.storage().ref().child(filename);

			const snapshot = await ref.put(blob);

			blob.close();
			const url = await snapshot.ref.getDownloadURL();
			console.log('Successfully uploaded! Image url : ', url);

			// update the image url for the new document
			const productDocRef = doc(db, "Products", productDocId);
			await updateDoc(productDocRef, { productPhoto: url });
			console.log('Successfully updated product image url!\n url: ', url);
			setProdImage(url);
		} catch (e) {
			console.log(e);
		}
	};

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

		if (coordinates.lat !== 0 && coordinates.lng !== 0) {
			const listingToBeSaved = {
				name: name,
				description: description,
				price: price,
				pickUpAddress: pickUpAddress,
				duration: duration,
				category: category,
				productPhoto: prodImage,
				coordinates: coordinates,
				owner: auth.currentUser.email,
				status: "Available",
				userID: auth.currentUser.uid,
			};

			console.log("Listing to be saved: ", listingToBeSaved);

			try {
				setUploading(true);
				const collectionRef = collection(db, "Products");
				const docRef = await addDoc(collectionRef, listingToBeSaved);

				// Retrieve the document ID from the reference
				const productId = docRef.id;

				// Now, update the document with the actual productId field
				await updateDoc(docRef, { productId: productId });

				// upload product image
				if (imageToUpload) uploadImage(productId);
				setUploading(false);

				console.log("New Listing Document written with ID: ", docRef.id);
				// alert("Listing created successfully!");
				// show toast
				Toast.show({
					type: 'success',
					position: 'bottom',
					text1: 'Listing created successfully!',
					visibilityTime: 3000,
					autoHide: true,
				});
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
			{uploading && (
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						width: "100%",
						height: "100%",
						zIndex: 10,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "rgba(0,0,0,0.2)",
					}}
				>
					<ActivityIndicator size="large" color={primaryColor} />
				</View>
			)}
			<ScrollView style={{
				marginBottom: 100,
			}}>
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
						<TouchableOpacity
							// style={formStyles.input}
							onPress={pickImage}
						>
							{!imageToUpload && (
								<Text
									style={{
										marginVertical: 8,
										backgroundColor: "#fff",
										padding: 10,
										fontSize: 16,
										borderRadius: 5,
										height: 40,
										borderColor: primaryColor,
										borderWidth: 1,
									}}
								>
									{imageToUpload ? imageToUpload : "Select item image"}
								</Text>
							)}
							{imageToUpload && (
								<View style={{ position: 'relative' }}>
									<Image
										source={{ uri: imageToUpload }}
										style={{
											width: 80,
											height: 80,
											marginVertical: 8,
										}}
									/>
									{/* discard image button X */}
									<TouchableOpacity
										onPress={() => setImageToUpload(null)}
										style={{
											position: 'absolute',
											top: -5,
											left: 65,
											borderRadius: 50,
											backgroundColor: 'rgba(91, 129, 250, 0.8)',
											paddingHorizontal: 8,
											paddingVertical: 5,
										}}
									>
										<Text style={{
											color: 'white',
											fontSize: 16,
											fontWeight: 'bold'
										}}>X</Text>
									</TouchableOpacity>
								</View>
							)}
						</TouchableOpacity>



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
