import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	FlatList,
	ScrollView,
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
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
} from "../../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from "firebase/firestore";

const Messages = ({ navigation,route }) => {

	const [userRequestListings, setUserRequestListings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUserListings();
	}, []);


	const getUserListings = async () => {
		try {
			const q = query(collection(db, "Bookings"), where("renterID", "==", auth.currentUser.uid),where("bookingStatus", "==" , "Requested"));
			const querySnapshot = await getDocs(q);
	  
			const allUserRequestListings = [];
			querySnapshot.forEach(async (docr) => {
				docData = docr.data()
				console.log("Product Id:", docData.productID)
				try {
					const productDocRef = doc(db, "Products", docData.productID);
					const productDoc = await getDoc(productDocRef);
			
					if (productDoc.exists()) {
					  const productData = productDoc.data();
					  console.log("Document data:", productData);
					  allUserRequestListings.push(productData);
					} else {
					  console.log("No such document for product ID:", docData.productID);
					}
				  } catch (error) {
					console.error("Error getting product document:", error);
				  }
				 
			});
	  
			setUserRequestListings(allUserRequestListings); // Set the state with the array of documents
		  } catch (error) {
			console.error("Error fetching data from Firestore:", error);
		}

		try {
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<View style={spacing.container}>
				<Image
					source={require('../../../assets/images/noMessage.png')}
					style={styles.image}
				/>
				<Text
					style={[
						typography.bodyHeading,
						{ textAlign: 'center', marginTop: 30 },
					]}
				>
					We'll notify you when {'\n'}
					you get new messages.
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 100,
		height: 100,
	},
});

export default Messages;
