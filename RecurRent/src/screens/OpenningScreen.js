import * as React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { primaryColor, secondaryColor, textColor, backgroundColor, typography, spacing, border, lightTheme, darkTheme } from "../styles/GlobalStyles";

const OpenningScreen = ({ navigation, route }) => {
  const onCreateAccountClicked = () => {
    navigation.navigate('SignUp');
  }

  const onSignInClicked = () => {
    navigation.navigate('LogIn')
  }
  return (
    <View style={styles.openningScreen}>
      <View style={styles.text}>
        <Text style={[typography.heading, styles.recurrent]}>RecurRent</Text>
        <Text style={[typography.subheading, styles.nowShareYour1]}>
          Now rent out your underutilized items and earn extra income!
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.buttonPrimary1, styles.buttonFlexBox]}
        onPress={onSignInClicked}>
        <Text style={[typography.body, styles.button, styles.buttonTypo]} >Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonSecondary1, styles.buttonFlexBox]}
        onPress={onCreateAccountClicked}>
        <Text style={[typography.body, styles.button1, styles.buttonTypo]}>Create account</Text>
      </TouchableOpacity>
      <Image
        style={styles.component4Icon}
        contentFit="cover"
        source={require("../../assets/images/component-4.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.p_mid,
    // paddingHorizontal: Padding.p_133xl,
    flexDirection: "row",
    height: 56,
    width: '90%',
    marginHorizontal: '5%',
    borderRadius: border.br_3xs,
    // left: 14,
    position: "absolute",
  },
  buttonTypo: {
    lineHeight: 20,
    textAlign: "center",
  },
  recurrent: {
    top: 0,
    // left: 110,
    letterSpacing: 0.8,
    lineHeight: 33,
    color: primaryColor,
    // textAlign: "left",
    textAlign: "center",
    position: "relative",
  },
  nowShareYour1: {
    top: 20,
    // left: 20,
    lineHeight: 21,
    color: secondaryColor,
    textAlign: "center",
    // width: 319,
    paddingHorizontal: '20%',
    position: "relative",
  },
  text: {
    top: 471,
    // left: 37,
    height: 95,
    width: '100%',
    textAlign: "center",
    position: "absolute",
    // backgroundColor: "#15f5f5",
  },
  button: {
    color: lightTheme.colors.onPrimaryContainer,
  },
  buttonPrimary1: {
    top: 642,
    backgroundColor: primaryColor,
  },
  button1: {
    color: secondaryColor,
  },
  buttonSecondary1: {
    top: 712,
    borderStyle: "solid",
    borderColor: lightTheme.colors.outline,
    borderWidth: 1,
  },
  component4Icon: {
    top: '18%',
    left: '20%',
    width: '60%',
    height: 228,
    position: "absolute",
    overflow: "visible",
  },
  openningScreen: {
    backgroundColor: backgroundColor,
    flex: 1,
    width: "100%",
    // height: 852,
    // overflow: "hidden",
  },
});

export default OpenningScreen;
