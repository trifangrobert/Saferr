import { Text, StyleSheet } from "react-native";

const Error = (props) => {
  return (
    <Text style={styles.error}>
      {props.error}
    </Text>
  );
};

export default Error;


const styles = StyleSheet.create({
  error: {
    color: "#f23838",
    textAlign: "center",
    margin: 10,
  },
});
    