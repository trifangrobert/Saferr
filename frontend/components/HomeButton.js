import { Pressable, Icon, useColorModeValue, Button } from 'native-base';
import { theme } from '../Theme';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeButton = ( { onPress } ) => {
    const buttonBackgroundColorMode = useColorModeValue('primary.600', 'primary.400');
    const iconBackgroundColorMode = useColorModeValue('text.400', 'text.200');

    return (
        <Button bg={buttonBackgroundColorMode} style={styles.button} onPress={onPress}>
            <Icon as={Ionicons} name="home-outline" color={iconBackgroundColorMode} size="md" />
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

export default HomeButton;
