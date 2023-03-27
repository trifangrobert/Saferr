import { View, Text } from "react-native";
import { Button } from "react-native";

const HomeScreen = ({navigation}) => {
  const handleNavigateProfile = () => {
    navigation.navigate("Profile");
  };
  const handleNavigateRegister = () => {
    navigation.navigate("Register");
  };
  return (
    <View>
      <Text>Home</Text>
      <Button title="Go to Profile" onPress={handleNavigateProfile} />
      <Button title="Go to Register" onPress={handleNavigateRegister} />
      
    </View>
  );
};

export default HomeScreen;
