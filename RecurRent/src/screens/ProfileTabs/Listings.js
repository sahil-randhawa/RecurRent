import React, { useState, useEffect } from 'react';
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
} from 'react-native';
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
} from '../../styles/GlobalStyles';
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
} from '../../components/Button';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from 'firebase/firestore';

const Listings = ({ navigation }) => {
	return (
		<>
			<View style={[spacing.container, { paddingVertical: 30, justifyContent: "space-between" }]}>
				<View style={{ paddingVertical: 80, alignItems: 'center' }}>
					<Image
						source={require('../../../assets/images/space.png')}
						style={styles.image}
					/>
					<Text
						style={[typography.heading, { textAlign: 'center', marginTop: 30 }]}
					>
						Let's Turn Your Space {'\n'} into Cash!
					</Text>
					<Text
						style={[
							typography.bodyHeading,
							{ textAlign: 'center', marginTop: 10 },
						]}
					>
						Once you get started use Your Listings {'\n'}
						to manage all your activities.
					</Text>
				</View>
				<Btn
					title="Create New Listing"
					onPress={() => {
						navigation.navigate('CreateNewListing');
					}}
					mode="contained"
					style={[
						primaryBtnStyle,
						{
							width: '100%',
							alignSelf: 'center',
							marginBottom: 15,
							color: lightTheme.colors.onPrimary,
						},
					]}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 180,
		height: 180,
	},
});

export default Listings;
