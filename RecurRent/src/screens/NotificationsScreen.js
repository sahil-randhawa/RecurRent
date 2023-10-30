import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import {
	lightTheme,
	secondaryColor,
	typography,
	primaryColor,
	tertiaryColor,
	spacing,
} from '../styles/GlobalStyles';

const NotificationsScreen = () => {
	return (
		<>
			<View style={spacing.container}>
				<Image
					source={require('../../assets/images/notification.png')}
					style={styles.image}
				/>
				<Text
					style={[
						typography.bodyHeading,
						{ textAlign: 'center', marginTop: 20 },
					]}
				>
					We'll notify you when {'\n'}
					something new arrives.
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 150,
		height: 150,
	},
});

export default NotificationsScreen;
