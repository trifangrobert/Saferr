import { Text, useColorModeValue, Button, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const ToggleAddEventButton = ( { style, onPress } ) => {
    const [selected, setSelected] = useState(false);

    const toggleSelected = () => {
        if(selected) {
            onPress();
        }
        setSelected(!selected);
        console.log(selected);
    };

    const buttonBackgroundColorMode = useColorModeValue('light.primary', 'dark.primary');
    const iconColorMode = useColorModeValue('light.text', 'dark.text');
    const textColorMode = useColorModeValue('light.text', 'dark.text');

    return (
        <Button bg={buttonBackgroundColorMode} 
                style={{...style, ...styles.button}} 
                leftIcon={ <Icon as={Ionicons} name={selected ? 'aperture-outline' : 'add-circle-outline'} color={iconColorMode} size="md" />}
                onPress={toggleSelected}
                >
           <Text color={textColorMode}>{selected ? 'Adding new event...' : 'Add new event'}</Text>
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 160,
        height: 40, 
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ToggleAddEventButton;
