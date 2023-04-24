import { View, Text } from "react-native";
import { Button } from "react-native";

import { useDispatch, useSelector } from "react-redux";

const HomeScreen = ({navigation}) => {

  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <View>
      {isAuthenticated && <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />}
      {!isAuthenticated && <Button title="Go to Register" onPress={() => navigation.navigate("Register")} /> }
      {!isAuthenticated && <Button title="Go to Login" onPress={() => navigation.navigate("Login")} /> }      
      <Button title="See map" onPress={() => navigation.navigate("Map")} />
    </View>
  );
};

export default HomeScreen;
