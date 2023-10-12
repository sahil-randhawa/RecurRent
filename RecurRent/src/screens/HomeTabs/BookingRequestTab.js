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
    Image,
    Pressable,
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
import { collection, getDocs, query, where, doc, getDoc, documentId, getDocFromCache } from "firebase/firestore";
import Search from "../../components/SearchBar";
import ProductCard from "../../components/Card";

const BookingRequestTab = ({ navigation, route }) => {
    useEffect(() => {
        getRequestedProductListings();
    }, []);

    const [ownerRequestsListings, setOwnerRequestsListings] = useState([])
    // const [ownerInfo, setOwnerInfo] = useState()
    // const [renterInfo, setRenterInfo] = useState()

    const getRequestedProductListings = async () => {
        console.log("user id", auth.currentUser.uid)
        try {
            const q = query(
                collection(db, "Bookings"),
                where("ownerID", "==", auth.currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const resultsFromFirestore = [];

            querySnapshot.forEach(async (docc) => {
                console.log(docc.id, " => ", docc.data());
                const currentDoc = docc.data()
                console.log(currentDoc.productID)
                const documentRef = doc(db, 'Products', currentDoc.productID);
                const documentRefRenter = doc(db, 'userProfiles', currentDoc.renterID);
                // getDoc(documentRef)
                // .then((docSnapshot) => {
                //     if (docSnapshot.exists()) {
                //     const documentData = docSnapshot.data();
                //     console.log("Requested product", documentData)
                //     const itemToAdd = {
                //         nameRenter:"Chitra",
                //         id: docc.id,
                //         ...docSnapshot.data()
                //     };
                //     console.log("Item to Add",itemToAdd)
                //     resultsFromFirestore.push(itemToAdd);

                //     } else {
                //     console.log('Document does not exist');
                //     }
                // })
                // .catch((error) => {
                //     console.error('Error getting document:', error);
                // });



                getDoc(documentRefRenter)
                    .then((docSnapshotrenter) => {
                        if (docSnapshotrenter.exists()) {
                            const renter = docSnapshotrenter.data();
                            console.log("Requested Renter", renter)
                            getDoc(documentRef)
                                .then((docSnapshot) => {
                                    if (docSnapshot.exists()) {
                                        const documentData = docSnapshot.data();
                                        console.log("Requested product", documentData)
                                        const itemToAdd = {
                                            renterName: renter.name,
                                            renterEmail: renter.email,
                                            renterMobileNumber: renter.mobileNumber,
                                            id: docc.id,
                                            ...docSnapshot.data()
                                        };
                                        console.log("Item to Add", itemToAdd)
                                        resultsFromFirestore.push(itemToAdd);

                                    } else {
                                        console.log('Document does not exist');
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error getting document:', error);
                                });


                        } else {
                            console.log('Renter Document does not exist');
                        }
                    })
                    .catch((error) => {
                        console.error('Error getting document:', error);
                    });


            });


            console.log("requets for owner", resultsFromFirestore)
            setOwnerRequestsListings(resultsFromFirestore);
            setRenterInfo(renter)
        } catch (err) {
            console.log(err)
        }
    }




    return (
        <>
            <ScrollView style={{ padding: 10 }}>
                {/* <View style={[spacing.container, { justifyContent: "space-evenly" }]}> */}

                <FlatList
                    data={ownerRequestsListings}
                    renderItem={(rowData) => {
                        return (
                            <View
                                style={{
                                    marginBottom: 10,
                                    backgroundColor: "#fff",
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                            >
                                <View style={{
                                    flexDirection: "row",
                                    // paddingBottom: 10
                                }}>
                                    <View>
                                        <Image source={{ uri: rowData.item["productPhoto"] }} style={styles.productImg} resizeMode={"cover"} />
                                    </View>
                                    <View style={{ paddingLeft: 20, flex: 1, }}>
                                        <Text style={typography.subheading}>{rowData.item.name}</Text>
                                        <Text><Text style={typography.bodyHeading}>Renter Name:</Text> {rowData.item.renterName}</Text>
                                        <Text><Text style={typography.bodyHeading}>Email:</Text> {rowData.item.renterEmail}</Text>
                                        <Text><Text style={typography.bodyHeading}>Contact:</Text> {rowData.item.renterMobileNumber}</Text>
                                        <View style={{
                                            flexDirection: "row",
                                            paddingTop: 5,
                                            flex: 1,
                                            justifyContent: "space-between",
                                        }}>
                                            <Pressable style={styles.btnConfirm} onPress={() => alert(rowData.item.id)}>
                                                <Text style={{ fontWeight: "bold", color: "#fff" }}>Confirm</Text>
                                            </Pressable>
                                            <Pressable style={styles.btnDecline} onPress={() => alert(rowData.item.id)}>
                                                <Text style={{ fontWeight: "bold", color: "#fff" }}>Decline</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>



                            </View>
                        );
                    }}
                    contentContainerStyle={{ paddingVertical: 10 }}
                />
                {/* </View> */}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    productImg: {
        width: 140,
        height: 150,
        padding: 10,
        borderColor: "black",
        borderWidth: 3
    },
    btnConfirm: {
        // width: "auto",
        backgroundColor: "#A0C49D",
        padding: 12,
        borderRadius: 10,
        // marginHorizontal: 20
    },
    btnDecline: {
        // width: "auto",
        backgroundColor: "#FF6666",
        padding: 12,
        borderRadius: 10,
        // marginHorizontal: 20
    },
});
export default BookingRequestTab;
