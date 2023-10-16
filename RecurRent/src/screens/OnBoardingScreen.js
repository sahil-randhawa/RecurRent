import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Btn, { primaryBtnStyle, secondaryBtnStyle } from '../components/Button';
import { Image } from 'expo-image';
import {
	primaryColor,
	textColor,
	typography,
	spacing,
	lightTheme,
	secondaryColor,
} from '../styles/GlobalStyles';

const OnBoardingScreen = ({ navigation, route }) => {
	const onCreateAccountClicked = () => {
		navigation.navigate('SignUp');
	};

	const onSignInClicked = () => {
		navigation.navigate('LogIn');
	};

	const handleButtonPress = () => {
		console.log('primary button');
	};
	return (
		<>
			<View style={spacing.container}>
				<View style={styles.imageContainer}>
					<Image
						style={styles.logo}
						contentFit="cover"
						source={require('../../assets/images/onboarding.svg')}
					/>
				</View>

				<View style={styles.textContainer}>
					<Text style={[typography.title, styles.title]}>RecurRent</Text>
					<Text style={[typography.body, styles.subHeading]}>
						Discover the power of passive income with your belongings!
					</Text>
				</View>

				<View style={{ marginBottom: 15, flexDirection: 'row' }}>
					<Btn
						title="Sign In"
						onPress={onSignInClicked}
						mode="contained"
						style={[primaryBtnStyle, { flex: 1, textAlign: 'center' }]}
					/>
				</View>

				<View style={{ flexDirection: 'row' }}>
					<Btn
						title="Create Account"
						onPress={onCreateAccountClicked}
						mode="outlined"
						style={[
							secondaryBtnStyle,
							{ flex: 1, textAlign: 'center', border: 2 },
						]}
					/>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		marginBottom: 80,
	},

	logo: {
		width: 200,
		height: 200,
		resizeMode: 'contain',
		overflow: 'visible',
	},

	textContainer: {
		marginBottom: 50,
		alignItems: 'center',
	},

	title: {
		color: primaryColor,
	},

	subHeading: {
		color: textColor,
		textAlign: 'center',
	},
});

export default OnBoardingScreen;
