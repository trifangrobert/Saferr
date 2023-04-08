import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logoutUser } from "../actions/authActions";

const ProfileScreen = ({navigation}) => {
  const { user } = useSelector(
    (state) => state.auth
  );

  console.log("user: ", user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) navigation.navigate("Home");
  }, [navigation.navigate, user]);


  const handleLogout = () => {

    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
    dispatch(logoutUser());
  };

  return (
    <View>
      <Text>Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
