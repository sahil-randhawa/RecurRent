import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet,Text,TouchableOpacity,View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import styles from '../styles/AuthStyles'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { TextInput } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../../firebaseConfig';

import {
	collection,
	doc,
	addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    orderBy,
    onSnapshot
} from 'firebase/firestore';
import { async } from '@firebase/util'
import { primaryColor } from '../styles/GlobalStyles'
const ChatScreen = ({navigation,route }) =>{
    const [chatText,setChatText] = useState('')
    const [messages, setMessages] = useState([]);
    const scrollViewRef = useRef(null);
    const sendMessage = async() =>{
        Keyboard.dismiss()
      console.log("Chat id",route.params.chatId)
        const q = query(collection(db, 'chats'), where("chatId", "==", route.params.chatId));

        const querySnapshot = await getDocs(q);
        console.log("chat q",querySnapshot.docs[0].data())
        const messagesCollectionRef = collection(querySnapshot.docs[0].ref, "messages");
        // const t = collection("chats").doc(querySnapshot.docs[0]).collection("messages")
        
        const chat=await addDoc(messagesCollectionRef, {
            timestemp: serverTimestamp(),
            message:chatText,
            email:auth.currentUser.email,
        });
        // db.collection("chats").doc(route.params.chatId).collection("messages").add({
        //     timestemp: firebase.firestore.FieldValue.serverTimestamp(),
        //     message:chatText,
        //     email:auth.currentUser.email,
        // })
        console.log("Message Sent",chat.id)
        setChatText("")
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true }); // Scroll to the end when a new message is sent
          }
    }

    useEffect(()=>{
        fetchMsg();
        
    },[])

    useLayoutEffect(()=>{
        
        fetchMsg()
        // console.log("messages on load",messages)
    },[route])

    fetchMsg = async() => {
        const q = query(collection(db, 'chats'), where("chatId", "==", route.params.chatId));

        const querySnapshot = await getDocs(q);
        console.log("chat q", querySnapshot.docs[0].data());

        // Get a reference to the "messages" subcollection
        const messagesRef = collection(querySnapshot.docs[0].ref, "messages");
        const orderedMessagesRef = query(messagesRef, orderBy("timestemp", "asc"));
        console.log("message Ref on load",messagesRef)
        // Set up the listener for the "messages" subcollection
        const unsubscribe = onSnapshot(orderedMessagesRef, (snapshot) => {
            setMessages(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            );
        });
        console.log("messages on load!",messages)
        return unsubscribe;  
    } 
    // const scrollToBottom = () => {
    //     scrollViewRef.current.scrollToEnd({ animated: true });
    //   };
    return(
        <SafeAreaView style={{flex:1,backgroundColor:"white"}}>
            <KeyboardAvoidingView
               behavior={Platform.OS === "ios" ? "padding" : "height"}
               style={styles.container}
               keyboardVerticalOffset={90}
               contentContainerStyle={{ flexGrow: 1 }}>
                    {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                <>
                <KeyboardAwareScrollView
                ref={scrollViewRef}
  contentContainerStyle={{ flexGrow: 1 }}
  extraHeight={Platform.OS === 'ios' ? 100 : 0} // Adjust this value as needed
>
                    {messages.map(({ id, data }) => {
                        if (data) {
                            return data.email === auth.currentUser.email ? (
                                <View style={styles.reciever} key={id}>
                                    <Text style={styles.recieverText}>{data.message}</Text>
                                </View>
                            ) : (
                                <View style={styles.sender} key={id}>
                                    <Text style={[styles.senderText,{color:"white"}]}>{data.message}</Text>
                                </View>
                            );
                        }
                        return null; // Handle the case when data is undefined
                    })}
                    </KeyboardAwareScrollView>
                    <View style={styles.footer}>
                        <TextInput placeholder='Your Message' 
                        value={chatText}
                        onChangeText={(text) => setChatText(text)}
                        style={styles.chatInput}
                        />
                        <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                        <Icon name="send" size={30} color="#2868E6"/>

                    </TouchableOpacity>
                    </View>
                    
                </>
                {/* </TouchableWithoutFeedback> */}

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles =StyleSheet.create({
    container:{
        flex:1,
    },

    reciever:{
        padding:15,
        backgroundColor:"#ECECEC",
        alignSelf:"flex-end",
        borderRadius:20,
        marginRight:15,
        marginBottom:20,
        maxWidth:"80%",
        position:"relative",
    },
    sender:{
        padding:15,
        backgroundColor:primaryColor,
        alignSelf:"flex-start",
        borderRadius:20,
        margin:15,
        maxWidth:"80%",
        position:"relative",
        color:"white"
    },
    recieverText:{
        color:"black",
        fontWeight:"500",
        marginLeft:10,
    },
    senderText:{
        fontWeight:"500",
        marginLeft:10,
        marginBottom:15,
    },
    footer:{
        flexDirection:"row",
        alignItems:"center",
        width:"100%",
        padding:15
    },
    chatInput:{
        bottom:0,
        height:20,
        flex:1,
        marginRight:15,
        borderColor:"transparent",
        backgroundColor:"#ECECEC",
        borderWidth:1,
        padding:10,
        color:"grey",
        // borderRadius:40,
    },
    recieverText:{},
    senderText:{}
})