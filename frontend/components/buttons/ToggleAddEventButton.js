import { Text, useColorModeValue, Button, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToggleAddEventButton = ({ style, onPress, selected }) => {
	const buttonBackgroundColorMode = useColorModeValue('light.primary', 'dark.primary');
	const iconColorMode = useColorModeValue('light.text', 'dark.text');
	const textColorMode = useColorModeValue('light.text', 'dark.text');

	return (
		<Button bg={buttonBackgroundColorMode}
			style={{ ...style, ...styles.button }}
			leftIcon={<Icon as={Ionicons} name={selected ? 'aperture-outline' : 'add-circle-outline'} color={iconColorMode} size="md" />}
			opacity={selected ? 0.8 : 1}
			onPress={() => { onPress(); }}
		>
			<Text color={textColorMode}>{selected ? 'Adding new event...' : 'Add new event'}</Text>
		</Button>
	);
};

const styles = StyleSheet.create({
	button: {
		width: 180,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ToggleAddEventButton;
