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

const Home = ({ navigation, route }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.holaWelcomeParent, styles.parentPosition]}>
                <Text style={styles.holaWelcome}>Hola! Welcome</Text>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.colorWhite,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Platform.OS === "android" ? 25 : StatusBar.currentHeight,
    },
    parentPosition: {
        // left: 20,
        position: "absolute",
        width: "100%",
        flex: 1,
        alignItems: "center",
    },
    holaWelcome: {
        fontSize: FontSize.size_11xl,
        letterSpacing: -0.3,
        lineHeight: 39,
        fontWeight: "700",
        fontFamily: FontFamily.poppinsBold,
        width: 339,
        textAlign: "left",
        color: Color.colorGray_100,
    },
})

export default Home;