import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logoutUser, getUserProfile } from "../actions/authActions";
import { random } from "lodash";
import { Ionicons } from '@expo/vector-icons';
import { View, Button, VStack, Text, useColorMode, useColorModeValue, Image, Avatar, Box, Center, Icon } from 'native-base';

import HomeButton from "../components/buttons/HomeButton";
import MapButton from "../components/buttons/MapButton";

const ProfileScreen = ({navigation}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const ToggleTheme = () => {
    toggleColorMode();
  }

  const { user } = useSelector(
    (state) => state.authReducer
  );

  console.log("user: ", user);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log("ProfileScreen useEffect");
  //   dispatch(getUserProfile());
  // }, []);

  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  }, [navigation.navigate, user]);

  const handleLogout = () => {

    dispatch(logoutUser());

    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const getRandomColor = () => {
    const randomColor = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
    return randomColor;
  }

  const backgroundColor = useColorModeValue('light.background', 'dark.background');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const borderColor = useColorModeValue('light.primary', 'dark.primary');

  const buttonBackgroundColorMode = useColorModeValue('light.primary', 'dark.primary');
  const iconColorMode = useColorModeValue('light.text', 'dark.text');

  return (
    <View bg={backgroundColor} style={{flex: 1, justifyContent: 'center'}}>
      <VStack space={8} justifyContent="center" alignItems="center" safeAreaTop>
        <VStack space={4} justifyContent="center" alignItems="center">
          <Avatar alignSelf="center" size="lg" color={getRandomColor()}>
            <Text color={textColor} fontSize={20} fontWeight="bold">{user.firstName[0]}{user.lastName[0]}</Text>
          </Avatar>
          {/* // TODO culoarea bulinei si a textului de facut match, imagine user */}
          <Text color={textColor} fontWeight={400} fontSize={24}>{user.firstName} {user.lastName}</Text>
        </VStack>
        
        <VStack space={4} justifyContent="center" alignItems="center">
          <Box maxW="100" w={100} rounded="md" overflow="hidden" bg={borderColor} p={2}>
            <Center>
              <Text color={textColor}>Role</Text>
            </Center>
          </Box>
          <Text color={textColor} fontWeight={300} fontSize={14}>{user.role}</Text>
          
          <Box maxW="100" w={100} rounded="md" overflow="hidden" bg={borderColor} p={2}>
            <Center>
              <Text color={textColor}>Email</Text>
            </Center>
          </Box>
          <Text color={textColor} fontWeight={300} fontSize={14}>{user.email}</Text>
        </VStack>
      
        <Button w="100" rounded="md" style={{ backgroundColor: "lightskyblue" }} onPress={handleLogout}>
          <Text color="white">Logout</Text>
        </Button>
      </VStack>

      <Button.Group size="md" space="8" spaceEvenly={true} style={{position: "absolute", bottom: 36, left: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
        <HomeButton onPress={() => navigation.navigate("Home")} />
        <MapButton onPress={() => navigation.navigate("Map")} />
        <Button bg={buttonBackgroundColorMode} 
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={ToggleTheme}>
            <Icon as={Ionicons} name="sunny-outline" color={iconColorMode} size="md" />
        </Button>
      </Button.Group>
    </View>
  );
};

export default ProfileScreen;
