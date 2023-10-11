import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
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
import Icon from 'react-native-vector-icons/Entypo';
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

const Wishlist = () => {
    const [user, setUser] = useState({});
    const [wishList, setWishList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFromDB();
    }, []);

    useEffect(() => {
        if (user.favlist) {
            getFavList();
        }
    }, [user]);

    const fetchFromDB = async () => {
        try {
            const q = query(collection(db, "userProfiles"), where("email", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getFavList = async () => {
        const resultsFromFirestore = [];
        await Promise.all(
            user.favlist.map(async (value) => {
                try {
                    const docRef = doc(db, 'Products', value);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log('Document data:', data);
                        resultsFromFirestore.push(data);
                    } else {
                        console.log('Document does not exist.');
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
            })
        );
        setWishList(resultsFromFirestore);
        console.log("WishList data:", wishList);

        try { }
        finally {
            setLoading(false);
        }
    }

    const handlePress = (item) => {
        // Handle press on the item, e.g., navigate to details or perform an action
        console.log(`Pressed item:` + JSON.stringify(item, null, "\t"));
    };

    return (
        <View style={spacing.container}>
            {loading ? (
                <ActivityIndicator size="large" color={primaryColor} />
            ) : wishList.length === 0 ? (
                <Text style={{ textAlign: "center", alignSelf: "center" }}>Currently, your wishlist is empty.{'\n'}Keep Browsing!</Text>
            ) : (
                <View>
                    <FlatList
                        data={wishList}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </View>
                                <Icon name="chevron-right" size={24} color={textColor.primary} style={styles.arrowIcon} />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.name}
                    />
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    itemContainer: {
        width: 380,
        //this should be changed so that it automatically fits the screen
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: lightTheme.colors.border,
        backgroundColor: lightTheme.colors.primaryContainer,
    },
    itemContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    itemText: {
        fontSize: 16,
        color: textColor.primary,
    },
    arrowIcon: {
        marginLeft: 10,
    },
});

export default Wishlist;
