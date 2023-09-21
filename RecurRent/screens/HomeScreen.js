import React, { useState } from "react";
import { Image } from "expo-image";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Platform,
} from "react-native";
import { FontFamily, Padding, Border, Color, FontSize } from "../GlobalStyles";
import { StatusBar } from "expo-status-bar";
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const Home = ({ navigation, route }) => {

    const onLogoutClicked = () => {
        signOut(auth).then(() => {
            navigation.navigate('OpenningScreen');
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.parentPosition]}>
                <Text style={styles.holaWelcome}>Hola! Welcome</Text>
            </View>
            {/* logout button */}
            <TouchableOpacity
                style={[styles.buttonlogout]}
                onPress={onLogoutClicked}
            >
                <Text style={[styles.buttonTextLogout]}>Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Color.colorWhite,
        alignItems: "center",
        justifyContent: "space-evenly",
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        // paddingVertical: '20%',
    },
    parentPosition: {
        // left: 20,
        // position: "absolute",
        width: "100%",
        // flex: 1,
        alignItems: "center",
        backgroundColor: Color.colorWhite,
    },
    holaWelcome: {
        fontSize: FontSize.size_11xl,
        letterSpacing: -0.3,
        lineHeight: 39,
        fontWeight: "700",
        fontFamily: FontFamily.poppinsBold,
        // width: 339,
        textAlign: "left",
        color: Color.colorGray_100,
    },
    buttonlogout: {
        width: "80%",
        alignItems: "center",
        borderColor: Color.colorCrimson,
        borderWidth: 2,
        paddingVertical: Padding.p_mid,
        marginHorizontal: '10%',
        borderRadius: Border.br_3xs,
    },
    buttonTextLogout: {
        fontSize: FontSize.size_11xl,
        letterSpacing: -0.3,
        lineHeight: 39,
        fontWeight: "700",
        fontFamily: FontFamily.poppinsBold,
        // width: 339,
        // textAlign: "left",
        color: Color.colorCrimson,
    },
})

export default Home;