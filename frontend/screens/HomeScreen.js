import { View, Button, VStack, Text, useColorModeValue, Image } from 'native-base';

import { useDispatch, useSelector } from "react-redux";
import MapButton from "../components/buttons/MapButton";
import LoginButton from "../components/buttons/LoginButton";
import RegisterButton from "../components/buttons/RegisterButton";
import ProfileButton from "../components/buttons/ProfileButton";

const HomeScreen = ({navigation}) => {
  const { isAuthenticated } = useSelector((state) => state.authReducer);
  const img = require('../assets/adaptive-icon1.png');

  const backgroundColor = useColorModeValue('light.background', 'dark.background');
  const textColor = useColorModeValue('light.text', 'dark.text');

  return (
    <View bg={backgroundColor} style={{flex: 1, justifyContent: 'center'}}>
        <VStack space={1} justifyContent="center" alignItems="center" safeAreaTop>
          <Image width={256} height={256} borderRadius={150} source={img} alt="Saferr"/>  
          <Text fontSize="sm" maxW="300" w="60%" textAlign="center" color={textColor} mx="20">Saffer is your dedicated platform for reporting and solving crime events in your area.</Text>
          {/* <Text fontSize="sm" maxW="300" w="60%" textAlign="center" color={textColor} mx="20">We believe in creating safer communities by empowering individuals to contribute to the safety and security of their neighborhoods.</Text> */}
        </VStack>
        {isAuthenticated && 
          (<Button.Group size="md" space="8" spaceEvenly={true} style={{position: "absolute", bottom: 48, left: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
           <MapButton onPress={() => navigation.navigate("Map")} />
           <ProfileButton onPress={() => navigation.navigate("Profile")} />
          </Button.Group>)}
        {!isAuthenticated && 
          (<Button.Group size="md" space="8" spaceEvenly={true} style={{position: "absolute", bottom: 48, left: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
            <RegisterButton onPress={() => navigation.navigate("Register")} />
            <MapButton onPress={() => navigation.navigate("Map")} />
            <LoginButton onPress={() => navigation.navigate("Login")} />
          </Button.Group>)}
    </View>
  );
};

export default HomeScreen;
