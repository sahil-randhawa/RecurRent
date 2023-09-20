import React, { useState } from "react";
import { Image } from "expo-image";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { FontFamily, Padding, Border, Color, FontSize } from "../GlobalStyles";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    return (
        <View style={styles.login}>
            <Image
                style={styles.loginChild}
                contentFit="cover"
                source={require("../assets/star-8.png")}
            />
            <View style={[styles.holaWelcomeParent, styles.parentPosition]}>
                <Text style={styles.holaWelcome}>Welcome Back</Text>
                <View style={styles.input}>
                    <Text style={[styles.title, styles.textTypo]}>Email</Text>
                    <View style={[styles.inputField, styles.inputLayout]}>
                        <TextInput
                            style={[styles.text, styles.textLayout]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="example@gmail.com"
                        />
                    </View>
                    <Text style={styles.error}>Error</Text>
                </View>
                <View style={styles.input1}>
                    <Text style={[styles.title, styles.textTypo]}>Password</Text>
                    <View style={[styles.inputField1, styles.inputLayout]}>
                        <TextInput
                            style={[styles.text, styles.textLayout]}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="your password"
                            secureTextEntry={true}
                        />
                    </View>
                    <Text style={styles.error}>Error</Text>
                </View>
                {/* <View style={styles.fPassword}>
                <Text style={styles.forgotPassword}>
                  Forgot password?
               </Text>
                </View> */}
                <TouchableOpacity
                    style={[
                        styles.buttonPrimary,
                        styles.buttonPrimaryFlexBox
                    ]}
                >
                    <Text style={[
                        styles.button,
                        styles.logInTypo
                    ]}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.frameParent, styles.parentPosition]}>
                <View>
                    <View style={styles.component2}>
                        <Text style={[styles.orRegisterWith, styles.alreadyHaveAnClr]}>
                            Or continue with
                        </Text>
                        <View style={[styles.component2Child, styles.component2Position]} />
                        <View style={[styles.component2Item, styles.component2Position]} />
                    </View>
                    <TouchableOpacity style={[styles.buttonWithCenteredIcon, styles.inputLayout]}>
                        <View
                            style={[
                                styles.socialIconGoogleParent,
                                styles.buttonPrimaryFlexBox,
                            ]}
                        >
                            <Image
                                style={styles.socialIconGoogle}
                                contentFit="cover"
                                source={require("../assets/social-icon--google.png")}
                            />
                            <Text style={[styles.google, styles.logInTypo]}>Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.alreadyHaveAnClr, styles.titleLayout]}>
                    <Text style={styles.alreadyHaveAnClr}>{`Don't have an account? `}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={[styles.logIn, styles.logInTypo]}>Create one</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    parentPosition: {
        // left: 20,
        position: "absolute",
        width: "100%",
        flex: 1,
        alignItems: "center",
    },
    textTypo: {
        fontFamily: FontFamily.interRegular,
        textAlign: "left",
    },
    inputLayout: {
        paddingVertical: Padding.p_lg,
        borderWidth: 1,
        borderStyle: "solid",
        alignItems: "center",
        width: 353,
        borderRadius: Border.br_3xs,
        backgroundColor: Color.colorWhite,
    },
    textLayout: {
        lineHeight: 20,
        fontSize: FontSize.size_base,
    },
    iconLayout: {
        marginLeft: 10,
        height: 20,
        width: 20,
        overflow: "hidden",
    },
    buttonPrimaryFlexBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    logInTypo: {
        fontFamily: FontFamily.interSemiBold,
        fontWeight: "600",
    },
    alreadyHaveAnClr: {
        color: Color.colorGray_300,
        fontFamily: FontFamily.interRegular,
    },
    component2Position: {
        borderTopWidth: 1,
        bottom: "47.22%",
        top: "47.22%",
        width: "32.29%",
        height: "5.56%",
        borderColor: Color.colorWhitesmoke,
        borderStyle: "solid",
        position: "absolute",
    },
    titleLayout: {
         marginTop: 20,
        lineHeight: 18,
        fontSize: FontSize.size_sm,
    },
    loginChild: {
        top: 47,
        left: 320,
        width: 46,
        height: 44,
        position: "absolute",
    },
    holaWelcome: {
        fontSize: FontSize.size_11xl,
        letterSpacing: -0.3,
        lineHeight: 39,
        fontWeight: "700",
        fontFamily: FontFamily.poppinsBold,
        width: 339,
        textAlign: "left",
        color: Color.colorGray_100,
    },
    title: {
        lineHeight: 18,
        fontSize: FontSize.size_sm,
        color: Color.colorGray_100,
    },
    text: {
        color: Color.colorGray_200,
        fontFamily: FontFamily.interRegular,
        textAlign: "left",
        flex: 1,
        lineHeight: 20,
        fontSize: FontSize.size_base,
    },
    icon: {
        display: "none",
    },
    inputField: {
        marginTop: 6,
        alignItems: "center",
        paddingHorizontal: Padding.p_base,
        borderColor: Color.colorWhitesmoke,
        paddingVertical: Padding.p_lg,
        flexDirection: "row",
        borderWidth: 1,
        borderStyle: "solid",
    },
    error: {
        fontSize: FontSize.size_smi,
        lineHeight: 16,
        fontWeight: "500",
        fontFamily: FontFamily.interMedium,
        color: Color.colorCrimson,
        display: "none",
        marginTop: 6,
        textAlign: "left",
    },
    input: {
        marginTop: 30,
    },
    inputField1: {
        justifyContent: "flex-end",
        marginTop: 6,
        alignItems: "center",
        paddingHorizontal: Padding.p_base,
        borderColor: Color.colorWhitesmoke,
        paddingVertical: Padding.p_lg,
        flexDirection: "row",
        borderWidth: 1,
        borderStyle: "solid",
    },
    input1: {
        justifyContent: "center",
        marginTop: 30,
    },
    button: {
        color: Color.colorWhite,
        textAlign: "center",
        lineHeight: 20,
        fontSize: FontSize.size_base,
    },
    buttonPrimary: {
        backgroundColor: Color.colorDodgerblue,
        height: 56,
        // paddingHorizontal: Padding.p_133xl,
        paddingVertical: Padding.p_mid,
        justifyContent: "center",
        alignItems: "center",
        width: 353,
        borderRadius: Border.br_3xs,
        flexDirection: "row",
        marginTop: 30,
    },
    holaWelcomeParent: {
        top: 145,
    },
    fPassword:{
      display: 'inline-flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end'
    },
    forgotPassword: {
      marginTop: 20,
      color: '#000',
      fontFamily: 'Inter',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      textAlign: 'right',
    },
    orRegisterWith: {
        top: "0%",
        left: "34.84%",
        lineHeight: 18,
        fontSize: FontSize.size_sm,
        textAlign: "left",
        position: "absolute",
    },
    component2Child: {
        right: "-0.14%",
        left: "67.85%",
    },
    component2Item: {
        right: "67.85%",
        left: "-0.14%",
    },
    component2: {
        height: 18,
        width: 353,
    },
    socialIconGoogle: {
        height: 20,
        width: 20,
        overflow: "hidden",
    },
    google: {
        color: Color.colorBlack,
        marginLeft: 12,
        lineHeight: 20,
        fontSize: FontSize.size_base,
        textAlign: "left",
    },
    socialIconGoogleParent: {
        alignItems: "center",
    },
    buttonWithCenteredIcon: {
        borderColor: Color.colorGainsboro,
        height: 54,
        paddingHorizontal: Padding.p_26xl,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: Padding.p_lg,
        borderWidth: 1,
        borderStyle: "solid",
    },
    logIn: {
        color: Color.colorGray_100,
    },
    alreadyHaveAnContainer: {
        marginTop: 50,
        // textAlign: "left",
    },
    frameParent: {
        top: 638,
        alignItems: "center",
    },
    login: {
        width: "100%",
        height: 852,
        overflow: "hidden",
        backgroundColor: Color.colorWhite,
        flex: 1,
    },
});

export default Login;
