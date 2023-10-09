import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput } from "react-native";
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
} from "../styles/GlobalStyles";
import Btn, { primaryBtnStyle } from "../components/Button";
import { auth, db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const Wishlist = () => {
    return (
        <View style={spacing.container}>
            <Text>Wishlist here</Text>
        </View>
    )
}
export default Wishlist