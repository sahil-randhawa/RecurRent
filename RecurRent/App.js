import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createStackNavigator } from '@react-navigation/stack';

import OnBoardingScreen from "./src/screens/OnBoardingScreen";
import LogInScreen from "./src/screens/LogInScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreen from "./src/screens/SignupScreen";
import Splash from "./src/screens/Splash";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import CreateNewListing from "./src/screens/CreateNewListing";
import Messages from "./src/screens/ProfileTabs/Messages";
import Wishlist from "./src/screens/ProfileTabs/Wishlist";
import Listings from "./src/screens/ProfileTabs/Listings";
import AccountSettings from "./src/screens/ProfileTabs/AccountSettings";
import Settings from "./src/screens/ProfileTabs/Settings";
import { typography } from "./src/styles/GlobalStyles";


const Stack = createStackNavigator();

const App = () => {
	const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
	const [fontsLoaded, error] = useFonts({
		"Montserrat-Black": require("./assets/fonts/Montserrat-Black.ttf"),
		"Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
		"Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
		"Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
		"Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
		"Manrope-Regular": require("./assets/fonts/Manrope-Regular.ttf"),
		"Manrope-Medium": require("./assets/fonts/Manrope-Medium.ttf"),
	});

	if (!fontsLoaded && !error) {
		return null;
	}

	return (
		<>
			<NavigationContainer>
				{hideSplashScreen ? (
					<Stack.Navigator
						screenOptions={{ headerShown: false }}
						initialRouteName="Splash">
						<Stack.Screen
							name="Splash"
							component={Splash}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="OnBoardingScreen"
							component={OnBoardingScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="SignUp"
							component={SignUpScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="LogIn"
							component={LogInScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Home"
							component={HomeScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="ProductDetails"
							component={ProductDetailsScreen}
							options={{ headerShown: true }}
						/>
						<Stack.Screen
							name="CreateNewListing"
							component={CreateNewListing}
							options={{ headerShown: true, title: "Create New Listing" }}
						/>
						<Stack.Screen
							name="Messages"
							component={Messages}
							options={{
								headerShown: true,
								title: "Messages",
								headerTitleStyle: typography.navHeading,
								headerBackTitle: "Profile",
							}}
						/>
						<Stack.Screen
							name="Wishlist"
							component={Wishlist}
							options={{
								headerShown: true,
								title: "Wishlist",
								headerTitleStyle: typography.navHeading,
								headerBackTitle: "Profile",
							}}
						/>
						<Stack.Screen
							name="Listings"
							component={Listings}
							options={{
								headerShown: true,
								title: "Your Listings",
								headerTitleStyle: typography.navHeading,
								headerBackTitle: "Profile",
							}}
						/>
						<Stack.Screen
							name="AccountSettings"
							component={AccountSettings}
							options={{
								headerShown: true,
								title: "Account Settings",
								headerTitleStyle: typography.navHeading,
								headerBackTitle: "Profile",
							}}
						/>
						<Stack.Screen
							name="Settings"
							component={Settings}
							options={{
								headerShown: true,
								title: "Settings",
								headerTitleStyle: typography.navHeading,
								headerBackTitle: "Profile",
							}}
						/>
					</Stack.Navigator>
				) : null}
			</NavigationContainer>
		</>
	);
};
export default App;
