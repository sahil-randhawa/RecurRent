import React from 'react';
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	ScrollView,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Alert,
} from 'react-native';
import { Avatar, List, Divider } from 'react-native-paper';
import {
	spacing,
	primaryColor,
	backgroundColor,
	tertiaryColor,
	textColor,
	typography,
	secondaryColor,
	lightTheme,
} from '../../styles/GlobalStyles';
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
	logoutBtnStyle,
} from '../../components/Button';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';

import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
const { height: screenHeight } = Dimensions.get('window');

const ProfileTab = ({ navigation, route }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState({});
	const [profileUrl, setProfileUrl] = useState(null);

	useEffect(() => {
		fetchFromDB();
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			fetchFromDB();
		}, [])
	);

	React.useLayoutEffect(() => {
		navigation.setOptions({
		  headerRight: () => (
			<TouchableOpacity
			  style={{ marginRight: 15 }}
			  onPress={confirmLogout}
			>
			  <Icon
					name="log-out-outline"
					size={26}
					color={primaryColor}
				/>
			</TouchableOpacity>
		  ),
		});
	  }, [navigation, onLogoutClicked]);

	  const confirmLogout = () => {
		Alert.alert(
		  'Sign Out',
		  'Are you sure you want to sign out?',
		  [
			{
			  text: 'Cancel',
			  style: 'cancel',
			},
			{
			  text: 'OK',
			  onPress: () => {
				// Call the logout function here
				onLogoutClicked();
			  },
			},
		  ],
		  { cancelable: true }
		);
	  };
	const fetchFromDB = async () => {
		console.log('Fetching from db: ' + auth.currentUser.email);
		try {
			// const q = query(
			// 	collection(db, "userProfiles"),
			// 	where("email", "==", auth.currentUser.email)
			// );
			// const querySnapshot = await getDocs(q);
			// querySnapshot.forEach((doc) => {
			// 	setUser(doc.data());
			// });
			const userDoc = await getDoc(
				doc(db, 'userProfiles', auth.currentUser.uid)
			);
			setUser(userDoc.data());
			setProfileUrl(userDoc.data().imageUrl ? userDoc.data().imageUrl : null);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
		console.log({ user });
	};

	const onLogoutClicked = () => {
		signOut(auth)
			.then(() => {
				navigation.reset({
					index: 0,
					routes: [{ name: 'OnBoardingScreen' }],
				});
				navigation.navigate('OnBoardingScreen');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const data = [
		{
			key: 'account-settings',
			title: 'Account Settings',
			description: 'Display picture, name and mobile',
			iconName: 'person-circle-outline',
			navigateTo: 'AccountSettings',
		},
		{
			key: 'messages',
			title: 'Messages',
			description: 'View and manage your messages',
			iconName: 'chatbox-ellipses-outline',
			navigateTo: 'Messages',
		},
		{
			key: 'wishlist',
			title: 'Wishlist',
			description: 'View saved listings',
			iconName: 'heart-outline',
			navigateTo: 'Wishlist',
		},
		{
			key: 'listings',
			title: 'Your Listings',
			description: 'View or edit your listings',
			iconName: 'reader-outline',
			navigateTo: 'Listings',
		},

		// {
		// 	key: 'settings',
		// 	title: 'Settings',
		// 	description: 'View app settings',
		// 	iconName: 'settings-outline',
		// 	navigateTo: 'Settings',
		// },

		{
			key: 'change-password',
			title: 'Change Password',
			description: 'Change your Password',
			iconName: 'key-outline',
			navigateTo: 'Change Password',
		},
	];

	return (
		// Profile Screen
		
		<View style={spacing.container}>
			{isLoading ? (
				<ActivityIndicator
					style={{
						marginTop: 50,
					}}
					animating={true}
					size="large"
				/>
			) : (
				<View style={styles.viewContainer}>
					
						<View style={styles.header}>
							<View style={{ borderWidth: 2, borderColor: primaryColor, borderRadius: 50 }}>
								<Avatar.Image
									size={75}
									source={
										profileUrl
											? { uri: profileUrl }
											: require('../../../assets/images/profile_placeholder.png')
									}
								/>
							</View>
							<View style={styles.textContainer}>
								<Text
									style={[
										typography.bodyHeading,
										{ color: textColor, marginBottom: 0 },
									]}
								>
									{user.name}
								</Text>
								{/* <Text style={typography.caption}>{user.email}</Text> */}
							</View>
						</View>
								
						<View style={styles.listContainer}>
							<FlatList
								data={data}
								renderItem={({ item, index }) => (
									<List.Item
										title={item.title}
										description={item.description}
										descriptionStyle={[
											typography.caption,
											{
												color: lightTheme.colors.onPrimaryContainer,
												marginTop: 5,
											},
										]}
										left={() => (
											<Icon
												name={item.iconName}
												size={24}
												color={primaryColor}
											/>
										)}
										right={() => (
											<Icon
												name="chevron-forward-outline"
												size={24}
												color={primaryColor}
											/>
										)}
										onPress={() => {
											navigation.navigate(item.navigateTo);
											// Navigate to the respective page when an item is pressed
										}}
										style={styles.listItem}
									/>
								)}
								keyExtractor={(item) => item.key}
								contentContainerStyle={styles.flatListContainer}
							/>
						</View>
							
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-end',
								marginBottom: 25,
							}}
						>
							{/* <Btn
								title="Sign Out"
								onPress={onLogoutClicked}
								mode="contained"
								style={[primaryBtnStyle, { flex: 1, textAlign: 'center' }]}
							/> */}
						</View>
					
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',

		width: screenWidth,
		paddingHorizontal: 20,
		height:screenHeight*0.8
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 20,
	},
	textContainer: {
		fontSize: 20,
		paddingLeft: 15,
	},
	flatListContainer: {
		justifyContent: 'center',
	},
	listContainer: {
		// flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingBottom: 80,
	},
	listItem: {
		marginVertical: 2,
		borderBottomWidth: 1,
		borderBottomColor: lightTheme.colors.primaryContainer,
	},
});

export default ProfileTab;
