import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logoutUser, getUserProfile } from "../actions/authActions";
import { Stack, Avatar } from "@react-native-material/core";
import { random } from "lodash";

const ProfileScreen = ({navigation}) => {
  const { user } = useSelector(
    (state) => state.auth
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

  return (
    <View>
      <Avatar size={70} label={`${user.firstName} ${user.lastName}`} color={getRandomColor()} />
      <Text>Profile Screen</Text>
      <Text>{user.firstName}</Text>
      <Text>{user.lastName}</Text>
      <Text>{user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
