import React, { useState } from "react";
import { Image } from "expo-image";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { FontFamily, Padding, Border, Color, FontSize } from "../GlobalStyles";

const Home = ({navigation, route}) => {
    return(
        <View style={[styles.holaWelcomeParent, styles.parentPosition]}>
        <Text style={styles.holaWelcome}>Hola! Welcome</Text>
        </View>
    );
}


const styles = StyleSheet.create({
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