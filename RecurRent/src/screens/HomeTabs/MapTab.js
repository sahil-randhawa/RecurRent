import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    FlatList,
    ScrollView,
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
import {
    doc,
    addDoc,
    setDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
    getDoc,
} from "firebase/firestore";
import Search from "../../components/SearchBar";
import ProductCard from "../../components/Card";
// library for mapview and marker
import MapView, { Marker } from "react-native-maps";
// TODO: Import location library
import * as Location from "expo-location";

const MapTab = ({ navigation, route }) => {
    const [deviceLocation, setDeviceLocation] = useState(null);
    // const [selectedMarker, setSelectedMarker] = useState(null);
    const [productListings, setProductListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isAndroid = Platform.OS == 'android';

    useEffect(() => {
        console.log("getting current location:");
        getCurrentLocation();
    }, []);

    //fetch all the product listings from the database
    const getProductListings = async () => {
        try {
            const q = query(
                collection(db, "Products"),
                where("status", "==", "Available"),
                where("coordinates.lat", ">=", 1),
                // where("coordinates.lat", ">=", deviceLocation.lat - 0.1),
                // where("coordinates.lat", "<=", deviceLocation.lat + 0.1),
                // where("coordinates.lng", ">=", deviceLocation.lng - 0.1),
                // where("coordinates.lng", "<=", deviceLocation.lng + 0.1)
            );
            const querySnapshot = await getDocs(q);
            const resultsFromFirestore = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());

                const itemToAdd = {
                    id: doc.id,
                    ...doc.data(),
                };
                resultsFromFirestore.push(itemToAdd);
            });

            // console.log("What is in our final array")
            // console.log(resultsFromFirestore)

            setProductListings(resultsFromFirestore);
            setIsLoading(false);
        } catch (err) {
            console.log(err)
        }
    }


    //getting current location of the current user
    const getCurrentLocation = async () => {
        try {
            // 1. get permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log(`Permission to access location was denied`);
                alert(`Permission to access location was denied`);
                return;
            }
            console.log("Location Permission granted");

            let location = await Location.getCurrentPositionAsync({ accuracy: isAndroid ? Location.Accuracy.Low : Location.Accuracy.Lowest, });
            // let location = await Location.getCurrentPositionAsync();
            // alert(JSON.stringify(location));
            console.log(`Location data: ${JSON.stringify(location)}`);

            setDeviceLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });
            // deviceLocation
            console.log("device location:", JSON.stringify(deviceLocation, null, "\t"));
            // getting product listings
            console.log("getting product listings:");
            getProductListings();
        } catch (err) {
            console.log(err);
        }
    };

    const moreDetailsClicked = async (selectedProductData) => {
        // alert(`Product : ${selectedProductData.item.name}`)
        try {

            const ownerID = selectedProductData.item.userID
            console.log(`Product owner ID:` + ownerID)
            const docRef = doc(db, "userProfiles", ownerID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                // const data = docSnap.data();
                //     // const documentId = ownerID; // Get the document ID


                const combinedData = {
                    selectedProduct: selectedProductData,
                    ownerData: docSnap.data(),
                };
                console.log("combine", JSON.stringify(combinedData, null, "\t"))
                navigation.navigate("ProductDetails", { combinedData: combinedData })

            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
                // setOwnerDetails(null)
                const combinedData = {
                    selectedProduct: selectedProductData,
                    ownerData: {},
                };
                console.log("combine", JSON.stringify(combinedData, null, "\t"))
                navigation.navigate("ProductDetails", { combinedData: combinedData })
            }
        } catch (error) {
            console.log(error);
        }

        // console.log("final" , ownerDetails)
        // const combinedData = {
        //     selectedProduct: selectedProductData,
        //     ownerData: ownerDetails,
        //   };
        //   console.log("combine", combinedData)
        // navigation.navigate("ProductDetails",{combinedData:combinedData})
    }

    // Function to handle marker press to select the specific marker to use for later purposes
    const handleMarkerPress = (marker) => {
        // setSelectedMarker(marker);
        const selectedProductData = { "item": marker };
        console.log("this marker is pressed:\n", JSON.stringify(selectedProductData, null, "\t"));
        moreDetailsClicked(selectedProductData);
    };

    return (
        <SafeAreaView
            style={styles.mapContainer}
        >
            {isLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator
                        size="large"
                        color="#000"
                        animating={true}
                    />
                </View>
            ) : (
                <View>
                    {deviceLocation !== null && (
                        <View>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: deviceLocation.lat,
                                    longitude: deviceLocation.lng,
                                    latitudeDelta: 1.0,
                                    longitudeDelta: 0.8,
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: deviceLocation.lat,
                                        longitude: deviceLocation.lng,
                                    }}
                                    title="You are here"
                                    pinColor="blue"
                                    isPreselected={true}
                                ></Marker>
                                {productListings.map((marker) => (
                                    <Marker
                                        key={marker.id}
                                        coordinate={{
                                            latitude: marker.coordinates.lat,
                                            longitude: marker.coordinates.lng,
                                        }}
                                        title={marker.name}
                                        description={marker.description}
                                        onPress={() => handleMarkerPress(marker)}
                                    >
                                        <View style={{
                                            backgroundColor: primaryColor,
                                            padding: 5,
                                            borderRadius: 5,
                                        }}>
                                            <Text style={{
                                                fontWeight: "bold",
                                                color: "white",
                                            }}>
                                                {marker.name} ${marker.price}
                                            </Text>
                                        </View>
                                    </Marker>
                                ))}
                            </MapView>
                        </View>
                    )}
                </View>
            )}
        </SafeAreaView>
    )
}
export default MapTab

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        justifyContent: "center",
        // paddingHorizontal: 20,
        backgroundColor: backgroundColor,
    },
    map: {
        width: "100%",
        height: "100%",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});