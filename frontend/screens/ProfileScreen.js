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

  return (
    <View>
      <Text>Profile Screen</Text>
      <Text>{user.firstName}</Text>
      <Text>{user.lastName}</Text>
      <Text>{user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
