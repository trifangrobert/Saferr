import { View, Text } from "react-native";
import { Button } from 'native-base';

import { useDispatch, useSelector } from "react-redux";
import HomeButton from "../components/buttons/HomeButton";
import LoginButton from "../components/buttons/LoginButton";
import RegisterButton from "../components/buttons/RegisterButton";
import ProfileButton from "../components/buttons/ProfileButton";

const HomeScreen = ({navigation}) => {
  const { isAuthenticated } = useSelector((state) => state.authReducer);
  return (
    <View style={{flex: 1}}>
        <Text alignItems="center" m="10">Home Page</Text>
        {isAuthenticated && 
          (<Button.Group size="md" space="8" spaceEvenly={true} style={{position: "absolute", bottom: 48, left: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
           <HomeButton onPress={() => navigation.navigate("Map")} />
           <ProfileButton onPress={() => navigation.navigate("Profile")} />
          </Button.Group>)}
        {!isAuthenticated && 
          (<Button.Group size="md" space="8" spaceEvenly={true} style={{position: "absolute", bottom: 48, left: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
            <RegisterButton onPress={() => navigation.navigate("Register")} />
            <HomeButton onPress={() => navigation.navigate("Map")} />
            <LoginButton onPress={() => navigation.navigate("Login")} />
          </Button.Group>)}
    </View>
  );
};

export default HomeScreen;
