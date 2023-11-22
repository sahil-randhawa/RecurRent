import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
	Alert,
	Image,
	ActivityIndicator,
	Platform,
	ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, firebase } from '../../../firebaseConfig';
import { collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { List, Button, Avatar, TextInput } from 'react-native-paper';
import Input from '../../components/Input';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
	logoutBtnStyle,
} from '../../components/Button';
import {
	backgroundColor,
	lightTheme,
	primaryColor,
	spacing,
	typography,
	formStyles,
} from '../../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const AccountSettingsScreen = () => {
	const [imageToUpload, setImageToUpload] = useState(null);
	const [uploading, setUploading] = useState(false);

	// get logged in user details from the db
	const [user, setUser] = useState(null);
	const [profileUrl, setProfileUrl] = useState(null);
	const [name, setName] = useState(null);
	// const [email, setEmail] = useState(null);
	const [mobile, setMobile] = useState(null);

	useEffect(() => {
		getUser();
	}, []);

	const getUser = async () => {
		try {
			const user = await getDoc(doc(db, 'userProfiles', auth.currentUser.uid));
			if (!user.exists) {
				console.log('No such user!');
			} else {
				// console.log('User profile data:', JSON.stringify(user.data(), null, 2));
				setUser(user.data());

				// setProfileUrl(user.data().imageUrl ? user.data().imageUrl : `https://ui-avatars.com/api/?name=${user.data().name}&size=128&length=1`);
				setProfileUrl(user.data().imageUrl ? user.data().imageUrl : null);

				// setName
				setName(user.data().name ? user.data().name : 'Invalid format');

				// setEmail - Changing email like this won't update it in Firestore Authentication
				// setEmail(user.data().email ? user.data().email : 'Invalid format');

				// setMobile
				setMobile(user.data().mobileNumber ? user.data().mobileNumber : 'Invalid format');
			}
		} catch (e) {
			console.log('Error in fetching user: ' + e);
		}
	};

	const pickImage = async () => {
		console.log('Picking image...');
		try {
			setImageToUpload(null);
			const result = await ImagePicker.launchImageLibraryAsync({
				// launchCameraAsync
				mediaTypes: ImagePicker.MediaTypeOptions.Images, // All, Images, Videos
				// mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [3, 3],
				quality: 1,
			});
			// console.log('Selected result :' + JSON.stringify(result));
			if (!result.canceled) {
				// setImage(result.uri);
				setImageToUpload(result.assets[0].uri);
				console.log('Image selected!' + JSON.stringify(result));
			}
		} catch (e) {
			console.log(e);
		}
	};

	const uploadImage = async () => {
		try {
			setUploading(true);
			// delete the old image from firebase storage
			if (user.imageUrl) {
				try {
					const oldImageRef = firebase.storage().refFromURL(user.imageUrl);
					await oldImageRef.delete();
					console.log('Successfully deleted old image!');
				} catch (e) {
					console.log('Error in deleting old image: ' + e);
				}
			}
			// upload new image to firebase storage
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

			// Update user's profile image url
			const userRef = doc(db, 'userProfiles', auth.currentUser.uid);
			await updateDoc(userRef, {
				imageUrl: url,
			});
			setProfileUrl(url);
			console.log('Successfully updated user profile image url!');

			setUploading(false);
			setImageToUpload(null);
			Toast.show({
				type: 'success',
				position: 'bottom',
				text1: 'Profile image updated successfully.',
				visibilityTime: 3000,
				autoHide: true,
			});
			// Alert.alert('Success', 'Image uploaded successfully');
			// return url;
		} catch (e) {
			console.log('Error-[function#uploadImage]: ' + e);
			setUploading(false);
			return null;
		}
	};

	// Save user edited info to the db
	const saveChanges = async () => {
		const docRef = doc(db, "userProfiles", auth.currentUser.uid);
	  
		const updatedData = {
		  name: name,
		//   email: email,
		  mobileNumber: mobile
		};
	  
		try {
			await setDoc(docRef, updatedData, { merge: true });
			console.log("Document updated successfully");
			//alert("Profile updated successfully!");
			Toast.show({
				type: 'success',
				position: 'bottom',
				text1: 'Your profile is updated successfully.',
				visibilityTime: 3000,
				autoHide: true,
			});
		} catch (error) {
		  console.error("Error updating document: ", error);
		}
	};

	return (
		<>
		<ScrollView style={styles.container}>
			{/* profile image edit */}
			<View
				style={{
					width: '100%',
					flexDirection: 'row',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<View
					style={{
						marginTop: 35,
						marginBottom: 20,
						alignItems: 'center',
					}}
				>
					<TouchableOpacity
						style={styles.profileImageTouchable}
						onPress={() => {
							pickImage();
						}}
					>
						<ImageBackground
							style={styles.profileImageBackground}
							imageStyle={{ borderRadius: 50 }} // to make it circular
							// source={{ uri: imageToUpload ? imageToUpload : profileUrl }}
							source={
								profileUrl
									? { uri: imageToUpload ? imageToUpload : profileUrl }
									: imageToUpload
									? { uri: imageToUpload }
									: require('../../../assets/images/profile_placeholder.png')
							}
						>
							{uploading ? (
								<ActivityIndicator
									size="large"
									color="#fff"
									animating={true}
								/>
							) : (
								<View
									style={{
										flex: 1,
										width: '100%',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<View
										style={{
											flex: 2,
										}}
									></View>
									<View style={styles.bgColor}>
										<Icon
											name="pencil"
											size={20}
											color={backgroundColor}
										/>
									</View>
								</View>
							)}
						</ImageBackground>
					</TouchableOpacity>
				</View>
				{imageToUpload && (
					<TouchableOpacity
						style={styles.uploadImg}
						onPress={() => {
							uploadImage();
						}}
					>
						<Text
							style={{
								color: '#fff',
								fontSize: 12,
								fontWeight: 'bold',
							}}
						>
							Save Image
						</Text>
					</TouchableOpacity>
				)}
			</View>


			{/* Edit info */}
			<View style={{ flex: 1, paddingTop: 50 }}>
				{/* Name */}
				<View
					style={{
						flexDirection: 'column',
						marginBottom: 10,
					}}
				>
					<Text
						style={[
							typography.bodyHeading,
							{ color: lightTheme.colors.secondary, marginBottom: 10 },
						]}
					>
						Name
					</Text>
					<View style={styles.txtInput}>
						<TextInput
							mode="outlined"
							value={name}
							onChangeText={(value) => setName(value)}
							editable={true}
							style={[typography.body, { marginBottom: 10, lineHeight: 0 }]}
							activeOutlineColor="#374D96"
						/>
					</View>
				</View>

				{/* Email */}
				<View
					style={{
						flexDirection: 'column',
						marginBottom: 10,
					}}
				>
					<Text
						style={[
							typography.bodyHeading,
							{
								color: lightTheme.colors.secondary,
								marginBottom: 10,
								lineHeight: 0,
							},
						]}
					>
						Email
					</Text>
					<View style={styles.txtInput}>
						<TextInput
							mode="outlined"
							value={email}
							onChangeText={(value) => setEmail(value)}
							editable={true}
							style={[typography.body, { marginBottom: 10, lineHeight: 0 }]}
							activeOutlineColor="#374D96"
						/>
					</View>
				</View>

				{/* Password */}
				{/* <View
					style={{
						flexDirection: 'column',
						marginBottom: 10,
					}}
				>
					<Text
						style={[
							typography.bodyHeading,
							{ color: lightTheme.colors.secondary, marginBottom: 10 },
						]}
					>
						Password
					</Text>
					<View style={styles.txtInput}>
						<TextInput
							mode="outlined"
							value={password}
							onChangeText={(value) => setPassword(value)}
							editable={true}
							style={[typography.body, { marginBottom: 10, lineHeight: 0  }]}
							activeOutlineColor="#374D96"
						/>
					</View>
				</View> */}

				{/* Mobile Number */}
				<View
					style={{
						flexDirection: 'column',
						marginBottom: 10,
					}}
				>
					<Text
						style={[
							typography.bodyHeading,
							{ color: lightTheme.colors.secondary, marginBottom: 10 },
						]}
					>
						Mobile Number
					</Text>
					<View style={styles.txtInput}>
						<TextInput
							mode="outlined"
							value={mobile}
							onChangeText={(value) => setMobile(value)}
							editable={true}
							style={[typography.body, { marginBottom: 10, lineHeight: 0 }]}
							activeOutlineColor="#374D96"
						/>
					</View>

			{/* user details edit*/}
			<View style={styles.container}>
				<View style={formStyles.fieldContainer}>
					<Text style={formStyles.label}>User Name</Text>
					<Input
						onChangeText={(text) => setName(text)}
						value={name}
						style={formStyles.input}
					/>
				</View>

				{/* <View style={formStyles.fieldContainer}>
					<Text style={formStyles.label}>Email Address</Text>
					<Input
						placeholder=""
						onChangeText={(text) => setEmail(text)}
						value={email}
						style={formStyles.input}
					/>
				</View> */}

				<View style={formStyles.fieldContainer}>
					<Text style={formStyles.label}>Mobile Number</Text>
					<Input
						onChangeText={(text) => setMobile(text)}
						value={mobile}
						style={formStyles.input}
					/>

				</View>


			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-end',
					marginBottom: 25,
				}}
			>

				<Btn
					title="Save Details"
					onPress={saveChanges}
					mode="contained"
					style={[
						primaryBtnStyle,
						{
							textAlign: "center",
							marginTop: 20
						},
					]}
				/>
			</View>
			</View>
			</View>
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

	profileImageTouchable: {
		width: 120,
		height: 120,
		borderRadius: 100,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: backgroundColor,
	},

	uploadImg: {
		borderRadius: 5,
		marginTop: 5,
		paddingVertical: 15,
		paddingHorizontal: 20,
		backgroundColor: primaryColor,
	},

	profileImageBackground: {
		width: 120,
		height: 120,
		alignItems: 'center',
		justifyContent: 'center',
	},

	bgColor: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5,
		backgroundColor: 'rgba(31, 31, 31, 0.5)',
	},

	rowData: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	inputRow: {
		width: '100%',
		paddingTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	input: {
		flex: 1,
		marginRight: 2,
	},

	txtInput: {
		height: 44,
		width: '100%',
		borderColor: lightTheme.colors.surface,
		borderWidth: 1,
		borderRadius: 4,
		marginVertical: 6,
		justifyContent: 'center',
	},

});

export default AccountSettingsScreen;
