import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	FlatList,
	ScrollView,
	Dimensions
	
} from "react-native";
import Input from "../../components/Input";
import Toast from 'react-native-toast-message';
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
} from "../../styles/GlobalStyles";
import Btn, {
	primaryBtnStyle,
	secondaryBtnStyle,
} from "../../components/Button";
import { StatusBar } from "expo-status-bar";
// import styles from "../../styles/AuthStyles";
import { auth, db,firebase } from "../../../firebaseConfig";

import { signOut,sendPasswordResetEmail,EmailAuthProvider,reauthenticateWithCredential,updatePassword } from "firebase/auth";
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	documentId,
} from "firebase/firestore";

const { height: screenHeight } = Dimensions.get('window');
const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

	const changePasswordClicked = () =>{
	const user = auth.currentUser;

    if (!user) {
		Toast.show({
			type: 'info',
			position: 'bottom',
			text1: `User not Logged in Properly.`,
			visibilityTime: 3000,
			autoHide: true,
		});
      return;
    }

    if(newPassword != confirmPassword){
        alert("New Password & Confirm Password Does not match!")
        setConfirmPassword('')
        setCurrentPassword('')
        setNewPassword('')
        return;
    }
    else{

        const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
        );
        
        console.log(credential)
        reauthenticateWithCredential(user,credential)
        .then(() => {
            return updatePassword(user,newPassword);
        })
        .then(() => {
            console.log('Success', 'Password updated successfully');
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Password updated successfully!',
                visibilityTime: 3000,
                autoHide: true,
            });
            signOut(auth)
			.then(() => {
				navigation.navigate("OnBoardingScreen");
			})
			.catch((error) => {
				console.log(error);
			});
        })
        .catch((error) => {
            console.log(error)
            Toast.show({
                type: 'info',
                position: 'bottom',
                text1: `Error: Old Password might be wrong. Check it.`,
                visibilityTime: 3000,
                autoHide: true,
            });
        });
    }
	}
	return (
		<>
			<ScrollView>
            <View style={[
					styles.container,
					{height:screenHeight}
				]}>
						<View style={formStyles.fieldContainer}>
							
							<Text style={formStyles.label}>Old Password</Text>
                            <Input
							secureTextEntry={true}
								label="Old Password"
								placeholder="Please enter your old password"
								value={currentPassword}
								onChangeText={setCurrentPassword}
                                style={formStyles.input}
                            />
							
						</View>
						<View style={formStyles.fieldContainer}>
                        <Text style={formStyles.label}>New Password</Text>
							<Input
								label="New Password"
								placeholder="Please enter your New password"
								value={newPassword}
								onChangeText={setNewPassword}
								secureTextEntry={true}
                                style={formStyles.input}
							/>
							
						</View>
                        <View style={formStyles.fieldContainer}>
                        <Text style={formStyles.label}>Confirm Password</Text>
							<Input
								label="Confirm Password"
								placeholder="Please enter your Confirm password"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry={true}
                                style={formStyles.input}
							/>
							
						</View>
			
			
			<Btn
						title="Change Password"
						onPress={changePasswordClicked}
						mode="contained"
						style={[
							primaryBtnStyle,
							{
								width: "100%",
								alignSelf: "center",
                                marginTop:20,
								marginBottom: 15,
								color: lightTheme.colors.onPrimary,
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
		// flex: 1,
		padding: 20,
		backgroundColor: backgroundColor,
		width: '100%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingBottom: 30,
	},
});

export default ChangePassword;
