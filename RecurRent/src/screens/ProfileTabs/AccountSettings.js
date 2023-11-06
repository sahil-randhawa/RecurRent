import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, firebase } from '../../../firebaseConfig';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { List, Button, Avatar, IconButton } from 'react-native-paper';
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
	primaryColor,
	spacing,
	typography,
} from '../../styles/GlobalStyles';

const AccountSettingsScreen = () => {
	const fields = [
		{ key: 'name', label: 'NAME', initialValue: 'John Doe' },
		{ key: 'email', label: 'EMAIL', initialValue: 'johndoe@example.com' },
		{ key: 'password', label: 'PASSWORD', initialValue: '********' },
		{
			key: 'mobileNumber',
			label: 'MOBILE NUMBER',
			initialValue: '123-456-7890',
		},
	];

	const [editingField, setEditingField] = useState(null);
	const fieldStates = {};

	fields.forEach((field) => {
		fieldStates[field.key] = useState(false);
	});

	const [imageToUpload, setImageToUpload] = useState(null);
	const [uploading, setUploading] = useState(false);

	// get logged in user details from the db
	const [user, setUser] = useState(null);
	const [profileUrl, setProfileUrl] = useState(null);

	useEffect(() => {
		getUser();
	}, []);


	const getUser = async () => {
		try {
			const user = await getDoc(doc(db, 'userProfiles', auth.currentUser.uid));
			if (!user.exists) {
				console.log('No such user!');
			} else {
				console.log('User profile data:', JSON.stringify(user.data(), null, 2));
				setUser(user.data());
				// setProfileUrl(user.data().imageUrl ? user.data().imageUrl : `https://ui-avatars.com/api/?name=${user.data().name}&size=128&length=1`);
				setProfileUrl(user.data().imageUrl ? user.data().imageUrl : null);

			}
		} catch (e) {
			console.log('Error in fetching user: ' + e);
		}
	};

	const pickImage = async () => {
		console.log('Picking image...');
		try {
			setImageToUpload(null);
			const result = await ImagePicker.launchImageLibraryAsync({  // launchCameraAsync
				mediaTypes: ImagePicker.MediaTypeOptions.Images,  // All, Images, Videos
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

			const filename = imageToUpload.substring(imageToUpload.lastIndexOf('/') + 1);

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

	const handleSaveChanges = (fieldKey) => {
		// Implement saving changes here for the specific field
		// Update user's information with the new values
		fieldStates[fieldKey][1](false); // Turn off editing for the specific field
	};

	const handleEditClick = (fieldKey) => {
		// Close the previously open edit field
		if (editingField) {
			fieldStates[editingField][1](false);
		}

		// Open the edit field for the clicked item
		setEditingField(fieldKey);
		fieldStates[fieldKey][1](true);
	};

	const renderField = (field) => {
		const [isEditing, setIsEditing] = fieldStates[field.key];
		const [newValue, setNewValue] = useState(field.initialValue);

		return (
			<View
				key={field.key}
				style={styles.infoRow}
			>
				<List.Item
					title={field.label}
					titleStyle={typography.captionHeading}
					description={
						isEditing ? (
							<View style={styles.inputRow}>
								<Input
									value={newValue}
									onChangeText={setNewValue}
									style={[{ width: '70%', marginRight: 2, marginTop: 0 }]}
								/>
								<Btn
									title="Save"
									titleStyle={typography.caption}
									onPress={() => {
										handleSaveChanges(field.key);
									}}
									mode="contained"
									style={{
										textAlign: 'center',
										margin: 0,
										borderRadius: 5,
										backgroundColor: primaryColor,
										padding: 0,
										width: '30%',
									}}
								/>
							</View>
						) : (
							<View style={styles.rowData}>
								<Text>{newValue}</Text>
								<Btn
									title="Edit"
									onPress={() => {
										handleEditClick(field.key);
									}}
									mode="contained"
									style={{
										textAlign: 'center',
										width: '25%',
										margin: 0,
										borderRadius: 5,
										backgroundColor: primaryColor,
										paddingVertical: 1,
									}}
								/>
							</View>
						)
					}
					descriptionStyle={styles.rowData}
				/>
			</View>
		);
	};

	return (
		<View style={[spacing.container, {
			justifyContent: 'flex-start',
		}]}>
			{/* profile image edit */}
			<View style={[styles.rowData, {
				justifyContent: 'space-around',
			}]}>
				<View style={{
					marginTop: 35,
					marginBottom: 20,
				}}>
					<TouchableOpacity
						style={{
							width: 120,
							height: 120,
							borderRadius: 100,
							overflow: 'hidden',
							borderWidth: 1,
							borderColor: '#707070',
						}}
						onPress={() => {
							pickImage();
						}}>
						<ImageBackground
							style={{
								width: 120,
								height: 120,
								alignItems: 'center',
								justifyContent: 'center',
							}}
							imageStyle={{ borderRadius: 50 }} // to make it circular
							// source={{ uri: imageToUpload ? imageToUpload : profileUrl }}
							source={profileUrl ? { uri: imageToUpload ? imageToUpload : profileUrl } : (imageToUpload ? { uri: imageToUpload } : require('../../../assets/images/profile_placeholder.png'))}
						>
							{uploading ? (<ActivityIndicator
								size="large"
								color="#fff"
								animating={true}
							/>) : (<View style={{
								flex: 1,
								width: '100%',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
								<View style={{
									flex: 2,
								}}></View>
								<View
									style={{
										flex: 1,
										width: '100%',
										justifyContent: 'center',
										alignItems: 'center',
										// borderBottomLeftRadius: 100,
										// borderBottomRightRadius: 100,
										marginTop: 5,
										backgroundColor: 'rgba(0,0,0,0.5)',
									}}
								>
									{/* <Text style={{
								color: '#fff',
								fontSize: 12,
								fontWeight: 'bold',
							}}>Edit</Text> */}
									<IconButton
										icon="pencil"
										color="#fff"
										size={20}
									/>
								</View>
							</View>)}
						</ImageBackground>
					</TouchableOpacity>
				</View>
				{imageToUpload &&
					<TouchableOpacity
						style={{
							borderRadius: 5,
							marginTop: 5,
							paddingVertical: 15,
							paddingHorizontal: 20,
							backgroundColor: primaryColor,
						}}
						onPress={() => {
							uploadImage();
						}}>
						<Text style={{
							color: '#fff',
							fontSize: 12,
							fontWeight: 'bold',
						}}>Save Image</Text>
					</TouchableOpacity>
				}
			</View>

			{/* user details edit*/}
			{fields.map((field) => renderField(field))}
		</View>
	);
};

const styles = StyleSheet.create({
	infoRow: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
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
});

export default AccountSettingsScreen;
