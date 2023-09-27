const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import SignUp from "./src/screens/signupScreen";
import OpenningScreen from "./src/screens/OpenningScreen";
import LogIn from "./src/screens/LogInScreen";
import Home from "./src/screens/HomeScreen";
import Splash from "./src/screens/Splash";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  const [fontsLoaded, error] = useFonts({
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "Manrope-Regular": require("./assets/fonts/Manrope-Regular.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OpenningScreen"
              component={OpenningScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LogIn"
              component={LogIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </>
  );
};
export default App;
