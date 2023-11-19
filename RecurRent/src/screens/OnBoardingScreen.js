import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Btn, { primaryBtnStyle, secondaryBtnStyle } from '../components/Button';
import { Image } from 'expo-image';
import {
	primaryColor,
	textColor,
	typography,
	spacing,
} from '../styles/GlobalStyles';

const OnBoardingScreen = ({ navigation, route }) => {
	const onCreateAccountClicked = () => {
		navigation.navigate('SignUp');
	};

	const onSignInClicked = () => {
		navigation.navigate('LogIn');
	};

	return (
		<>
			<View style={spacing.container}>
				<View style={styles.imageContainer}>
					<Image
						style={styles.logo}
						contentFit="contain"
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
		...Platform.select({
			android: {
				overflow: 'hidden',
			},
		}),
		marginBottom: 80,
	},

	logo: {
		width: 350,
		height: 350,
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
