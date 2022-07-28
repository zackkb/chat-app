import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

export default function Chat(props) {
  let { name, color } = props.route.params;

  // Set the title to name entered on start
  useEffect(() => {
    props.navigation.setOptions({ title: name });
  });

  return (
    <View style={[{ backgroundColor: color }, { flex: 1 }]}>
      <Text style={styles.text}>Hello {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
});
