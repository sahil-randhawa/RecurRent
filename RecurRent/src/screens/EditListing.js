import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Image,
	Alert,
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
import { auth, db, firebase } from "../../firebaseConfig";
import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import * as Location from "expo-location";

const EditListing = ({ navigation, route }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState(
		""
	);
	const [price, setPrice] = useState("");
	const [pickUpAddress, setpickUpAddress] = useState(
		""
	);
	const [duration, setDuration] = useState("");
	const [category, setCategory] = useState("");
	const [imageToUpload, setImageToUpload] = useState("table");

	// const[enableStatus, setEnableStatus] = useState(false)

	useEffect(() => {
		// Update state variables with values from route.params when the screen loads
		const selectedProduct = route.params.combinedData.selectedProduct;
		console.log('selectedProduct Id: ', selectedProduct.item.productId);
		setName(selectedProduct.item.name);
		setDescription(selectedProduct.item.description);
		setPrice(selectedProduct.item.price);
		setpickUpAddress(selectedProduct.item.pickUpAddress);
		setDuration(selectedProduct.item.duration);
		setCategory(selectedProduct.item.category);
		setImageToUpload(selectedProduct.item.productPhoto); //Need to change
		// setEnableStatus(selectedProduct.item.enableListing);
	}, []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
		  headerRight: () => (
			<TouchableOpacity
			  style={{ marginRight: 15 }}
			  onPress={confirmDisable}
			>
			  {/* <Icon
					name="log-out-outline"
					size={26}
					color={primaryColor}
				/> */}
				<Text style={{color:primaryColor}}>
					{selectedProduct.item.enableListing ? "Disable Listing" : "Enable Listing"}
				</Text>
			</TouchableOpacity>
		  ),
		});
	  }, [navigation, onDisabledClicked]);

	const onDisabledClicked = async () => {
		

		const docRef = doc(db, "Products", selectedProduct.item.productId);

		const updatedData = {
			enableListing: !selectedProduct.item.enableListing
		};

		try {
			await setDoc(docRef, updatedData, { merge: true });
			console.log("Document updated successfully");
			
			Toast.show({
				type: 'success',
				position: 'bottom',
				text1: `${selectedProduct.item.enableListing ? "Listing is now Disabled!" : "Listing is now Enabled!"}`,
				visibilityTime: 3000,
				autoHide: true,
			});

			navigation.navigate("Listings");
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	}

	const confirmDisable = () => {
		// setEnableStatus(!selectedProduct.item.enableListing)
		// console.log(enableStatus)

		Alert.alert(
		  'Confirm',
		  `Are you sure?`,
		  [
			{
			  text: 'Cancel',
			  style: 'cancel',
			},
			{
			  text: 'OK',
			  onPress: () => {
				// Call the disable function here
				// console.log(enableStatus)
				onDisabledClicked();
			  },
			},
		  ],
		  { cancelable: true }
		);
	  };

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
		} catch (e) {
			console.log(e);
		}
	};


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
			productPhoto: imageToUpload,
		};

		try {
			await setDoc(docRef, updatedData, { merge: true });
			console.log("Document updated successfully");
			alert("Listing updated successfully!");
			if (imageToUpload) {
				uploadImage(selectedProduct.item.productId);
			}
			Toast.show({
				type: 'success',
				position: 'bottom',
				text1: 'Listing updated successfully!',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
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

					{/* <View style={formStyles.fieldContainer}>
						<Text style={formStyles.label}>Image</Text>
						<Input
							placeholder="eg.Fan"
							onChangeText={(text) => setImage(text)}
							value={image} //Need to change
							style={formStyles.input}
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
										color: "#9E9E9E",
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
						title="Save Listing"
						onPress={updateButtonHandler}
						mode="contained"
						style={[
							primaryBtnStyle,
							{
								textAlign: "center",
								marginBottom: 10
							},
						]}
					/>

					{/* <Btn
						title = {enableStatus ? "Disable Listing" : "Enable Listing"}
						onPress={updateButtonHandler}
						mode="contained"
						style={[
							primaryBtnStyle,
							{
								textAlign: "center",
							},
						]}
					/> */}
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
