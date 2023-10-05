import React from "react";
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	ScrollView,
	FlatList,
	StyleSheet,
} from "react-native";
import { Avatar, List, Divider } from "react-native-paper";
import {
	spacing,
	primaryColor,
	tertiaryColor,
	textColor,
	typography,
} from "../../styles/GlobalStyles";
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
	logoutBtnStyle,
} from "../../components/Button";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const ProfileTab = ({ navigation, route }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState({});

	useEffect(() => {
		fetchFromDB();
	}, []);

	const onLogoutClicked = () => {
		signOut(auth)
			.then(() => {
				navigation.navigate("OnBoardingScreen");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const data = [
		{
			key: "messages",
			title: "Messages",
			iconName: "chatbox-ellipses-outline",
		},
		{ key: "orders", title: "Your Orders", iconName: "reader-outline" },
		{ key: "reviews", title: "Your Reviews", iconName: "star-outline" },
		{ key: "wishlist", title: "Wishlist", iconName: "heart-outline" },
		{ key: "settings", title: "Settings", iconName: "settings-outline" },
	];


    const fetchFromDB = async () => {
        console.log("fetching from db: " + auth.currentUser.email);
        try {
            const q = query(collection(db, "userProfiles"), where("email", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
            
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
        console.log({ user });
    };

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
				<View style={[spacing.container, styles.viewContainer]}>
					<View style={styles.header}>
						<View>
							<Avatar.Image
								size={70}
								source={{ uri: "https://i.pravatar.cc/300" }}
							/>
						</View>
						<View style={styles.textContainer}>
							<Text style={[typography.heading, { marginBottom: 0 }]}>
								{user.name}
							</Text>
							<Text style={typography.caption}>{user.email}</Text>
						</View>
					</View>
					<Divider />
					<FlatList
						data={data}
						renderItem={({ item }) => (
							<List.Item
								title={item.title}
								left={() => (
									<Icon name={item.iconName} size={24} color={primaryColor} />
								)}
							/>
						)}
						keyExtractor={(item) => item.key}
						contentContainerStyle={styles.flatListContainer}
					/>
					<View
						style={{
							marginBottom: 15,
							flexDirection: "row",
						}}
					>
						<Btn
							title="Log Out"
							onPress={onLogoutClicked}
							mode="outlined"
							style={[
								secondaryBtnStyle,
								{
									flex: 1,
									textAlign: "center",
									border: 2,
									borderColor: tertiaryColor,
								},
							]}
						/>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		alignItems: "flex-start",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 20,
	},
	textContainer: {
		fontSize: 20,
		paddingLeft: 10,
	},
});

export default ProfileTab;

