import React, { useState,useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    FlatList
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
} from "../styles/GlobalStyles";


const ProductDetailsScreen = ({ navigation, route }) => {

    //Route Data
    const [selectedProduct, setSelectedProduct] = useState(route.params.combinedData.selectedProduct)
    
    const [ownerDetails, setOwnerDetails] = useState(route.params.combinedData.ownerData);
   
    // useEffect( () => {findOwner()},[])
    // const findOwner = async() => {
    //     try {
           
    //         const ownerID = selectedProduct.item.userID
    //         console.log(ownerID)
    //         const docRef = doc(db, "userProfiles",ownerID);
    //         const docSnap = await getDoc(docRef);

    //         if (docSnap.exists()) {
    //         console.log("Document data details:", docSnap.data());
    //         const data = docSnap.data();
    //             const documentId = ownerID; // Get the document ID

    //             setOwnerDetails({ ...data, documentId });
    //             console.log("Document data owner details:", ownerDetails);
                
    //         } else {
    //         // docSnap.data() will be undefined in this case
    //         console.log("No such document!");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    return (
        <>
        <View style={[
            spacing.container,
            { justifyContent: "space-evenly" }
        ]}>
            <View >
					
                    <Image
                            source={{ uri: selectedProduct.item["productPhoto"] }}
                            style={{ width: 300, height: 300 }}
                        />
			</View>
            <View>
                <Text style={[typography.title, { marginBottom: 10, color: textColor }]}>{selectedProduct.item.name}</Text>
                <Text style={[typography.body, { marginBottom: 10, color: textColor }]}>{selectedProduct.item.description}</Text>
                <Text style={[typography.body, { marginBottom: 10, color: primaryColor }]}>
                    Duration :
                    <Text style={[typography.body, { marginBottom: 10, color: textColor }]}> 
                        {selectedProduct.item.duration}
                    </Text>
                    </Text>
                    <Text style={[typography.body, { marginBottom: 10, color: primaryColor }]}>
                    Price :
                    <Text style={[typography.body, { marginBottom: 10, color: textColor }]}> 
                        {selectedProduct.item.price}
                    </Text>
                    </Text>
                    <Text style={[typography.body, { marginBottom: 10, color: primaryColor }]}>
                    Status :
                    <Text style={[typography.body, { marginBottom: 10, color: textColor }]}> 
                        {selectedProduct.item.status}
                    </Text>
                    </Text>

                    <Text style={[typography.heading, { marginBottom: 10, color: textColor }]}>Owner Details</Text>
                    <Text style={[typography.body, { marginBottom: 10, color: primaryColor }]}>
                    Owner Name :
                    <Text style={[typography.body, { marginBottom: 10, color: textColor }]}> 
                        {ownerDetails.name}
                    </Text>
                    </Text>

                    <Text style={[typography.body, { marginBottom: 10, color: primaryColor }]}>
                    Owner Email Address :
                    <Text style={[typography.body, { marginBottom: 10, color: textColor }]}> 
                        {ownerDetails.email}
                    </Text>
                    </Text>

                    <Text style={[typography.body, { marginBottom: 10, color: primaryColor }]}>
                    Owner Contact Number :
                    <Text style={[typography.body, { marginBottom: 10, color: textColor }]}> 
                        null
                    </Text>
                    </Text>
            </View>
            
        </View>
        </>
    )
}

const styles = StyleSheet.create({
 
  });
export default ProductDetailsScreen