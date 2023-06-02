import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logoutUser, getUserProfile } from "../actions/authActions";
import { random } from "lodash";
import { View, Button, VStack, Text, useColorModeValue, Image, Avatar, Box, Center } from 'native-base';

import HomeButton from "../components/buttons/HomeButton";
import MapButton from "../components/buttons/MapButton";

const ProfileScreen = ({navigation}) => {
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

  return (
    <View bg={backgroundColor} style={{flex: 1, justifyContent: 'center'}}>
      <VStack space={8} justifyContent="center" alignItems="center" safeAreaTop>
        <VStack space={4} justifyContent="center" alignItems="center">
          <Avatar alignSelf="center" size="lg" color={getRandomColor()}>
            <Text color={textColor} fontSize={20} fontWeight="bold">{user.firstName[0]}{user.lastName[0]}</Text>
          </Avatar>
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
      
        <Button w="100" rounded="md" onPress={handleLogout}>
          <Text color={textColor}>Logout</Text>
        </Button>
      </VStack>

      <Button.Group size="md" space="8" spaceEvenly={true} style={{position: "absolute", bottom: 48, left: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
        <HomeButton onPress={() => navigation.navigate("Home")} />
        <MapButton onPress={() => navigation.navigate("Map")} />
      </Button.Group>
    </View>
  );
};

export default ProfileScreen;
