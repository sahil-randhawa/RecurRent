import React, { useState,useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
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
} from "../../styles/GlobalStyles";
import Btn, { primaryBtnStyle } from "../../components/Button";
import { StatusBar } from "expo-status-bar";
import { auth, db } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where,doc, getDoc } from "firebase/firestore";
import { Card, Title, Paragraph,Button } from 'react-native-paper';


const MainTab = ({ navigation, route }) => {

    useEffect( () => {getProductListings()},[])

	const [productsListings, setProductsListings] = useState([])
    const [ownerDetails, setOwnerDetails] = useState({});
    
    const getProductListings = async () => {
		try {
			const q = query(collection(db, "Products"), where("status", "==", "Available"));
			const querySnapshot = await getDocs(q);
			const resultsFromFirestore = []       
			querySnapshot.forEach((doc) => {             
				//console.log(doc.id, " => ", doc.data());
				
				const itemToAdd = {
					id: doc.id,
					...doc.data()
				}
				resultsFromFirestore.push(itemToAdd)
			});
	  
	
			// console.log("What is in our final array")
			// console.log(resultsFromFirestore)
	
			setProductsListings(resultsFromFirestore)           
	
		} catch (err) {
			console.log(err)
		} 
	  }

      const moreDetailsClicked = async(selectedProductData) =>{
        // alert(`Product : ${selectedProductData.item.name}`)
        try {
           
            const ownerID = selectedProductData.item.userID
            console.log(ownerID)
            const docRef = doc(db, "userProfiles",ownerID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            // const data = docSnap.data();
            //     // const documentId = ownerID; // Get the document ID

              
                const combinedData = {
                    selectedProduct: selectedProductData,
                    ownerData: docSnap.data(),
                  };
                  console.log("combine", combinedData)
                navigation.navigate("ProductDetails",{combinedData:combinedData})
                
            } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            // setOwnerDetails(null)
            const combinedData = {
                selectedProduct: selectedProductData,
                ownerData: {},
              };
              console.log("combine", combinedData)
            navigation.navigate("ProductDetails",{combinedData:combinedData})
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

      
    return (
        <>
            <View style={[
                spacing.container,
                { justifyContent: "space-evenly" }
            ]}>
                {/* <View style={{ flexDirection: "row" }}>
                    <Text style={typography.title}>RecurRent Home</Text>
                </View> */}
                <FlatList
           data={productsListings}
		   horizontal={true}
           renderItem={(rowData) => {
                return(
                    <Card style={styles.card}>
                        <Card.Cover source={{ uri: rowData.item['productPhoto'] }} />
                        <Card.Content>
                            <Title style={styles.cardTitle}>{rowData.item.name}</Title>
                            <Paragraph>Duration : {rowData.item.duration}</Paragraph>
                        </Card.Content>
                        <Card.Actions> 
                            <Button style={styles.moreDetailsButton} onPress={()=>{moreDetailsClicked(rowData)}}>
                                <Text>More Details</Text>
                            </Button>
                        </Card.Actions> 
                    </Card>
                )
           }
        }
            // ItemSeparatorComponent={ () => {
            //     return (<View style={ styles.separator }/>)
            // }}
       />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    
    card: {
        margin: 16,
    	width: 300,
		height:400
    },

    moreDetailsButton:{
        position: 'absolute',
        top: 0,   // Adjust top and left values to position the button as needed
        left: 0,
        zIndex: 1, 
        
    },
    cardTitle:{
        height:60,
    }
  });
export default MainTab