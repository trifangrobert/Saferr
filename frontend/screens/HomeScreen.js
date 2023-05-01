import { View, Text } from "react-native";
import { Button } from 'native-base';

import { useDispatch, useSelector } from "react-redux";
import MapComponent from "../components/MapComponent";
import HomeButton from "../components/HomeButton";

const HomeScreen = ({navigation}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <View style={{flex: 1}}>
      <MapComponent style={{flex: 1}}/>
        {isAuthenticated && 
          (<Button.Group style={{position: "absolute", bottom: 20, alignItems: "center", }} size="md">
          <Button onPress={() => navigation.navigate("Profile")}>Go to profile</Button>
          <HomeButton onPress={() => navigation.navigate("Home")} />
          </Button.Group>)}
        {!isAuthenticated && 
          (<Button.Group style={{position: "absolute", bottom: 20, alignItems: "center", }} size="md">
            <Button onPress={() => navigation.navigate("Register")}>Go to register</Button>
            <HomeButton onPress={() => navigation.navigate("Home")} />
            <Button onPress={() => navigation.navigate("Login")}>Go to login</Button>
          </Button.Group>)}
    </View>
  );
};

export default HomeScreen;
