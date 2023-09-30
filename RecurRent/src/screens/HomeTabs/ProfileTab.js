import React from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import {
    spacing,
    primaryColor,
    tertiaryColor,
    textColor,
} from '../../styles/GlobalStyles'
import Btn, { primaryBtnStyle, secondaryBtnStyle, logoutBtnStyle } from "../../components/Button";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";


const ProfileTab = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        fetchFromDB();
    }, []);

    const fetchFromDB = async () => {
        console.log("fetching from db: " + auth.currentUser.email);
        try {
            const q = query(collection(db, "userProfiles"), where("email", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
            console.log({ user });
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };


    const onLogoutClicked = () => {
        signOut(auth)
            .then(() => {
                navigation.navigate("OnBoardingScreen");
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        // Profile Screen
        <View style={{ flex: 1 }}>
            {isLoading ? (
                <ActivityIndicator
                    style={{
                        marginTop: 50,
                    }}
                    animating={true}
                    size="large"
                />
            ) : (
                <View style={spacing.container}>
                    <View style={spacing.container}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/300' }}
                            style={{ width: 100, height: 100, borderRadius: 100 / 2 }}
                        />
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            marginVertical: 20,
                        }}>
                            {/* {user.name} */}
                            User Name
                        </Text>
                        <Text style={{
                            fontSize: 16,
                        }}>
                            Email
                        </Text>
                    </View>
                    <View style={{
                        marginBottom: 15,
                        flexDirection: "row"
                    }}>
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
                                }
                            ]}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}
export default ProfileTab