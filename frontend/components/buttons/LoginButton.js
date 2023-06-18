import { Icon, useColorModeValue, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginButton = ({ onPress }) => {
	const buttonBackgroundColorMode = useColorModeValue('light.primary', 'dark.primary');
	const iconColorMode = useColorModeValue('light.text', 'dark.text');

	return (
		<Button bg={buttonBackgroundColorMode} style={styles.button} onPress={onPress}>
			<Icon as={Ionicons} name="log-in-outline" color={iconColorMode} size="md" />
		</Button>
	);
};

const styles = StyleSheet.create({
	button: {
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default LoginButton;
