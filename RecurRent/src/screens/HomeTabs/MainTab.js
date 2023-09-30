import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Platform,
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
import Btn, { primaryBtnStyle } from "../../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../../../firebaseConfig";

const MainTab = () => {
    return (
        <>
            <View style={[
                spacing.container,
                { justifyContent: "space-evenly" }
            ]}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={typography.title}>RecurRent Home</Text>
                </View>
            </View>
        </>
    )
}
export default MainTab