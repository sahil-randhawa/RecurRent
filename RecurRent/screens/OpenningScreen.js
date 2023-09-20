import * as React from "react";
import { Text, StyleSheet, View,TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Padding, Border, FontFamily, FontSize, Color } from "../GlobalStyles";

const OpenningScreen = ({navigation, route}) => {
  const onCreateAccountClicked = () => {
    navigation.navigate('SignUp');
  }

  const onSignInClicked = () =>{
    navigation.navigate('LogIn')
  }
  return (
    <View style={styles.openningScreen}>
      <View style={styles.text}>
        <Text style={styles.recurrent}>RecurRent</Text>
        <Text style={styles.nowShareYour1}>
          Now share your personal items and utilize it
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.buttonPrimary1, styles.buttonFlexBox]} 
        onPress={onSignInClicked}>
        <Text style={[styles.button, styles.buttonTypo]} >Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      style={[styles.buttonSecondary1, styles.buttonFlexBox]}
      onPress={onCreateAccountClicked}>
        <Text style={[styles.button1, styles.buttonTypo]}>Create account</Text>
      </TouchableOpacity>
      <Image
        style={styles.component4Icon}
        contentFit="cover"
        source={require("../assets/component-4.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Padding.p_mid,
    // paddingHorizontal: Padding.p_133xl,
    flexDirection: "row",
    height: 56,
    width: 400,
    borderRadius: Border.br_3xs,
    left : 14,
    position: "absolute",
  },
  buttonTypo: {
    fontFamily: FontFamily.interSemiBold,
    lineHeight: 20,
    fontSize: FontSize.size_base,
    textAlign: "center",
    fontWeight: "600",
    
  },
  recurrent: {
    top: 0,
    left: 110,
    fontSize: 26,
    letterSpacing: 0.8,
    lineHeight: 33,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorBlack,
    textAlign: "left",
    fontWeight: "600",
    position: "absolute",
  },
  nowShareYour1: {
    top: 53,
    left: 20,
    fontSize: 17,
    lineHeight: 21,
    fontFamily: FontFamily.interRegular,
    color: "rgba(0, 53, 76, 0.7)",
    textAlign: "center",
    width: 319,
    position: "absolute",
  },
  text: {
    top: 471,
    left: 37,
    height: 95,
     width: 319,
    position: "absolute",
  },
  button: {
    color: Color.colorWhite,
  },
  buttonPrimary1: {
    top: 642,
    backgroundColor: "#0092ff",
  },
  button1: {
    color: "#1b1d1e",
  },
  buttonSecondary1: {
    top: 712,
    borderStyle: "solid",
    borderColor: "#b2b2b2",
    borderWidth: 1,
  },
  component4Icon: {
    top: 119,
    left: 80,
    width: 267,
    height: 228,
    position: "absolute",
  },
  openningScreen: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 852,
    overflow: "hidden",
  },
});

export default OpenningScreen;
